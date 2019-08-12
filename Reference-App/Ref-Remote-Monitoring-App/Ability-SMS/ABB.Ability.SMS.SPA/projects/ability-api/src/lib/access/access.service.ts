import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ArsBaseUrl} from '../urlTokens';
import {Observable} from 'rxjs';

@Injectable()
export class AccessService {

  constructor(@Inject(ArsBaseUrl) private baseUrl: string, private http: HttpClient) {
  }

  getUserPermission(): Observable<any> {
    const apiUrl = `${this.baseUrl}/access/user/permission`;
    return this.http.get<any>(apiUrl);
  }

  checkAccess(object: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/access/checkaccess`;
    return this.http.post<any>(apiUrl, object);

  }

}
