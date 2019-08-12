import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchComponent} from './search.component';
import {SearchBarComponent} from './search-bar/search-bar.component';
import {DataLoaderModule} from '../data-loader';

@NgModule({
  imports: [
    CommonModule,
    DataLoaderModule
  ],
  declarations: [SearchComponent, SearchBarComponent],
  exports: [
    SearchBarComponent,
    SearchComponent
  ]
})
export class SearchModule {
}
