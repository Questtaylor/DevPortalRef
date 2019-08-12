import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataLoaderModule} from '../data-loader';
import {NavigatorTreeComponent} from './navigator-tree/navigator-tree.component';
import {NavigatorComponent} from './navigator/navigator.component';
import {NavigatorTableComponent} from './navigator-table/navigator-table.component';
import {SearchModule} from '../search';

@NgModule({
  imports: [
    CommonModule,
    DataLoaderModule,
    SearchModule
  ],
  declarations: [
    NavigatorTreeComponent,
    NavigatorComponent,
    NavigatorTableComponent
  ],
  exports: [
    NavigatorTreeComponent,
    NavigatorComponent,
    NavigatorTableComponent
  ]
})
export class NavigatorModule {
}
