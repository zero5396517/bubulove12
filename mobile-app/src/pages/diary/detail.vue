<template>
	<view class="page">
		<u-navbar title="日记详情" :is-back="true" :border-bottom="false" :background="{ background: 'rgba(255,255,255,0.92)' }">
			<template #right>
				<u-icon name="edit-pen" size="40" color="#bc004f" @click="goEdit"></u-icon>
			</template>
		</u-navbar>
		<view class="body app-safe-bottom" v-if="diary">
			<text class="title">{{ diary.title || "无标题" }}</text>
			<u-text :text="timeStr" type="info" size="24" margin="8rpx 0 24rpx" />
			<u-text v-if="diary.privacy === 'private'" text="私密" type="warning" size="24" margin="0 0 16rpx" />
			<text class="content">{{ diary.content }}</text>

			<view v-if="imageUrls.length" class="imgs">
				<image
					v-for="(u, i) in imageUrls"
					:key="i"
					:src="u"
					mode="aspectFill"
					class="img"
					@click="preview(i)"
				/>
			</view>

			<view v-if="diary.voiceMediaId" class="voice">
				<u-button size="small" type="primary" plain @click="togglePlay">{{ playing ? "停止" : "播放语音" }}</u-button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { get, getMediaBlob } from "../../utils/db.js";

const diaryId = ref("");
const diary = ref(null);
const imageUrls = ref([]);
const playing = ref(false);
let audio = null;

const timeStr = computed(() => {
	const ts = diary.value?.updatedAt || diary.value?.createdAt;
	if (!ts) return "";
	const d = new Date(ts);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
});

onLoad(async (q) => {
	diaryId.value = q.id || "";
	const d = await get("diaries", diaryId.value);
	diary.value = d;
	if (!d) return;
	if (d.imageMediaIds && d.imageMediaIds.length) {
		const urls = [];
		for (const mid of d.imageMediaIds) {
			const m = await getMediaBlob(mid);
			if (m && m.blob) urls.push(URL.createObjectURL(m.blob));
		}
		imageUrls.value = urls;
	}
});

onUnmounted(() => {
	imageUrls.value.forEach((u) => {
		if (u.startsWith("blob:")) URL.revokeObjectURL(u);
	});
	if (audio) {
		audio.stop();
		audio.destroy();
	}
});

function preview(i) {
	uni.previewImage({ urls: imageUrls.value, current: imageUrls.value[i] });
}

function goEdit() {
	uni.navigateTo({ url: `/pages/diary/edit?id=${diaryId.value}` });
}

async function togglePlay() {
	if (!diary.value?.voiceMediaId) return;
	const m = await getMediaBlob(diary.value.voiceMediaId);
	if (!m || !m.blob) {
		uni.$u.toast("语音不可用");
		return;
	}
	if (!audio) {
		audio = uni.createInnerAudioContext();
		audio.onEnded(() => {
			playing.value = false;
		});
	}
	if (playing.value) {
		audio.stop();
		playing.value = false;
		return;
	}
	audio.src = URL.createObjectURL(m.blob);
	audio.play();
	playing.value = true;
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
.title {
	font-size: 40rpx;
	font-weight: 700;
	color: #1d1b19;
}
.content {
	font-size: 30rpx;
	line-height: 1.7;
	color: #1d1b19;
	white-space: pre-wrap;
}
.imgs {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
	margin-top: 24rpx;
}
.img {
	width: 220rpx;
	height: 220rpx;
	border-radius: 12rpx;
	background: #f3ede9;
}
.voice {
	margin-top: 32rpx;
}
</style>
