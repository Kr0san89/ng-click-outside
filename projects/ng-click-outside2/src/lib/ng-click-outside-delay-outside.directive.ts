import {booleanAttribute, Directive, input} from '@angular/core';
import {NgClickOutsideDirective} from "./ng-click-outside.directive";

/**
 * Click oustside Directive but with an setTimeout on the listener
 * This may help for items that are conditionally shown ([see issue #13](https://github.com/arkon/ng-click-outside/issues/13)).
 */
@Directive({
  selector: '[clickOutside][delayClickOutsideInit]',
  standalone: true
})
export class NgClickOutsideDelayOutsideDirective extends NgClickOutsideDirective  {

  /**
   * Delays the initialization of the click outside handler.
   * This may help for items that are conditionally shown ([see issue #13](https://github.com/arkon/ng-click-outside/issues/13)).
   */
  delayClickOutsideInit = input.required( {transform: booleanAttribute});

  protected override _initOnClickBody() {
    if (this.delayClickOutsideInit()) {
      setTimeout(super.initListener.bind(this));
    } else {
      super.initListener();
    }
  }
}
