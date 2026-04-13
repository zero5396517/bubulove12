<template>
	<view class="page">
		<u-navbar title="爱的相册" :is-back="true" :border-bottom="false" :background="{ background: 'rgba(255,255,255,0.88)' }">
			<template #right>
				<u-button
					size="mini"
					type="primary"
					:custom-style="{ borderRadius: '999rpx', padding: '0 24rpx', height: '56rpx' }"
					@click="createAlbum"
				>
					新建
				</u-button>
			</template>
		</u-navbar>
		<view class="body app-safe-bottom">
			<view class="section-head">
				<u-text text="Memory Collection" size="20" color="#ab2c5d" />
				<text class="hero serif">甜蜜相册</text>
				<u-text
					text="在这里，每一张照片都是我们相遇、相识、相爱的见证。"
					type="info"
					size="26"
					margin="12rpx 0 0"
				/>
			</view>

			<u-tabs :list="tabList" :current="tabIndex" active-color="#bc004f" inactive-color="#909399" @change="onTab"></u-tabs>

			<view v-if="tabIndex === 0">
				<view v-if="albums.length === 0" class="empty-wrap">
					<u-empty mode="data" text="还没有相册"></u-empty>
				</view>
				<view v-else class="bento">
					<view class="feat" @click="openAlbum(albums[0].id)">
						<image v-if="coverUrl[albums[0].id]" class="feat-img" :src="coverUrl[albums[0].id]" mode="aspectFill" />
						<view v-else class="feat-ph"></view>
						<view class="feat-grad"></view>
						<view class="feat-bot">
							<view>
								<text class="feat-title serif">{{ albums[0].name }}</text>
								<u-text
									:text="`更新于 ${formatTime(albums[0].updatedAt)} · ${photoCount[albums[0].id] || 0} 张`"
									size="24"
									color="rgba(255,255,255,0.85)"
									margin="8rpx 0 0"
								/>
							</view>
							<view class="feat-pill">
								<text class="feat-pill-t">{{ photoCount[albums[0].id] || 0 }} 张</text>
							</view>
						</view>
					</view>
					<view class="grid-rest">
						<view
							v-for="a in albums.slice(1)"
							:key="a.id"
							class="tile"
							@click="openAlbum(a.id)"
						>
							<image v-if="coverUrl[a.id]" class="tile-img" :src="coverUrl[a.id]" mode="aspectFill" />
							<view v-else class="tile-ph"></view>
							<view class="tile-grad"></view>
							<view class="tile-bot">
								<text class="tile-title serif">{{ a.name }}</text>
								<u-text :text="`${photoCount[a.id] || 0} 张`" size="20" color="rgba(255,255,255,0.9)" margin="8rpx 0 0" />
							</view>
						</view>
					</view>
				</view>
			</view>

			<view v-else>
				<view v-if="favorites.length === 0" class="empty-wrap">
					<u-empty mode="data" text="暂无收藏"></u-empty>
				</view>
				<u-grid v-else :col="3" :border="false" class="fav-grid">
					<u-grid-item v-for="p in favorites" :key="p.id" @click="openAlbum(p.albumId)">
						<u-image :src="thumbMap[p.id]" width="100%" height="200rpx" border-radius="16"></u-image>
					</u-grid-item>
				</u-grid>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { onPullDownRefresh, onShow } from "@dcloudio/uni-app";
import { listAlbums, listFavoritePhotos, getMediaBlob, listPhotosByAlbum, createAlbumDraft, saveAlbum } from "../../utils/db.js";

const tabList = [{ name: "相册" }, { name: "收藏" }];
const tabIndex = ref(0);
const albums = ref([]);
const favorites = ref([]);
const thumbMap = ref({});
const coverUrl = ref({});
const photoCount = ref({});

function onTab(index) {
	tabIndex.value = index;
}

