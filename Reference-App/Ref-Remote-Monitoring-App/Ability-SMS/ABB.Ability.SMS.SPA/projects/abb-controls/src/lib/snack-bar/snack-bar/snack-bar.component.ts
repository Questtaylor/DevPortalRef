import {Component, OnDestroy, OnInit} from '@angular/core';
import {NotificationMessage, NotificationsService} from '../../notifications';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'abb-controls-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit, OnDestroy {

  private readonly notificationsSubject = new BehaviorSubject<NotificationMessage[]>([]);
  private subscription: Subscription;

  constructor(private notificationsService: NotificationsService) {
  }

  public get notifications(): Observable<NotificationMessage[]> {
    return this.notificationsSubject.asObservable();
  }

  public ngOnInit(): void {
    this.subscription = this.notificationsService.onNotification
      .pipe(filter(notification => notification.showToUser))
      .subscribe((notification: NotificationMessage) => {
        this.showNotification(notification);
      });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onSnackBarItemClosed(notification: NotificationMessage) {
    const index = this.notificationsSubject.value.indexOf(notification);
    if (index > -1) {
      this.notificationsSubject.value.splice(index, 1);
    }
  }

  private showNotification(notification: NotificationMessage) {
    this.notificationsSubject.value.push(notification);
  }
}
