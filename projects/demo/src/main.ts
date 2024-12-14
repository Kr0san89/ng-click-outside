import {APP_ID, enableProdMode, importProvidersFrom} from '@angular/core';

import {environment} from './environments/environment';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {
  NgClickOutsideAttachOutsideDirective,
  NgClickOutsideDirective,
  NgClickOutsideEmitOnBlurDirective,
  NgClickOutsideExcludeDirective
} from 'ng-click-outside2';
import {AppComponent} from './app/app.component';

if (environment.production) {
  enableProdMode();
}

function bootstrap() {
  bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(BrowserModule, NgClickOutsideDirective, NgClickOutsideAttachOutsideDirective, NgClickOutsideExcludeDirective, NgClickOutsideEmitOnBlurDirective),
      {provide: APP_ID, useValue: 'serverApp'}
    ]
  })
    .catch(err => console.error(err));
}


if (document.readyState === 'complete') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}

