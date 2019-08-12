import {AfterContentInit, Component, forwardRef, Injectable, Injector, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';
import {NgbTimeAdapter, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

/**
 * Example of a String Time adapter
 */
@Injectable()
export class NgbTimeStringAdapter extends NgbTimeAdapter<string> {

  fromModel(value: string): NgbTimeStruct {
    if (!value) {
      return null;
    }
    const split = value.split(':');
    return {
      hour: parseInt(split[0], 10),
      minute: parseInt(split[1], 10),
      second: parseInt(split[2], 10)
    };
  }

  toModel(time: NgbTimeStruct): string {
    if (!time) {
      return null;
    }
    return `${this.pad(time.hour)}:${this.pad(time.minute)}:${this.pad(time.second)}`;
  }

  private pad(i: number): string {
    return i < 10 ? `0${i}` : `${i}`;
  }
}

@Component({
  selector: 'abb-controls-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true
    },
    {provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter}
  ]
})
export class TimePickerComponent implements ControlValueAccessor, OnInit, AfterContentInit, OnChanges {

  @Input() disabled = false;
  public time = null;
  public time_parsed = '';
  public opened = false;
  public control: FormControl;

  public get value() {
    return this._value;
  }

  public set value(val) {
    this._value = val;
    this.time = val;
    this.time_parsed = val;
    this.propagateChange(this._value);
  }

  private _value: any;

  constructor(private injector: Injector) {
  }

  clearField() {
    this.time = null;
    this.time_parsed = '';
    this.updateChanges(this.time);
  }
  public close(e) {
    if (e) {
      e.preventDefault();
    }

    this.opened = false;

  }

  public set(e) {
    e.preventDefault();
    this.opened = false;
    this.time_parsed = this.time;
    this.updateChanges(this.time);
  }

  public open(e) {
    if (this.disabled) {
      return;
    }
    e.preventDefault();
    this.opened = !this.opened;
  }

  ngOnInit() {

  }

  ngAfterContentInit(): void {
    const ngControl: NgControl = this.injector.get(NgControl, null);
    if (ngControl) {
      this.control = ngControl.control as FormControl;
    }
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  public updateChanges(time: string) {
    this._value = time;
    this.propagateChange(this._value);
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  writeValue(value) {

      this.value = value;

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.disabled.currentValue !== changes.disabled.previousValue) {
      this.close(null);
    }
  }


  private propagateChange: any = function () {
  };


}
