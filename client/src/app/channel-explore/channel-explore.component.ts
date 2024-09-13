import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Channel } from '../interfaces/channel.interface';

@Component({
  selector: 'app-channel-explore',
  standalone: true,
  imports: [NavbarComponent, CommonModule, HttpClientModule],
  templateUrl: './channel-explore.component.html',
  styleUrl: './channel-explore.component.css'
})
export class ChannelExploreComponent implements OnInit {

  joinableChannels: Channel[] = [];
  groupID!: number;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.groupID = Number(sessionStorage.getItem('cg'));
    const userID = this.getUserID();
    if (userID) {
      this.getJoinableChannels(userID);
    }
  }

  getUserID(): string | null {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      return null; 
    }

    const currentUser = JSON.parse(userData);
    return currentUser.userID || null;
  }

  getJoinableChannels(userID: string): void {
    this.http.post<Channel[]>('http://localhost:3000/channelExplore', { userID, groupID: this.groupID }).subscribe(channels => {
      this.joinableChannels = channels


      console.log(this.joinableChannels);
    }, error => {
      console.error('Error loading channels:', error);
    });
  }

  requestChannel(channelID: string): void {
    const userID = this.getUserID();
    if (!userID) {
      console.error('No user ID found');
      return;
    }
  
    this.http.post('http://localhost:3000/channelExplore/join', { userID, channelID, groupID: this.groupID }).subscribe(
      (response: any) => { 
        if (response && response.channelName) {
          alert(`Successfully requested to join ${response.channelName}`);
          this.getJoinableChannels(userID);
        } else {
          alert('Channel name not found');
        }
      },
      error => {
        console.error('Error joining channel:', error);
        alert('Error joining channel, please try again later.');
      }
    );
  }

}
