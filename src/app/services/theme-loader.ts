import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ThemeGenerator, ThemeCreationOptions } from '@lithiumjs/ngx-material-theming';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AppThemeLoader {

    constructor (private readonly http: HttpClient) {}

    public loadTemplate$(dark: boolean = false): Observable<string> {
        return this.http.get(`/assets/${dark ? 'dark' : 'light'}_theme.css`, { responseType: 'text' });
    }

    public createFromTemplate(options: ThemeCreationOptions): Observable<string> {
        const result = this.loadTemplate$(options.isDark).pipe(
            map(templateData => ThemeGenerator.createFromTemplate({
                templateData,
                ...options
            })),
            shareReplay(1)
        );

        result.subscribe();

        return result;
    }
}
