import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonButtons,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    IonButton,
    IonContent,
    IonHeader,
    IonButtons,
    IonPage,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage {
  videoUrl =
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  constructor(private router: Router) {}

  goPaywall() {
    this.router.navigateByUrl('/paywall');
  }
}

