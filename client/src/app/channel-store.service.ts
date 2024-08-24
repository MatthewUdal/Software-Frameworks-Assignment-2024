import { Injectable } from '@angular/core';
import { Channel } from './interfaces/channel.interface';

@Injectable({
  providedIn: 'root'
})
export class ChannelStoreService {
  private channels: Channel[] = [];

  constructor() {
    this.loadChannels();
  }

  // Load channels from localStorage
  loadChannels(): Channel[] {
    const storedchannels = sessionStorage.getItem('channels');
    if (storedchannels) {
      return JSON.parse(storedchannels) as Channel[];
    }
    return []; // Return an empty array if no channels are stored
  }

  // Save channels to localStorage
  saveChannels(): void {
    localStorage.setItem('channels', JSON.stringify(this.channels));
  }

  // Initialize channels (e.g., from the component)
  initializeChannels(initialchannels: Channel[]): void {
    this.channels = initialchannels;
    this.saveChannels();
  }

  // Add a new channel
  addchannel(channel: Channel): void {
    this.channels.push(channel);
    this.saveChannels();
  }


  // Delete a channel by ID
  deleteChannel(channelID: number): void {
    this.channels = this.channels.filter(c => c.channelID !== channelID);
    this.saveChannels();
  }

  // Get all channels
  getAllChannels(): Channel[] {
    return this.channels;
  }

  
   // Get all group matching channels
  getAllGroupChannels(groupID: number): Channel[] {
    return this.channels.filter(channel => channel.groupID === groupID);
  }
  
}
