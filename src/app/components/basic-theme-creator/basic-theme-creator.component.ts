import { Component, Output, ViewChild } from '@angular/core';
import { StateEmitter, EventSource, AotAware, OnInit } from '@lithiumjs/angular';
import { Subject, Observable, combineLatest } from 'rxjs';
import { PresetTheme } from 'src/app/models/preset-theme';
import { map, filter, mergeMapTo } from 'rxjs/operators';
import { ThemeContainer, ThemeLoader } from '@lithiumjs/ngx-material-theming';

@Component({
    selector: 'app-basic-theme-creator',
    templateUrl: './basic-theme-creator.component.html',
    styleUrls: ['./basic-theme-creator.component.scss']
})
export class BasicThemeCreatorComponent extends AotAware {

    @OnInit()
    private readonly onInit$: Observable<void>;

    @EventSource()
    public readonly onCancel$: Observable<void>;

    @EventSource()
    public readonly onSubmit$: Observable<void>;

    @StateEmitter()
    @Output('theme')
    public readonly theme$: Subject<PresetTheme.Profile>;

    @StateEmitter({ initialValue: '' })
    @Output('themeName')
    public readonly themeName$: Subject<string>;

    @StateEmitter({ initialValue: false })
    @Output('darkTheme')
    public readonly darkTheme$: Subject<boolean>;

    @StateEmitter({ initialValue: PresetTheme.profiles.default.primary })
    protected readonly primaryColor$: Subject<string>;

    @StateEmitter({ initialValue: PresetTheme.profiles.default.accent })
    protected readonly accentColor$: Subject<string>;

    @StateEmitter({ initialValue: PresetTheme.profiles.default.warn })
    protected readonly warnColor$: Subject<string>;

    @ViewChild(ThemeContainer)
    private readonly themeContainer: ThemeContainer;

    constructor() {
        super();

        combineLatest(this.primaryColor$, this.accentColor$, this.warnColor$)
            .pipe(map(([primary, accent, warn]) => ({ primary, accent, warn })))
            .subscribe(this.theme$);

        this.onInit$
            .pipe(mergeMapTo(combineLatest(this.theme$, this.darkTheme$)))
            .pipe(filter(([theme]) => !!theme))
            .subscribe(([theme, darkTheme]) => {
                ThemeLoader.unloadCompiled('--new-basic-theme');
                ThemeLoader.createBasic('--new-basic-theme', theme.primary, theme.accent, theme.warn, darkTheme);

                this.themeContainer.theme$.next('--new-basic-theme');
                this.themeContainer.disabled$.next(false);
            });
    }
}
