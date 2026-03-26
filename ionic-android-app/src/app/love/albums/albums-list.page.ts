import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonContent,
  IonHeader,
  IonButtons,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Album = {
  id: string;
  name: string;
  coverUrl: string;
  photos: string[];
  createdAt: number;
};

@Component({
  selector: 'app-albums-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonContent,
    IonHeader,
    IonButtons,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
    IonImg,
    RouterLink,
  ],
  templateUrl: './albums-list.page.html',
  styleUrls: ['./albums-list.page.scss'],
})
export class AlbumsListPage {
  albumName = '';
  photos: string[] = [];

  albums: Album[] = [
    {
      id: 'a1',
      name: '甜品与电影',
      coverUrl:
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=70',
      photos: [
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=70',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=70',
      ],
      createdAt: Date.now() - 86400000 * 3,
    },
  ];

  constructor(private router: Router) {}

  openAlbum(id: string) {
    this.router.navigateByUrl(`/albums/detail/${id}`);
  }

  onSelectPhotos(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    const urls: string[] = [];
    for (const f of files) {
      if (!f.type.startsWith('image/')) continue;
      urls.push(URL.createObjectURL(f));
    }
    this.photos = urls.slice(0, 9);
  }

  createAlbumMock() {
    if (!this.photos.length) return;
    const id = `a_${Date.now()}`;
    const album: Album = {
      id,
      name: this.albumName || '新的相册',
      coverUrl: this.photos[0],
      photos: this.photos,
      createdAt: Date.now(),
    };
    this.router.navigateByUrl(`/albums/detail/${id}`, { state: { album } });
  }
}

