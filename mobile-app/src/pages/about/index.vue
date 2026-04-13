<template>
	<view class="page">
		<u-navbar title="隐私说明" :is-back="true" :border-bottom="false" :background="{ background: 'rgba(255,255,255,0.88)' }" />
		<view class="body app-safe-bottom">
			<u-text
				text="纯前端 Web 应用：数据仅存本机，符合产品「移动端优先、离线核心能力」定位。"
				size="26"
				color="#564241"
				margin="0 0 32rpx"
			/>
			<view class="panel">
				<u-text text="本地存储" size="24" color="#bc004f" margin="0 0 16rpx" />
				<u-text
					text="恋爱日记、相册、里程碑等数据保存在本机浏览器的 IndexedDB 与本地存储中，不会自动上传到服务器。"
					size="28"
					color="#564241"
				/>
			</view>
			<view class="panel">
				<u-text text="多设备与备份" size="24" color="#bc004f" margin="0 0 16rpx" />
				<u-text text="更换浏览器或清理站点数据可能导致内容丢失；重要内容请自行备份。" size="28" color="#564241" />
			</view>
		</view>
	</view>
</template>

<script setup></script>

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
	padding: 32rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 8rpx 28rpx rgba(0, 0, 0, 0.04);
}
</style>
