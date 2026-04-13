const STORAGE_KEY = "love_diary_prefs_v1";

function read() {
	try {
		const raw = uni.getStorageSync(STORAGE_KEY);
		if (!raw) return {};
		return typeof raw === "string" ? JSON.parse(raw) : raw;
	} catch {
		return {};
	}
}

function write(data) {
	try {
		uni.setStorageSync(STORAGE_KEY, JSON.stringify(data));
	} catch (e) {
		console.error(e);
	}
}

export function getPrefs() {
	return read();
}

export function setPrefs(patch) {
	const next = { ...read(), ...patch };
	write(next);
	return next;
}

export function getLoveAnchorMs() {
	const p = read();
	if (p.loveAnchorMs && typeof p.loveAnchorMs === "number") return p.loveAnchorMs;
	return null;
}

export function setLoveAnchorMs(ms) {
	setPrefs({ loveAnchorMs: ms });
}

export function setLastMilestoneCheckMs(ms) {
	setPrefs({ lastMilestoneCheckMs: ms });
}
