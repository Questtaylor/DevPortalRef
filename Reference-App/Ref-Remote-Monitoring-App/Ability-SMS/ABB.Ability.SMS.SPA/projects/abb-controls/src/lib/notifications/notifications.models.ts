export class NotificationMessage {
  constructor(public message: string,
              public type: 'log' | 'info' | 'warning' | 'error' | 'success' = 'log',
              public showToUser: boolean = false,
              public saveToLogs: boolean = true) {
  }

  public static fromHttpError(error: any, errorTitle: string): NotificationMessage {

    const abbHttpError = error as { 'error': { 'error': string, 'errorType': string } };

    let errorDetails: string;

    if (abbHttpError && abbHttpError.error && abbHttpError.error.error) {
      errorDetails = `ABB Ability API returned ${abbHttpError.error.errorType || 'error' }: ${abbHttpError.error.error}`;
    } else if (error.message) {
      errorDetails = `Details: ${error.message}`;
    } else {
      errorDetails = '';
    }

    return new NotificationMessage(`${errorTitle} ${errorDetails}`, 'error', true);

  }
}
