import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel,
  IonSegment, IonSegmentButton, IonTextarea, IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService, Diary } from '../../services/db.service';

@Component({
  selector: 'app-diaries-edit',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel,
    IonSegment, IonSegmentButton, IonTextarea, IonTitle, IonToolbar,
  ],
  templateUrl: './diaries-edit.page.html',
  styleUrls: ['./diaries-edit.page.scss'],
})
export class DiariesEditPage implements OnInit {
  diary: Diary | null = null;
  title = '';
  date = '';
  body = '';
  privacy: 'private' | 'public' = 'private';
  existingPhotoUrls: string[] = [];

  constructor(private route: ActivatedRoute, public router: Router, private db: DbService) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.diary = (await this.db.getDiary(id)) ?? null;
    if (!this.diary) return;
    this.title = this.diary.title;
    this.date = this.diary.date;
    this.body = this.diary.content;
    this.privacy = this.diary.privacy;
    for (const pk of this.diary.photoKeys) {
      const photo = await this.db.getPhoto(pk);
      if (photo) this.existingPhotoUrls.push(URL.createObjectURL(photo.blob));
    }
  }

  async save() {
    if (!this.diary) return;
    this.diary.title = this.title || '未命名的心动';
    this.diary.date = this.date;
    this.diary.content = this.body;
    this.diary.privacy = this.privacy;
    this.diary.updatedAt = Date.now();
    await this.db.addDiary(this.diary);
    this.router.navigateByUrl(`/diaries/detail/${this.diary.id}`);
  }

  async deleteDiary() {
    if (!this.diary) return;
    for (const pk of this.diary.photoKeys) await this.db.deletePhoto(pk);
    if (this.diary.voiceKey) await this.db.deleteVoice(this.diary.voiceKey);
    await this.db.deleteDiary(this.diary.id);
    this.router.navigateByUrl('/tabs/diaries');
  }
}
