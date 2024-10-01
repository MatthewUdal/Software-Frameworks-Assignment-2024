import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Channel } from '../interfaces/channel.interface';
import { GetUserService } from '../get-user.service';

@Component({
  selector: 'app-channel-explore',
  standalone: true,
  imports: [NavbarComponent, CommonModule, HttpClientModule],
  templateUrl: './channel-explore.component.html',
  styleUrl: './channel-explore.component.css'
})
export class ChannelExploreComponent implements OnInit {

  joinableChannels: Channel[] = [];
  groupID!: string | null;

  constructor(private http: HttpClient, private userService: GetUserService ) {}

  ngOnInit(): void {
    this.groupID = sessionStorage.getItem('cg');
    const userID = this.userService.getUserID();
    if (userID) {
      this.getJoinableChannels(userID);
    }
  }

  getJoinableChannels(userID: string): void {
    this.http.post<Channel[]>('/api/channelExplore', { userID, groupID: this.groupID }).subscribe(channels => {
      this.joinableChannels = channels


      console.log(this.joinableChannels);
    }, error => {
      console.error('Error loading channels:', error);
    });
  }

  requestChannel(channelID: string): void {
    const userID = this.userService.getUserID();
    if (!userID) {
      console.error('No user ID found');
      return;
    }
  
    this.http.post('/api/channelExplore/join', { userID, channelID, groupID: this.groupID }).subscribe(
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
