import { Component } from '@angular/core';
import { NgClickOutsideEmitOnBlurDirective, NgClickOutsideExcludeDirective, NgClickOutsideAttachOutsideDirective } from 'ng-click-outside2';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [NgClickOutsideEmitOnBlurDirective, NgClickOutsideExcludeDirective, NgClickOutsideAttachOutsideDirective]
})
export class AppComponent {
  countInside: number = 0;
  countOutside: number = 0;

  attachOutsideOnClick = false;
  enabled = true;

  _toggleAttachOutsideOnClick() {
    this.attachOutsideOnClick = !this.attachOutsideOnClick;
  }

  _toggleEnabled() {
    this.enabled = !this.enabled;
  }

  onClick(e: Event) {
    console.info('Clicked inside:', e);
    this.countInside++;
  }

  onClickedOutside(e: Event) {
    console.info('Clicked outside:', e);
    this.countOutside++;
  }
}
