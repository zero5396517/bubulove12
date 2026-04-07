import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel,
  IonSegment, IonSegmentButton, IonTextarea, IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService, Diary, VoiceRecord } from '../../services/db.service';

@Component({
  selector: 'app-diaries-new',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel,
    IonSegment, IonSegmentButton, IonTextarea, IonTitle, IonToolbar,
  ],
  templateUrl: './diaries-new.page.html',
  styleUrls: ['./diaries-new.page.scss'],
})
export class DiariesNewPage {
  title = '';
  date = this.formatToday();
  body = '';
  privacy: 'private' | 'public' = 'private';
  photoFiles: { url: string; blob: Blob }[] = [];
  voiceUrl: string | null = null;
  private voiceBlob: Blob | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  recording = false;
  private voiceChunks: Blob[] = [];

  constructor(private router: Router, private db: DbService) {}

  onSelectPhotos(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    for (const f of files) {
      if (!f.type.startsWith('image/')) continue;
      this.photoFiles.push({ url: URL.createObjectURL(f), blob: f });
    }
    this.photoFiles = this.photoFiles.slice(0, 9);
  }

  removePhoto(idx: number) {
    this.photoFiles.splice(idx, 1);
  }

  async toggleRecording() {
    if (this.recording) {
      this.mediaRecorder?.stop();
      this.recording = false;
      return;
    }
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) return;
    if (typeof MediaRecorder === 'undefined') return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.voiceChunks = [];
      const mr = new MediaRecorder(stream);
      this.mediaRecorder = mr;
      mr.ondataavailable = (e: BlobEvent) => { if (e.data.size > 0) this.voiceChunks.push(e.data); };
      mr.onstop = () => {
        this.voiceBlob = new Blob(this.voiceChunks, { type: 'audio/webm' });
        this.voiceUrl = URL.createObjectURL(this.voiceBlob);
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      this.recording = true;
    } catch {
      this.recording = false;
    }
  }

  async save() {
    const id = this.db.genId();
    const now = Date.now();
    const photoKeys: string[] = [];
    for (const pf of this.photoFiles) {
      const pid = this.db.genId();
      await this.db.addPhoto({ id: pid, albumId: '', blob: pf.blob, thumbnailBlob: null, createdAt: now });
      photoKeys.push(pid);
    }
    let voiceKey: string | null = null;
    if (this.voiceBlob) {
      voiceKey = this.db.genId();
      const vr: VoiceRecord = { id: voiceKey, blob: this.voiceBlob, duration: 0, createdAt: now };
      await this.db.addVoice(vr);
    }
    const diary: Diary = {
      id, title: this.title || '未命名的心动', content: this.body,
      date: this.date, privacy: this.privacy, photoKeys, voiceKey, tags: [],
      createdAt: now, updatedAt: now,
    };
    await this.db.addDiary(diary);
    this.router.navigateByUrl(`/diaries/detail/${id}`);
  }

  private formatToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
