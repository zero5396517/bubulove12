import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel,
  IonSegment, IonSegmentButton, IonTextarea, IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService, Milestone } from '../../services/db.service';

@Component({
  selector: 'app-milestones-new',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel,
    IonSegment, IonSegmentButton, IonTextarea, IonTitle, IonToolbar,
  ],
  templateUrl: './milestones-new.page.html',
  styleUrls: ['./milestones-new.page.scss'],
})
export class MilestonesNewPage {
  title = '';
  date = this.formatToday();
  dateType: 'solar' | 'lunar' = 'solar';
  description = '';
  important = true;
  remindDays = 3;

  constructor(private router: Router, private db: DbService) {}

  async save() {
    const now = Date.now();
    const m: Milestone = {
      id: this.db.genId(),
      title: this.title || '新里程碑',
      date: this.date,
      dateType: this.dateType,
      description: this.description,
      important: this.important,
      remindDays: this.remindDays,
      mediaKey: null,
      createdAt: now,
      updatedAt: now,
    };
    await this.db.addMilestone(m);
    this.router.navigateByUrl(`/milestones/detail/${m.id}`);
  }

  private formatToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
