<template>
	<view class="page">
		<u-navbar title="" :is-back="false" :border-bottom="false" :background="{ background: 'rgba(255,255,255,0.88)' }">
			<template #left>
				<view class="nav-brand">
					<u-icon name="heart-fill" size="36" color="#f87171"></u-icon>
					<text class="nav-title serif">布布与一二的恋爱日记</text>
				</view>
			</template>
			<template #right>
				<u-icon name="more-circle" size="40" color="#a8a29e" @click="goAbout"></u-icon>
			</template>
		</u-navbar>

		<view class="body app-safe-bottom">
			<u-alert-tips
				v-if="reminderText"
				type="warning"
				:title="reminderText"
				:show-icon="true"
				@click="goMilestone"
			/>

			<view class="hero">
				<view class="hero-blob hero-blob--tl"></view>
				<view class="hero-blob hero-blob--br"></view>
				<text class="tag">Forever &amp; Always</text>
				<view class="title-block">
					<text class="title-line serif">记录我们的\n</text>
					<text class="title-accent serif">每一寸心动</text>
				</view>
				<view class="pill">
					<view class="avatars">
						<view class="avatar a1"><text class="avatar-t">布</text></view>
						<view class="avatar a2"><text class="avatar-t">一</text></view>
					</view>
					<text class="pill-t">布布 &amp; 一二</text>
				</view>
			</view>

			<u-grid :col="2" :border="false" class="grid">
				<u-grid-item v-for="(it, i) in entries" :key="i" @click="() => go(it.path)">
					<view class="tile" hover-class="tile--active" :hover-stay-time="150">
						<view class="circle" :style="{ background: it.bg }">
							<u-icon :name="it.icon" size="52" :color="it.iconColor"></u-icon>
						</view>
						<text class="label serif">{{ it.label }}</text>
					</view>
				</u-grid-item>
			</u-grid>

			<view class="milestone-panel">
				<u-icon class="milestone-watermark" name="heart-fill" size="120" color="#bc004f"></u-icon>
				<view class="milestone-inner">
					<u-text text="Current Milestone" size="22" color="#bc004f" />
					<text class="serif together-line">我们在一起已经</text>
					<text class="days">{{ togetherDays }}</text>
					<text class="serif unit">天</text>
					<view class="milestone-bar"></view>
				</view>
			</view>

			<view v-if="recentDiary" class="polaroid-section">
				<text class="polaroid-heading serif">最近的记忆</text>
				<view class="polaroid" @click="goRecentDetail">
					<view class="polaroid-photo">
						<image v-if="recentCover" class="polaroid-img" :src="recentCover" mode="aspectFill" />
						<view v-else class="polaroid-placeholder"></view>
					</view>
					<text class="polaroid-cap serif">{{ recentCaption }}</text>
				</view>
			</view>
		</view>

		<view class="fab-heart" @click="goNewDiary">
			<u-icon name="heart-fill" size="44" color="#bc004f"></u-icon>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { getTogetherDayCount } from "../../utils/together.js";
import { getUpcomingImportantMilestones, touchMilestoneCheck } from "../../utils/reminders.js";
import { listDiaries, getMediaBlob } from "../../utils/db.js";

const togetherDays = ref(0);
const upcoming = ref([]);
const recentDiary = ref(null);
const recentCover = ref("");

const entries = [
	{ label: "恋爱日记", path: "/pages/diary/list", icon: "edit-pen", bg: "#ffd9e1", iconColor: "#6e0034" },
	{ label: "爱的相册", path: "/pages/album/list", icon: "photo", bg: "#ffd9de", iconColor: "#620026" },
	{ label: "相爱里程碑", path: "/pages/milestone/list", icon: "calendar", bg: "#ffdad9", iconColor: "#4f1e20" },
	{ label: "爱的告白", path: "/pages/confession/index", icon: "heart-fill", bg: "#fce7f3", iconColor: "#bc004f" },
];

