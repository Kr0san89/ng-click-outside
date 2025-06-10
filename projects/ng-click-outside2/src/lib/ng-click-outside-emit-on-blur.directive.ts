import {afterNextRender, Directive, DOCUMENT, inject, NgZone, OnDestroy, output} from '@angular/core';

/**
 *  emits an event when user clicks outside of applications' window while it's visible.
 *  Especially useful if page contains iframes.
 */
@Directive({
  selector: '[clickOutsideEmitOnBlur]',
  standalone: true
})
export class NgClickOutsideEmitOnBlurDirective implements OnDestroy {
  private _ngZone = inject(NgZone);
  private document = inject<Document>(DOCUMENT);
  blurWindow = output<Event>();

  constructor() {
    this._onWindowBlur = this._onWindowBlur.bind(this);
    afterNextRender(() => this._initWindowBlurListener())
  }

  ngOnDestroy() {
    this._removeWindowBlurListener();
  }

  private _initWindowBlurListener() {
    this._ngZone.runOutsideAngular(() => {
      this.document.defaultView?.addEventListener('blur', this._onWindowBlur);
    });
  }

  /**
   * Resolves problem with outside click on iframe
   * @see https://github.com/arkon/ng-click-outside/issues/32
   */
  private _onWindowBlur(ev: Event) {
    if (!this.document.hidden) {
      this._ngZone.run(() => this.blurWindow.emit(ev));
    }
  }

  private _removeWindowBlurListener() {
    this._ngZone.runOutsideAngular(() => {
      this.document.defaultView?.removeEventListener('blur', this._onWindowBlur);
    });
  }
}
