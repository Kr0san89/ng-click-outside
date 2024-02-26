import { NgClickOutsideExcludeDirective } from './ng-click-outside-exclude.directive';
import {Component, ViewChild} from "@angular/core";
import {NgClickOutsideDirective} from "./ng-click-outside.directive";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {DOCUMENT} from "@angular/common";
import {By} from "@angular/platform-browser";


@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'test-click',
  standalone: true,
  imports: [NgClickOutsideDirective, NgClickOutsideExcludeDirective],
  template: `
    <button id="b-1" (click)="clickButton1 = clickButton1 + 1"></button>
    <button id="b-2" (clickOutside)="clickOutsideButton2 = clickOutsideButton2 + 1" [clickOutsideExclude]="'.no-outside-click'"
            (click)="clickButton2 = clickButton2 + 1"   [clickOutsideEnabled]="enabled"
    ></button>
    <button id="b-3" (click)="clickButton3 = clickButton3 + 1" class="no-outside-click"></button>
  `
})
class TestClickOutsideComponent {
  @ViewChild(NgClickOutsideDirective) ngClickOutsideDirective?: NgClickOutsideDirective
  clickOutsideButton2 = 0;
  clickButton1 = 0;
  clickButton2 = 0;
  clickButton3 = 0;
  enabled = true
}

describe('NgClickOutsideExcludeDirective', () => {
  let component: TestClickOutsideComponent;
  let fixture: ComponentFixture<TestClickOutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestClickOutsideComponent],
      providers: [{provider: DOCUMENT, useValue: document}]
    }).compileComponents();

    fixture = TestBed.createComponent(TestClickOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })


  it('should excludeDirective should be defined when attribute exclude exists ', () => {
    expect(component.ngClickOutsideDirective!.excludeDirective).toBeDefined();
  });

  it('should not count click of Button 3 as it is excluded', () => {
    const button3 = fixture.debugElement.query(By.css('#b-3'));
    button3.nativeElement.click();
    expect(component.clickButton3).toBe(1);
    expect(component.clickButton2).toBe(0);
    expect(component.clickOutsideButton2).toBe(0);
  });
});
