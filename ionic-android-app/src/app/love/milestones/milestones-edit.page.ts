import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel,
  IonSegment, IonSegmentButton, IonTextarea, IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService, Milestone } from '../../services/db.service';

@Component({
  selector: 'app-milestones-edit',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel,
    IonSegment, IonSegmentButton, IonTextarea, IonTitle, IonToolbar,
  ],
  templateUrl: './milestones-edit.page.html',
  styleUrls: ['./milestones-edit.page.scss'],
})
export class MilestonesEditPage implements OnInit {
  milestone: Milestone | null = null;
  title = '';
  date = '';
  dateType: 'solar' | 'lunar' = 'solar';
  description = '';
  important = true;
  remindDays = 3;

  constructor(private route: ActivatedRoute, public router: Router, private db: DbService) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.milestone = (await this.db.getMilestone(id)) ?? null;
    if (!this.milestone) return;
    this.title = this.milestone.title;
    this.date = this.milestone.date;
    this.dateType = this.milestone.dateType;
    this.description = this.milestone.description;
    this.important = this.milestone.important;
    this.remindDays = this.milestone.remindDays;
  }

  async save() {
    if (!this.milestone) return;
    this.milestone.title = this.title || '里程碑';
    this.milestone.date = this.date;
    this.milestone.dateType = this.dateType;
    this.milestone.description = this.description;
    this.milestone.important = this.important;
    this.milestone.remindDays = this.remindDays;
    this.milestone.updatedAt = Date.now();
    await this.db.addMilestone(this.milestone);
    this.router.navigateByUrl(`/milestones/detail/${this.milestone.id}`);
  }

  async deleteMilestone() {
    if (!this.milestone) return;
    await this.db.deleteMilestone(this.milestone.id);
    this.router.navigateByUrl('/tabs/milestones');
  }
}
