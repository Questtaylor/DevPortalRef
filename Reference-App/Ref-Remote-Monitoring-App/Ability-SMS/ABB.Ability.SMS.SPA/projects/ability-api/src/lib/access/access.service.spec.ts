import { TestBed, inject } from '@angular/core/testing';

import { AccessService } from './access.service';
import {ArsBaseUrl} from '../urlTokens';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('AccessService', () => {
  const baseUrl = 'funky monkey';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ArsBaseUrl,
          useValue: baseUrl
        },
        AccessService
      ]
    });
  });

  it('should be created', inject([AccessService], (service: AccessService) => {
    expect(service).toBeTruthy();
  }));
});
