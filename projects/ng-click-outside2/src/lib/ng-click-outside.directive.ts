import {
  afterNextRender,
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  output,
  DOCUMENT
} from '@angular/core';
import {NgClickOutsideExcludeToken} from "./ng-click-outside-exclude.directive";
import {arrayAttribute} from "./array-attribute";

/**
 * Directive to detect clicks outside of the current element
 *
 * ```typescript
 * @Component({
 *   selector: 'app',
 *   template: `
 *     <div (clickOutside)="onClickedOutside($event)">Click outside this</div>
 *   `
 * })
 * export class AppComponent {
 *   onClickedOutside(e: Event) {
 *     console.log('Clicked outside:', e);
 *   }
 * }
 * ```
 */
@Directive({
  selector: '[clickOutside]:not([delayClickOutsideInit]):not([attachOutsideOnClick])',
  standalone: true,
})
export class NgClickOutsideDirective implements OnDestroy {

  /**
   * Enables directive.
   */
  clickOutsideEnabled = input(true, {transform: booleanAttribute});

  /**
   * A comma-separated list of events to cause the trigger.
   * ### For example, for additional mobile support:
   * `[clickOutsideEvents]="'click,touchstart'"`
   */
  clickOutsideEvents = input(['click'], {
    transform: arrayAttribute
  });

  /**
   * Outside Click Event
   */
  clickOutside = output<Event>();

  excludeDirective = inject(NgClickOutsideExcludeToken, {host: true, optional: true});
  protected _el = inject(ElementRef);
  protected _ngZone = inject(NgZone);
  private document = inject<Document>(DOCUMENT);
  lastRemoved?: Node[];
  mutationObserver?: MutationObserver;

  constructor() {
    this._initOnClickBody = this._initOnClickBody.bind(this);
    this._onClickBody = this._onClickBody.bind(this);
    afterNextRender(() => this._init())
  }

  ngOnDestroy() {
    this._removeClickOutsideListener();
    this.mutationObserver?.disconnect();
  }

  protected _init() {
    this._initOnClickBody();
  }

  protected _initOnClickBody() {
    this.initListener();
  }

  protected _emit(ev: Event) {
    this._ngZone.run(() => this.clickOutside.emit(ev));
  }

  protected initListener() {
    this.initMutationObserver();
    this._initClickOutsideListener();
  }

  private initMutationObserver() {
    this.mutationObserver = new MutationObserver((mutationList) => {
      this.lastRemoved = mutationList.flatMap(list => Array.from((list.removedNodes as any).values()));
    });

    this.mutationObserver.observe(this._el.nativeElement, {
      childList: true,
      subtree: true,
    });
  }

  protected _initClickOutsideListener() {
    this._ngZone.runOutsideAngular(() => {
      this.clickOutsideEvents().forEach(e => this.document.addEventListener(e, this._onClickBody));
    });
  }

  protected _removeClickOutsideListener() {
    this._ngZone.runOutsideAngular(() => {
      this.clickOutsideEvents().forEach(e => this.document.removeEventListener(e, this._onClickBody));
    });
  }

  private _onClickBody(ev: Event) {
    if (!this.clickOutsideEnabled()) {
      return;
    }

    if (!this._el.nativeElement.contains(ev.target) && !this.excludeDirective?.isExclude(ev.target) && !this.gotRemoved(ev.target as Node)) {
      this._emit(ev);
    }
    this.resetLastRemovedList();
  }

  protected gotRemoved(target: Node, list = this.lastRemoved): boolean {
    return list?.some(node => node === target || node.contains(target)) ?? false;
  }

  private resetLastRemovedList() {
    this.lastRemoved = undefined;
  }
}
