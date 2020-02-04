import * as chroma from "chroma-js";
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { StateEmitter, AfterViewInit, EventSource } from '@lithiumjs/angular';
import { Subject, Observable, merge } from 'rxjs';
import { delay, withLatestFrom } from 'rxjs/operators';
import { ThemeContainer, ThemeGenerator } from '@lithiumjs/ngx-material-theming';
import { PresetTheme } from 'src/app/models/preset-theme';
import { OverlayHelpers } from 'src/app/services/overlay-helpers';
import { BasicThemeCreatorComponent } from 'src/app/components/basic-theme-creator/basic-theme-creator.component';
import { AdvancedThemeCreatorComponent } from 'src/app/components/advanced-theme-creator/advanced-theme-creator.component';
import { AppThemeLoader } from 'src/app/services/theme-loader';
import { BaseComponent } from 'src/app/components/base-component';

@Component({
    selector: 'app-home-page',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent extends BaseComponent {

    public readonly presetThemes = PresetTheme.values;

    @AfterViewInit()
    private readonly afterViewInit$: Observable<void>;

    @EventSource()
    private readonly onAddBasicTheme$: Observable<void>;

    @EventSource()
    private readonly onAddAdvancedTheme$: Observable<void>;

    @EventSource()
    private readonly onAddRandomTheme$: Observable<void>;

    @StateEmitter.Alias('themeContainer.theme$')
    protected readonly activeTheme$: Subject<string>;

    @StateEmitter({ initialValue: [] })
    private readonly customThemes$: Subject<string[]>;

    @StateEmitter()
    private readonly showMenu$: Subject<boolean>;

    private _themeCache: { [themeName: string]: PresetTheme.Profile } = {};

    constructor(
        injector: Injector,
        overlayHelpers: OverlayHelpers,
        appThemeLoader: AppThemeLoader,
        protected themeContainer: ThemeContainer,
        cdRef: ChangeDetectorRef) {
        super(injector, cdRef);

        this.onAddBasicTheme$
            .pipe(withLatestFrom(this.customThemes$))
            .subscribe(([, customThemes]) => {
                const ref = overlayHelpers.createGlobal<BasicThemeCreatorComponent>(BasicThemeCreatorComponent, {
                    hasBackdrop: true
                });
                const component = ref.component.instance;

                component.onSubmit$
                    .pipe(withLatestFrom(component.theme$, component.themeName$, component.darkTheme$))
                    .subscribe(([, theme, themeName, isDark]) => {
                        // Create the theme
                        appThemeLoader.createFromTemplate({
                            name: '' + themeName, 
                            primaryPalette: ThemeGenerator.createPalette(theme.primary),
                            accentPalette: ThemeGenerator.createPalette(theme.accent),
                            warnPalette: ThemeGenerator.createPalette(theme.warn),
                            isDark
                        }).subscribe(() => {
                            // Add the theme and make it active
                            this.customThemes$.next(customThemes.concat(themeName));
                            this.activeTheme$.next(themeName);
                        });
                    });

                merge(component.onCancel$, component.onSubmit$).subscribe(() => ref.overlay.dispose());
            });

        this.onAddAdvancedTheme$
            .pipe(withLatestFrom(this.customThemes$))
            .subscribe(([, customThemes]) => {
                const ref = overlayHelpers.createGlobal(AdvancedThemeCreatorComponent, {
                    hasBackdrop: true
                });
                const component = ref.component.instance;

                component.onSubmit$
                    .pipe(withLatestFrom(component.theme$, component.themeName$, component.darkTheme$))
                    .subscribe(([, theme, themeName, isDark]) => {
                        // Create the theme
                        appThemeLoader.createFromTemplate({
                            name: '' + themeName,
                            primaryPalette: theme.primary,
                            accentPalette: theme.accent,
                            warnPalette: theme.warn,
                            isDark
                        }).subscribe(() => {
                            // Add the theme and make it active
                            this.customThemes$.next(customThemes.concat(themeName));
                            this.activeTheme$.next(themeName);
                        });
                    });

                merge(component.onCancel$, component.onSubmit$).subscribe(() => ref.overlay.dispose());
            });

        // Create a new random theme when the user presses the random theme button
        this.onAddRandomTheme$.pipe(
            withLatestFrom(this.customThemes$)
        ).subscribe(([, customThemes]) => {
            // Create a random theme
            const themeName = `random-${customThemes.length}`;
            appThemeLoader.createFromTemplate({
                isDark: Math.random() > 0.5,
                name: themeName,
                primaryPalette: ThemeGenerator.createPalette(chroma.random().hex()),
                accentPalette: ThemeGenerator.createPalette(chroma.random().hex()),
                warnPalette: ThemeGenerator.createPalette(chroma.random().hex())
            }).subscribe(() => {
                // Add the theme and make it active
                this.customThemes$.next(customThemes.concat(themeName));
                this.activeTheme$.next(themeName);
            });
        });

        // Show the side menu on page load
        this.afterViewInit$.pipe(
            delay(850)
        ).subscribe(() => {
            this.showMenu$.next(true);
        });
    }

    public getThemeColor(theme: string, color: keyof PresetTheme.Profile): string {
        return this.themeCache(theme)[color];
    }

    public isPresetTheme(theme: string) {
        return PresetTheme.values.includes(theme as PresetTheme);
    }

    private themeCache(theme: string): PresetTheme.Profile {
        if (this.isPresetTheme(theme)) {
            return PresetTheme.profiles[theme];
        } else if (this._themeCache[theme]) {
            return this._themeCache[theme];
        } else {
            const themeElements = document.head.querySelectorAll(`style[data-theme-name=${theme}]`);

            if (themeElements && themeElements.length > 0) {
                const element = themeElements.item(themeElements.length - 1);
                return this._themeCache[theme] = ['primary', 'accent', 'warn'].reduce<PresetTheme.Profile>((profile, color) => {
                    profile[color] = element.getAttribute(`data-color-${color}`) || 'none';
                    return profile;
                }, {} as PresetTheme.Profile);
            } else {
                console.error(`Theme elements not found for '${theme}'.`);
                return {} as PresetTheme.Profile;
            }
        }
    }
}
