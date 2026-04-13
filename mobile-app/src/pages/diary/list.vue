<template>
	<view class="page">
		<u-navbar title="恋爱日记" :is-back="true" :border-bottom="false" :background="{ background: 'rgba(255,255,255,0.88)' }">
			<template #right>
				<u-icon name="plus" size="44" color="#bc004f" @click="goEdit('')"></u-icon>
			</template>
		</u-navbar>
		<view class="body app-safe-bottom">
			<u-search
				v-model="keyword"
				placeholder="搜索那些心动时刻…"
				:show-action="false"
				shape="round"
				bg-color="#ede7e3"
				height="56"
			></u-search>

			<scroll-view class="chip-scroll" scroll-x :show-scrollbar="false">
				<view class="chip-row">
					<view
						class="chip"
						:class="{ 'chip--on': filterYm === null }"
						@click="filterYm = null"
					>
						<text class="chip-t">全部</text>
					</view>
					<view
						v-for="ym in monthChips"
						:key="ym"
						class="chip"
						:class="{ 'chip--on': filterYm === ym }"
						@click="filterYm = ym"
					>
						<text class="chip-t">{{ formatYmLabel(ym) }}</text>
					</view>
				</view>
			</scroll-view>

			<view v-if="filtered.length === 0" class="empty-wrap">
				<u-empty mode="list" text="暂无日记"></u-empty>
			</view>
			<view v-else class="feed">
				<view
					v-for="d in filtered"
					:key="d.id"
					class="card-wrap"
					@click="goDetail(d.id)"
				>
					<!-- Quote card -->
					<view v-if="cardKind(d) === 'quote'" class="card card-quote">
						<u-icon name="chat" size="40" color="rgba(188,0,79,0.35)" class="quote-icon"></u-icon>
						<text class="quote serif">{{ d.content || d.title || "…" }}</text>
						<u-text :text="metaLine(d)" size="20" color="#897271" margin="24rpx 0 0" />
					</view>
					<!-- Image + text -->
					<view v-else-if="cardKind(d) === 'image'" class="card card-split">
						<view class="split-img">
							<image v-if="thumbMap[d.id]" class="split-img-el" :src="thumbMap[d.id]" mode="aspectFill" />
							<view v-else class="split-ph"></view>
						</view>
						<view class="split-body">
							<view class="split-meta">
								<u-text :text="dayTag(d)" size="20" color="#bc004f" />
								<u-text :text="timePart(d)" size="20" color="#897271" margin="0 0 0 12rpx" />
							</view>
							<text class="split-title">{{ d.title || "无标题" }}</text>
							<u-text :text="snippet(d.content)" size="26" color="#564241" />
							<view class="read-more">
								<u-text text="继续阅读" size="22" color="#bc004f" />
								<u-icon name="arrow-right" size="24" color="#bc004f"></u-icon>
							</view>
						</view>
					</view>
					<!-- Wide hero -->
					<view v-else-if="cardKind(d) === 'wide'" class="card card-wide">
						<view class="wide-hero">
							<image v-if="thumbMap[d.id]" class="wide-img" :src="thumbMap[d.id]" mode="aspectFill" />
							<view v-else class="wide-ph"></view>
							<view class="wide-grad"></view>
							<view class="wide-top">
								<u-text :text="dayTag(d)" size="20" color="#bc004f" />
							</view>
							<text class="wide-title">{{ d.title || "无标题" }}</text>
						</view>
						<view class="wide-bottom">
							<u-text :text="snippet(d.content)" size="26" color="#564241" />
						</view>
					</view>
					<!-- Default -->
					<view v-else class="card card-plain">
						<view class="split-meta">
							<u-text :text="dayTag(d)" size="20" color="#bc004f" />
							<u-text :text="timePart(d)" size="20" color="#897271" margin="0 0 0 12rpx" />
						</view>
						<text class="split-title">{{ d.title || "无标题" }}</text>
						<u-text :text="snippet(d.content)" size="26" color="#564241" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { onPullDownRefresh, onShow } from "@dcloudio/uni-app";
import { listDiaries, getMediaBlob } from "../../utils/db.js";

const keyword = ref("");
const filterYm = ref(null);
const rows = ref([]);
const thumbMap = ref({});

