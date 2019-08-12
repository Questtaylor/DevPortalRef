import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatePickerRangeComponent} from './date-picker-range.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    NgbModule,
    FormsModule,
    CommonModule
  ],
  declarations: [DatePickerRangeComponent],
  exports: [DatePickerRangeComponent]
})
export class DatePickerRangeModule {
}
