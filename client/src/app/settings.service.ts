import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private settingsVisibleSource = new BehaviorSubject<boolean>(false);
  settingsVisible$ = this.settingsVisibleSource.asObservable();

  toggleSettings(): void {
    this.settingsVisibleSource.next(!this.settingsVisibleSource.value);
  }

  showSettings(): void {
    this.settingsVisibleSource.next(true);
  }

  hideSettings(): void {
    this.settingsVisibleSource.next(false);
  }
}
