import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonButtons,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    IonButton,
    IonContent,
    IonHeader,
    IonButtons,
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

