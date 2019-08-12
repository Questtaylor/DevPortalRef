import {AfterContentInit, Component, forwardRef, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

const now = new Date();

@Component({
  selector: 'abb-controls-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerComponent),
    multi: true
  }]
})
export class DatePickerComponent implements ControlValueAccessor, OnInit, AfterContentInit {

  model: NgbDateStruct;
  date: { year: number, month: number };
  @ViewChild('d') _dateInput;
  @Input() addOneDay = false;
  @Input() disabled = false;
  dateModel: NgbDateStruct;

  public control: FormControl;
  private _value: string;

  constructor(
    private injector: Injector,
  ) {
  }

  propagateChange: any = function () {
  };

  validateFn: any = function () {
  };

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.dateModel = this.fromModel(this._value);
    this.propagateChange(this._value);
  }

  clearField() {
    this.dateModel = null;
    this.updateChanges(this.dateModel);
  }

  getValidation() {
    return Object.keys(this.control.errors);
  }

  ngOnInit() {
    this.selectToday();
  }

  selectToday() {
    this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }

  public updateChanges(date: NgbDateStruct) {
    this.control.markAsTouched();
    this._value = this.toModel(date);
    this.propagateChange(this._value);
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  writeValue(value) {
    this.value = value;

  }

  public open() {
    this._dateInput.open();
  }

  public close() {
    this._dateInput.close();
  }

  public toggle() {
    this._dateInput.toggle();
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

  private fromModel(date: string): NgbDateStruct {

    const dateDate = new Date(date);

    if (this.addOneDay) {
      dateDate.setDate(dateDate.getDate() - 1);
    }

    return date ? {
      year: dateDate.getFullYear(),
      month: dateDate.getMonth() + 1,
      day: dateDate.getDate()
    } : null;
  }

  private toModel(date: NgbDateStruct): string {
    if (date) {

      const fixedDate = new Date(Date.UTC(
        date.year,
        date.month - 1,
        date.day
      ));

      if (this.addOneDay) {
        fixedDate.setDate(fixedDate.getDate() + 1);
      }

      return fixedDate.toISOString();
    } else {
      return null;
    }
  }
}
