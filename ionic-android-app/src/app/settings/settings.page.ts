import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  IonToggle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    IonToggle,
    FormsModule,
  ],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  currentLang = 'zh';
  currentTheme: 'light' | 'dark' | 'system' = 'system';
  notificationsEnabled = true;

  constructor(private router: Router) {}

  resetOnboarding() {
    this.router.navigateByUrl('/onboarding');
  }
}

