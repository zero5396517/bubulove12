import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTextarea,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Privacy = 'private' | 'public';

type DiaryDraft = {
  title: string;
  date: string;
  body: string;
  privacy: Privacy;
  photos: string[]; // object URLs
  voiceUrl: string | null; // object URL
};

@Component({
  selector: 'app-diaries-new',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonTextarea,
    RouterLink,
  ],
  templateUrl: './diaries-new.page.html',
  styleUrls: ['./diaries-new.page.scss'],
})
export class DiariesNewPage {
  title = '';
  date = this.formatToday();
  body = '';
  privacy: Privacy = 'private';

  photos: string[] = [];
  voiceUrl: string | null = null;

  @ViewChild('fileInput', { static: false }) fileInput?: { nativeElement: HTMLInputElement };

  // MediaRecorder can be missing on some browsers; we handle gracefully.
  private mediaRecorder: MediaRecorder | null = null;
  private recording = false;
  private voiceChunks: Blob[] = [];

  constructor(private router: Router) {}

  onSelectPhotos(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    const urls: string[] = [];
    for (const f of files) {
      if (!f.type.startsWith('image/')) continue;
      urls.push(URL.createObjectURL(f));
    }
    this.photos = [...this.photos, ...urls].slice(0, 9);
  }

  removePhoto(url: string) {
    this.photos = this.photos.filter((p) => p !== url);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mr = new MediaRecorder(stream as any);
      this.mediaRecorder = mr;
      mr.ondataavailable = (e: BlobEvent) => {
        if (e.data) this.voiceChunks.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(this.voiceChunks, { type: 'audio/webm' });
        this.voiceUrl = URL.createObjectURL(blob);
        // Stop tracks to release microphone.
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      this.recording = true;
    } catch {
      // Mock behavior: if permission denied or not supported, keep UI only.
      this.recording = false;
    }
  }

  submitMock() {
    const id = `d_new_${Date.now()}`;
    const draft: DiaryDraft = {
      title: this.title || '未命名的心动',
      date: this.date,
      body: this.body,
      privacy: this.privacy,
      photos: this.photos,
      voiceUrl: this.voiceUrl,
    };

    this.router.navigateByUrl(`/diaries/detail/${id}`, { state: { draft } });
  }

  private formatToday() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}

