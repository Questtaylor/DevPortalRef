import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataLoaderComponent} from './data-loader.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DataLoaderComponent],
  exports: [
    DataLoaderComponent
  ]
})
export class DataLoaderModule {
}
