import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'abb-controls-form-control-container',
  templateUrl: './form-control-container.component.html',
  styleUrls: ['./form-control-container.component.scss']
})
export class FormControlContainerComponent implements OnInit {

  @Input() text: string;

  constructor() {
  }

  ngOnInit() {
  }

}
