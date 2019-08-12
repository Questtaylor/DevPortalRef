import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControlContainerComponent} from './form-control-container.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FormControlContainerComponent],
  exports: [FormControlContainerComponent]
})
export class FormControlContainerModule {
}
