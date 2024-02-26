import {
  afterNextRender,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {NgClickOutsideExcludeToken} from "./ng-click-outside-exclude.directive";

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
  selector: '[clickOutside]',
  standalone: true,
})
export class NgClickOutsideDirective implements OnChanges, OnDestroy {

  /**
   * Enables directive.
   */
  @Input() clickOutsideEnabled = true;

  /**
   * By default, the outside click event handler is automatically attached.
   *
   * Explicitely setting this to `true`sets the handler after the element is clicked. The outside click event handler
   * will then be removed after a click outside has occurred.
   */
  @Input() attachOutsideOnClick = false;
  /**
   * Delays the initialization of the click outside handler.
   * This may help for items that are conditionally shown ([see issue #13](https://github.com/arkon/ng-click-outside/issues/13)).
   */
  @Input() delayClickOutsideInit = false;

  /**
   * A comma-separated list of events to cause the trigger.
   * ### For example, for additional mobile support:
   * `[clickOutsideEvents]="'click,touchstart'"`
   */
  @Input() clickOutsideEvents = '';

  /**
   * Outside Click Event
   */
  @Output() clickOutside: EventEmitter<Event> = new EventEmitter<Event>();

  excludeDirective = inject(NgClickOutsideExcludeToken, {host: true, optional: true});
  private _el = inject(ElementRef);
  private _ngZone = inject(NgZone);
  private document = inject<Document>(DOCUMENT);
  private _events: Array<string> = ['click'];

  constructor() {
    this._initOnClickBody = this._initOnClickBody.bind(this);
    this._onClickBody = this._onClickBody.bind(this);
    afterNextRender(() => this._init())
  }

  ngOnDestroy() {
    this._removeClickOutsideListener();
    this._removeAttachOutsideOnClickListener();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['attachOutsideOnClick'] || changes['emitOnBlur']) {
      this._init();
    }
  }

  private _init() {
    if (this.clickOutsideEvents !== '') {
      this._events = this.clickOutsideEvents.split(',').map(e => e.trim());
    }

    if (this.attachOutsideOnClick) {
      this._initAttachOutsideOnClickListener();
    } else {
      this._initOnClickBody();
    }
  }

  private _initOnClickBody() {
    if (this.delayClickOutsideInit) {
      setTimeout(this._initClickOutsideListener.bind(this));
    } else {
      this._initClickOutsideListener();
    }
  }


  private _onClickBody(ev: Event) {
    if (!this.clickOutsideEnabled) {
      return;
    }

    if (!this._el.nativeElement.contains(ev.target) && !this.excludeDirective?.isExclude(ev.target)) {
      this._emit(ev);

      if (this.attachOutsideOnClick) {
        this._removeClickOutsideListener();
      }
    }
  }

  private _emit(ev: Event) {
    if (!this.clickOutsideEnabled) {
      return;
    }

    this._ngZone.run(() => this.clickOutside.emit(ev));
  }

  private _initClickOutsideListener() {
    this._ngZone.runOutsideAngular(() => {
      this._events.forEach(e => this.document.addEventListener(e, this._onClickBody));
    });
  }

  private _removeClickOutsideListener() {
    this._ngZone.runOutsideAngular(() => {
      this._events.forEach(e => this.document.removeEventListener(e, this._onClickBody));
    });
  }

  private _initAttachOutsideOnClickListener() {
    this._ngZone.runOutsideAngular(() => {
      this._events.forEach(e => this._el.nativeElement.addEventListener(e, this._initOnClickBody));
    });
  }

  private _removeAttachOutsideOnClickListener() {
    this._ngZone.runOutsideAngular(() => {
      this._events.forEach(e => this._el.nativeElement.removeEventListener(e, this._initOnClickBody));
    });
  }
}
