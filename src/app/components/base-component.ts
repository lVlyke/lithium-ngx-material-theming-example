import { AutoPush } from '@lithiumjs/angular';
import { ChangeDetectorRef } from '@angular/core';

export class BaseComponent {

    constructor(
        readonly cdRef?: ChangeDetectorRef
    ) {
        if (cdRef) {
            AutoPush.enable(this, cdRef);
        }
    }
}