import { uuid } from "./id.js";

const DB_NAME = "bubulove_love_diary";
const DB_VERSION = 1;

const STORE_NAMES = ["diaries", "albums", "photos", "milestones", "media"];

let dbPromise = null;

function supportsIdb() {
	return typeof indexedDB !== "undefined";
}

function openDb() {
	if (!supportsIdb()) {
		return Promise.reject(new Error("IndexedDB not available"));
	}
	if (dbPromise) return dbPromise;
	dbPromise = new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onerror = () => reject(req.error);
		req.onsuccess = () => resolve(req.result);
		req.onupgradeneeded = (e) => {
			const db = e.target.result;
			for (const name of STORE_NAMES) {
				if (!db.objectStoreNames.contains(name)) {
					const store = db.createObjectStore(name, { keyPath: "id" });
					if (name === "photos") {
						store.createIndex("byAlbum", "albumId", { unique: false });
					}
				}
			}
		};
	});
	return dbPromise;
}

async function tx(storeName, mode, fn) {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const t = db.transaction(storeName, mode);
		const store = t.objectStore(storeName);
		let reqResult;
		try {
			reqResult = fn(store);
		} catch (err) {
			reject(err);
			return;
		}
		t.oncomplete = () => resolve(reqResult);
		t.onerror = () => reject(t.error);
		t.onabort = () => reject(t.error || new Error("abort"));
	});
}

export async function put(storeName, record) {
	await tx(storeName, "readwrite", (store) => store.put(record));
}

export async function get(storeName, id) {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const t = db.transaction(storeName, "readonly");
		const r = t.objectStore(storeName).get(id);
		r.onsuccess = () => resolve(r.result || null);
		r.onerror = () => reject(r.error);
	});
}

export async function remove(storeName, id) {
	await tx(storeName, "readwrite", (store) => store.delete(id));
}

export async function getAll(storeName) {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const t = db.transaction(storeName, "readonly");
		const r = t.objectStore(storeName).getAll();
		r.onsuccess = () => resolve(r.result || []);
		r.onerror = () => reject(r.error);
	});
}

export async function getAllByIndex(storeName, indexName, value) {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const t = db.transaction(storeName, "readonly");
		const store = t.objectStore(storeName);
		const idx = store.index(indexName);
		const r = idx.getAll(value);
		r.onsuccess = () => resolve(r.result || []);
		r.onerror = () => reject(r.error);
	});
}

/* —— Diary —— */
export function createDiaryDraft() {
	const now = Date.now();
	return {
		id: uuid(),
		title: "",
		content: "",
		imageMediaIds: [],
		voiceMediaId: null,
		privacy: "public",
		createdAt: now,
		updatedAt: now,
	};
}

export async function saveDiary(rec) {
	rec.updatedAt = Date.now();
	await put("diaries", rec);
	return rec;
}

export async function listDiaries() {
	const rows = await getAll("diaries");
	return rows.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export async function deleteDiary(id) {
	const d = await get("diaries", id);
	if (!d) return;
	if (d.imageMediaIds && d.imageMediaIds.length) {
		for (const mid of d.imageMediaIds) {
			await remove("media", mid).catch(() => {});
		}
	}
	if (d.voiceMediaId) {
		await remove("media", d.voiceMediaId).catch(() => {});
	}
	await remove("diaries", id);
}

/* —— Media blobs —— */
export async function saveMediaBlob({ id, type, blob }) {
	const rec = {
		id: id || uuid(),
		type,
		blob,
		createdAt: Date.now(),
	};
	await put("media", rec);
	return rec.id;
}

export async function getMediaBlob(id) {
	return get("media", id);
}

/* —— Albums —— */
export function createAlbumDraft(name) {
	const now = Date.now();
	return {
		id: uuid(),
		name: name || "新相册",
		coverPhotoId: null,
		sortOrder: now,
		createdAt: now,
		updatedAt: now,
	};
}

export async function saveAlbum(rec) {
	rec.updatedAt = Date.now();
	await put("albums", rec);
	return rec;
}

export async function listAlbums() {
	const rows = await getAll("albums");
	return rows.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export async function deleteAlbum(id) {
	const photos = await listPhotosByAlbum(id);
	for (const p of photos) {
		if (p.mediaId) await remove("media", p.mediaId).catch(() => {});
		await remove("photos", p.id);
	}
	await remove("albums", id);
}

/* —— Photos —— */
export function createPhotoDraft(albumId, mediaId) {
	const now = Date.now();
	return {
		id: uuid(),
		albumId,
		mediaId,
		sortOrder: now,
		favorite: false,
		createdAt: now,
	};
}

export async function savePhoto(rec) {
	await put("photos", rec);
	const album = await get("albums", rec.albumId);
	if (album && !album.coverPhotoId) {
		album.coverPhotoId = rec.id;
		await saveAlbum(album);
	}
	return rec;
}

export async function listPhotosByAlbum(albumId) {
	const rows = await getAllByIndex("photos", "byAlbum", albumId);
	return rows.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export async function listFavoritePhotos() {
	const rows = await getAll("photos");
	return rows.filter((p) => p.favorite).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function deletePhoto(id) {
	const p = await get("photos", id);
	if (!p) return;
	if (p.mediaId) await remove("media", p.mediaId).catch(() => {});
	await remove("photos", id);
}

/* —— Milestones —— */
export function createMilestoneDraft() {
	const now = Date.now();
	const d = new Date();
	d.setHours(0, 0, 0, 0);
	return {
		id: uuid(),
		title: "",
		note: "",
		dateMs: d.getTime(),
		calendarType: "solar",
		lunarLabel: "",
		important: false,
		remindDaysBefore: 3,
		createdAt: now,
		updatedAt: now,
	};
}

export async function saveMilestone(rec) {
	rec.updatedAt = Date.now();
	await put("milestones", rec);
	return rec;
}

export async function listMilestones() {
	const rows = await getAll("milestones");
	return rows.sort((a, b) => (b.dateMs || 0) - (a.dateMs || 0));
}

export async function deleteMilestone(id) {
	await remove("milestones", id);
}

export { openDb, supportsIdb };
