import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  currentView: string = '';

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.currentView = 'group-settings'
  }

  setView(view: string): void {
    this.currentView = view;
  }

  leaveGroup(){
    console.log('leave group');
  }

  toggleSettings(): void {
    this.settingsService.toggleSettings();
  }
}
