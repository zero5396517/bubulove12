<template>
	<view class="page">
		<u-navbar
			:title="isNew ? '新建日记' : '编辑日记'"
			:is-back="true"
			:border-bottom="false"
			:background="{ background: 'rgba(254,248,244,0.92)' }"
		>
			<template #right>
				<u-button
					type="primary"
					size="mini"
					:plain="true"
					:loading="saving"
					:custom-style="{ color: '#bc004f', borderColor: 'transparent' }"
					@click="save"
				>
					保存
				</u-button>
			</template>
		</u-navbar>
		<view class="body app-safe-bottom">
			<view class="date-row">
				<view class="date-block">
					<text class="date-num serif">{{ dateParts.day }}</text>
					<text class="date-mon">{{ dateParts.mon }}</text>
				</view>
				<view class="date-right">
					<text class="date-week">{{ dateParts.weekday }}</text>
					<text class="date-sub">{{ dateParts.ym }}</text>
				</view>
			</view>

			<u-form :model="form" ref="formRef">
				<view class="editor-block">
					<u-input
						v-model="form.title"
						border="none"
						placeholder="难忘的一天…"
						:custom-style="titleInputStyle"
					></u-input>
					<u-input
						v-model="form.content"
						type="textarea"
						border="none"
						placeholder="写下此刻的心情…"
						:height="360"
						:custom-style="bodyInputStyle"
					></u-input>
				</view>
				<view class="meta-panel">
					<u-form-item label="隐私" border-bottom>
						<u-radio-group v-model="form.privacy">
							<u-radio label="公开" value="public" active-color="#bc004f"></u-radio>
							<u-radio label="私密" value="private" active-color="#bc004f"></u-radio>
						</u-radio-group>
					</u-form-item>
				</view>
			</u-form>

			<u-text text="图片" size="28" color="#564241" margin="32rpx 0 16rpx" />
			<view class="upload-bento">
				<view class="bento-main">
					<u-upload
						:file-list="fileList"
						:auto-upload="false"
						action=""
						:max-count="9"
						:max-size="5 * 1024 * 1024"
						multiple
						@on-choose-complete="onChooseComplete"
						@on-remove="onRemoveImg"
					></u-upload>
				</view>
			</view>

			<u-text text="语音" size="28" color="#564241" margin="32rpx 0 16rpx" />
			<view class="voice-row">
				<u-button size="small" type="primary" :loading="recording" @click="toggleRecord">
					{{ recording ? "停止录音" : "录音" }}
				</u-button>
				<u-button v-if="form.voiceMediaId" size="small" @click="clearVoice">删除语音</u-button>
			</view>
			<u-text v-if="form.voiceMediaId" text="已保存一条语音" type="info" size="24" />

			<u-gap height="48" bg-color="transparent"></u-gap>
			<u-button type="primary" :loading="saving" :custom-style="saveBtnStyle" @click="save">保存日记</u-button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import {
	createDiaryDraft,
	get,
	saveDiary,
	saveMediaBlob,
	getMediaBlob,
	remove,
} from "../../utils/db.js";
import { compressImageFile } from "../../utils/imageCompress.js";

const formRef = ref(null);
const form = ref(createDiaryDraft());
const fileList = ref([]);
const mediaIds = ref([]);
const recording = ref(false);
const saving = ref(false);
const recManager = ref(null);
let diaryId = "";

const isNew = computed(() => !diaryId);

const titleInputStyle = {
	fontSize: "40rpx",
	fontFamily: "Georgia, 'Times New Roman', serif",
	color: "#1d1b19",
	padding: "0",
};
const bodyInputStyle = {
	fontSize: "30rpx",
	fontFamily: "Georgia, 'Times New Roman', serif",
	lineHeight: "1.75",
	color: "#1d1b19",
	padding: "0",
};
const saveBtnStyle = {
	width: "100%",
	height: "96rpx",
	borderRadius: "9999rpx",
	background: "linear-gradient(90deg, #bc004f 0%, #ff5986 100%)",
	boxShadow: "0 12rpx 32rpx rgba(188, 0, 79, 0.2)",
	fontWeight: "700",
	letterSpacing: "0.15em",
};

