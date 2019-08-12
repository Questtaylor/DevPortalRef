import {Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {NgbCalendar, NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const now = new Date();

@Component({
  selector: 'abb-controls-date-picker-range',
  templateUrl: './date-picker-range.component.html',
  styleUrls: ['./date-picker-range.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerRangeComponent),
    multi: true
  }]
})
export class DatePickerRangeComponent implements ControlValueAccessor, OnInit {

  @ViewChild('dateInput') dateInput: ElementRef;
  model: NgbDateStruct;
  @Input() disabled: true;
  @Output() dateToChange = new EventEmitter<string>();
  @Output() dateFromChange = new EventEmitter<string>();
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  isOpened = false;
  selectedRange = '';
  dateModel: NgbDateStruct;
  private _value: string;

  constructor(calendar: NgbCalendar, private renderer: Renderer2) {
    this.fromDate = calendar.getPrev(calendar.getToday(), 'd', 10);
    this.toDate = calendar.getToday();
  }

  propagateChange: any = function () {
  };

  validateFn: any = function () {
  };

  get value() {
    return this._value;
  }

  // open() {
  //   this.isOpened = true;
  // }

  set value(val) {
    this._value = val;
    this.dateModel = this.fromModel(this._value);
    this.propagateChange(this._value);
  }

  @Input('dateTo')
  set dateTo(value: string) {
    this.toDate = this.fromModel(value, true);
  }

  @Input('dateFrom')
  set dateFrom(value: string) {
    this.fromDate = this.fromModel(value);
  }

  public setFocus() {
    this.dateInput.nativeElement.setSelectionRange(0, 0);
    this.dateInput.nativeElement.focus();

    // this.renderer.selectRootElement(this.dateInput['nativeElement']).focus();


  }

  ngOnInit() {
    this.selectToday();
  }

  selectToday() {
    this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }

  onDateSelection(date: NgbDate) {

    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.selectedRange = `${this.toStringDate(this.fromDate)} - ${this.toStringDate(this.toDate)}`;
      this.updateChanges(this.selectedRange);

      this.dateToChange.next(this.toModel(this.toDate, true));
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.selectedRange = `${this.toStringDate(this.fromDate)} - ${this.toStringDate(this.fromDate)}`;
      this.dateFromChange.next(this.toModel(this.fromDate));
      this.updateChanges(this.selectedRange);
    }
  }

  public updateChanges(date: string) {
    this._value = date;
    this.propagateChange(this._value);
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  private toStringDate(date: NgbDate) {
    return `${this.fromDate.year}-${this.addExtraZero(date.month)}-${this.addExtraZero(date.day)}`;
  }

  private addExtraZero(number: number) {

    if (number < 10) {
      return '0' + number;
    }
    return number + '';


  }

  private fromModel(date: string, addOneDay = false): NgbDate {

    const dateDate = new Date(date);

    if (addOneDay) {
      dateDate.setDate(dateDate.getDate() - 1);
    }

    return date ? new NgbDate(dateDate.getFullYear(), dateDate.getMonth() + 1, dateDate.getDate()) : null;
  }

  private toModel(date: NgbDate, addOneDay = false): string {
    if (date) {

      const fixedDate = new Date(Date.UTC(
        date.year,
        date.month - 1,
        date.day
      ));

      if (addOneDay) {
        fixedDate.setDate(fixedDate.getDate() + 1);
      }

      return fixedDate.toISOString();
    } else {
      return null;
    }
  }

}
