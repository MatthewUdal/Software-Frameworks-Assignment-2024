import { TestBed } from '@angular/core/testing';

import { GroupStoreService } from './group-store.service';

describe('GroupStoreService', () => {
  let service: GroupStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
