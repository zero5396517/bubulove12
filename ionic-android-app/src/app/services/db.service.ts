import { Injectable } from '@angular/core';

const DB_NAME = 'love-diary-db';
const DB_VERSION = 1;

export interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  privacy: 'private' | 'public';
  photoKeys: string[];
  voiceKey: string | null;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Confession {
  id: string;
  title: string;
  content: string;
  tags: string[];
  privacy: 'private' | 'public';
  createdAt: number;
}

export interface Album {
  id: string;
  name: string;
  coverPhotoKey: string | null;
  photoKeys: string[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Photo {
  id: string;
  albumId: string;
  blob: Blob;
  thumbnailBlob: Blob | null;
  createdAt: number;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  dateType: 'solar' | 'lunar';
  description: string;
  important: boolean;
  remindDays: number;
  mediaKey: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface VoiceRecord {
  id: string;
  blob: Blob;
  duration: number;
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class DbService {
  private db: IDBDatabase | null = null;

  private open(): Promise<IDBDatabase> {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('diaries')) {
          const s = db.createObjectStore('diaries', { keyPath: 'id' });
          s.createIndex('date', 'date');
          s.createIndex('privacy', 'privacy');
        }
        if (!db.objectStoreNames.contains('confessions')) {
          db.createObjectStore('confessions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('albums')) {
          db.createObjectStore('albums', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('photos')) {
          const p = db.createObjectStore('photos', { keyPath: 'id' });
          p.createIndex('albumId', 'albumId');
        }
        if (!db.objectStoreNames.contains('milestones')) {
          const m = db.createObjectStore('milestones', { keyPath: 'id' });
          m.createIndex('date', 'date');
        }
        if (!db.objectStoreNames.contains('voices')) {
          db.createObjectStore('voices', { keyPath: 'id' });
        }
      };
      req.onsuccess = () => { this.db = req.result; resolve(this.db); };
      req.onerror = () => reject(req.error);
    });
  }

  private async tx(store: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const db = await this.open();
    return db.transaction(store, mode).objectStore(store);
  }

  private req<T>(r: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  }

  genId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // --- Diaries ---
  async addDiary(d: Diary): Promise<void> {
    const s = await this.tx('diaries', 'readwrite');
    await this.req(s.put(d));
  }
  async getDiary(id: string): Promise<Diary | undefined> {
    const s = await this.tx('diaries', 'readonly');
    return this.req(s.get(id));
  }
  async getAllDiaries(): Promise<Diary[]> {
    const s = await this.tx('diaries', 'readonly');
    const all: Diary[] = await this.req(s.getAll());
    return all.sort((a, b) => b.createdAt - a.createdAt);
  }
  async deleteDiary(id: string): Promise<void> {
    const s = await this.tx('diaries', 'readwrite');
    await this.req(s.delete(id));
  }

  // --- Confessions ---
  async addConfession(c: Confession): Promise<void> {
    const s = await this.tx('confessions', 'readwrite');
    await this.req(s.put(c));
  }
  async getAllConfessions(): Promise<Confession[]> {
    const s = await this.tx('confessions', 'readonly');
    const all: Confession[] = await this.req(s.getAll());
    return all.sort((a, b) => b.createdAt - a.createdAt);
  }

  // --- Albums ---
  async addAlbum(a: Album): Promise<void> {
    const s = await this.tx('albums', 'readwrite');
    await this.req(s.put(a));
  }
  async getAlbum(id: string): Promise<Album | undefined> {
    const s = await this.tx('albums', 'readonly');
    return this.req(s.get(id));
  }
  async getAllAlbums(): Promise<Album[]> {
    const s = await this.tx('albums', 'readonly');
    const all: Album[] = await this.req(s.getAll());
    return all.sort((a, b) => b.createdAt - a.createdAt);
  }
  async deleteAlbum(id: string): Promise<void> {
    const s = await this.tx('albums', 'readwrite');
    await this.req(s.delete(id));
  }

  // --- Photos ---
  async addPhoto(p: Photo): Promise<void> {
    const s = await this.tx('photos', 'readwrite');
    await this.req(s.put(p));
  }
  async getPhoto(id: string): Promise<Photo | undefined> {
    const s = await this.tx('photos', 'readonly');
    return this.req(s.get(id));
  }
  async getPhotosByAlbum(albumId: string): Promise<Photo[]> {
    const s = await this.tx('photos', 'readonly');
    const idx = s.index('albumId');
    return this.req(idx.getAll(albumId));
  }
  async deletePhoto(id: string): Promise<void> {
    const s = await this.tx('photos', 'readwrite');
    await this.req(s.delete(id));
  }

  // --- Milestones ---
  async addMilestone(m: Milestone): Promise<void> {
    const s = await this.tx('milestones', 'readwrite');
    await this.req(s.put(m));
  }
  async getMilestone(id: string): Promise<Milestone | undefined> {
    const s = await this.tx('milestones', 'readonly');
    return this.req(s.get(id));
  }
  async getAllMilestones(): Promise<Milestone[]> {
    const s = await this.tx('milestones', 'readonly');
    const all: Milestone[] = await this.req(s.getAll());
    return all.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db2 = new Date(b.date).getTime();
      return db2 - da;
    });
  }
  async deleteMilestone(id: string): Promise<void> {
    const s = await this.tx('milestones', 'readwrite');
    await this.req(s.delete(id));
  }

