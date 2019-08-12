import {Component, Input} from '@angular/core';

@Component({
  selector: 'abb-controls-data-loader',
  templateUrl: './data-loader.component.html',
  styleUrls: ['./data-loader.component.scss']
})
export class DataLoaderComponent {

  @Input() label = 'Please wait...';
  @Input() coverage = false;
  @Input() isLoading = true;

  constructor() {
  }

}
