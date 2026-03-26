import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBadge,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';

type Privacy = 'private' | 'public';

type DiaryDisplay = {
  title: string;
  date: string;
  body: string;
  privacy: Privacy;
  photos: string[];
  voiceUrl: string | null;
};

@Component({
  selector: 'app-diaries-detail',
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonContent,
    IonHeader,
    IonIcon,
    IonImg,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBadge,
    RouterLink,
  ],
  templateUrl: './diaries-detail.page.html',
  styleUrls: ['./diaries-detail.page.scss'],
})
export class DiariesDetailPage implements OnInit {
  diary: DiaryDisplay = {
    title: '',
    date: '',
    body: '',
    privacy: 'private',
    photos: [],
    voiceUrl: null,
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const state = this.router.getCurrentNavigation()?.extras?.state as
      | { draft?: Partial<DiaryDisplay> }
      | undefined;
    const draft = state?.draft;
    if (draft) {
      this.diary = {
        title: draft.title ?? '未命名的心动',
        date: draft.date ?? '',
        body: draft.body ?? '',
        privacy: (draft.privacy as Privacy) ?? 'private',
        photos: draft.photos ?? [],
        voiceUrl: draft.voiceUrl ?? null,
      };
      return;
    }

    // Fallback mock data.
    const id = this.route.snapshot.paramMap.get('id');
    this.diary = this.mockById(id);
  }

  private mockById(id: string | null): DiaryDisplay {
    if (id === 'd2') {
      return {
        title: '甜品和电影',
        date: '2026-03-21',
        body: '你笑起来的时候，连电影都变得更好看了。',
        privacy: 'public',
        photos: [],
        voiceUrl: null,
      };
    }

    return {
      title: '今天的拥抱',
      date: '2026-03-25',
      body:
        '我们在路灯下聊了很久，心里突然就安静了。\n\n希望下次再见，我们也能这样慢慢走。',
      privacy: 'private',
      photos: [
        'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=70',
        'https://images.unsplash.com/photo-1520975916090-8e2f9a1a2b10?auto=format&fit=crop&w=900&q=70',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=70',
      ],
      voiceUrl: null,
    };
  }

  backToList() {
    this.router.navigateByUrl('/tabs/diaries');
  }

  edit() {
    // MVP：先进入新建页，后续再完善“编辑日记”路由与回显。
    this.router.navigateByUrl('/diaries/new', { state: { diary: this.diary } });
  }
}

