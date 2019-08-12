export interface CallMethodRequest {
  objectId: string;
  modelId: string;
  methodName: string;
  payload?: {
    /*This property specifies where you want to recieve a response once the command is completed. This needs to be a publicly accessible url.*/
    callbackUrl?: string;
    /*timeout message will be sent to your callback url. This value is in seconds.*/
    timeout?: number;
    input?: {}
  };
}
