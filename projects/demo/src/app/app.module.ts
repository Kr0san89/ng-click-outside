import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {NgClickOutsideDirective, NgClickOutsideExcludeDirective, NgClickOutsideEmitOnBlurDirective} from "ng-click-outside2";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    NgClickOutsideDirective,
    NgClickOutsideExcludeDirective,
    NgClickOutsideEmitOnBlurDirective
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
