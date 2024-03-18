import {booleanAttribute, Directive, Input} from '@angular/core';
import {NgClickOutsideDirective} from "./ng-click-outside.directive";

@Directive({
  selector: '[clickOutside][delayClickOutsideInit]',
  standalone: true
})
export class NgClickOutsideDelayOutsideDirective  extends NgClickOutsideDirective  {

  /**
   * Delays the initialization of the click outside handler.
   * This may help for items that are conditionally shown ([see issue #13](https://github.com/arkon/ng-click-outside/issues/13)).
   */
  @Input({transform: booleanAttribute, required: true}) delayClickOutsideInit = true;

  protected override _initOnClickBody() {
    if (this.delayClickOutsideInit) {
      setTimeout(this._initClickOutsideListener.bind(this));
    } else {
      this._initClickOutsideListener();
    }
  }
}
