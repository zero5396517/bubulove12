import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonIcon, IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { DbService, Album } from '../../services/db.service';

@Component({
  selector: 'app-albums-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonContent, IonHeader, IonIcon, IonTitle, IonToolbar,
  ],
  templateUrl: './albums-detail.page.html',
  styleUrls: ['./albums-detail.page.scss'],
})
export class AlbumsDetailPage implements OnInit {
  album: Album | null = null;
  coverUrl = '';
  photoUrls: string[] = [];
  previewUrl: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private db: DbService) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.album = (await this.db.getAlbum(id)) ?? null;
    if (!this.album) return;
    for (const pk of this.album.photoKeys) {
      const p = await this.db.getPhoto(pk);
      if (p) {
        const url = URL.createObjectURL(p.blob);
        this.photoUrls.push(url);
        if (pk === this.album.coverPhotoKey || (!this.coverUrl && this.photoUrls.length === 1)) {
          this.coverUrl = url;
        }
      }
    }
  }

  async onUploadPhotos(ev: Event) {
    if (!this.album) return;
    const input = ev.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    const now = Date.now();
    for (const f of files) {
      if (!f.type.startsWith('image/')) continue;
      const pid = this.db.genId();
      await this.db.addPhoto({ id: pid, albumId: this.album.id, blob: f, thumbnailBlob: null, createdAt: now });
      this.album.photoKeys.push(pid);
      this.photoUrls.push(URL.createObjectURL(f));
    }
    if (!this.album.coverPhotoKey && this.album.photoKeys.length) {
      this.album.coverPhotoKey = this.album.photoKeys[0];
    }
    this.album.updatedAt = now;
    await this.db.addAlbum(this.album);
  }

  openPreview(url: string) { this.previewUrl = url; }
  closePreview() { this.previewUrl = null; }

  async deleteAlbum() {
    if (!this.album) return;
    for (const pk of this.album.photoKeys) await this.db.deletePhoto(pk);
    await this.db.deleteAlbum(this.album.id);
    this.router.navigateByUrl('/tabs/albums');
  }

  back() { this.router.navigateByUrl('/tabs/albums'); }
}
