import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonIcon, IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { DbService, Milestone } from '../../services/db.service';

@Component({
  selector: 'app-milestones-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonContent, IonHeader, IonIcon, IonTitle, IonToolbar,
  ],
  templateUrl: './milestones-detail.page.html',
  styleUrls: ['./milestones-detail.page.scss'],
})
export class MilestonesDetailPage implements OnInit, OnDestroy {
  milestone: Milestone | null = null;
  days = 0;
  hours = 0;
  minutes = 0;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private db: DbService) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.milestone = (await this.db.getMilestone(id)) ?? null;
    if (!this.milestone) return;
    this.updateCountdown();
    this.timer = setInterval(() => this.updateCountdown(), 60000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  updateCountdown() {
    if (!this.milestone) return;
    const target = new Date(this.milestone.date + 'T00:00:00').getTime();
    const now = Date.now();
    const diff = target - now;
    const absDiff = Math.abs(diff);
    this.days = Math.floor(absDiff / 86400000);
    this.hours = Math.floor((absDiff % 86400000) / 3600000);
    this.minutes = Math.floor((absDiff % 3600000) / 60000);
    if (diff < 0) this.days = -this.days;
  }

  get isPast(): boolean { return this.days < 0; }

  async deleteMilestone() {
    if (!this.milestone) return;
    await this.db.deleteMilestone(this.milestone.id);
    this.router.navigateByUrl('/tabs/milestones');
  }
}
