import {AfterContentInit, Component, forwardRef, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'abb-controls-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
  }]
})
export class InputComponent implements ControlValueAccessor, OnInit, AfterContentInit {

  public model: any;
  @Input() disabled = false;
  @Input() type = 'text';
  @Input() placeholder = '';

  public control: FormControl;
  constructor(
    private injector: Injector,
  ) {
  }

  propagateChange: any = function () {
  };

  validateFn: any = function () {
  };

  onTouched() {
    this.control.markAsTouched();
  }

  public clearField() {
    this.model = null;
    this.propagateChange(this.model);
  }

  public updateChanges() {
    this.propagateChange(this.model);
  }

  ngOnInit() {
  }


  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  writeValue(value) {
    this.model = value;
  }

  registerOnTouched() {
  }

  validate(c: FormControl) {
    return this.validateFn(c);
  }

  ngAfterContentInit(): void {
    const ngControl: NgControl = this.injector.get(NgControl, null);
    if (ngControl) {
      this.control = ngControl.control as FormControl;
    }
  }

  setDisabledState(isDisabled: boolean): void {
  }


}
