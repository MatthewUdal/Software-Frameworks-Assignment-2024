import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Channel } from './interfaces/channel.interface';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  private selectedChannelSource = new BehaviorSubject<Channel | null>(null);
  selectedChannel$ = this.selectedChannelSource.asObservable();

  selectChannel(channel: Channel): void {
    this.selectedChannelSource.next(channel);
  }
}
