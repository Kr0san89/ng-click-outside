import {NgClickOutsideEmitOnBlurDirective} from './ng-click-outside-emit-on-blur.directive';
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {DOCUMENT} from "@angular/common";
import {Component, ViewChild} from "@angular/core";
import {By} from "@angular/platform-browser";


@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'test-click',
  standalone: true,
  imports: [NgClickOutsideEmitOnBlurDirective],
  template: `
    <button id="b-1" (blurWindow)="blurWindowButton1 = blurWindowButton1 + 1"
            (click)="clickButton1 = clickButton1 + 1" clickOutsideEmitOnBlur
    ></button>
  `
})
class TestClickOutsideComponent {
  @ViewChild(NgClickOutsideEmitOnBlurDirective) ngClickOutsideEmitOnBlurDirective?: NgClickOutsideEmitOnBlurDirective
  blurWindowButton1 = 0;
  clickButton1 = 0;
}


describe('NgClickOutsideEmitOnBlurDirective', () => {
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

  it('should create an instance', () => {
    expect(component.ngClickOutsideEmitOnBlurDirective).toBeDefined();
  });

  it('should emit on window blur', () => {
    const button1 = fixture.debugElement.query(By.css('#b-1'));

    button1.nativeElement.click();
    document.defaultView!.dispatchEvent(new Event('blur'));

    expect(component.clickButton1).toBe(1);
    expect(component.blurWindowButton1).toBe(1);
  });
});
