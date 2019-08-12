import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {NotificationMessage} from './notifications.models';

@Injectable()
export class NotificationsService {

  private readonly notificationsSubject = new Subject<NotificationMessage>();

  public send(...notifications: NotificationMessage[]): void {
    for (const notification of notifications) {
      this.notificationsSubject.next(notification);
    }
  }

  public get onNotification(): Observable<NotificationMessage> {
    return this.notificationsSubject.asObservable();
  }
}
