import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {NgClickOutsideDirective, NgClickOutsideExcludeDirective, NgClickOutsideEmitOnBlurDirective, NgClickOutsideAttachOutsideDirective} from "ng-click-outside2";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    NgClickOutsideDirective,
    NgClickOutsideAttachOutsideDirective,
    NgClickOutsideExcludeDirective,
    NgClickOutsideEmitOnBlurDirective
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
