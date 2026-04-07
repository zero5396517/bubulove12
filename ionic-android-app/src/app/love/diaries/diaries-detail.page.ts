import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonIcon, IonImg, IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { DbService, Diary, Photo, VoiceRecord } from '../../services/db.service';

@Component({
  selector: 'app-diaries-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonContent, IonHeader, IonIcon, IonImg, IonTitle, IonToolbar,
  ],
  templateUrl: './diaries-detail.page.html',
  styleUrls: ['./diaries-detail.page.scss'],
})
export class DiariesDetailPage implements OnInit {
  diary: Diary | null = null;
  photoUrls: string[] = [];
  voiceUrl: string | null = null;
  previewUrl: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private db: DbService) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.diary = (await this.db.getDiary(id)) ?? null;
    if (!this.diary) return;
    for (const pk of this.diary.photoKeys) {
      const photo = await this.db.getPhoto(pk);
      if (photo) this.photoUrls.push(URL.createObjectURL(photo.blob));
    }
    if (this.diary.voiceKey) {
      const v = await this.db.getVoice(this.diary.voiceKey);
      if (v) this.voiceUrl = URL.createObjectURL(v.blob);
    }
  }

  openPreview(url: string) {
    this.previewUrl = url;
  }

  closePreview() {
    this.previewUrl = null;
  }

  edit() {
    if (this.diary) this.router.navigateByUrl(`/diaries/edit/${this.diary.id}`);
  }

  async deleteDiary() {
    if (!this.diary) return;
    for (const pk of this.diary.photoKeys) await this.db.deletePhoto(pk);
    if (this.diary.voiceKey) await this.db.deleteVoice(this.diary.voiceKey);
    await this.db.deleteDiary(this.diary.id);
    this.router.navigateByUrl('/tabs/diaries');
  }
}
