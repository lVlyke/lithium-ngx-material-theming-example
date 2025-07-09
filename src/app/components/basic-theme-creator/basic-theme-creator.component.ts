import { Component, Output, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { AfterViewInit, ComponentState, ComponentStateRef, DeclareState } from '@lithiumjs/angular';
import { Observable, combineLatest } from 'rxjs';
import { PresetTheme } from '../../models/preset-theme';
import { map, filter, mergeMap, delay, switchMap, tap } from 'rxjs/operators';
import { ThemeContainer, ThemeLoader } from '@lithiumjs/ngx-material-theming';
import { AppThemeLoader } from '../../services/theme-loader';
import { BaseComponent } from '../base-component';
import { ThemeGenerator } from '@lithiumjs/ngx-material-theming/dynamic';
import { ColorPickerDirective } from 'ngx-color-picker';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatToolbar } from '@angular/material/toolbar';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-basic-theme-creator',
    templateUrl: './basic-theme-creator.component.html',
    styleUrls: ['./basic-theme-creator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,

        NgTemplateOutlet,
        MatCard,
        MatCardContent,
        MatFormField,
        MatToolbar,
        MatLabel,
        MatInput,
        MatGridList,
        MatGridTile,
        MatCheckbox,
        MatButton,

        ThemeContainer,
        ColorPickerDirective
    ],
    providers: [ComponentState.create(BasicThemeCreatorComponent)]
})
export class BasicThemeCreatorComponent extends BaseComponent {

    private static readonly THEME_PREVIEW_NAME = '--new-basic-theme';

    @Output('cancel')
    public readonly cancel$ = new EventEmitter<void>();

    @Output('submit')
    public readonly submit$ = new EventEmitter<void>();

    @Output('theme')
    public readonly theme$: EventEmitter<PresetTheme.Profile | undefined>;

    @Output('themeName')
    public readonly themeName$: EventEmitter<string>;

    @Output('darkTheme')
    public readonly darkTheme$: EventEmitter<boolean>;

    public primaryColor = PresetTheme.profiles.default.primary;
    public accentColor = PresetTheme.profiles.default.accent;
    public warnColor = PresetTheme.profiles.default.warn;

    @DeclareState()
    public theme?: PresetTheme.Profile;

    public themeName = '';
    public darkTheme = false;

    @ViewChild(ThemeContainer, { static: true })
    protected readonly themeContainer!: ThemeContainer;

    @AfterViewInit()
    private readonly afterViewInit$!: Observable<void>;

    constructor(
        readonly cdRef: ChangeDetectorRef,
        readonly appThemeLoader: AppThemeLoader,
        readonly stateRef: ComponentStateRef<BasicThemeCreatorComponent>
    ) {
        super(cdRef);

        this.theme$ = stateRef.emitter("theme");
        this.themeName$ = stateRef.emitter("themeName");
        this.darkTheme$ = stateRef.emitter("darkTheme");

        // Update theme on palette changes
        combineLatest(stateRef.getAll("primaryColor", "accentColor", "warnColor")).pipe(
            map(([primary, accent, warn]) => ({ primary, accent, warn }))
        ).subscribe(theme => this.theme = theme);

        // Re-render the theme when changed
        this.afterViewInit$.pipe(
            delay(0),
            mergeMap(() => combineLatest(stateRef.getAll("theme", "darkTheme"))),
            filter(([theme]) => !!theme),
            switchMap((([theme, isDark]) => {
                const themeName = BasicThemeCreatorComponent.THEME_PREVIEW_NAME;
                ThemeLoader.unloadCompiled(themeName);
                
                return appThemeLoader.createFromTemplate({
                    name: themeName,
                    primaryPalette: ThemeGenerator.createPalette(theme!.primary),
                    accentPalette: ThemeGenerator.createPalette(theme!.accent),
                    warnPalette: ThemeGenerator.createPalette(theme!.warn),
                    isDark
                }).pipe(tap(() => {
                    this.themeContainer.theme = themeName;
                    this.themeContainer.active = true;
                }));
            }))
        ).subscribe();
    }
}
