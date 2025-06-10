import {Directive, DOCUMENT, inject, input} from '@angular/core';


/**
 * Optimization for Treeshaking: https://angular.io/guide/lightweight-injection-tokens
 */
export abstract class NgClickOutsideExcludeToken {
  abstract isExclude(target: any): boolean;
}

/**
 * Directive to exclude elements from the click-outside
 */
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
  clickOutsideExclude = input('');

  private document: Document = inject(DOCUMENT);

  public excludeCheck(): HTMLElement[] {
    const clickOutsideExclude = this.clickOutsideExclude()
    if (clickOutsideExclude) {
      try {
        const nodes = Array.from(this.document.querySelectorAll(clickOutsideExclude)) as Array<HTMLElement>;
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
