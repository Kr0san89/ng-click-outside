import {booleanAttribute, Directive, effect, input, OnDestroy} from '@angular/core';
import {NgClickOutsideDirective} from "./ng-click-outside.directive";

@Directive({
  selector: '[clickOutside][attachOutsideOnClick]',
  standalone: true
})
export class NgClickOutsideAttachOutsideDirective extends NgClickOutsideDirective implements OnDestroy {
  /**
   * By default, the outside click event handler is automatically attached.
   *
   * Explicitely setting this to `true`sets the handler after the element is clicked. The outside click event handler
   * will then be removed after a click outside has occurred.
   */
  attachOutsideOnClick = input.required({transform: booleanAttribute});


  constructor() {
    super();
    effect(() => {
      this.attachOutsideOnClick();
      this._init()
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._removeAttachOutsideOnClickListener();
  }

  protected override _init() {
    if (this.attachOutsideOnClick()) {
      this._initAttachOutsideOnClickListener();
    } else {
      this._initOnClickBody();
    }
  }

  protected override _emit(ev: Event) {
    if (this.attachOutsideOnClick()) {
      this._removeClickOutsideListener();
    }
    super._emit(ev);
  }

  protected _initAttachOutsideOnClickListener() {
    this._ngZone.runOutsideAngular(() => {
      this.clickOutsideEvents().forEach(e => this._el.nativeElement.addEventListener(e, this._initOnClickBody));
    });
  }

  protected _removeAttachOutsideOnClickListener() {
    this._ngZone.runOutsideAngular(() => {
      this.clickOutsideEvents().forEach(e => this._el.nativeElement.removeEventListener(e, this._initOnClickBody));
    });
  }
}
