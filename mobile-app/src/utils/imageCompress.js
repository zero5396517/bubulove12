function blobToJpegBlob(blob, { maxSide = 1600, quality = 0.82 } = {}) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(blob);
		const img = new Image();
		img.onload = () => {
			try {
				const w = img.width;
				const h = img.height;
				let tw = w;
				let th = h;
				if (w > maxSide || h > maxSide) {
					if (w >= h) {
						tw = maxSide;
						th = Math.round((h * maxSide) / w);
					} else {
						th = maxSide;
						tw = Math.round((w * maxSide) / h);
					}
				}
				const canvas = document.createElement("canvas");
				canvas.width = tw;
				canvas.height = th;
				const ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0, tw, th);
				canvas.toBlob(
					(out) => {
						URL.revokeObjectURL(url);
						if (out) resolve(out);
						else reject(new Error("toBlob failed"));
					},
					"image/jpeg",
					quality
				);
			} catch (e) {
				URL.revokeObjectURL(url);
				reject(e);
			}
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("image load failed"));
		};
		img.src = url;
	});
}

/** H5: temp path or blob URL → compressed jpeg Blob */
export async function compressImageFile(filePath, opts) {
	// #ifdef H5
	const blob = await fetch(filePath).then((r) => r.blob());
	return blobToJpegBlob(blob, opts);
	// #endif
	// #ifndef H5
	return new Promise((resolve, reject) => {
		uni.getFileSystemManager().readFile({
			filePath,
			success: (res) => resolve(res.data),
			fail: reject,
		});
	});
	// #endif
}
