<template>
	<view class="page">
		<u-navbar :title="isNew ? '新建里程碑' : '编辑里程碑'" :is-back="true" :border-bottom="false" :background="{ background: 'rgba(255,255,255,0.88)' }" />
		<view class="body app-safe-bottom">
			<view class="panel">
				<u-form :model="form" ref="formRef">
					<u-form-item label="标题" border-bottom>
						<u-input v-model="form.title" border="none" placeholder="例如：第一次牵手"></u-input>
					</u-form-item>
					<u-form-item label="说明" border-bottom>
						<u-input v-model="form.note" type="textarea" border="none" placeholder="记录这一刻" :height="160"></u-input>
					</u-form-item>
					<u-form-item label="历法" border-bottom>
						<u-radio-group v-model="form.calendarType">
							<u-radio label="公历" value="solar" active-color="#bc004f"></u-radio>
							<u-radio label="农历展示" value="lunar" active-color="#bc004f"></u-radio>
						</u-radio-group>
					</u-form-item>
					<u-form-item label="日期" border-bottom>
						<u-button size="mini" type="primary" plain @click="showPicker = true">{{ dateLabel || "选择日期" }}</u-button>
					</u-form-item>
					<u-form-item label="重要时刻" border-bottom>
						<u-switch v-model="form.important" active-color="#bc004f"></u-switch>
					</u-form-item>
					<u-form-item label="提前提醒(天)" border-bottom>
						<u-input v-model="remindStr" type="number" border="none" placeholder="3"></u-input>
					</u-form-item>
				</u-form>
			</view>

			<u-checkbox v-model="anchorAsStart" label="设为「在一起」起算日" active-color="#bc004f"></u-checkbox>

			<u-picker
				v-model="showPicker"
				mode="time"
				:params="{ year: true, month: true, day: true, timestamp: true }"
				title="选择日期"
				@confirm="onPick"
			></u-picker>

			<u-gap height="32" bg-color="transparent"></u-gap>
			<u-button type="primary" :loading="saving" :custom-style="saveBtnStyle" @click="save">保存</u-button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { createMilestoneDraft, get, saveMilestone } from "../../utils/db.js";
import { setLoveAnchorMs } from "../../utils/prefs.js";
import { solarMsToLunarLabel } from "../../utils/lunarFmt.js";

const formRef = ref(null);
const form = ref(createMilestoneDraft());
const showPicker = ref(false);
const saving = ref(false);
const remindStr = ref("3");
const anchorAsStart = ref(false);
let milestoneId = "";

const saveBtnStyle = {
	width: "100%",
	height: "96rpx",
	borderRadius: "9999rpx",
	background: "linear-gradient(90deg, #bc004f 0%, #ff5986 100%)",
	boxShadow: "0 12rpx 32rpx rgba(188, 0, 79, 0.15)",
};

const isNew = computed(() => !milestoneId);

const dateLabel = computed(() => {
	const d = new Date(form.value.dateMs || 0);
	if (!form.value.dateMs) return "";
	const s = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	if (form.value.calendarType === "lunar") {
		const lun = solarMsToLunarLabel(form.value.dateMs);
		return `${s}（${lun}）`;
	}
	return s;
});

onLoad((q) => {
	milestoneId = q.id || "";
});

onMounted(async () => {
	if (milestoneId) {
		const m = await get("milestones", milestoneId);
		if (m) {
			form.value = { ...m };
			remindStr.value = String(m.remindDaysBefore ?? 3);
		}
	}
});

function onPick(e) {
	const sec = e && e.timestamp;
	if (sec) {
		form.value.dateMs = sec * 1000;
		form.value.lunarLabel = solarMsToLunarLabel(form.value.dateMs);
	}
	showPicker.value = false;
}

async function save() {
	saving.value = true;
	try {
		form.value.remindDaysBefore = Math.max(0, parseInt(remindStr.value, 10) || 0);
		if (form.value.calendarType === "lunar" && !form.value.lunarLabel) {
			form.value.lunarLabel = solarMsToLunarLabel(form.value.dateMs);
		}
		await saveMilestone(form.value);
		if (anchorAsStart.value) {
			setLoveAnchorMs(form.value.dateMs);
		}
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
.panel {
	background: #fff;
	border-radius: 24rpx;
	padding: 8rpx 24rpx 0;
	margin-bottom: 24rpx;
	box-shadow: 0 8rpx 28rpx rgba(0, 0, 0, 0.04);
}
</style>
