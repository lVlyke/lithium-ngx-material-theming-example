import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { OnDestroy, AfterViewInit, ComponentState, ComponentStateRef, DeclareState } from '@lithiumjs/angular';
import { Observable, combineLatest } from 'rxjs';
import { PresetTheme } from '../../models/preset-theme';
import { map, filter, delay, switchMap, mergeMap } from 'rxjs/operators';
import { ThemeContainer, ThemeLoader, ThemeCreator } from '@lithiumjs/ngx-material-theming';
import { AppThemeLoader } from '../../services/theme-loader';
import { ThemeGenerator } from '@lithiumjs/ngx-material-theming/dynamic';
import { ColorPickerDirective } from 'ngx-color-picker';
import { FormsModule } from '@angular/forms';
import { NgStyle,  NgTemplateOutlet } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatToolbar } from '@angular/material/toolbar';
import { MatFormField, MatLabel } from '@angular/material/select';
import { BaseComponent } from '../base-component';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';

export type AdvancedThemeProfile = {
    [K in keyof PresetTheme.Profile]: ThemeCreator.Palette;
};

@Component({
    selector: 'app-advanced-theme-creator',
    templateUrl: './advanced-theme-creator.component.html',
    styleUrls: ['./advanced-theme-creator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,

        NgTemplateOutlet,
        NgStyle,
        MatCard,
        MatCardContent,
        MatFormField,
        MatToolbar,
        MatLabel,
        MatInput,
        MatGridList,
        MatGridTile,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatAccordion,
        MatIcon,
        MatCheckbox,
        MatButton,

        ThemeContainer,
        ColorPickerDirective
    ],
    providers: [ComponentState.create(AdvancedThemeCreatorComponent)]
})
export class AdvancedThemeCreatorComponent extends BaseComponent {

    private static readonly THEME_PREVIEW_NAME = '--new-advanced-theme';

    public readonly paletteColors: Array<keyof ThemeCreator.PaletteBase> = [
        "50",
        "100",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
        "900",
        "A100",
        "A200",
        "A400",
        "A700"
    ];

    public readonly activeElement = document.activeElement;

    @Output('cancel')
    public readonly cancel$ = new EventEmitter<void>();

    @Output('submit')
    public readonly submit$ = new EventEmitter<void>();

    @Output('theme')
    public readonly theme$: EventEmitter<AdvancedThemeProfile | undefined>;

    @Output('themeName')
    public readonly themeName$: EventEmitter<string>;

    @Output('darkTheme')
    public readonly darkTheme$: EventEmitter<boolean>;

    @DeclareState()
    public primaryPalette: ThemeCreator.Palette;

    @DeclareState()
    public accentPalette: ThemeCreator.Palette;

    @DeclareState()
    public warnPalette: ThemeCreator.Palette;

    @DeclareState()
    public primaryColor!: string;

    @DeclareState()
    public accentColor!: string;

    @DeclareState()
    public warnColor!: string;

    @DeclareState()
    public theme?: AdvancedThemeProfile;

    public themeName = '';
    public darkTheme = false;

    @ViewChild(ThemeContainer, { static: true })
    protected readonly themeContainer!: ThemeContainer;

    @AfterViewInit()
    private readonly afterViewInit$!: Observable<void>;

    @OnDestroy()
    private readonly onDestroy$!: Observable<void>;

    constructor(
        readonly appThemeLoader: AppThemeLoader,
        readonly cdRef: ChangeDetectorRef,
        readonly stateRef: ComponentStateRef<AdvancedThemeCreatorComponent>
    ) {
        super(cdRef);

        this.primaryPalette = this.computePalette(PresetTheme.profiles.default.primary);
        this.accentPalette = this.computePalette(PresetTheme.profiles.default.accent);
        this.warnPalette = this.computePalette(PresetTheme.profiles.default.warn);

        this.theme$ = stateRef.emitter("theme");
        this.themeName$ = stateRef.emitter("themeName");
        this.darkTheme$ = stateRef.emitter("darkTheme");

        // Update primary colors on palette changes
        stateRef.get("primaryPalette").subscribe(palette => this.primaryColor = palette[500]);
        stateRef.get("accentPalette").subscribe(palette => this.accentColor = palette[500]);
        stateRef.get("warnPalette").subscribe(palette => this.warnColor = palette[500]);

        // Update theme on palette changes
        combineLatest(stateRef.getAll("primaryPalette", "accentPalette", "warnPalette")).pipe(
            map(([primary, accent, warn]) => ({ primary, accent, warn }))
        ).subscribe(theme => this.theme = theme);

        // Re-render the theme when changed
        this.afterViewInit$.pipe(
            delay(0),
            mergeMap(() => combineLatest(stateRef.getAll("theme", "darkTheme"))),
            filter(([theme]) => !!theme),
            switchMap(([theme, isDark]) => {
                const themeName = AdvancedThemeCreatorComponent.THEME_PREVIEW_NAME;
                ThemeLoader.unloadCompiled(themeName);

                return appThemeLoader.createFromTemplate({
                    name: themeName,
                    primaryPalette: theme!.primary,
                    accentPalette: theme!.accent,
                    warnPalette: theme!.warn,
                    isDark
                }).pipe(map(() => {
                    this.themeContainer.theme = themeName;
                    this.themeContainer.active = true;
                }));
            })
        ).subscribe();

        // Unload preview theme on destroy
        this.onDestroy$.subscribe(() => ThemeLoader.unloadCompiled(AdvancedThemeCreatorComponent.THEME_PREVIEW_NAME));
    }

    protected changePalette(paletteName: AdvancedThemeCreatorComponent.PaletteName): void {
        switch (paletteName) {
            case 'primaryPalette': {
                this.primaryPalette = this.theme!.primary;
            } break;
            case 'accentPalette': {
                this.accentPalette = this.theme!.accent;
            } break;
            case 'warnPalette': {
                this.warnPalette = this.theme!.warn;
            } break;
        }
    }

    protected createBasicPalette(paletteName: AdvancedThemeCreatorComponent.PaletteName, color: string): void {
        const computedPalette = this.computePalette(color);
        switch (paletteName) {
            case 'primaryPalette': {
                this.primaryPalette = computedPalette;
            } break;
            case 'accentPalette': {
                this.accentPalette = computedPalette;
            } break;
            case 'warnPalette': {
                this.warnPalette = computedPalette;
            } break;
        }
    }

    private computePalette(color: string) {
        return ThemeGenerator.createPalette(color);
    }
}


export namespace AdvancedThemeCreatorComponent {

    export type PaletteName = 'primaryPalette' | 'accentPalette' | 'warnPalette';
}
