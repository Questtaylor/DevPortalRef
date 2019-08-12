import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'abb-controls-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

  @Input() public emitChangeOnEveryKey = false;
  @Input() public placeholder: string;
  @Output() public searchTextChanged = new EventEmitter<string>();

  public onTextChange(text: string): void {
    this.searchTextChanged.emit(text);
  }

  public onKeyUp(text: string, event: KeyboardEvent) {
    if (text === '' || (event.key === 'enter' || this.emitChangeOnEveryKey)) {
      this.onTextChange(text);
    }
  }

  public onClearButtonClicked(target: HTMLInputElement) {
    target.value = null;
    this.onTextChange(null);
  }
}
