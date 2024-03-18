import {Component, ViewChild} from "@angular/core";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {DOCUMENT} from "@angular/common";
import {NgClickOutsideDelayOutsideDirective} from "./ng-click-outside-delay-outside.directive";
import {By} from "@angular/platform-browser";


@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'test-click',
  standalone: true,
  imports: [NgClickOutsideDelayOutsideDirective],
  template: `
    <button id="b-1" (click)="clickButton1 = clickButton1 + 1"></button>
    <button id="b-2" (clickOutside)="clickOutsideButton2 = clickOutsideButton2 + 1"
            (click)="clickButton2 = clickButton2 + 1" [clickOutsideEnabled]="enabled" delayClickOutsideInit
    ></button>`
})
class TestClickOutsideComponent {
  @ViewChild(NgClickOutsideDelayOutsideDirective) ngClickOutsideDirective?: NgClickOutsideDelayOutsideDirective
  clickOutsideButton2 = 0;
  clickButton1 = 0;
  clickButton2 = 0;
  enabled = true
}

describe('NgClickOutsideDirective', () => {
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
  });

  it('should click outside', () => {
    const button1 = fixture.debugElement.query(By.css('#b-1'));
    button1.nativeElement.click();
    expect(component.clickButton1).toBe(1);
    expect(component.clickButton2).toBe(0);
    expect(component.clickOutsideButton2).toBe(1);
  });
});

