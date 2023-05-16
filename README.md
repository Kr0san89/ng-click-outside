# ng-click-outside2


[![NPM](https://img.shields.io/npm/v/ng-click-outside2?color=orange&style=flat-square)](https://www.npmjs.com/package/ng-click-outside2)
[![License](https://img.shields.io/github/license/Kr0san89/ng-click-outside?color=blue&style=flat-square)](https://github.com/Kr0san89/ng-click-outside/blob/master/LICENSE)

Angular directive for handling click events outside an element.

Like binding to a regular `click` event in a template, you can do something like this:

```HTML
<div (clickOutside)="onClickedOutside($event)">My element</div>
```

## Table of contents
1. [Installation](#installation)
2. [Compatibility](#compatibility)
3. [Usage](#usage)
4. [Migration from ng-click-outside](#migration-from-ng-click-outside)

## Installation

```shell
npm install --save ng-click-outside2
```

## Compatibility
| Angular | Version | NPM |
|---------|---------|---| 
| 13      | 10.x.x  | `ng-click-outside2@^10.0.0` |
| 14,15,16 | 11.x.x  | `ng-click-outside2@^11.0.0` |

If you still use Angular <= 12 please use the original package. https://www.npmjs.com/package/ng-click-outside

## Usage

Add `NgClickOutsideDirective` to your list of module imports:

```typescript
import {NgClickOutsideDirective} from 'ng-click-outside2';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgClickOutsideDirective],
  bootstrap: [AppComponent]
})
class AppModule {}
```

You can then use the directive in your templates:

```typescript
@Component({
  selector: 'app',
  template: `
    <div (clickOutside)="onClickedOutside($event)">Click outside this</div>
  `
})
export class AppComponent {
  onClickedOutside(e: Event) {
    console.log('Clicked outside:', e);
  }
}
```

### Options

| Property name | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| `attachOutsideOnClick` | boolean | `false` | By default, the outside click event handler is automatically attached. Explicitely setting this to `true` sets the handler after the element is clicked. The outside click event handler will then be removed after a click outside has occurred. |
| `clickOutsideEnabled` | boolean | `true` | Enables directive. |
| `clickOutsideEvents` | string | `'click'` | A comma-separated list of events to cause the trigger. For example, for additional mobile support: `[clickOutsideEvents]="'click,touchstart'"`. |
| `delayClickOutsideInit` | boolean | `false` | Delays the initialization of the click outside handler. This may help for items that are conditionally shown ([see issue #13](https://github.com/arkon/ng-click-outside/issues/13)). |
| `emitOnBlur` | boolean | `false` | If enabled, emits an event when user clicks outside of applications' window while it's visible. Especially useful if page contains iframes. |
| `exclude` | string | | A comma-separated string of DOM element queries to exclude when clicking outside of the element. For example: `[exclude]="'button,.btn-primary'"`. |
| `excludeBeforeClick` | boolean | `false` | By default, `clickOutside` registers excluded DOM elements on init. This property refreshes the list before the `clickOutside` event is triggered. This is useful for ensuring that excluded elements added to the DOM after init are excluded (e.g. ng2-bootstrap popover: this allows for clicking inside the `.popover-content` area if specified in `exclude`). |

## Migration from ng-click-outside

```
// change imports
import { ClickOutsideModule } from 'ng-click-outside';
// to
import {NgClickOutsideDirective} from 'ng-click-outside2';

// and in Module import
ClickOutsideModule
// to
NgClickOutsideDirective
```
---
