import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';

type AlbumDisplay = {
  id: string;
  name: string;
  coverUrl: string;
  photos: string[];
};

@Component({
  selector: 'app-albums-detail',
  standalone: true,
  imports: [
    CommonModule,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonContent,
    IonHeader,
    IonIcon,
    IonImg,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: './albums-detail.page.html',
  styleUrls: ['./albums-detail.page.scss'],
})
export class AlbumsDetailPage implements OnInit {
  album: AlbumDisplay = {
    id: '',
    name: '',
    coverUrl: '',
    photos: [],
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const state = this.router.getCurrentNavigation()?.extras?.state as
      | { album?: Partial<AlbumDisplay> }
      | undefined;
    const fromState = state?.album;
    if (fromState) {
      this.album = {
        id: fromState.id ?? 'unknown',
        name: fromState.name ?? '未命名相册',
        coverUrl: fromState.coverUrl ?? '',
        photos: fromState.photos ?? [],
      };
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    this.album = this.mockById(id);
  }

  private mockById(id: string | null): AlbumDisplay {
    return {
      id: id ?? 'mock',
      name: '甜品与电影',
      coverUrl:
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=70',
      photos: [
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=70',
        'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=70',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=70',
      ],
    };
  }

  back() {
    this.router.navigateByUrl('/tabs/albums');
  }

  shareMock() {
    // UI-only mock, no Web Share API yet.
    this.router.navigateByUrl('/tabs/albums');
  }
}