async function load() {
	albums.value = await listAlbums();
	favorites.value = await listFavoritePhotos();
	const map = {};
	for (const p of favorites.value) {
		const m = await getMediaBlob(p.mediaId);
		if (m && m.blob) map[p.id] = URL.createObjectURL(m.blob);
	}
	thumbMap.value = map;

	const cu = {};
	const pc = {};
	for (const a of albums.value) {
		const photos = await listPhotosByAlbum(a.id);
		pc[a.id] = photos.length;
		const cover = photos.find((p) => p.id === a.coverPhotoId) || photos[0];
		if (cover) {
			const m = await getMediaBlob(cover.mediaId);
			if (m?.blob) cu[a.id] = URL.createObjectURL(m.blob);
		}
	}
	Object.keys(coverUrl.value).forEach((k) => {
		const u = coverUrl.value[k];
		if (u && u.startsWith("blob:")) URL.revokeObjectURL(u);
	});
	coverUrl.value = cu;
	photoCount.value = pc;
}

onMounted(() => load());
onShow(() => load());

onPullDownRefresh(async () => {
	await load();
	uni.stopPullDownRefresh();
});

onUnmounted(() => {
	Object.values(thumbMap.value).forEach((u) => {
		if (typeof u === "string" && u.startsWith("blob:")) URL.revokeObjectURL(u);
	});
	Object.values(coverUrl.value).forEach((u) => {
		if (typeof u === "string" && u.startsWith("blob:")) URL.revokeObjectURL(u);
	});
});

function formatTime(ts) {
	if (!ts) return "";
	const d = new Date(ts);
	return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

function openAlbum(id) {
	uni.navigateTo({ url: `/pages/album/detail?id=${id}` });
}

async function createAlbum() {
	const a = createAlbumDraft("新相册");
	await saveAlbum(a);
	uni.$u.toast("已创建相册");
	await load();
	openAlbum(a.id);
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
.section-head {
	margin-bottom: 32rpx;
}
.hero {
	display: block;
	font-size: 56rpx;
	font-weight: 700;
	color: #1d1b19;
	margin-top: 8rpx;
	line-height: 1.2;
}
.serif {
	font-family: Georgia, "Times New Roman", serif;
}
.empty-wrap {
	padding: 80rpx 0;
}
.bento {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	margin-top: 24rpx;
}
.feat {
	position: relative;
	border-radius: 24rpx;
	overflow: hidden;
	min-height: 360rpx;
	box-shadow: 0 12rpx 40rpx rgba(188, 0, 79, 0.08);
}
.feat-img {
	width: 100%;
	height: 360rpx;
}
.feat-ph {
	width: 100%;
	height: 360rpx;
	background: linear-gradient(135deg, #fecdd3, #fbcfe8);
}
.feat-grad {
	position: absolute;
	inset: 0;
	background: linear-gradient(to top, rgba(0, 0, 0, 0.75), transparent 55%);
}
.feat-bot {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 32rpx;
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
}
.feat-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
}
.feat-pill {
	background: rgba(255, 255, 255, 0.22);
	backdrop-filter: blur(8px);
	padding: 8rpx 20rpx;
	border-radius: 999rpx;
}
.feat-pill-t {
	font-size: 22rpx;
	color: #fff;
	font-weight: 700;
}
.grid-rest {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
}
.tile {
	position: relative;
	border-radius: 24rpx;
	overflow: hidden;
	min-height: 280rpx;
	box-shadow: 0 8rpx 28rpx rgba(0, 0, 0, 0.06);
}
.tile-img {
	width: 100%;
	height: 280rpx;
}
.tile-ph {
	width: 100%;
	height: 280rpx;
	background: linear-gradient(160deg, #ffedd5, #fecaca);
}
.tile-grad {
	position: absolute;
	inset: 0;
	background: linear-gradient(to top, rgba(137, 114, 113, 0.85), transparent 50%);
}
.tile-bot {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 24rpx;
}
.tile-title {
	font-size: 28rpx;
	font-weight: 700;
	color: #fff;
	line-height: 1.3;
}
.fav-grid {
	margin-top: 24rpx;
}
</style>
