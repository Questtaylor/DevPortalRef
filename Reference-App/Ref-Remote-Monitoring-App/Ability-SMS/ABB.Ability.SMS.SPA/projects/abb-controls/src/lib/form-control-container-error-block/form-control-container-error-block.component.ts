import {Component, Input, OnInit} from '@angular/core';
import {IErrorTranslation} from './error-translation.interface';

export class FormControlContainerErrorBlockOptions {
  constructor(public errorsTranslation: Array<IErrorTranslation>) {
  }
}

@Component({
  selector: 'abb-controls-form-control-container-error-block',
  templateUrl: './form-control-container-error-block.component.html',
  styleUrls: ['./form-control-container-error-block.component.scss']
})
export class FormControlContainerErrorBlockComponent implements OnInit {

  @Input() formErrors: any;
  private errorsTranslation: Array<IErrorTranslation>;

  constructor(options: FormControlContainerErrorBlockOptions) {
    this.errorsTranslation = options.errorsTranslation;
  }

  getErrors() {
    if (this.formErrors) {
      return Object.keys(this.formErrors);
    } else {
      return [];
    }

  }

  getTranslation(key) {

    const translation = this.errorsTranslation.find(x => x.error === key);
    if (translation && translation.text) {
      return translation.text;
    } else {
      return 'No translation provided';
    }
  }

  ngOnInit() {
  }

}
