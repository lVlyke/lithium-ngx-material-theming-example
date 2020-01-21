import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AotAware, StateEmitter, AfterViewInit, EventSource, AutoPush } from '@lithiumjs/angular';
import { Subject, Observable, merge } from 'rxjs';
import { delay, withLatestFrom } from 'rxjs/operators';
import { ThemeContainer, ThemeGenerator } from '@lithiumjs/ngx-material-theming';
import { PresetTheme } from 'src/app/models/preset-theme';
import { OverlayHelpers } from 'src/app/services/overlay-helpers';
import { BasicThemeCreatorComponent } from 'src/app/components/basic-theme-creator/basic-theme-creator.component';
import { AdvancedThemeCreatorComponent } from 'src/app/components/advanced-theme-creator/advanced-theme-creator.component';

@Component({
    selector: 'app-home-page',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoPush()
export class HomePageComponent extends AotAware {

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

    private static THEME_COLOR_PARSER(color: string): RegExp {
        return new RegExp(`\\.mat-icon\\.mat-${color}[\\s\\n]*{[\\s\\n]*color:[\\s\\n]*([^;}]+)[\\s\\n]*(?:;|})`);
    }

    constructor(overlayHelpers: OverlayHelpers, protected themeContainer: ThemeContainer, _cdRef: ChangeDetectorRef) {
        super();

        this.customThemes$.next(this.loadThemes());

        this.onAddBasicTheme$
            .pipe(withLatestFrom(this.customThemes$))
            .subscribe(([, customThemes]) => {
                const ref = overlayHelpers.createGlobal<BasicThemeCreatorComponent>(BasicThemeCreatorComponent, {
                    hasBackdrop: true
                });
                const component = ref.component.instance;

                component.onSubmit$
                    .pipe(withLatestFrom(component.theme$, component.themeName$, component.darkTheme$))
                    .subscribe(([, theme, themeName, darkTheme]) => {
                        // Create the theme
                        ThemeGenerator.createBasic('' + themeName, theme.primary, theme.accent, theme.warn, darkTheme);

                        // Add the theme and make it active
                        this.customThemes$.next(customThemes.concat(themeName));
                        this.activeTheme$.next(themeName);
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
                    .subscribe(([, theme, themeName, darkTheme]) => {
                        // Create the theme
                        ThemeGenerator.create('' + themeName, theme.primary, theme.accent, theme.warn, darkTheme);

                        // Add the theme and make it active
                        this.customThemes$.next(customThemes.concat(themeName));
                        this.activeTheme$.next(themeName);
                    });

                merge(component.onCancel$, component.onSubmit$).subscribe(() => ref.overlay.dispose());
            });

        this.onAddRandomTheme$
            .pipe(withLatestFrom(this.customThemes$))
            .subscribe(([, customThemes]) => {
                // Create a random theme
                const themeName = `random-${customThemes.length}`;
                ThemeGenerator.createRandom(themeName);

                // Add the theme and make it active
                this.customThemes$.next(customThemes.concat(themeName));
                this.activeTheme$.next(themeName);
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

    private loadThemes(): string[] {
        let themes: string[] = [];
        const userThemesJson: string = window.localStorage.getItem('themes');

        if (userThemesJson) {
            themes = themes.concat(JSON.parse(userThemesJson));
        }

        return themes;
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
                    const result = HomePageComponent.THEME_COLOR_PARSER(color).exec(element.innerHTML);
                    profile[color] = result.length > 1 ? result[1] : 'none';
                    return profile;
                }, {} as PresetTheme.Profile);
            } else {
                console.error(`Theme elements not found for '${theme}'.`);
                return {} as PresetTheme.Profile;
            }
        }
    }
}
