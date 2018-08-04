import { Injectable, ComponentFactoryResolver, Component, Output, EventEmitter, ViewChild, NgModule, defineInjectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ModalManager {
    /**
     * @param {?} componentFactoryResolver
     */
    constructor(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.globalConfig = {
            size: "md",
            modalClass: undefined,
            hideCloseButton: false,
            centered: false,
            backdrop: true,
            animation: true,
            keyboard: true,
            closeOnOutsideClick: true,
            backdropClass: "modal-backdrop"
        };
    }
    /**
     * @param {?} config
     * @return {?}
     */
    set defaults(config) {
        this.globalConfig = Object.assign(this.globalConfig, config);
    }
    /**
     * @param {?} config
     * @return {?}
     */
    setDefaults(config) {
        this.globalConfig = Object.assign(this.globalConfig, config);
    }
    /**
     * @return {?}
     */
    get defaults() {
        return this.globalConfig;
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    setRootViewContainerRef(ref) {
        this.modalHost = ref;
    }
    /**
     * @param {?} modalInstance
     * @param {?} config
     * @return {?}
     */
    open(modalInstance, config) {
        if (typeof modalInstance === "object") {
            modalInstance.init(config);
            modalInstance.open();
            return modalInstance;
        }
        else if (typeof modalInstance === "function") {
            /** @type {?} */
            let componentFactory = this.componentFactoryResolver.resolveComponentFactory(modalInstance);
            this.modalHost.remove();
            /** @type {?} */
            let componentRef = this.modalHost.createComponent(componentFactory);
            setTimeout(() => {
                componentRef.instance['ModalComponent'].init(config);
                componentRef.instance['ModalComponent'].open();
            });
            componentRef.instance['onOpen'] = this.closeFactory();
            componentRef.instance['onClose'] = componentRef.instance['ModalComponent'].onClose;
            componentRef.instance['close'] = componentRef.instance['ModalComponent'].onOpen;
            return componentRef.instance;
        }
    }
    /**
     * @param {?} modalInstance
     * @return {?}
     */
    close(modalInstance) {
        modalInstance.close();
    }
    /**
     * @return {?}
     */
    closeFactory() {
        /** @type {?} */
        var _self = this;
        return function () {
            this['ModalComponent'].close();
            _self.modalHost.remove();
        };
    }
}
ModalManager.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
ModalManager.ctorParameters = () => [
    { type: ComponentFactoryResolver }
];
/** @nocollapse */ ModalManager.ngInjectableDef = defineInjectable({ factory: function ModalManager_Factory() { return new ModalManager(inject(ComponentFactoryResolver)); }, token: ModalManager, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ModalComponent {
    /**
     * @param {?} modalManager
     */
    constructor(modalManager) {
        this.modalManager = modalManager;
        // //title of modal
        // @Input() title;
        // //size of modal. sm,lg,md
        // @Input() size;
        // //modalClass added to modal dialog
        // @Input() modalClass;
        // //hide close button
        // @Input() hideCloseButton;
        // //if modal is vertically centered
        // @Input() centered
        // //if backdrop is applied on modal
        // @Input() backdrop
        // //if true, animation is added to modal dialog
        // @Input() animation;
        // //listen to keyboard events
        // @Input() keyboard;
        // //close on outside click
        // @Input() closeOnOutsideClick;
        // //custom backdrop class
        // @Input() backdropClass;
        this.opened = new EventEmitter(false);
        this.closed = new EventEmitter(false);
        this.openObserver = new Subject();
        this.closeObserver = new Subject();
        this.isOpened = false;
        this.settings = {
            closeOnEscape: true,
            closeOnOutsideClick: true,
            hideCloseButton: false,
            backdrop: true
        };
    }
    /**
     * @param {?} config
     * @return {?}
     */
    init(config) {
        this.settings = Object.assign({}, this.modalManager.defaults, config);
        this.createBackDrop();
    }
    /**
     * @return {?}
     */
    open() {
        if (this.isOpened)
            return;
        document.body.appendChild(this.backdropElement);
        document.body.classList.add("modal-open");
        this.isOpened = true;
        window.setTimeout(() => {
            this.modalRoot.nativeElement.classList.add('in');
            this.modalRoot.nativeElement.focus();
            this.opened.emit();
            this.openObserver.next(true);
        }, 0);
    }
    /**
     * @return {?}
     */
    close() {
        if (!this.isOpened)
            return;
        this.modalRoot.nativeElement.classList.remove('in');
        document.body.removeChild(this.backdropElement);
        document.body.className = document.body.className.replace(/modal-open\b/, "");
        window.setTimeout(() => {
            this.isOpened = false;
            this.closed.emit();
            this.closeObserver.next(true);
        }, 100);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    preventClosing(event) {
        event.stopPropagation();
    }
    /**
     * @return {?}
     */
    onOpen() {
        return this.openObserver.asObservable();
    }
    /**
     * @return {?}
     */
    onClose() {
        return this.closeObserver.asObservable();
    }
    /**
     * @return {?}
     */
    createBackDrop() {
        this.backdropElement = document.createElement("div");
        this.backdropElement.classList.add("fade");
        this.backdropElement.classList.add("in");
        if (this.settings && this.settings.backdrop && this.settings.backdrop == true) {
            this.backdropElement.classList.add(this.settings.backdropClass);
        }
    }
}
ModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'modal',
                template: `<div class="modal" tabindex="-1" role="dialog" #modalRoot (keydown.esc)="settings?.keyboard ? close() : 0" [ngStyle]="{ display: isOpened ? 'block' : 'none' }" [ngClass]="{'fade': settings.animation}" (click)="settings?.backdrop !== 'static' && settings?.closeOnOutsideClick ? close() : 0">
    <div [class]="'modal-dialog modal-'+ settings?.size + ' ' + settings?.modalClass" (click)="preventClosing($event)" [ngClass]="{'modal-dialog-centered': settings.centered}">
        <div class="modal-content" tabindex="0" *ngIf="isOpened">
            <div class="modal-header">
                <button *ngIf="!settings?.hideCloseButton" type="button" class="close" [attr.aria-label]="settings?.cancelButtonLabel || 'Close'" (click)="close()"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" *ngIf="settings?.title">{{ settings?.title }}</h4>
                <ng-content select="modal-header"></ng-content>
            </div>
            <div class="modal-body">
                <ng-content select="modal-content"></ng-content>
            </div>
            <div class="modal-footer">
                <ng-content select="modal-footer"></ng-content>
            </div>
        </div>
    </div>
</div>`,
                styles: [`.modal-dialog-centered {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    min-height: calc(100% - (0.5rem * 2));
  }
  @media (min-width: 576px) {
    .modal-dialog-centered {
      min-height: calc(100% - (1.75rem * 2));
    }
  }`]
            },] },
];
/** @nocollapse */
ModalComponent.ctorParameters = () => [
    { type: ModalManager }
];
ModalComponent.propDecorators = {
    opened: [{ type: Output }],
    closed: [{ type: Output }],
    modalRoot: [{ type: ViewChild, args: ["modalRoot",] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ModalFooterComponent {
    constructor() { }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
ModalFooterComponent.decorators = [
    { type: Component, args: [{
                selector: 'modal-footer',
                template: `<ng-content></ng-content>`
            },] },
];
/** @nocollapse */
ModalFooterComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ModalContentComponent {
    constructor() { }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
ModalContentComponent.decorators = [
    { type: Component, args: [{
                selector: 'modal-content',
                template: `<ng-content></ng-content>`
            },] },
];
/** @nocollapse */
ModalContentComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ModalHeaderComponent {
    constructor() { }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
ModalHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'modal-header',
                template: `<ng-content></ng-content>`
            },] },
];
/** @nocollapse */
ModalHeaderComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ModalModule {
}
ModalModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [ModalComponent, ModalFooterComponent, ModalContentComponent, ModalHeaderComponent],
                exports: [ModalComponent, ModalFooterComponent, ModalContentComponent, ModalHeaderComponent]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { ModalManager, ModalComponent, ModalModule, ModalContentComponent, ModalHeaderComponent, ModalFooterComponent };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdiLW1vZGFsLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uZ2ItbW9kYWwvbGliL21vZGFsLnNlcnZpY2UudHMiLCJuZzovL25nYi1tb2RhbC9saWIvbW9kYWwuY29tcG9uZW50LnRzIiwibmc6Ly9uZ2ItbW9kYWwvbGliL21vZGFsLWZvb3Rlci5jb21wb25lbnQudHMiLCJuZzovL25nYi1tb2RhbC9saWIvbW9kYWwtY29udGVudC5jb21wb25lbnQudHMiLCJuZzovL25nYi1tb2RhbC9saWIvbW9kYWwtaGVhZGVyLmNvbXBvbmVudC50cyIsIm5nOi8vbmdiLW1vZGFsL2xpYi9tb2RhbC5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgVmlld0NoaWxkLCBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIENvbXBvbmVudFJlZiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBNb2RhbE1hbmFnZXIge1xuXG4gIHByaXZhdGUgbW9kYWxIb3N0OiBWaWV3Q29udGFpbmVyUmVmO1xuXG4gIHByaXZhdGUgZ2xvYmFsQ29uZmlnIDogTW9kYWxDb25maWcgPSB7XG4gICAgc2l6ZTogXCJtZFwiLFxuICAgIG1vZGFsQ2xhc3M6IHVuZGVmaW5lZCxcbiAgICBoaWRlQ2xvc2VCdXR0b24gOiBmYWxzZSxcbiAgICBjZW50ZXJlZDogZmFsc2UsXG4gICAgYmFja2Ryb3A6IHRydWUsXG4gICAgYW5pbWF0aW9uIDogdHJ1ZSxcbiAgICBrZXlib2FyZDogdHJ1ZSxcbiAgICBjbG9zZU9uT3V0c2lkZUNsaWNrOiB0cnVlLFxuICAgIGJhY2tkcm9wQ2xhc3M6IFwibW9kYWwtYmFja2Ryb3BcIiBcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyKSB7IH1cblxuICBzZXQgZGVmYXVsdHMoY29uZmlnOiBNb2RhbENvbmZpZykge1xuICAgIHRoaXMuZ2xvYmFsQ29uZmlnID0gT2JqZWN0LmFzc2lnbih0aGlzLmdsb2JhbENvbmZpZywgY29uZmlnKTtcbiAgfVxuXG4gIHNldERlZmF1bHRzKGNvbmZpZzogTW9kYWxDb25maWcpe1xuICAgIHRoaXMuZ2xvYmFsQ29uZmlnID0gT2JqZWN0LmFzc2lnbih0aGlzLmdsb2JhbENvbmZpZywgY29uZmlnKTsgICAgXG4gIH1cblxuICBnZXQgZGVmYXVsdHMoKSA6IE1vZGFsQ29uZmlnIHtcbiAgICByZXR1cm4gdGhpcy5nbG9iYWxDb25maWc7XG4gIH1cblxuICBzZXRSb290Vmlld0NvbnRhaW5lclJlZihyZWYpe1xuICAgIHRoaXMubW9kYWxIb3N0ID0gcmVmO1xuICB9XG5cbiAgb3Blbihtb2RhbEluc3RhbmNlLCBjb25maWcpe1xuICAgIGlmKHR5cGVvZiBtb2RhbEluc3RhbmNlID09PSBcIm9iamVjdFwiKXtcbiAgICAgIG1vZGFsSW5zdGFuY2UuaW5pdChjb25maWcpO1xuICAgICAgbW9kYWxJbnN0YW5jZS5vcGVuKCk7XG4gICAgICByZXR1cm4gbW9kYWxJbnN0YW5jZTtcbiAgICB9ZWxzZSBpZih0eXBlb2YgbW9kYWxJbnN0YW5jZSA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgIGxldCBjb21wb25lbnRGYWN0b3J5ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkobW9kYWxJbnN0YW5jZSk7XG4gICAgICB0aGlzLm1vZGFsSG9zdC5yZW1vdmUoKTtcbiAgICAgIGxldCBjb21wb25lbnRSZWYgPSB0aGlzLm1vZGFsSG9zdC5jcmVhdGVDb21wb25lbnQoY29tcG9uZW50RmFjdG9yeSk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29tcG9uZW50UmVmLmluc3RhbmNlWydNb2RhbENvbXBvbmVudCddLmluaXQoY29uZmlnKTtcbiAgICAgICAgY29tcG9uZW50UmVmLmluc3RhbmNlWydNb2RhbENvbXBvbmVudCddLm9wZW4oKTsgICAgICAgIFxuICAgICAgfSlcbiAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZVsnb25PcGVuJ10gPSB0aGlzLmNsb3NlRmFjdG9yeSgpO1xuICAgICAgY29tcG9uZW50UmVmLmluc3RhbmNlWydvbkNsb3NlJ10gPSBjb21wb25lbnRSZWYuaW5zdGFuY2VbJ01vZGFsQ29tcG9uZW50J10ub25DbG9zZTtcbiAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZVsnY2xvc2UnXSA9IGNvbXBvbmVudFJlZi5pbnN0YW5jZVsnTW9kYWxDb21wb25lbnQnXS5vbk9wZW47XG4gICAgIHJldHVybiBjb21wb25lbnRSZWYuaW5zdGFuY2U7XG4gICAgfSBcblxuICB9XG5cbiAgY2xvc2UobW9kYWxJbnN0YW5jZSl7XG4gICAgbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuICB9XG5cbiAgY2xvc2VGYWN0b3J5KCl7XG4gICAgdmFyIF9zZWxmID0gdGhpcztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzWydNb2RhbENvbXBvbmVudCddLmNsb3NlKCk7XG4gICAgICBfc2VsZi5tb2RhbEhvc3QucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBNb2RhbENvbmZpZyB7XG4gICAgdGl0bGU/OiBzdHJpbmcsXG4gICAgc2l6ZT86IHN0cmluZyB8IFwibWRcIixcbiAgICBtb2RhbENsYXNzPzogc3RyaW5nIHwgJycsXG4gICAgaGlkZUNsb3NlQnV0dG9uPzogYm9vbGVhbiB8IGZhbHNlLFxuICAgIGNlbnRlcmVkPzogYm9vbGVhbiB8IGZhbHNlLFxuICAgIGJhY2tkcm9wPzogYm9vbGVhbiB8ICdzdGF0aWMnIHwgdHJ1ZSxcbiAgICBhbmltYXRpb24/OiBib29sZWFuIHwgdHJ1ZSxcbiAgICBrZXlib2FyZD86IGJvb2xlYW4gfCB0cnVlLFxuICAgIGNsb3NlT25PdXRzaWRlQ2xpY2s/OiBib29sZWFuIHwgdHJ1ZSxcbiAgICBiYWNrZHJvcENsYXNzPzogc3RyaW5nIHwgXCJtb2RhbC1iYWNrZHJvcFwiXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgT25EZXN0cm95LCBPbkNoYW5nZXMsIEV2ZW50RW1pdHRlciwgRWxlbWVudFJlZiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tICcuL21vZGFsLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5kZWNsYXJlIHZhciBkb2N1bWVudDogYW55O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtb2RhbCcsXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIiAjbW9kYWxSb290IChrZXlkb3duLmVzYyk9XCJzZXR0aW5ncz8ua2V5Ym9hcmQgPyBjbG9zZSgpIDogMFwiIFtuZ1N0eWxlXT1cInsgZGlzcGxheTogaXNPcGVuZWQgPyAnYmxvY2snIDogJ25vbmUnIH1cIiBbbmdDbGFzc109XCJ7J2ZhZGUnOiBzZXR0aW5ncy5hbmltYXRpb259XCIgKGNsaWNrKT1cInNldHRpbmdzPy5iYWNrZHJvcCAhPT0gJ3N0YXRpYycgJiYgc2V0dGluZ3M/LmNsb3NlT25PdXRzaWRlQ2xpY2sgPyBjbG9zZSgpIDogMFwiPlxuICAgIDxkaXYgW2NsYXNzXT1cIidtb2RhbC1kaWFsb2cgbW9kYWwtJysgc2V0dGluZ3M/LnNpemUgKyAnICcgKyBzZXR0aW5ncz8ubW9kYWxDbGFzc1wiIChjbGljayk9XCJwcmV2ZW50Q2xvc2luZygkZXZlbnQpXCIgW25nQ2xhc3NdPVwieydtb2RhbC1kaWFsb2ctY2VudGVyZWQnOiBzZXR0aW5ncy5jZW50ZXJlZH1cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIiB0YWJpbmRleD1cIjBcIiAqbmdJZj1cImlzT3BlbmVkXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cIiFzZXR0aW5ncz8uaGlkZUNsb3NlQnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBbYXR0ci5hcmlhLWxhYmVsXT1cInNldHRpbmdzPy5jYW5jZWxCdXR0b25MYWJlbCB8fCAnQ2xvc2UnXCIgKGNsaWNrKT1cImNsb3NlKClcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgKm5nSWY9XCJzZXR0aW5ncz8udGl0bGVcIj57eyBzZXR0aW5ncz8udGl0bGUgfX08L2g0PlxuICAgICAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIm1vZGFsLWhlYWRlclwiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJtb2RhbC1jb250ZW50XCI+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwibW9kYWwtZm9vdGVyXCI+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+YCxcbiAgc3R5bGVzOltgLm1vZGFsLWRpYWxvZy1jZW50ZXJlZCB7XG4gICAgZGlzcGxheTogLW1zLWZsZXhib3g7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICAtbXMtZmxleC1hbGlnbjogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgbWluLWhlaWdodDogY2FsYygxMDAlIC0gKDAuNXJlbSAqIDIpKTtcbiAgfVxuICBAbWVkaWEgKG1pbi13aWR0aDogNTc2cHgpIHtcbiAgICAubW9kYWwtZGlhbG9nLWNlbnRlcmVkIHtcbiAgICAgIG1pbi1oZWlnaHQ6IGNhbGMoMTAwJSAtICgxLjc1cmVtICogMikpO1xuICAgIH1cbiAgfWBdXG59KVxuZXhwb3J0IGNsYXNzIE1vZGFsQ29tcG9uZW50IHtcblxuICAvLyAvL3RpdGxlIG9mIG1vZGFsXG4gIC8vIEBJbnB1dCgpIHRpdGxlO1xuXG4gIC8vIC8vc2l6ZSBvZiBtb2RhbC4gc20sbGcsbWRcbiAgLy8gQElucHV0KCkgc2l6ZTtcblxuICAvLyAvL21vZGFsQ2xhc3MgYWRkZWQgdG8gbW9kYWwgZGlhbG9nXG4gIC8vIEBJbnB1dCgpIG1vZGFsQ2xhc3M7XG5cbiAgLy8gLy9oaWRlIGNsb3NlIGJ1dHRvblxuICAvLyBASW5wdXQoKSBoaWRlQ2xvc2VCdXR0b247XG5cbiAgLy8gLy9pZiBtb2RhbCBpcyB2ZXJ0aWNhbGx5IGNlbnRlcmVkXG4gIC8vIEBJbnB1dCgpIGNlbnRlcmVkXG5cbiAgLy8gLy9pZiBiYWNrZHJvcCBpcyBhcHBsaWVkIG9uIG1vZGFsXG4gIC8vIEBJbnB1dCgpIGJhY2tkcm9wXG5cbiAgLy8gLy9pZiB0cnVlLCBhbmltYXRpb24gaXMgYWRkZWQgdG8gbW9kYWwgZGlhbG9nXG4gIC8vIEBJbnB1dCgpIGFuaW1hdGlvbjtcblxuICAvLyAvL2xpc3RlbiB0byBrZXlib2FyZCBldmVudHNcbiAgLy8gQElucHV0KCkga2V5Ym9hcmQ7XG5cbiAgLy8gLy9jbG9zZSBvbiBvdXRzaWRlIGNsaWNrXG4gIC8vIEBJbnB1dCgpIGNsb3NlT25PdXRzaWRlQ2xpY2s7XG5cbiAgLy8gLy9jdXN0b20gYmFja2Ryb3AgY2xhc3NcbiAgLy8gQElucHV0KCkgYmFja2Ryb3BDbGFzcztcblxuICBAT3V0cHV0KCkgcHVibGljIG9wZW5lZCA9IG5ldyBFdmVudEVtaXR0ZXIoZmFsc2UpO1xuICBAT3V0cHV0KCkgcHVibGljIGNsb3NlZCA9IG5ldyBFdmVudEVtaXR0ZXIoZmFsc2UpO1xuXG4gIHByaXZhdGUgb3Blbk9ic2VydmVyID0gbmV3IFN1YmplY3Q8YW55PigpO1xuICBwcml2YXRlIGNsb3NlT2JzZXJ2ZXIgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gIFxuICBwdWJsaWMgaXNPcGVuZWQgPSBmYWxzZTtcblxuICBAVmlld0NoaWxkKFwibW9kYWxSb290XCIpXG4gIHB1YmxpYyBtb2RhbFJvb3Q6IEVsZW1lbnRSZWY7XG4gIHB1YmxpYyBzZXR0aW5ncztcbiAgcHJpdmF0ZSBiYWNrZHJvcEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbW9kYWxNYW5hZ2VyIDogTW9kYWxNYW5hZ2VyKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IHtcbiAgICAgIGNsb3NlT25Fc2NhcGU6IHRydWUsXG4gICAgICBjbG9zZU9uT3V0c2lkZUNsaWNrOiB0cnVlLFxuICAgICAgaGlkZUNsb3NlQnV0dG9uOiBmYWxzZSxcbiAgICAgIGJhY2tkcm9wOiB0cnVlXG4gICAgfVxuICB9XG5cbiAgaW5pdChjb25maWcpIHtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5tb2RhbE1hbmFnZXIuZGVmYXVsdHMsIGNvbmZpZyk7XG4gICAgdGhpcy5jcmVhdGVCYWNrRHJvcCgpO1xuICB9XG5cblxuICBvcGVuKCkge1xuICAgIGlmICh0aGlzLmlzT3BlbmVkKVxuICAgICAgcmV0dXJuO1xuICAgIFxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5iYWNrZHJvcEVsZW1lbnQpO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcIm1vZGFsLW9wZW5cIik7XG4gICAgdGhpcy5pc09wZW5lZCA9IHRydWU7XG4gICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5tb2RhbFJvb3QubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpbicpO1xuICAgICAgdGhpcy5tb2RhbFJvb3QubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5vcGVuZWQuZW1pdCgpO1xuICAgICAgdGhpcy5vcGVuT2JzZXJ2ZXIubmV4dCh0cnVlKTtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIGlmICghdGhpcy5pc09wZW5lZClcbiAgICAgIHJldHVybjtcblxuICAgIHRoaXMubW9kYWxSb290Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaW4nKTtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMuYmFja2Ryb3BFbGVtZW50KTtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lLnJlcGxhY2UoL21vZGFsLW9wZW5cXGIvLCBcIlwiKTtcbiAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmlzT3BlbmVkID0gZmFsc2U7XG4gICAgICB0aGlzLmNsb3NlZC5lbWl0KCk7XG4gICAgICB0aGlzLmNsb3NlT2JzZXJ2ZXIubmV4dCh0cnVlKTtcbiAgICB9LCAxMDApO1xuICB9XG5cbiAgcHVibGljIHByZXZlbnRDbG9zaW5nKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICBvbk9wZW4oKXtcbiAgICByZXR1cm4gdGhpcy5vcGVuT2JzZXJ2ZXIuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBvbkNsb3NlKCl7XG4gICAgcmV0dXJuIHRoaXMuY2xvc2VPYnNlcnZlci5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQmFja0Ryb3AoKSB7XG4gICAgdGhpcy5iYWNrZHJvcEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJmYWRlXCIpO1xuICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJpblwiKTtcbiAgICBpZiAodGhpcy5zZXR0aW5ncyAmJiB0aGlzLnNldHRpbmdzLmJhY2tkcm9wICYmIHRoaXMuc2V0dGluZ3MuYmFja2Ryb3AgPT0gdHJ1ZSkge1xuICAgICAgdGhpcy5iYWNrZHJvcEVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLnNldHRpbmdzLmJhY2tkcm9wQ2xhc3MpO1xuICAgIH1cbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtb2RhbC1mb290ZXInLFxuICB0ZW1wbGF0ZTpgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PmBcbn0pXG5leHBvcnQgY2xhc3MgTW9kYWxGb290ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbW9kYWwtY29udGVudCcsXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PmBcbn0pXG5leHBvcnQgY2xhc3MgTW9kYWxDb250ZW50Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21vZGFsLWhlYWRlcicsXG4gIHRlbXBsYXRlOmA8bmctY29udGVudD48L25nLWNvbnRlbnQ+YFxufSlcblxuZXhwb3J0IGNsYXNzIE1vZGFsSGVhZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICB9XG5cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNb2RhbENvbXBvbmVudCB9IGZyb20gJy4vbW9kYWwuY29tcG9uZW50JztcbmltcG9ydCB7IE1vZGFsRm9vdGVyQ29tcG9uZW50IH0gZnJvbSBcIi4vbW9kYWwtZm9vdGVyLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgTW9kYWxDb250ZW50Q29tcG9uZW50IH0gZnJvbSBcIi4vbW9kYWwtY29udGVudC5jb21wb25lbnRcIjtcbmltcG9ydCB7IE1vZGFsSGVhZGVyQ29tcG9uZW50IH0gZnJvbSBcIi4vbW9kYWwtaGVhZGVyLmNvbXBvbmVudFwiO1xuXG5pbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW01vZGFsQ29tcG9uZW50LCBNb2RhbEZvb3RlckNvbXBvbmVudCwgTW9kYWxDb250ZW50Q29tcG9uZW50LCBNb2RhbEhlYWRlckNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtNb2RhbENvbXBvbmVudCwgTW9kYWxGb290ZXJDb21wb25lbnQsIE1vZGFsQ29udGVudENvbXBvbmVudCwgTW9kYWxIZWFkZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE1vZGFsTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7SUFxQkUsWUFBb0Isd0JBQWtEO1FBQWxELDZCQUF3QixHQUF4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