import { Component, Output, ViewChild } from '@angular/core';
import { StateEmitter, EventSource, AotAware, OnInit, OnDestroy } from '@lithiumjs/angular';
import { Subject, Observable, combineLatest } from 'rxjs';
import { PresetTheme } from 'src/app/models/preset-theme';
import { map, filter, mergeMapTo, withLatestFrom } from 'rxjs/operators';
import { ThemeContainer, ThemeLoader } from '@lithiumjs/ngx-material-theming';

export type AdvancedThemeProfile = {
    [K in keyof PresetTheme.Profile]: ThemeLoader.Palette;
};

@Component({
    selector: 'app-advanced-theme-creator',
    templateUrl: './advanced-theme-creator.component.html',
    styleUrls: ['./advanced-theme-creator.component.scss']
})
export class AdvancedThemeCreatorComponent extends AotAware {

    private static readonly THEME_PREVIEW_NAME = '--new-advanced-theme';

    public readonly paletteColors: Array<keyof ThemeLoader.Palette & number> = [
        50,
        100,
        200,
        300,
        400,
        500,
        600,
        700,
        800,
        900
    ];

    public readonly activeElement = document.activeElement;

    @EventSource()
    public readonly onCancel$: Observable<void>;

    @EventSource()
    public readonly onSubmit$: Observable<void>;

    @OnInit()
    private readonly onInit$: Observable<void>;

    @OnDestroy()
    private readonly onDestroy$: Observable<void>;

    @EventSource()
    private readonly onPaletteChange$: Observable<AdvancedThemeCreatorComponent.PaletteName>;

    @EventSource()
    private readonly onCreateBasicPalette$: Observable<[AdvancedThemeCreatorComponent.PaletteName, string]>;

    @StateEmitter()
    @Output('theme')
    public readonly theme$: Subject<AdvancedThemeProfile>;

    @StateEmitter({ initialValue: '' })
    @Output('themeName')
    public readonly themeName$: Subject<string>;

    @StateEmitter({ initialValue: false })
    @Output('darkTheme')
    public readonly darkTheme$: Subject<boolean>;

    @StateEmitter()
    protected readonly primaryPalette$: Subject<ThemeLoader.Palette>;

    @StateEmitter()
    protected readonly accentPalette$: Subject<ThemeLoader.Palette>;

    @StateEmitter()
    protected readonly warnPalette$: Subject<ThemeLoader.Palette>;

    @StateEmitter.Alias('primaryPalette$.500')
    protected readonly primaryColor$: Observable<string>;

    @StateEmitter.Alias('accentPalette$.500')
    protected readonly accentColor$: Observable<string>;

    @StateEmitter.Alias('warnPalette$.500')
    protected readonly warnColor$: Observable<string>;

    @ViewChild(ThemeContainer)
    private readonly themeContainer: ThemeContainer;

    constructor() {
        super();

        const computePalette = (color: string): ThemeLoader.Palette  => (<any>ThemeLoader).computePalette(color);

        this.primaryPalette$.next(computePalette(PresetTheme.profiles.default.primary));
        this.accentPalette$.next(computePalette(PresetTheme.profiles.default.accent));
        this.warnPalette$.next(computePalette(PresetTheme.profiles.default.warn));

        combineLatest(this.primaryPalette$, this.accentPalette$, this.warnPalette$)
            .pipe(map(([primary, accent, warn]) => ({ primary, accent, warn })))
            .subscribe(this.theme$);

        this.onPaletteChange$
            .pipe(withLatestFrom(this.theme$))
            .subscribe(([paletteName, theme]) => {
                switch (paletteName) {
                    case 'primaryPalette': return this.primaryPalette$.next(theme.primary);
                    case 'accentPalette': return this.accentPalette$.next(theme.accent);
                    case 'warnPalette': return this.warnPalette$.next(theme.warn);
                }
            });

        this.onCreateBasicPalette$
            .subscribe(([paletteName, color]) => {
                const computedPalette = computePalette(color);
                switch (paletteName) {
                    case 'primaryPalette': return this.primaryPalette$.next(computedPalette);
                    case 'accentPalette': return this.accentPalette$.next(computedPalette);
                    case 'warnPalette': return this.warnPalette$.next(computedPalette);
                }
            });

        this.onInit$
            .pipe(mergeMapTo(combineLatest(this.theme$, this.darkTheme$)))
            .pipe(filter(([theme]) => !!theme))
            .subscribe(([theme, darkTheme]) => {
                const themeName = AdvancedThemeCreatorComponent.THEME_PREVIEW_NAME;
                ThemeLoader.unloadCompiled(themeName);
                ThemeLoader.create(themeName, theme.primary, theme.accent, theme.warn, darkTheme);

                this.themeContainer.theme$.next(themeName);
                this.themeContainer.active$.next(true);
            });

        this.onDestroy$
            .subscribe(() => ThemeLoader.unloadCompiled(AdvancedThemeCreatorComponent.THEME_PREVIEW_NAME));
    }
}


export namespace AdvancedThemeCreatorComponent {

    export type PaletteName = 'primaryPalette' | 'accentPalette' | 'warnPalette';
}