const reminderText = computed(() => {
	if (!upcoming.value.length) return "";
	const m = upcoming.value[0];
	const d = m._nextEventDay ? new Date(m._nextEventDay) : new Date();
	const ds = `${d.getMonth() + 1}月${d.getDate()}日`;
	return `重要时刻临近：${m.title || "纪念日"}（${ds}）`;
});

const recentCaption = computed(() => {
	const d = recentDiary.value;
	if (!d) return "";
	const ts = d.updatedAt || d.createdAt;
	const t = ts ? new Date(ts) : new Date();
	const ds = `${t.getFullYear()}.${String(t.getMonth() + 1).padStart(2, "0")}.${String(t.getDate()).padStart(2, "0")}`;
	const title = (d.title || "无标题").trim();
	return `${ds} — ${title}`;
});

async function loadRecent() {
	const rows = await listDiaries();
	recentDiary.value = rows[0] || null;
	if (recentCover.value && recentCover.value.startsWith("blob:")) {
		URL.revokeObjectURL(recentCover.value);
		recentCover.value = "";
	}
	const d = recentDiary.value;
	if (!d?.imageMediaIds?.length) return;
	const mid = d.imageMediaIds[0];
	const m = await getMediaBlob(mid);
	if (m?.blob) recentCover.value = URL.createObjectURL(m.blob);
}

async function refresh() {
	togetherDays.value = await getTogetherDayCount();
	upcoming.value = await getUpcomingImportantMilestones(14);
	await loadRecent();
}

onMounted(() => {
	refresh();
});

onShow(() => {
	refresh();
});

onUnmounted(() => {
	if (recentCover.value && recentCover.value.startsWith("blob:")) URL.revokeObjectURL(recentCover.value);
});

function go(path) {
	uni.navigateTo({ url: path });
}

function goAbout() {
	uni.navigateTo({ url: "/pages/about/index" });
}

function goMilestone() {
	touchMilestoneCheck();
	uni.navigateTo({ url: "/pages/milestone/list" });
}

function goNewDiary() {
	uni.navigateTo({ url: "/pages/diary/edit" });
}

