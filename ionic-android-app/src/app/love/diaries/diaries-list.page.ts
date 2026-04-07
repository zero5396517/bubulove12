import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonBadge, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonLabel,
  IonSearchbar, IonSelect, IonSelectOption, IonSegment, IonSegmentButton,
  IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { DbService, Diary } from '../../services/db.service';

@Component({
  selector: 'app-diaries-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonBadge, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonLabel,
    IonSearchbar, IonSelect, IonSelectOption, IonSegment, IonSegmentButton,
    IonTitle, IonToolbar,
  ],
  templateUrl: './diaries-list.page.html',
  styleUrls: ['./diaries-list.page.scss'],
})
export class DiariesListPage implements OnInit {
  query = '';
  privacy: 'all' | 'private' | 'public' = 'all';
  year = '';
  month = '';
  allDiaries: Diary[] = [];

  constructor(private router: Router, private db: DbService) {}

  async ngOnInit() {
    await this.load();
  }

  async ionViewWillEnter() {
    await this.load();
  }

  async load() {
    this.allDiaries = await this.db.getAllDiaries();
  }

  get filteredDiaries(): Diary[] {
    let list = this.allDiaries;
    if (this.privacy !== 'all') {
      list = list.filter(d => d.privacy === this.privacy);
    }
    if (this.query.trim()) {
      const q = this.query.toLowerCase();
      list = list.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (this.year) {
      list = list.filter(d => d.date.startsWith(this.year));
    }
    if (this.month) {
      list = list.filter(d => d.date.slice(5, 7) === this.month);
    }
    return list;
  }

  get years(): string[] {
    const s = new Set(this.allDiaries.map(d => d.date.slice(0, 4)));
    return Array.from(s).sort().reverse();
  }

  newDiary() {
    this.router.navigateByUrl('/diaries/new');
  }

  onQueryInput(ev: CustomEvent) {
    this.query = (ev.detail as { value?: string }).value ?? '';
  }

  onPrivacyChange(ev: CustomEvent) {
    this.privacy = ev.detail.value;
  }
}
