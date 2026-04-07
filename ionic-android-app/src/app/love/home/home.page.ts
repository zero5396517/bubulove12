import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonIcon, IonLabel, IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { DbService, Milestone } from '../../services/db.service';

@Component({
  selector: 'app-love-home',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonContent, IonHeader, IonIcon, IonLabel, IonTitle, IonToolbar,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class LoveHomePage implements OnInit {
  upcomingMilestones: (Milestone & { daysLeft: number })[] = [];

  constructor(private router: Router, private db: DbService) {}

  async ngOnInit() {
    await this.db.seedIfEmpty();
    await this.loadMilestones();
  }

  async loadMilestones() {
    const all = await this.db.getAllMilestones();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.upcomingMilestones = all
      .map(m => {
        const d = new Date(m.date);
        d.setHours(0, 0, 0, 0);
        const diff = Math.ceil((d.getTime() - today.getTime()) / 86400000);
        return { ...m, daysLeft: diff };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 3);
  }

  countdownText(days: number): string {
    if (days === 0) return '今天';
    if (days > 0) return `还有 ${days} 天`;
    return `已过去 ${Math.abs(days)} 天`;
  }
}
