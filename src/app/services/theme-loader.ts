import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ThemeGenerator, ThemeCreationOptions } from '@lithiumjs/ngx-material-theming';
import { map, publishReplay, refCount } from 'rxjs/operators';
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
            map(templateData => ThemeGenerator.createFromTemplate({
                templateData,
                ...options
            }))
        );
    }
}