function goRecentDetail() {
	const d = recentDiary.value;
	if (d?.id) uni.navigateTo({ url: `/pages/diary/detail?id=${d.id}` });
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #fef8f4;
	position: relative;
}
.body {
	padding: 24rpx 32rpx 120rpx;
}
.nav-brand {
	display: flex;
	align-items: center;
	gap: 8rpx;
	max-width: 520rpx;
}
.nav-title {
	font-size: 28rpx;
	font-weight: 700;
	color: #ef4444;
	letter-spacing: 0.02em;
}
.hero {
	text-align: center;
	padding: 24rpx 0 40rpx;
	position: relative;
	overflow: hidden;
}
.hero-blob {
	position: absolute;
	border-radius: 50%;
	filter: blur(48rpx);
	z-index: 0;
	pointer-events: none;
	opacity: 0.45;
}
.hero-blob--tl {
	width: 200rpx;
	height: 200rpx;
	background: rgba(255, 217, 225, 0.55);
	top: -40rpx;
	left: -20rpx;
}
.hero-blob--br {
	width: 240rpx;
	height: 240rpx;
	background: rgba(255, 217, 222, 0.4);
	bottom: -50rpx;
	right: -30rpx;
}
.tag {
	position: relative;
	z-index: 1;
	display: block;
	font-size: 20rpx;
	letter-spacing: 0.2em;
	color: #ab2c5d;
	font-weight: 600;
	margin-bottom: 24rpx;
	text-transform: uppercase;
}
.title-block {
	position: relative;
	z-index: 1;
}
.title-line {
	font-size: 56rpx;
	line-height: 1.25;
	color: #1d1b19;
	white-space: pre-line;
}
.title-accent {
	font-size: 56rpx;
	line-height: 1.25;
	color: #bc004f;
	font-style: italic;
}
.serif {
	font-family: Georgia, "Times New Roman", "Noto Serif", serif;
}
.pill {
	position: relative;
	z-index: 1;
	margin-top: 32rpx;
	display: inline-flex;
	align-items: center;
	gap: 16rpx;
	padding: 12rpx 28rpx;
	background: #fff;
	border-radius: 9999rpx;
	box-shadow: 0 8rpx 24rpx rgba(188, 0, 79, 0.06);
}
.avatars {
	display: flex;
	flex-direction: row;
}
.avatar {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	border: 4rpx solid #fef8f4;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: -16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}
.avatar:first-child {
	margin-left: 0;
}
.a1 {
	background: linear-gradient(135deg, #fecdd3, #fda4af);
}
.a2 {
	background: linear-gradient(135deg, #bfdbfe, #93c5fd);
}
.avatar-t {
	font-size: 22rpx;
	font-weight: 700;
	color: #1d1b19;
}
.pill-t {
	font-size: 24rpx;
	color: #564241;
	font-weight: 500;
}
.grid {
	margin-top: 16rpx;
	position: relative;
	z-index: 1;
}
.tile {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 48rpx 24rpx;
	background: #fff;
	border-radius: 32rpx;
	box-shadow: 0 8rpx 28rpx rgba(188, 0, 79, 0.05);
	min-height: 220rpx;
}
.tile--active {
	transform: scale(0.97);
}
.circle {
	width: 128rpx;
	height: 128rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 24rpx;
}
.label {
	font-size: 30rpx;
	font-weight: 600;
	color: #1d1b19;
}
.milestone-panel {
	position: relative;
	margin: 32rpx 0 0;
	padding: 48rpx 40rpx;
	background: #fff;
	border-radius: 32rpx;
	box-shadow: 0 12rpx 40rpx rgba(188, 0, 79, 0.06);
	overflow: hidden;
}
.milestone-watermark {
	position: absolute;
	top: 16rpx;
	right: 16rpx;
	opacity: 0.08;
	pointer-events: none;
}
.milestone-inner {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}
.together-line {
	font-size: 32rpx;
	color: #1d1b19;
	margin-top: 16rpx;
	line-height: 1.35;
}
.days {
	font-size: 96rpx;
	font-weight: 700;
	color: #bc004f;
	line-height: 1.1;
	margin: 12rpx 0 0;
}
.unit {
	font-size: 28rpx;
	color: #564241;
	margin-top: 4rpx;
}
.milestone-bar {
	width: 96rpx;
	height: 8rpx;
	background: #ffb1c5;
	border-radius: 999rpx;
	margin-top: 28rpx;
}
.polaroid-section {
	margin-top: 48rpx;
}
.polaroid-heading {
	display: block;
	font-size: 36rpx;
	color: #1d1b19;
	margin-bottom: 24rpx;
	padding-left: 8rpx;
}
.polaroid {
	width: 560rpx;
	max-width: 100%;
	margin: 0 auto;
	padding: 24rpx 24rpx 48rpx;
	background: #fff;
	border-radius: 32rpx;
	box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.08);
	transform: rotate(1.5deg);
}
.polaroid-photo {
	aspect-ratio: 1;
	border-radius: 16rpx;
	overflow: hidden;
	margin-bottom: 24rpx;
	background: #f8f2ef;
}
.polaroid-img {
	width: 100%;
	height: 100%;
}
.polaroid-placeholder {
	width: 100%;
	height: 100%;
	background: linear-gradient(160deg, #fce7f3, #fef8f4 50%, #ffe4e6);
}
.polaroid-cap {
	display: block;
	text-align: center;
	font-size: 26rpx;
	color: #564241;
	font-style: italic;
	line-height: 1.5;
}
.fab-heart {
	position: fixed;
	right: 32rpx;
	bottom: 120rpx;
	width: 112rpx;
	height: 112rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(188, 0, 79, 0.18);
	backdrop-filter: blur(12px);
	box-shadow: 0 12rpx 32rpx rgba(188, 0, 79, 0.12);
	z-index: 100;
}
</style>
