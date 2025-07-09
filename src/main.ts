import { enableProdMode, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(APP_ROUTES),
    ]
}).catch(err => console.log(err));
