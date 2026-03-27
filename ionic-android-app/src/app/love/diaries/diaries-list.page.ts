import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  IonIcon,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

type Privacy = 'private' | 'public';

type Diary = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  privacy: Privacy;
  preview: string;
  photoCount: number;
  hasVoice: boolean;
};

@Component({
  selector: 'app-diaries-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonBadge,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar,
    RouterLink,
  ],
  templateUrl: './diaries-list.page.html',
  styleUrls: ['./diaries-list.page.scss'],
})
export class DiariesListPage {
  query = '';
  privacy: 'all' | Privacy = 'all';
  year = '2026';

  diaries: Diary[] = [
    {
      id: 'd1',
      title: '今天的拥抱',
      date: '2026-03-25',
      privacy: 'private',
      preview: '我们在路灯下聊了很久，心里突然就安静了。',
      photoCount: 3,
      hasVoice: true,
    },
    {
      id: 'd2',
      title: '甜品和电影',
      date: '2026-03-21',
      privacy: 'public',
      preview: '你笑起来的时候，连电影都变得更好看了。',
      photoCount: 0,
      hasVoice: false,
    },
    {
      id: 'd3',
      title: '一起散步',
      date: '2026-03-18',
      privacy: 'private',
      preview: '风有点凉，但你的手一直很暖。',
      photoCount: 2,
      hasVoice: false,
    },
    {
      id: 'd4',
      title: '纪念日彩排',
      date: '2026-03-12',
      privacy: 'private',
      preview: '我们把想说的话写在便利贴上，然后贴满了桌角。',
      photoCount: 1,
      hasVoice: false,
    },
  ];

  constructor(private router: Router) {}

  newDiary() {
    this.router.navigateByUrl('/diaries/new');
  }

  onQueryInput(ev: CustomEvent) {
    this.query = (ev.detail as { value?: string }).value ?? '';
  }
}

