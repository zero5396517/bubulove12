export async function shareAlbumOrPhotos(title, text, url) {
	// #ifdef H5
	if (typeof navigator !== "undefined" && navigator.share) {
		try {
			await navigator.share({ title, text, url: url || window.location.href });
			return true;
		} catch (e) {
			if (e && e.name === "AbortError") return false;
		}
	}
	try {
		await navigator.clipboard.writeText(url || window.location.href);
		uni.$u.toast("链接已复制");
		return true;
	} catch {
		uni.$u.toast("请手动复制链接");
	}
	// #endif
	// #ifndef H5
	uni.showShareMenu?.({});
	uni.$u.toast("请使用系统分享");
	// #endif
	return false;
}
