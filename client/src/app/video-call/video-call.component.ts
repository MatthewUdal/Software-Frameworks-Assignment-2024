import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PeerServiceService } from '../peer-service.service';
import { ActivatedRoute } from '@angular/router';
import { GetUserService } from '../get-user.service';
import { ChannelService } from '../channel.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.css'
})
export class VideoCallComponent implements OnInit, OnDestroy {
  localStream: MediaStream | null = null;
  peerId: string = '';
  userId: string = '';
  channelID: string = '';
  remotePeers: string[] = [];
  callActive: boolean = false;

  constructor(private peerService: PeerServiceService, private route: ActivatedRoute, private userService: GetUserService, private channelService: ChannelService) {}

  ngOnInit(): void {
    this.userId = this.userService.getUserID() || '';
    this.channelService.selectedChannel$.subscribe(channel => {
      let currentChannel = channel;
      if (currentChannel) {
        this.channelID = channel?._id || '';
      }
      });

      this.setupLocalVideoStream();

      // Initialize PeerJS with a unique ID for the current user and channel
      const peer = this.peerService.initPeer(this.userId, this.channelID);

      peer.on('open', (id) => {
        console.log(`My peer ID is: ${id}`);
        this.peerId = id;

        // Connect to other peers in the channel if any
        this.connectToChannelPeers();
      });
    };
    


  // Set up the local video stream
  async setupLocalVideoStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localStream = stream;

      // Display the local video stream in the UI
      const localVideo = document.getElementById('local-video') as HTMLVideoElement;
      if (localVideo) {
        localVideo.srcObject = stream;
        localVideo.play();
      }
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  }

  // Connect to all peers in the channel
  connectToChannelPeers() {
    // Mock: List of peers in the channel (In a real app, fetch this list from the server)
    this.remotePeers = ['user2', 'user3']; // Example peer IDs

    if (this.localStream) {
      this.remotePeers.forEach((peerID) => {
        this.peerService.callPeer(`${this.channelID}-${peerID}`, this.localStream!);
      });
    }
  }

  ngOnDestroy(): void {
    // Clean up connections and local streams
    this.peerService.closeCall();
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }
  }
}
