<template>
	<view class="page">
		<u-navbar title="里程碑详情" :is-back="true" :border-bottom="false" :background="{ background: 'rgba(255,255,255,0.88)' }">
			<template #right>
				<u-icon name="edit-pen" size="40" color="#bc004f" @click="goEdit"></u-icon>
			</template>
		</u-navbar>
		<view class="body app-safe-bottom" v-if="m">
			<view class="head-block">
				<u-text v-if="m.important" text="重要时刻" size="22" color="#bc004f" margin="0 0 12rpx" />
				<text class="title serif">{{ m.title || "未命名" }}</text>
				<text class="date-line serif">{{ dateLine }}</text>
			</view>
			<view class="note-card">
				<text class="note">{{ m.note }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { get } from "../../utils/db.js";
import { solarMsToLunarLabel } from "../../utils/lunarFmt.js";

const mid = ref("");
const m = ref(null);

const dateLine = computed(() => {
	if (!m.value) return "";
	const d = new Date(m.value.dateMs || 0);
	const s = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
	if (m.value.calendarType === "lunar") {
		return `${s} · ${m.value.lunarLabel || solarMsToLunarLabel(m.value.dateMs)}`;
	}
	return s;
});

onLoad(async (q) => {
	mid.value = q.id || "";
	m.value = await get("milestones", mid.value);
});

function goEdit() {
	uni.navigateTo({ url: `/pages/milestone/edit?id=${mid.value}` });
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
.head-block {
	padding: 32rpx 0 24rpx;
}
.title {
	display: block;
	font-size: 44rpx;
	font-weight: 700;
	color: #1d1b19;
	line-height: 1.35;
}
.date-line {
	display: block;
	margin-top: 16rpx;
	font-size: 28rpx;
	color: #564241;
}
.serif {
	font-family: Georgia, "Times New Roman", serif;
}
.note-card {
	margin-top: 8rpx;
	padding: 40rpx 36rpx;
	background: #fff;
	border-radius: 24rpx;
	box-shadow: 0 8rpx 28rpx rgba(188, 0, 79, 0.06);
}
.note {
	font-size: 30rpx;
	line-height: 1.75;
	color: #1d1b19;
	white-space: pre-wrap;
}
</style>
