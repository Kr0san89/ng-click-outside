import {APP_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {NgClickOutsideDirective, NgClickOutsideExcludeDirective, NgClickOutsideEmitOnBlurDirective, NgClickOutsideAttachOutsideDirective} from "ng-click-outside2";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgClickOutsideDirective,
    NgClickOutsideAttachOutsideDirective,
    NgClickOutsideExcludeDirective,
    NgClickOutsideEmitOnBlurDirective
  ],
  providers: [{ provide: APP_ID,  useValue: 'serverApp' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
