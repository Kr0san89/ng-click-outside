import {Directive, inject, Inject, Input} from '@angular/core';
import {DOCUMENT} from "@angular/common";

/**
 * Optimization for Treeshaking: https://angular.io/guide/lightweight-injection-tokens
 */
export abstract class NgClickOutsideExcludeToken {
  abstract isExclude(target: any): boolean;
}

@Directive({
  selector: '[clickOutsideExclude]',
  standalone: true,
  providers: [
    {provide: NgClickOutsideExcludeToken, useExisting: NgClickOutsideExcludeDirective}
  ]
})
export class NgClickOutsideExcludeDirective extends NgClickOutsideExcludeToken {

  /**
   * A comma-separated string of DOM element queries to exclude when clicking outside of the element.
   * For example: `[exclude]="'button,.btn-primary'"`.
   */
  @Input() clickOutsideExclude = '';

  private document: Document = inject(DOCUMENT);

  public excludeCheck(): HTMLElement[] {
    if (this.clickOutsideExclude) {
      try {
        const nodes = Array.from(this.document.querySelectorAll(this.clickOutsideExclude)) as Array<HTMLElement>;
        if (nodes) {
          return nodes;
        }
      } catch (err) {
        console.error('[ng-click-outside] Check your exclude selector syntax.', err);
      }
    }
    return [];
  }

  public isExclude(target: any): boolean {
    const nodesExcluded = this.excludeCheck();
    for (let excludedNode of nodesExcluded) {
      if (excludedNode.contains(target)) {
        return true;
      }
    }

    return false;
  }
}
