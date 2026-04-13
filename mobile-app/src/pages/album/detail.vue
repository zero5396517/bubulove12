<template>
	<view class="page">
		<u-navbar :title="album?.name || '相册'" :is-back="true" :border-bottom="false" :background="{ background: 'rgba(255,255,255,0.92)' }">
			<template #right>
				<u-icon name="share" size="40" color="#bc004f" @click="doShare"></u-icon>
			</template>
		</u-navbar>
		<view class="body app-safe-bottom" v-if="album">
			<u-input v-model="album.name" border="surround" placeholder="相册名称" @blur="rename"></u-input>
			<u-gap height="24" bg-color="transparent"></u-gap>

			<u-text text="图片" size="30" bold margin="0 0 16rpx" />
			<u-upload
				:file-list="fileList"
				:auto-upload="false"
				action=""
				:deletable="false"
				:max-count="30"
				:max-size="6 * 1024 * 1024"
				multiple
				@on-choose-complete="onChooseComplete"
			></u-upload>

			<u-text text="照片墙" size="30" bold margin="32rpx 0 16rpx" />
			<view v-if="photos.length === 0" class="empty-wrap">
				<u-empty text="添加一些照片吧"></u-empty>
			</view>
			<u-grid v-else :col="3" :border="false">
				<u-grid-item v-for="(p, idx) in photos" :key="p.id" @longpress="openSheet(p, idx)">
					<view class="ph">
						<u-image :src="urls[p.id]" width="100%" height="200rpx" border-radius="12"></u-image>
						<view v-if="album.coverPhotoId === p.id" class="badge">封面</view>
						<view v-if="p.favorite" class="heart">♥</view>
					</view>
				</u-grid-item>
			</u-grid>
		</view>

		<u-action-sheet
			v-model="sheetShow"
			:list="sheetList"
			@click="onSheet"
			@close="sheetPhoto = null"
		></u-action-sheet>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import {
	get,
	listPhotosByAlbum,
	savePhoto,
	saveAlbum,
	saveMediaBlob,
	getMediaBlob,
	remove,
	deletePhoto,
	createPhotoDraft,
} from "../../utils/db.js";
import { compressImageFile } from "../../utils/imageCompress.js";
import { shareAlbumOrPhotos } from "../../utils/share.js";

const albumId = ref("");
const album = ref(null);
const photos = ref([]);
const fileList = ref([]);
const urls = ref({});
const mediaIds = ref([]);
const sheetShow = ref(false);
const sheetPhoto = ref(null);
const sheetIndex = ref(0);

const sheetList = computed(() => [
	{ text: "设为封面" },
	{ text: sheetPhoto.value?.favorite ? "取消收藏" : "加入收藏" },
	{ text: "上移" },
	{ text: "下移" },
	{ text: "删除", color: "#fa3534" },
]);

onLoad((q) => {
	albumId.value = q.id || "";
});

onMounted(() => load());

onUnmounted(() => {
	Object.values(urls.value).forEach((u) => {
		if (typeof u === "string" && u.startsWith("blob:")) URL.revokeObjectURL(u);
	});
});

async function load() {
	const a = await get("albums", albumId.value);
	album.value = a;
	const ps = await listPhotosByAlbum(albumId.value);
	photos.value = ps;
	mediaIds.value = ps.map((p) => p.mediaId);
	fileList.value = [];
	const um = {};
	for (const p of ps) {
		const m = await getMediaBlob(p.mediaId);
		if (m && m.blob) {
			const url = URL.createObjectURL(m.blob);
			um[p.id] = url;
			fileList.value.push({ url, progress: 100 });
		}
	}
	urls.value = um;
}

async function rename() {
	if (album.value) await saveAlbum(album.value);
}

async function onChooseComplete(list) {
	const start = photos.value.length;
	for (let i = start; i < list.length; i++) {
		const item = list[i];
		try {
			const blob = await compressImageFile(item.url);
			const mid = await saveMediaBlob({ type: "image", blob });
			const ph = createPhotoDraft(albumId.value, mid);
			ph.sortOrder = Date.now() + i;
			await savePhoto(ph);
			if (item.url && item.url.startsWith("blob:")) URL.revokeObjectURL(item.url);
			item.url = URL.createObjectURL(blob);
			item.progress = 100;
		} catch (e) {
			console.error(e);
			uni.$u.toast("图片处理失败");
		}
	}
	await load();
}

function openSheet(p, idx) {
	sheetPhoto.value = p;
	sheetIndex.value = idx;
	sheetShow.value = true;
}

async function onSheet(index) {
	const p = sheetPhoto.value;
	const idx = sheetIndex.value;
	if (!p) return;
	sheetShow.value = false;
	if (index === 0) {
		album.value.coverPhotoId = p.id;
		await saveAlbum(album.value);
		uni.$u.toast("已设为封面");
	} else if (index === 1) {
		p.favorite = !p.favorite;
		await savePhoto(p);
		uni.$u.toast(p.favorite ? "已收藏" : "已取消收藏");
	} else if (index === 2) {
		await move(idx, -1);
	} else if (index === 3) {
		await move(idx, 1);
	} else if (index === 4) {
		await deletePhoto(p.id);
		if (album.value.coverPhotoId === p.id) {
			album.value.coverPhotoId = null;
			await saveAlbum(album.value);
		}
		uni.$u.toast("已删除");
	}
	await load();
}

async function move(idx, delta) {
	const j = idx + delta;
	if (j < 0 || j >= photos.value.length) return;
	const a = photos.value[idx];
	const b = photos.value[j];
	const t = a.sortOrder;
	a.sortOrder = b.sortOrder;
	b.sortOrder = t;
	await savePhoto(a);
	await savePhoto(b);
	await load();
}

function doShare() {
	shareAlbumOrPhotos(album.value?.name || "相册", "分享自《布布与一二的恋爱日记》", typeof location !== "undefined" ? location.href : "");
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #fef8f4;
}
.body {
	padding: 24rpx 32rpx 48rpx;
}
.empty-wrap {
	padding: 48rpx 0;
}
.ph {
	position: relative;
}
.badge {
	position: absolute;
	top: 8rpx;
	left: 8rpx;
	background: rgba(188, 0, 79, 0.85);
	color: #fff;
	font-size: 20rpx;
	padding: 4rpx 10rpx;
	border-radius: 8rpx;
}
.heart {
	position: absolute;
	bottom: 8rpx;
	right: 8rpx;
	color: #bc004f;
	font-size: 28rpx;
}
</style>
