import { Injectable, ComponentRef } from '@angular/core';
import {
    Overlay,
    ComponentType,
    OverlayRef,
    OverlayConfig,
    PositionStrategy,
    OverlayPositionBuilder
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

export interface OverlayHelpersRef<T> {

    overlay: OverlayRef;
    component: ComponentRef<T>;
}

export interface OverlayHelpersConfig extends OverlayConfig {
    disposeOnBackdropClick?: boolean;
}

@Injectable()
export class OverlayHelpers {

    constructor(
        private overlay: Overlay,
        private overlayPositionBuilder: OverlayPositionBuilder
    ) {}

    public create<T>(component: ComponentType<T>, positionStrategy: PositionStrategy, config?: OverlayHelpersConfig): OverlayHelpersRef<T> {
        const overlayRef = this.overlay.create(Object.assign({}, { positionStrategy }, config));
        const componentRef = overlayRef.attach(new ComponentPortal(component));

        if (config && config.disposeOnBackdropClick) {
            overlayRef.backdropClick().subscribe(() => overlayRef.dispose());
        }

        return { overlay: overlayRef, component: componentRef };
    }

    public createGlobal<T>(component: ComponentType<T>, config?: OverlayHelpersConfig): OverlayHelpersRef<T> {
        const positionStrategy = this.overlayPositionBuilder
            .global()
            .centerHorizontally()
            .centerVertically();

        return this.create<T>(component, positionStrategy, config);
    }
}
