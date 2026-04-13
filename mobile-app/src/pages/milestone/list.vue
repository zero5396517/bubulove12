<template>
	<view class="page">
		<u-navbar title="相爱里程碑" :is-back="true" :border-bottom="false" :background="{ background: 'rgba(255,255,255,0.88)' }">
			<template #right>
				<u-icon name="plus" size="44" color="#bc004f" @click="goEdit('')"></u-icon>
			</template>
		</u-navbar>
		<view class="body app-safe-bottom">
			<view class="hero-counter">
				<u-text text="Our Journey Together" size="20" color="#ab2c5d" />
				<view class="counter-wrap">
					<text class="counter-num serif">{{ togetherDays }}</text>
					<view class="days-badge"><text class="days-badge-t">DAYS</text></view>
				</view>
				<text class="hero-sub serif">Since our first hello.</text>
			</view>

			<view v-if="upcoming.length" class="bento">
				<view class="bento-card bento-card--light" @click="goDetail(upcoming[0].id)">
					<text class="bento-label">Upcoming</text>
					<text class="bento-title serif">{{ upcoming[0].title || "纪念日" }}</text>
					<view class="bento-row">
						<text class="bento-big">{{ daysLeft0 }}</text>
						<text class="bento-unit">天后</text>
					</view>
				</view>
				<view v-if="upcoming[1]" class="bento-card bento-card--solid" @click="goDetail(upcoming[1].id)">
					<u-text text="Next Celebration" size="20" color="rgba(255,255,255,0.85)" />
					<text class="bento-celebrate serif">下一刻</text>
					<view class="bento-date-pill">
						<text class="bento-date-t">{{ formatEvent(upcoming[1]) }}</text>
					</view>
				</view>
			</view>

			<view v-if="rows.length === 0" class="empty-wrap">
				<u-empty mode="list" text="还没有里程碑"></u-empty>
			</view>
			<view v-else class="timeline">
				<view class="timeline-axis"></view>
				<view v-for="(m, i) in rows" :key="m.id" class="tl-item" @click="goDetail(m.id)">
					<view class="tl-dot-wrap">
						<view class="tl-dot"></view>
					</view>
					<view class="tl-card" :class="{ 'tl-card--alt': i % 2 === 1 }">
						<text class="tl-date serif">{{ formatDateShort(m) }}</text>
						<view class="tl-head">
							<u-icon name="calendar" size="28" color="#ab2c5d"></u-icon>
							<text class="tl-title serif">{{ m.title || "未命名" }}</text>
						</view>
						<u-text v-if="m.important" text="重要" type="warning" size="22" margin="0 0 8rpx" />
						<u-text :text="snippet(m.note)" size="26" color="#564241" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { onPullDownRefresh, onShow } from "@dcloudio/uni-app";
import { listMilestones } from "../../utils/db.js";
import { getTogetherDayCount } from "../../utils/together.js";
import { getUpcomingImportantMilestones } from "../../utils/reminders.js";

const rows = ref([]);
const togetherDays = ref(0);
const upcoming = ref([]);

function startOfDay(ms) {
	const d = new Date(ms);
	d.setHours(0, 0, 0, 0);
	return d.getTime();
}

const daysLeft0 = computed(() => {
	const m = upcoming.value[0];
	if (!m || !m._nextEventDay) return "—";
	const n = Math.ceil((startOfDay(m._nextEventDay) - startOfDay(Date.now())) / 86400000);
	return n >= 0 ? String(n) : "0";
});

async function load() {
	rows.value = await listMilestones();
	togetherDays.value = await getTogetherDayCount();
	upcoming.value = await getUpcomingImportantMilestones(400);
}

onMounted(() => load());
onShow(() => load());

onPullDownRefresh(async () => {
	await load();
	uni.stopPullDownRefresh();
});

