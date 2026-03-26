import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonButtons,
} from '@ionic/angular';

@Component({
  selector: 'app-confession',
  standalone: true,
  imports: [
    FormsModule,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonButtons,
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonTextarea,
    IonTitle,
    IonToolbar,
    RouterLink,
  ],
  templateUrl: './confession.page.html',
  styleUrls: ['./confession.page.scss'],
})
export class ConfessionPage {
  title = '';
  body = '';
  privacy: 'private' | 'public' = 'private';

  tags = ['甜甜的', '勇敢的', '温柔的', '搞笑的', '仪式感'];
  selectedTags = new Set<string>();

  history = [
    { title: '今天也喜欢你', when: '3天前', privacy: '私密' as const },
    { title: '谢谢你一直在', when: '1周前', privacy: '公开' as const },
    { title: '晚安', when: '2周前', privacy: '私密' as const },
  ];

  constructor(private router: Router) {}

  toggleTag(tag: string) {
    if (this.selectedTags.has(tag)) this.selectedTags.delete(tag);
    else this.selectedTags.add(tag);
  }

  publish() {
    // MVP：先走 UI 流程，后续接 IndexedDB 写入
    this.router.navigateByUrl('/tabs/diaries');
  }
}

