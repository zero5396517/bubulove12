import { Solar } from "lunar-javascript";

export function solarMsToLunarLabel(ms) {
	try {
		const d = new Date(ms);
		const solar = Solar.fromYmd(d.getFullYear(), d.getMonth() + 1, d.getDate());
		const lunar = solar.getLunar();
		return lunar.toString();
	} catch {
		return "";
	}
}