const dateParts = computed(() => {
	const ts = form.value.updatedAt || form.value.createdAt || Date.now();
	const d = new Date(ts);
	const wk = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const mon = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	return {
		day: String(d.getDate()),
		mon: mon[d.getMonth()],
		weekday: wk[d.getDay()],
		ym: `${d.toLocaleString("en-US", { month: "long" })} ${d.getFullYear()}`,
	};
});

onLoad((q) => {
	diaryId = q.id || "";
});

onMounted(async () => {
	if (diaryId) {
		const d = await get("diaries", diaryId);
		if (d) {
			form.value = { ...d };
			mediaIds.value = [...(d.imageMediaIds || [])];
			fileList.value = [];
			for (const mid of mediaIds.value) {
				const m = await getMediaBlob(mid);
				if (m && m.blob) {
					const url = URL.createObjectURL(m.blob);
					fileList.value.push({ url, progress: 100 });
				}
			}
		}
	}
	recManager.value = uni.getRecorderManager();
	recManager.value.onStop(async (res) => {
		recording.value = false;
		try {
			const path = res.tempFilePath;
			const blob = await fetch(path).then((r) => r.blob());
			const old = form.value.voiceMediaId;
			if (old) await remove("media", old);
			const id = await saveMediaBlob({ type: "audio", blob });
			form.value.voiceMediaId = id;
			uni.$u.toast("语音已保存");
		} catch (e) {
			console.error(e);
			uni.$u.toast("语音保存失败");
		}
	});
	recManager.value.onError(() => {
		recording.value = false;
		uni.$u.toast("录音失败");
	});
});

async function onChooseComplete(list) {
	const prev = mediaIds.value.length;
	for (let i = prev; i < list.length; i++) {
		const item = list[i];
		try {
			const blob = await compressImageFile(item.url);
			const id = await saveMediaBlob({ type: "image", blob });
			mediaIds.value.push(id);
			if (item.url && item.url.startsWith("blob:")) URL.revokeObjectURL(item.url);
			item.url = URL.createObjectURL(blob);
			item.progress = 100;
		} catch (e) {
			console.error(e);
			uni.$u.toast("图片处理失败");
		}
	}
	form.value.imageMediaIds = [...mediaIds.value];
}

function onRemoveImg(index) {
	const id = mediaIds.value[index];
	if (id) remove("media", id);
	mediaIds.value.splice(index, 1);
	form.value.imageMediaIds = [...mediaIds.value];
}

function toggleRecord() {
	if (!recManager.value) return;
	if (recording.value) {
		recManager.value.stop();
		return;
	}
	recording.value = true;
	recManager.value.start({ duration: 60000, format: "mp3" });
}

async function clearVoice() {
	const id = form.value.voiceMediaId;
	if (id) await remove("media", id);
	form.value.voiceMediaId = null;
}

async function save() {
	saving.value = true;
	try {
		form.value.imageMediaIds = [...mediaIds.value];
		await saveDiary(form.value);
		uni.$u.toast("已保存");
		setTimeout(() => uni.navigateBack(), 400);
	} catch (e) {
		console.error(e);
		uni.$u.toast("保存失败");
	} finally {
		saving.value = false;
	}
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
.date-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 32rpx;
}
.date-block {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20rpx 28rpx;
	background: rgba(188, 0, 79, 0.06);
	border-radius: 24rpx;
}
.date-num {
	font-size: 72rpx;
	font-weight: 700;
	color: #bc004f;
	line-height: 1;
}
.date-mon {
	font-size: 18rpx;
	font-weight: 700;
	letter-spacing: 0.2em;
	color: rgba(188, 0, 79, 0.55);
	margin-top: 8rpx;
}
.date-right {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}
.date-week {
	font-size: 28rpx;
	font-weight: 600;
	color: #1d1b19;
}
.date-sub {
	font-size: 24rpx;
	color: #564241;
}
.serif {
	font-family: Georgia, "Times New Roman", serif;
}
.editor-block {
	margin-bottom: 16rpx;
}
.meta-panel {
	margin-top: 8rpx;
	background: #fff;
	border-radius: 24rpx;
	padding: 8rpx 24rpx 0;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}
.upload-bento {
	background: #fff;
	border-radius: 24rpx;
	padding: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}
.bento-main {
	width: 100%;
}
.voice-row {
	display: flex;
	gap: 16rpx;
	margin: 16rpx 0;
	flex-wrap: wrap;
}
</style>
