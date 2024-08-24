import { TestBed } from '@angular/core/testing';

import { ChannelStoreService } from './channel-store.service';

describe('ChannelStoreService', () => {
  let service: ChannelStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
