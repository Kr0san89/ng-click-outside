import {APP_ID, ApplicationConfig, importProvidersFrom} from '@angular/core';
import {BrowserModule, provideClientHydration, withEventReplay} from "@angular/platform-browser";
import {
  NgClickOutsideAttachOutsideDirective,
  NgClickOutsideDirective,
  NgClickOutsideEmitOnBlurDirective,
  NgClickOutsideExcludeDirective
} from "ng-click-outside2";

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, NgClickOutsideDirective, NgClickOutsideAttachOutsideDirective, NgClickOutsideExcludeDirective, NgClickOutsideEmitOnBlurDirective),
    {provide: APP_ID, useValue: 'serverApp'}, provideClientHydration(withEventReplay())
  ]
};

