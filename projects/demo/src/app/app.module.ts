import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {NgClickOutsideDirective, NgClickOutsideExcludeDirective} from "ng-click-outside2";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    NgClickOutsideDirective,
    NgClickOutsideExcludeDirective
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
