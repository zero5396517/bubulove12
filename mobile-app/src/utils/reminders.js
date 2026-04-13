import { listMilestones } from "./db.js";
import { setLastMilestoneCheckMs } from "./prefs.js";

function startOfDay(ms) {
	const d = new Date(ms);
	d.setHours(0, 0, 0, 0);
	return d.getTime();
}

/** Next anniversary of month/day from dateMs (this year or next). */
function nextAnnualOccurrence(ms) {
	const src = new Date(ms || 0);
	const now = new Date();
	let y = now.getFullYear();
	let cand = new Date(y, src.getMonth(), src.getDate()).getTime();
	if (cand < startOfDay(Date.now())) {
		cand = new Date(y + 1, src.getMonth(), src.getDate()).getTime();
	}
	return startOfDay(cand);
}

export async function getUpcomingImportantMilestones(withinDays = 14) {
	const now = startOfDay(Date.now());
	const end = now + withinDays * 86400000;
	const rows = await listMilestones();
	const out = [];
	for (const m of rows) {
		if (!m.important) continue;
		const eventDay = nextAnnualOccurrence(m.dateMs || 0);
		const remindStart = eventDay - (m.remindDaysBefore || 0) * 86400000;
		if (eventDay >= now && eventDay <= end && now >= remindStart) {
			out.push({ ...m, _nextEventDay: eventDay });
		}
	}
	return out.sort((a, b) => (a._nextEventDay || 0) - (b._nextEventDay || 0));
}

export function touchMilestoneCheck() {
	setLastMilestoneCheckMs(Date.now());
}
