import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonIcon, IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { DbService, Milestone } from '../../services/db.service';

@Component({
  selector: 'app-milestones-timeline',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonContent, IonHeader, IonIcon, IonTitle, IonToolbar,
  ],
  templateUrl: './milestones-timeline.page.html',
  styleUrls: ['./milestones-timeline.page.scss'],
})
export class MilestonesTimelinePage implements OnInit {
  milestones: (Milestone & { daysLeft: number })[] = [];

  constructor(private router: Router, private db: DbService) {}

  async ngOnInit() { await this.load(); }
  async ionViewWillEnter() { await this.load(); }

  async load() {
    const all = await this.db.getAllMilestones();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.milestones = all.map(m => {
      const d = new Date(m.date);
      d.setHours(0, 0, 0, 0);
      return { ...m, daysLeft: Math.ceil((d.getTime() - today.getTime()) / 86400000) };
    }).sort((a, b) => b.daysLeft - a.daysLeft);
  }

  countdownText(days: number): string {
    if (days === 0) return '今天';
    if (days > 0) return `还有 ${days} 天`;
    return `已过去 ${Math.abs(days)} 天`;
  }

  countdownColor(days: number): string {
    if (days > 0) return 'var(--love-accent)';
    if (days === 0) return 'var(--love-accent)';
    return 'var(--love-text-secondary)';
  }

  badgeText(m: Milestone & { daysLeft: number }): string {
    if (m.important) return '重要';
    if (m.daysLeft > 0 && m.remindDays > 0) return '提醒中';
    return '记录';
  }

  badgeColor(m: Milestone & { daysLeft: number }): string {
    if (m.important) return 'tertiary';
    if (m.daysLeft > 0 && m.remindDays > 0) return 'primary';
    return 'medium';
  }
}
