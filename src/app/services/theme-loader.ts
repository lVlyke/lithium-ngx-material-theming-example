import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ThemeCreator } from '@lithiumjs/ngx-material-theming';
import { ThemeCreationOptions } from '@lithiumjs/ngx-material-theming/dynamic';
import { map } from 'rxjs/operators';
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AppThemeLoader {

    constructor (private readonly http: HttpClient) {}

    public loadTemplate$(dark: boolean = false): Observable<string> {
        return this.http.get(`${environment.production ? location.pathname : ''}/assets/${dark ? 'dark' : 'light'}_theme.css`, {
            responseType: 'text'
        });
    }

    public createFromTemplate(options: ThemeCreationOptions): Observable<string> {
        return this.loadTemplate$(options.isDark).pipe(
            map(templateData => ThemeCreator.createFromTemplate({
                templateData,
                ...options
            }))
        );
    }
}
