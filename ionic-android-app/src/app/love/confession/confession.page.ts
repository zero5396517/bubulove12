import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList,
  IonSegment, IonSegmentButton, IonTextarea, IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { DbService, Confession } from '../../services/db.service';

@Component({
  selector: 'app-confession',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList,
    IonSegment, IonSegmentButton, IonTextarea, IonTitle, IonToolbar,
  ],
  templateUrl: './confession.page.html',
  styleUrls: ['./confession.page.scss'],
})
export class ConfessionPage implements OnInit {
  title = '';
  body = '';
  privacy: 'private' | 'public' = 'private';
  tags = ['甜甜的', '勇敢的', '温柔的', '搞笑的'];
  selectedTags = new Set<string>();
  history: Confession[] = [];
  previewItem: Confession | null = null;

  constructor(private router: Router, private db: DbService) {}

  async ngOnInit() {
    this.history = await this.db.getAllConfessions();
  }

  toggleTag(tag: string) {
    if (this.selectedTags.has(tag)) this.selectedTags.delete(tag);
    else this.selectedTags.add(tag);
  }

  async publish() {
    if (!this.body.trim()) return;
    const c: Confession = {
      id: this.db.genId(),
      title: this.title || '无标题告白',
      content: this.body,
      tags: Array.from(this.selectedTags),
      privacy: this.privacy,
      createdAt: Date.now(),
    };
    await this.db.addConfession(c);
    this.title = '';
    this.body = '';
    this.selectedTags.clear();
    this.history = await this.db.getAllConfessions();
  }

  showPreview(c: Confession) {
    this.previewItem = c;
  }

  closePreview() {
    this.previewItem = null;
  }

  timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const days = Math.floor(diff / 86400000);
    if (days === 0) return '今天';
    if (days < 7) return `${days}天前`;
    if (days < 30) return `${Math.floor(days / 7)}周前`;
    return `${Math.floor(days / 30)}月前`;
  }
}
