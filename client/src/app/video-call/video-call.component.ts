import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { PeerServiceService } from '../peer-service.service';
import { SocketService } from '../socket-service.service';
import { CommonModule } from '@angular/common';
import Peer, { MediaConnection } from 'peerjs';
import { Router } from '@angular/router';
import { ChannelService } from '../channel.service';

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements OnInit {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideosContainer', { static: false }) remoteVideosContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('screenVideo') screenVideo!: ElementRef<HTMLVideoElement>;

  public peerId: string | undefined;
  public isMuted: boolean = false;
  public isScreenSharing: boolean = false;
  private connections: MediaConnection[] = [];
  private videoElementsMap = new Map<string, HTMLVideoElement>(); 


  constructor(private peerService: PeerServiceService, private socketService: SocketService, private router: Router, private channelService: ChannelService) {}

  ngOnInit(): void {
    const roomId = this.channelService.getCurrentChannel() || '';
    console.log(roomId)

    // Ensure the local stream is set before anything else
    this.startCall().then(() => {
      this.peerId = this.peerService.initPeer(roomId);

      this.peerService.onIncomingCall((call: MediaConnection) => {
        this.answerIncomingCall(call);
      });

      this.peerService.onUserConnected((userId: string) => {
        console.log(`User connected: ${userId}`);
        this.callUser(userId);
      });

      // Listen for a user-disconnected event
      this.socketService.getSocket().on('user-disconnected', (peerId: string) => {
        console.log(`Received user-disconnected event for peer ID: ${peerId}`);
        this.removeRemoteVideoByPeerId(peerId);
      });
    }).catch((error) => {
      console.error('Failed to initialize local stream', error);
    });
  }
  

  async startCall(): Promise<void> {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Only set the video element source here after it's available
      if (this.localVideo && this.localVideo.nativeElement) {
        this.localVideo.nativeElement.srcObject = localStream;
        this.localVideo.nativeElement.muted = true;
      }

      this.peerService.setLocalStream(localStream);
      console.log('Local stream set successfully.');
    } catch (error) {
      console.error('Error accessing media devices. Please check permissions or try another device.', error);
    }
  }

  // Call a new user in the room
  private callUser(remotePeerId: string): void {
    console.log('Calling user: ' + remotePeerId);
    const localStream = this.peerService.getLocalStream();
    if (!localStream) {
      console.error('Local stream is not available. Cannot make a call.');
      return;
    }
    const call = this.peerService.callPeer(remotePeerId, localStream);
    this.handleStreamEvents(call, remotePeerId);
  }

  // Answer an incoming call and display the remote stream
  private answerIncomingCall(call: MediaConnection): void {
    const localStream = this.peerService.getLocalStream();
    this.peerService.answerCall(call, localStream);
    this.handleStreamEvents(call, call.peer); 
  }

  // Handle events on the MediaConnection object
  private handleStreamEvents(call: MediaConnection, remotePeerId: string): void {
    this.connections.push(call); 
  
    call.on('stream', (remoteStream: MediaStream) => {
      const existingVideo = this.videoElementsMap.get(remotePeerId);

      if (existingVideo) {
        console.log('Remote stream already added, skipping.');
        return;
      }

      const remoteVideo = document.createElement('video');
      remoteVideo.srcObject = remoteStream;
      remoteVideo.autoplay = true;
      remoteVideo.playsInline = true;
      remoteVideo.style.width = '400px'; 
      remoteVideo.style.margin = '5px';
      remoteVideo.style.border = '2px solid #03DAC6';

      this.videoElementsMap.set(remotePeerId, remoteVideo);

      this.remoteVideosContainer.nativeElement.appendChild(remoteVideo);
    });
  
    call.on('close', () => {
      console.log('Call closed');
      this.removeRemoteVideoByPeerId(remotePeerId);
    });
  }

  // Remove remote video element by the peer ID of the disconnected user
  private removeRemoteVideoByPeerId(peerId: string): void {
    const videoElement = this.videoElementsMap.get(peerId);
    if (videoElement) {
      console.log(`Removing video element for peer ID: ${peerId}`);
      videoElement.srcObject = null;
      this.remoteVideosContainer.nativeElement.removeChild(videoElement);
      this.videoElementsMap.delete(peerId);
    }
  }

  // End the current call and notify others
  endCall(): void {
    const peerId = this.peerService.peerId;
    if (peerId) {
      this.socketService.getSocket().emit('user-disconnected', peerId);
      this.peerService.stopLocalStream();
      this.peerService.disconnectPeer();
  
      if (this.localVideo && this.localVideo.nativeElement) {
        this.localVideo.nativeElement.srcObject = null;
      }

      // Remove all remote videos and clear map
      this.videoElementsMap.forEach((videoElement) => {
        videoElement.srcObject = null;
        this.remoteVideosContainer.nativeElement.removeChild(videoElement);
      });
      this.videoElementsMap.clear();
      
      this.router.navigate(['/homepage']);
    }
  }

  toggleMute(): void {
    const localStream = this.peerService.getLocalStream();
    if (localStream) {
      this.isMuted = !this.isMuted;
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !this.isMuted; // Enable/disable audio track
      });
      console.log(`Audio is now ${this.isMuted ? 'muted' : 'unmuted'}.`);
    }
  }

  // Toggle screen sharing on and off
  async toggleScreenShare(): Promise<void> {
    if (!this.isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        
        this.isScreenSharing = true;
        this.peerService.setScreenStream(screenStream);

        // Create a new video element for the screen sharing stream
        if (this.screenVideo && this.screenVideo.nativeElement) {
          this.screenVideo.nativeElement.srcObject = screenStream;
          this.screenVideo.nativeElement.autoplay = true;
          this.screenVideo.nativeElement.style.width = '400px';
          this.screenVideo.nativeElement.style.margin = '5px';
          this.screenVideo.nativeElement.style.border = '2px solid #03DAC6';

          // Append the screen video element to the remote videos container
          this.remoteVideosContainer.nativeElement.appendChild(this.screenVideo.nativeElement);
        }

        // Add the screen stream to the existing calls
        this.connections.forEach((call) => {
          const sender = call.peerConnection.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenStream.getVideoTracks()[0]);
          }
        });

        console.log('Screen sharing started.');
      } catch (error) {
        console.error('Failed to start screen sharing', error);
      }
    } else {
      this.stopScreenShare();
    }
  }

  // Stop screen sharing and revert to the camera stream
  stopScreenShare(): void {
    if (this.isScreenSharing) {
      this.isScreenSharing = false;
      this.peerService.stopScreenStream();

      // Remove the screen video element
      if (this.screenVideo && this.screenVideo.nativeElement) {
        this.screenVideo.nativeElement.srcObject = null;
        this.remoteVideosContainer.nativeElement.removeChild(this.screenVideo.nativeElement);
      }

      // Revert back to the local camera stream in existing calls
      const localStream = this.peerService.getLocalStream();
      this.connections.forEach((call) => {
        const sender = call.peerConnection.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(localStream.getVideoTracks()[0]);
        }
      });

      console.log('Screen sharing stopped.');
    }
  }
}
