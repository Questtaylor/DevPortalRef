import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NotificationMessage} from '../../notifications';

@Component({
  selector: 'abb-controls-snack-bar-item',
  templateUrl: './snack-bar-item.component.html',
  styleUrls: ['./snack-bar-item.component.scss']
})
export class SnackBarItemComponent implements OnInit {

  @Input() public notification: NotificationMessage;
  @Output() public snackBarItemClosed = new EventEmitter();

  public show = false;
  public text = '';
  public type: string;
  private timeoutHander = null;
  private timeout = 3000;

  public ngOnInit(): void {
    this.text = this.notification.message;
    this.show = true;
    this.type = this.notification.type;

    this.timeoutHander = setTimeout(
      () => this.onCloseSnackBar(), this.timeout
    );
  }

  public onCloseSnackBar() {
    this.show = false;
    this.snackBarItemClosed.emit(this.notification);

    if (this.timeoutHander) {
      clearTimeout(this.timeoutHander);
    }
  }
}