  // --- Voices ---
  async addVoice(v: VoiceRecord): Promise<void> {
    const s = await this.tx('voices', 'readwrite');
    await this.req(s.put(v));
  }
  async getVoice(id: string): Promise<VoiceRecord | undefined> {
    const s = await this.tx('voices', 'readonly');
    return this.req(s.get(id));
  }
  async deleteVoice(id: string): Promise<void> {
    const s = await this.tx('voices', 'readwrite');
    await this.req(s.delete(id));
  }

  // --- Seed data ---
  async seedIfEmpty(): Promise<void> {
    const diaries = await this.getAllDiaries();
    if (diaries.length > 0) return;

    const now = Date.now();
    await this.addDiary({
      id: 'd1', title: '今天的拥抱', content: '我们在路灯下聊了很久，心里突然就安静了。\n\n希望下次再见，我们也能继续把喜欢说得更具体。',
      date: '2026-03-25', privacy: 'private', photoKeys: [], voiceKey: null, tags: ['温柔', '路灯', '散步'],
      createdAt: now - 86400000 * 1, updatedAt: now - 86400000 * 1,
    });
    await this.addDiary({
      id: 'd2', title: '甜品和电影', content: '你笑起来的时候，连电影都变得更好看了。',
      date: '2026-03-21', privacy: 'public', photoKeys: [], voiceKey: null, tags: ['甜品', '电影'],
      createdAt: now - 86400000 * 5, updatedAt: now - 86400000 * 5,
    });
    await this.addDiary({
      id: 'd3', title: '一起散步', content: '风有点凉，但你的手一直很暖。',
      date: '2026-03-18', privacy: 'private', photoKeys: [], voiceKey: null, tags: ['散步'],
      createdAt: now - 86400000 * 8, updatedAt: now - 86400000 * 8,
    });
    await this.addDiary({
      id: 'd4', title: '纪念日彩排', content: '我们把想说的话写在便利贴上，然后贴满了桌角。',
      date: '2026-03-12', privacy: 'private', photoKeys: [], voiceKey: null, tags: ['纪念日'],
      createdAt: now - 86400000 * 14, updatedAt: now - 86400000 * 14,
    });

    await this.addConfession({
      id: 'c1', title: '今天也喜欢你', content: '你认真生活的样子真的很迷人，我想把这份喜欢一直写下去。',
      tags: ['甜甜的'], privacy: 'private', createdAt: now - 86400000 * 3,
    });
    await this.addConfession({
      id: 'c2', title: '谢谢你一直在', content: '有你在，所有的疲惫都变得不那么难熬。希望未来也能并肩走下去。',
      tags: ['温柔的'], privacy: 'public', createdAt: now - 86400000 * 7,
    });
    await this.addConfession({
      id: 'c3', title: '晚安', content: '今天也很想你。等你睡着，我再把这份心动轻轻收好。',
      tags: ['甜甜的'], privacy: 'private', createdAt: now - 86400000 * 14,
    });

    await this.addAlbum({
      id: 'a1', name: '甜品与电影', coverPhotoKey: null, photoKeys: [], tags: ['约会'],
      createdAt: now - 86400000 * 3, updatedAt: now - 86400000 * 3,
    });
    await this.addAlbum({
      id: 'a2', name: '牵手的路灯', coverPhotoKey: null, photoKeys: [], tags: ['约会'],
      createdAt: now - 86400000 * 7, updatedAt: now - 86400000 * 7,
    });
    await this.addAlbum({
      id: 'a3', name: '旅行碎片', coverPhotoKey: null, photoKeys: [], tags: ['旅行'],
      createdAt: now - 86400000 * 14, updatedAt: now - 86400000 * 14,
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 5);
    const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

    await this.addMilestone({
      id: 'm1', title: '第一次牵手纪念日', date: fmtDate(tomorrow), dateType: 'solar',
      description: '那天的风有点冷，但你握住我手的瞬间，我就知道这份喜欢会一直延续下去。',
      important: true, remindDays: 3, mediaKey: null, createdAt: now, updatedAt: now,
    });
    const d2 = new Date(); d2.setDate(d2.getDate() + 12);
    await this.addMilestone({
      id: 'm2', title: '一起看海', date: fmtDate(d2), dateType: 'solar',
      description: '海风、日落和你。', important: false, remindDays: 1, mediaKey: null,
      createdAt: now, updatedAt: now,
    });
    const d3 = new Date(); d3.setDate(d3.getDate() - 36);
    await this.addMilestone({
      id: 'm3', title: '第一次共度周末', date: fmtDate(d3), dateType: 'solar',
      description: '那个周末的时光好像格外慢。', important: true, remindDays: 7, mediaKey: null,
      createdAt: now, updatedAt: now,
    });
  }
}