const monthChips = computed(() => {
	const set = new Set();
	for (const d of rows.value) {
		const t = d.updatedAt || d.createdAt;
		if (!t) continue;
		const dt = new Date(t);
		set.add(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`);
	}
	return Array.from(set).sort().reverse().slice(0, 12);
});

const filtered = computed(() => {
	let list = rows.value;
	const k = keyword.value.trim();
	if (k) {
		list = list.filter(
			(d) =>
				(d.title && d.title.includes(k)) ||
				(d.content && d.content.includes(k))
		);
	}
	if (filterYm.value) {
		const [y, m] = filterYm.value.split("-").map(Number);
		list = list.filter((d) => {
			const ts = d.updatedAt || d.createdAt || 0;
			const dt = new Date(ts);
			return dt.getFullYear() === y && dt.getMonth() + 1 === m;
		});
	}
	return list;
});

function cardKind(d) {
	const hasImg = !!(d.imageMediaIds && d.imageMediaIds.length);
	const c = (d.content || "").trim();
	const t = (d.title || "").trim();
	if (!hasImg && c.length > 0 && c.length <= 90 && t.length <= 1) return "quote";
	if (hasImg) {
		const long = (d.content || "").length > 100;
		if (long) return "wide";
		return "image";
	}
	return "plain";
}

function dayTag(d) {
	const ts = d.updatedAt || d.createdAt;
	if (!ts) return "";
	const dt = new Date(ts);
	return `${dt.getMonth() + 1}月${dt.getDate()}日`;
}

function timePart(d) {
	const ts = d.updatedAt || d.createdAt;
	if (!ts) return "";
	const dt = new Date(ts);
	return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

function metaLine(d) {
	const ts = d.updatedAt || d.createdAt;
	if (!ts) return "";
	const dt = new Date(ts);
	return `${dt.getMonth() + 1}月${dt.getDate()}日 · ${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

function formatYmLabel(ym) {
	const [y, m] = ym.split("-").map(Number);
	return `${y}年${m}月`;
}

async function loadThumbs() {
	const prev = { ...thumbMap.value };
	for (const k of Object.keys(prev)) {
		if (prev[k] && prev[k].startsWith("blob:")) URL.revokeObjectURL(prev[k]);
	}
	const map = {};
	for (const d of rows.value) {
		const mid = d.imageMediaIds && d.imageMediaIds[0];
		if (!mid) continue;
		const m = await getMediaBlob(mid);
		if (m?.blob) map[d.id] = URL.createObjectURL(m.blob);
	}
	thumbMap.value = map;
}

async function load() {
	rows.value = await listDiaries();
	await loadThumbs();
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
});

function snippet(s) {
	if (!s) return "";
	return s.length > 80 ? s.slice(0, 80) + "…" : s;
}

function goEdit(id) {
	const q = id ? `?id=${id}` : "";
	uni.navigateTo({ url: `/pages/diary/edit${q}` });
}

function goDetail(id) {
	uni.navigateTo({ url: `/pages/diary/detail?id=${id}` });
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
.serif {
	font-family: Georgia, "Times New Roman", serif;
}
.chip-scroll {
	margin: 28rpx 0 8rpx;
	white-space: nowrap;
	width: 100%;
}
.chip-row {
	display: inline-flex;
	gap: 16rpx;
	padding-bottom: 8rpx;
}
.chip {
	padding: 12rpx 28rpx;
	border-radius: 999rpx;
	background: #f8f2ef;
}
.chip--on {
	background: #bc004f;
	box-shadow: 0 4rpx 16rpx rgba(188, 0, 79, 0.2);
}
.chip-t {
	font-size: 24rpx;
	color: #564241;
	font-weight: 500;
}
.chip--on .chip-t {
	color: #fff;
}
.empty-wrap {
	padding: 80rpx 0;
}
.feed {
	display: flex;
	flex-direction: column;
	gap: 48rpx;
	margin-top: 24rpx;
}
.card {
	border-radius: 24rpx;
	overflow: hidden;
	background: #fff;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
}
.card-quote {
	padding: 48rpx 40rpx;
	text-align: center;
	background: #f8f2ef;
}
.quote-icon {
	display: block;
	margin: 0 auto 16rpx;
}
.quote {
	font-size: 34rpx;
 font-style: italic;
	line-height: 1.5;
	color: #1d1b19;
}
.card-split {
	display: flex;
	flex-direction: column;
	padding: 32rpx;
	gap: 24rpx;
 background: #fff;
}
@media screen and (min-width: 480px) {
	.card-split {
		flex-direction: row;
		align-items: stretch;
	}
}
.split-img {
	width: 100%;
	height: 280rpx;
	border-radius: 16rpx;
	overflow: hidden;
	background: #f8f2ef;
}
@media screen and (min-width: 480px) {
	.split-img {
		width: 220rpx;
		height: auto;
		min-height: 200rpx;
	}
}
.split-img-el {
	width: 100%;
	height: 100%;
}
.split-ph {
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #fce7f3, #f8f2ef);
}
.split-body {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}
.split-meta {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}
.split-title {
	font-size: 34rpx;
	font-weight: 700;
	color: #1d1b19;
	margin-bottom: 12rpx;
	line-height: 1.35;
}
.read-more {
	display: flex;
	align-items: center;
	gap: 4rpx;
	margin-top: 16rpx;
}
.card-wide {
	background: #fff;
}
.wide-hero {
	position: relative;
	height: 320rpx;
}
.wide-img {
	width: 100%;
	height: 100%;
}
.wide-ph {
	width: 100%;
	height: 100%;
	background: linear-gradient(180deg, #1e1b4b, #4c1d95);
}
.wide-grad {
	position: absolute;
 inset: 0;
	background: linear-gradient(to top, rgba(255, 255, 255, 0.92), transparent);
}
.wide-top {
	position: absolute;
	top: 24rpx;
	left: 24rpx;
}
.wide-title {
	position: absolute;
	bottom: 24rpx;
	left: 24rpx;
	right: 24rpx;
	font-size: 34rpx;
	font-weight: 700;
	color: #1d1b19;
}
.wide-bottom {
	padding: 28rpx 32rpx 48rpx;
}
.card-plain {
	padding: 40rpx 32rpx;
	background: #fff;
}
</style>
