import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

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
export class NgClickOutsideDirective implements OnInit, OnChanges, OnDestroy {

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
   *  If enabled, emits an event when user clicks outside of applications' window while it's visible.
   *  Especially useful if page contains iframes.
   */
  @Input() emitOnBlur = false;

  /**
   * A comma-separated string of DOM element queries to exclude when clicking outside of the element.
   * For example: `[exclude]="'button,.btn-primary'"`.
   */
  @Input() exclude = '';
  /**
   * By default, `clickOutside` registers excluded DOM elements on init.
   *
   * This property refreshes the list before the `clickOutside` event is triggered. This is useful for ensuring that
   * excluded elements added to the DOM after init are excluded (e.g. ng2-bootstrap popover: this allows for clicking
   * inside the `.popover-content` area if specified in `exclude`).
   */
  @Input() excludeBeforeClick = false;

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

  private _nodesExcluded: Array<HTMLElement> = [];
  private _events: Array<string> = ['click'];

  constructor(
    private _el: ElementRef,
    private _ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document) {
    this._initOnClickBody = this._initOnClickBody.bind(this);
    this._onClickBody = this._onClickBody.bind(this);
    this._onWindowBlur = this._onWindowBlur.bind(this);
  }

  ngOnInit() {
    this._init();
  }

  ngOnDestroy() {
    this._removeClickOutsideListener();
    this._removeAttachOutsideOnClickListener();
    this._removeWindowBlurListener();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['attachOutsideOnClick'] || changes['exclude'] || changes['emitOnBlur']) {
      this._init();
    }
  }

  private _init() {
    if (this.clickOutsideEvents !== '') {
      this._events = this.clickOutsideEvents.split(',').map(e => e.trim());
    }

    this._excludeCheck();

    if (this.attachOutsideOnClick) {
      this._initAttachOutsideOnClickListener();
    } else {
      this._initOnClickBody();
    }

    if (this.emitOnBlur) {
      this._initWindowBlurListener();
    }
  }

  private _initOnClickBody() {
    if (this.delayClickOutsideInit) {
      setTimeout(this._initClickOutsideListener.bind(this));
    } else {
      this._initClickOutsideListener();
    }
  }

  private _excludeCheck() {
    if (this.exclude) {
      try {
        const nodes = Array.from(this.document.querySelectorAll(this.exclude)) as Array<HTMLElement>;
        if (nodes) {
          this._nodesExcluded = nodes;
        }
      } catch (err) {
        console.error('[ng-click-outside] Check your exclude selector syntax.', err);
      }
    }
  }

  private _onClickBody(ev: Event) {
    if (!this.clickOutsideEnabled) {
      return;
    }

    if (this.excludeBeforeClick) {
      this._excludeCheck();
    }

    if (!this._el.nativeElement.contains(ev.target) && !this._shouldExclude(ev.target)) {
      this._emit(ev);

      if (this.attachOutsideOnClick) {
        this._removeClickOutsideListener();
      }
    }
  }

  /**
   * Resolves problem with outside click on iframe
   * @see https://github.com/arkon/ng-click-outside/issues/32
   */
  private _onWindowBlur(ev: Event) {
    setTimeout(() => {
      if (!this.document.hidden) {
        this._emit(ev);
      }
    });
  }

  private _emit(ev: Event) {
    if (!this.clickOutsideEnabled) {
      return;
    }

    this._ngZone.run(() => this.clickOutside.emit(ev));
  }

  private _shouldExclude(target: any): boolean {
    for (let excludedNode of this._nodesExcluded) {
      if (excludedNode.contains(target)) {
        return true;
      }
    }

    return false;
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

  private _initWindowBlurListener() {
    this._ngZone.runOutsideAngular(() => {
      window.addEventListener('blur', this._onWindowBlur);
    });
  }

  private _removeWindowBlurListener() {
    this._ngZone.runOutsideAngular(() => {
      window.removeEventListener('blur', this._onWindowBlur);
    });
  }
}
