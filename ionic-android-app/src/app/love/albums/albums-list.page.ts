import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonSearchbar,
  IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService, Album, Photo } from '../../services/db.service';

@Component({
  selector: 'app-albums-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonSearchbar,
    IonTitle, IonToolbar,
  ],
  templateUrl: './albums-list.page.html',
  styleUrls: ['./albums-list.page.scss'],
})
export class AlbumsListPage implements OnInit {
  albums: (Album & { coverUrl: string; photoCount: number })[] = [];
  query = '';
  showCreateModal = false;
  newAlbumName = '';
  newAlbumPhotos: { url: string; blob: Blob }[] = [];

  constructor(private router: Router, private db: DbService) {}

  async ngOnInit() { await this.load(); }
  async ionViewWillEnter() { await this.load(); }

  async load() {
    const all = await this.db.getAllAlbums();
    this.albums = [];
    for (const a of all) {
      let coverUrl = '';
      if (a.coverPhotoKey) {
        const p = await this.db.getPhoto(a.coverPhotoKey);
        if (p) coverUrl = URL.createObjectURL(p.blob);
      } else if (a.photoKeys.length) {
        const p = await this.db.getPhoto(a.photoKeys[0]);
        if (p) coverUrl = URL.createObjectURL(p.blob);
      }
      this.albums.push({ ...a, coverUrl, photoCount: a.photoKeys.length });
    }
  }

  get filteredAlbums() {
    if (!this.query.trim()) return this.albums;
    const q = this.query.toLowerCase();
    return this.albums.filter(a => a.name.toLowerCase().includes(q));
  }

  onQueryInput(ev: CustomEvent) {
    this.query = (ev.detail as { value?: string }).value ?? '';
  }

  openCreate() { this.showCreateModal = true; }
  closeCreate() { this.showCreateModal = false; this.newAlbumName = ''; this.newAlbumPhotos = []; }

  onSelectPhotos(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    for (const f of files) {
      if (!f.type.startsWith('image/')) continue;
      this.newAlbumPhotos.push({ url: URL.createObjectURL(f), blob: f });
    }
  }

  async createAlbum() {
    const id = this.db.genId();
    const now = Date.now();
    const photoKeys: string[] = [];
    for (const pf of this.newAlbumPhotos) {
      const pid = this.db.genId();
      await this.db.addPhoto({ id: pid, albumId: id, blob: pf.blob, thumbnailBlob: null, createdAt: now });
      photoKeys.push(pid);
    }
    const album: Album = {
      id, name: this.newAlbumName || '新的相册',
      coverPhotoKey: photoKeys[0] || null,
      photoKeys, tags: [],
      createdAt: now, updatedAt: now,
    };
    await this.db.addAlbum(album);
    this.closeCreate();
    this.router.navigateByUrl(`/albums/detail/${id}`);
  }
}
