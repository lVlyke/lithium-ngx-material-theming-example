import { Component, Output, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { StateEmitter, EventSource, AfterViewInit } from '@lithiumjs/angular';
import { Subject, Observable, combineLatest } from 'rxjs';
import { PresetTheme } from 'src/app/models/preset-theme';
import { map, filter, mergeMapTo, delay, switchMap } from 'rxjs/operators';
import { ThemeContainer, ThemeLoader } from '@lithiumjs/ngx-material-theming';
import { AppThemeLoader } from 'src/app/services/theme-loader';
import { BaseComponent } from '../base-component';
import { ThemeGenerator } from '@lithiumjs/ngx-material-theming/dynamic';

@Component({
    selector: 'app-basic-theme-creator',
    templateUrl: './basic-theme-creator.component.html',
    styleUrls: ['./basic-theme-creator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicThemeCreatorComponent extends BaseComponent {

    private static readonly THEME_PREVIEW_NAME = '--new-basic-theme';

    @AfterViewInit()
    private readonly afterViewInit$: Observable<void>;

    @EventSource()
    public readonly onCancel$: Observable<void>;

    @EventSource()
    public readonly onSubmit$: Observable<void>;

    @Output('theme')
    @StateEmitter()
    public readonly theme$: Subject<PresetTheme.Profile>;

    @Output('themeName')
    @StateEmitter({ initialValue: '' })
    public readonly themeName$: Subject<string>;

    @Output('darkTheme')
    @StateEmitter({ initialValue: false })
    public readonly darkTheme$: Subject<boolean>;

    @StateEmitter({ initialValue: PresetTheme.profiles.default.primary })
    protected readonly primaryColor$: Subject<string>;

    @StateEmitter({ initialValue: PresetTheme.profiles.default.accent })
    protected readonly accentColor$: Subject<string>;

    @StateEmitter({ initialValue: PresetTheme.profiles.default.warn })
    protected readonly warnColor$: Subject<string>;

    @ViewChild(ThemeContainer)
    private readonly themeContainer: ThemeContainer;

    constructor(injector: Injector, cdRef: ChangeDetectorRef, appThemeLoader: AppThemeLoader) {
        super(injector, cdRef);

        combineLatest(this.primaryColor$, this.accentColor$, this.warnColor$)
            .pipe(map(([primary, accent, warn]) => ({ primary, accent, warn })))
            .subscribe(this.theme$);

        this.afterViewInit$
            .pipe(delay(0))
            .pipe(mergeMapTo(combineLatest(this.theme$, this.darkTheme$)))
            .pipe(filter(([theme]) => !!theme))
            .pipe(switchMap((([theme, isDark]) => {
                const themeName = BasicThemeCreatorComponent.THEME_PREVIEW_NAME;
                ThemeLoader.unloadCompiled(themeName);
                
                return appThemeLoader.createFromTemplate({
                    name: themeName,
                    primaryPalette: ThemeGenerator.createPalette(theme.primary),
                    accentPalette: ThemeGenerator.createPalette(theme.accent),
                    warnPalette: ThemeGenerator.createPalette(theme.warn),
                    isDark
                }).pipe(map(() => {
                    this.themeContainer.theme = themeName;
                    this.themeContainer.active = true;
                }));
            }))).subscribe();
    }
}
