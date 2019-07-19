import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HomePageComponent } from './home.page';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../../../app/components/components.module';
import { NgxMaterialThemingModule } from '@lithiumjs/ngx-material-theming';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        MatCardModule,
        MatButtonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatRadioModule,
        MatSelectModule,
        MatFormFieldModule,
        NgxMaterialThemingModule,
        MatExpansionModule,

        ComponentsModule,

        RouterModule.forChild([{ path: '', component: HomePageComponent }])
    ],
    declarations: [HomePageComponent],
    exports: [HomePageComponent]
})
export class HomePageModule {}
