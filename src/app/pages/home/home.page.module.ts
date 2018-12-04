import { NgModule } from '@angular/core';
import {
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatRadioModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule
} from '@angular/material';
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
