import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonBadge,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

@Component({
  selector: 'app-paywall',
  standalone: true,
  imports: [
    IonButton,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonBadge,
    IonHeader,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: './paywall.page.html',
  styleUrls: ['./paywall.page.scss'],
})
export class PaywallPage {
  selectedPlan: 'weekly' | 'yearly' = 'weekly';

  constructor(private router: Router) {}

  goMainApp() {
    this.router.navigateByUrl('/tabs/home');
  }
}

