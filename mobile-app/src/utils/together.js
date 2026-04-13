import { getLoveAnchorMs } from "./prefs.js";
import { listMilestones } from "./db.js";

export async function resolveAnchorMs() {
	const fixed = getLoveAnchorMs();
	if (fixed) return fixed;
	const ms = await listMilestones();
	if (!ms.length) return null;
	const oldest = ms.reduce((a, b) => ((a.dateMs || 0) < (b.dateMs || 0) ? a : b));
	return oldest.dateMs || null;
}

export async function getTogetherDayCount() {
	const anchor = await resolveAnchorMs();
	if (!anchor) return 0;
	const diff = Date.now() - anchor;
	return Math.max(0, Math.floor(diff / 86400000));
}
