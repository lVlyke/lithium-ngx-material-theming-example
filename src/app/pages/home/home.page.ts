import * as chroma from "chroma-js";
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgClass, NgStyle, NgTemplateOutlet, UpperCasePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatCard, MatCardTitle } from "@angular/material/card";
import { MatIconButton, MatButton } from "@angular/material/button";
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from "@angular/material/sidenav";
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";
import { MatList, MatListItem } from "@angular/material/list";
import { MatRadioButton, MatRadioGroup } from "@angular/material/radio";
import { MatFormField, MatLabel, MatOption, MatSelect } from "@angular/material/select";
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";
import { AfterViewInit, AsyncState, ComponentState } from '@lithiumjs/angular';
import { Observable, merge } from 'rxjs';
import { delay, switchMap, withLatestFrom } from 'rxjs/operators';
import { ThemeContainer } from '@lithiumjs/ngx-material-theming';
import { ThemeGenerator } from '@lithiumjs/ngx-material-theming/dynamic';
import { PresetTheme } from '../../models/preset-theme';
import { OverlayHelpers } from '../../services/overlay-helpers';
import { BasicThemeCreatorComponent } from '../../components/basic-theme-creator/basic-theme-creator.component';
import { AdvancedThemeCreatorComponent } from '../../components/advanced-theme-creator/advanced-theme-creator.component';
import { AppThemeLoader } from '../../services/theme-loader';
import { BaseComponent } from '../../components/base-component';
import { ThemePreviewComponent } from "../../components/theme-preview";

@Component({
    selector: 'app-home-page',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,

        NgTemplateOutlet,
        NgClass,
        NgStyle,
        UpperCasePipe,
        MatToolbar,
        MatIconButton,
        MatButton,
        MatIcon,
        MatSidenav,
        MatSidenavContainer,
        MatSidenavContent,
        MatRadioGroup,
        MatRadioButton,
        MatList,
        MatListItem,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        MatCard,
        MatCardTitle,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,

        ThemePreviewComponent
    ],
    providers: [
        OverlayHelpers,

        ComponentState.create(HomePageComponent)
    ]
})
export class HomePageComponent extends BaseComponent {

    public readonly presetThemes = PresetTheme.values;
    public readonly activeTheme$ = this.themeContainer.theme$;

    @AsyncState()
    public readonly activeTheme!: string;

    protected customThemes: string[] = [];
    protected showMenu = false;

    @AfterViewInit()
    private readonly afterViewInit$!: Observable<void>;

    private _themeCache: { [themeName: string]: PresetTheme.Profile } = {};

    constructor(
        private readonly overlayHelpers: OverlayHelpers,
        private readonly appThemeLoader: AppThemeLoader,
        protected readonly themeContainer: ThemeContainer,
        readonly cdRef: ChangeDetectorRef
    ) {
        super(cdRef);

        // Show the side menu on page load
        this.afterViewInit$.pipe(
            delay(850)
        ).subscribe(() => this.showMenu = true);
    }

    public getThemeColor(theme: string, color: keyof PresetTheme.Profile): string {
        return this.themeCache(theme)[color];
    }

    public isPresetTheme(theme: string) {
        return PresetTheme.values.includes(theme as PresetTheme);
    }

    protected addBasicTheme(): void {
        const ref = this.overlayHelpers.createGlobal<BasicThemeCreatorComponent>(BasicThemeCreatorComponent, {
            hasBackdrop: true
        });
        const component = ref.component.instance;

        component.submit$.pipe(
            switchMap(() => this.appThemeLoader.createFromTemplate({
                name: '' + component.themeName, 
                primaryPalette: ThemeGenerator.createPalette(component.theme!.primary),
                accentPalette: ThemeGenerator.createPalette(component.theme!.accent),
                warnPalette: ThemeGenerator.createPalette(component.theme!.warn),
                isDark: component.darkTheme
            }))
        ).subscribe(() => {
            // Add the theme and make it active
            this.customThemes = this.customThemes.concat(component.themeName);
            this.themeContainer.theme = component.themeName;
        });

        merge(component.cancel$, component.submit$).subscribe(() => ref.overlay.dispose());
    }

    protected addAdvancedTheme(): void {
        const ref = this.overlayHelpers.createGlobal(AdvancedThemeCreatorComponent, {
            hasBackdrop: true
        });
        const component = ref.component.instance;

        component.submit$.pipe(
            withLatestFrom(component.theme$, component.themeName$, component.darkTheme$),
            switchMap(() => this.appThemeLoader.createFromTemplate({
                name: '' + component.themeName,
                primaryPalette: component.theme!.primary,
                accentPalette: component.theme!.accent,
                warnPalette: component.theme!.warn,
                isDark: component.darkTheme
            }))
        ).subscribe(() => {
            // Add the theme and make it active
            this.customThemes = this.customThemes.concat(component.themeName);
            this.themeContainer.theme = component.themeName;
        });

        merge(component.cancel$, component.submit$).subscribe(() => ref.overlay.dispose());
    }

    protected addRandomTheme(): void {
        // Create a random theme
        const themeName = `random-${this.customThemes.length}`;
        this.appThemeLoader.createFromTemplate({
            isDark: Math.random() > 0.5,
            name: themeName,
            primaryPalette: ThemeGenerator.createPalette(chroma.random().hex()),
            accentPalette: ThemeGenerator.createPalette(chroma.random().hex()),
            warnPalette: ThemeGenerator.createPalette(chroma.random().hex())
        }).subscribe(() => {
            // Add the theme and make it active
            this.customThemes = this.customThemes.concat(themeName);
            this.themeContainer.theme = themeName;
        });
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
                const colors: Array<keyof PresetTheme.Profile> = ['primary', 'accent', 'warn'];
                return this._themeCache[theme] = colors.reduce<PresetTheme.Profile>((profile, color) => {
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
