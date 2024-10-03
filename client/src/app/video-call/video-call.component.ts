import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { PeerServiceService } from '../peer-service.service';
import { SocketService } from '../socket-service.service';
import { CommonModule } from '@angular/common';
import Peer, { MediaConnection } from 'peerjs';
import { Router } from '@angular/router';

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

  public peerId: string | undefined;
  private connections: MediaConnection[] = [];
  private videoElementsMap = new Map<string, HTMLVideoElement>(); 


  constructor(private peerService: PeerServiceService, private socketService: SocketService, private router: Router) {}

  ngOnInit(): void {
    const roomId = 'example-room-id'; 

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
      remoteVideo.style.width = '300px'; 
      remoteVideo.style.margin = '5px';

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
}
