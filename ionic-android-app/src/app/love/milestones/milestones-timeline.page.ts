import { Component } from '@angular/core';
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';

type Milestone = {
  id: string;
  title: string;
  dateText: string;
  badge: 'important' | 'primary' | 'normal';
  countdownText: string;
};

@Component({
  selector: 'app-milestones-timeline',
  standalone: true,
  imports: [
    CommonModule,
    IonBadge,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: './milestones-timeline.page.html',
  styleUrls: ['./milestones-timeline.page.scss'],
})
export class MilestonesTimelinePage {
  milestones: Milestone[] = [
    {
      id: 'm1',
      title: '第一次牵手纪念日',
      dateText: '公历 · 2026-04-05',
      badge: 'important',
      countdownText: '还有 11 天',
    },
    {
      id: 'm2',
      title: '一起看海',
      dateText: '公历 · 2026-03-30',
      badge: 'primary',
      countdownText: '还有 5 天',
    },
    {
      id: 'm3',
      title: '每月约会日',
      dateText: '每月重复',
      badge: 'normal',
      countdownText: '今天',
    },
    {
      id: 'm4',
      title: '第一次共度周末',
      dateText: '公历 · 2026-02-18',
      badge: 'important',
      countdownText: '已过去 36 天',
    },
  ];

  badgeColor(b: Milestone['badge']): string {
    if (b === 'important') return 'tertiary';
    if (b === 'primary') return 'primary';
    return 'medium';
  }
}

