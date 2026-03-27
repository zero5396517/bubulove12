import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonButtons,
  IonLabel,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-love-home',
  standalone: true,
  imports: [
    CommonModule,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonButtons,
    IonLabel,
    IonRow,
    IonTitle,
    IonToolbar,
    RouterLink,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class LoveHomePage {
  constructor(private router: Router) {}

  openConfession() {
    this.router.navigateByUrl('/confession');
  }

  openDiaries() {
    this.router.navigateByUrl('/tabs/diaries');
  }

  openAlbums() {
    this.router.navigateByUrl('/tabs/albums');
  }

  openMilestones() {
    this.router.navigateByUrl('/tabs/milestones');
  }
}

