import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelExploreComponent } from './channel-explore.component';

describe('ChannelExploreComponent', () => {
  let component: ChannelExploreComponent;
  let fixture: ComponentFixture<ChannelExploreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelExploreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelExploreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