function formatDateShort(m) {
	const d = new Date(m.dateMs || 0);
	return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function formatEvent(m) {
	const t = m._nextEventDay || m.dateMs;
	if (!t) return "";
	const d = new Date(t);
	return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function snippet(s) {
	if (!s) return "";
	return s.length > 80 ? s.slice(0, 80) + "…" : s;
}

function goEdit(id) {
	const q = id ? `?id=${id}` : "";
	uni.navigateTo({ url: `/pages/milestone/edit${q}` });
}

function goDetail(id) {
	uni.navigateTo({ url: `/pages/milestone/detail?id=${id}` });
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
.hero-counter {
	text-align: center;
	margin-bottom: 40rpx;
}
.counter-wrap {
	position: relative;
	display: inline-block;
	margin-top: 16rpx;
}
.counter-num {
	font-size: 120rpx;
	font-weight: 700;
	color: #bc004f;
	line-height: 1;
}
.days-badge {
	position: absolute;
	right: -56rpx;
	top: 8rpx;
	background: #fd6c9c;
	padding: 8rpx 16rpx;
	border-radius: 999rpx;
	transform: rotate(12deg);
}
.days-badge-t {
	font-size: 22rpx;
	font-weight: 700;
	color: #fff;
}
.hero-sub {
	display: block;
	margin-top: 16rpx;
	font-size: 30rpx;
	color: #564241;
	font-style: italic;
}
.bento {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
	margin-bottom: 48rpx;
}
.bento-card {
	border-radius: 24rpx;
	padding: 32rpx;
	min-height: 200rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	box-shadow: 0 12rpx 32rpx rgba(188, 0, 79, 0.06);
}
.bento-card--light {
	background: #fff;
}
.bento-card--solid {
	background: linear-gradient(145deg, #bc004f, #ff5986);
}
.bento-label {
	font-size: 20rpx;
	color: #897271;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}
.bento-card--solid .bento-label {
	color: rgba(255, 255, 255, 0.85);
}
.bento-title {
	font-size: 32rpx;
	font-weight: 700;
	color: #1d1b19;
	margin-top: 8rpx;
}
.bento-row {
	display: flex;
	align-items: baseline;
	gap: 8rpx;
	margin-top: 16rpx;
}
.bento-big {
	font-size: 56rpx;
	font-weight: 700;
	color: #bc004f;
}
.bento-unit {
	font-size: 24rpx;
	color: #564241;
}
.bento-celebrate {
	font-size: 36rpx;
	color: #fff;
	font-style: italic;
	margin: 12rpx 0;
}
.bento-date-pill {
	align-self: flex-start;
	background: rgba(255, 255, 255, 0.2);
	padding: 12rpx 24rpx;
	border-radius: 999rpx;
}
.bento-date-t {
	font-size: 24rpx;
	color: #fff;
}
.empty-wrap {
	padding: 48rpx 0;
}
.timeline {
	position: relative;
	padding-left: 24rpx;
}
.timeline-axis {
	position: absolute;
	left: 8rpx;
	top: 0;
	bottom: 0;
	width: 6rpx;
	border-radius: 999rpx;
	background: linear-gradient(
		180deg,
		rgba(220, 192, 191, 0) 0%,
		rgba(220, 192, 191, 0.5) 12%,
		rgba(220, 192, 191, 0.5) 88%,
		rgba(220, 192, 191, 0) 100%
	);
}
.tl-item {
	position: relative;
	padding-left: 40rpx;
	margin-bottom: 48rpx;
}
.tl-dot-wrap {
	position: absolute;
	left: -8rpx;
	top: 24rpx;
	width: 32rpx;
	height: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2;
}
.tl-dot {
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
	background: #fef8f4;
	border: 4rpx solid #bc004f;
	box-shadow: 0 0 0 6rpx rgba(188, 0, 79, 0.12);
}
.tl-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 28rpx 32rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);
}
.tl-card--alt {
	background: #f8f2ef;
}
.tl-date {
	display: block;
	font-size: 28rpx;
	color: #dcc0bf;
	font-style: italic;
	margin-bottom: 12rpx;
}
.tl-head {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 12rpx;
}
.tl-title {
	font-size: 32rpx;
	font-weight: 700;
	color: #1d1b19;
}
</style>
