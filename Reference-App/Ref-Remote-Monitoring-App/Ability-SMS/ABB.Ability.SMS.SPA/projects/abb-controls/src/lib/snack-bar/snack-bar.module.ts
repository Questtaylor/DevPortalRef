import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SnackBarComponent} from './snack-bar/snack-bar.component';
import {SnackBarItemComponent} from './snack-bar-item/snack-bar-item.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SnackBarComponent,
    SnackBarItemComponent
  ],
  exports: [
    SnackBarComponent
  ]
})
export class SnackBarModule {
}
