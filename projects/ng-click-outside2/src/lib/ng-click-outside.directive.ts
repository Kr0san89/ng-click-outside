import {
  afterNextRender,
  booleanAttribute,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {NgClickOutsideExcludeToken} from "./ng-click-outside-exclude.directive";
import {arrayAttribute} from "./array-attribute";

/**
 * Directove to detect clicks outside of the current element
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
  @Input({transform: booleanAttribute}) clickOutsideEnabled = true;

  /**
   * A comma-separated list of events to cause the trigger.
   * ### For example, for additional mobile support:
   * `[clickOutsideEvents]="'click,touchstart'"`
   */
  @Input({
    transform: arrayAttribute
  }) clickOutsideEvents = ['click'];

  /**
   * Outside Click Event
   */
  @Output() clickOutside: EventEmitter<Event> = new EventEmitter<Event>();

  excludeDirective = inject(NgClickOutsideExcludeToken, {host: true, optional: true});
  protected _el = inject(ElementRef);
  protected _ngZone = inject(NgZone);
  private document = inject<Document>(DOCUMENT);

  constructor() {
    this._initOnClickBody = this._initOnClickBody.bind(this);
    this._onClickBody = this._onClickBody.bind(this);
    afterNextRender(() => this._init())
  }

  ngOnDestroy() {
    this._removeClickOutsideListener();
  }

  protected _init() {
    this._initClickOutsideListener();
  }

  protected _initOnClickBody() {
    this._initClickOutsideListener();
  }

  protected _emit(ev: Event) {
    this._ngZone.run(() => this.clickOutside.emit(ev));
  }

  protected _initClickOutsideListener() {
    this._ngZone.runOutsideAngular(() => {
      this.clickOutsideEvents.forEach(e => this.document.addEventListener(e, this._onClickBody));
    });
  }

  protected _removeClickOutsideListener() {
    this._ngZone.runOutsideAngular(() => {
      this.clickOutsideEvents.forEach(e => this.document.removeEventListener(e, this._onClickBody));
    });
  }

  private _onClickBody(ev: Event) {
    if (!this.clickOutsideEnabled) {
      return;
    }

    if (!this._el.nativeElement.contains(ev.target) && !this.excludeDirective?.isExclude(ev.target)) {
      this._emit(ev);
    }
  }
}
