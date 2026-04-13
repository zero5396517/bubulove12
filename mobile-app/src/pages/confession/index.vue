<template>
	<view class="page">
		<u-navbar title="爱的告白" :is-back="true" :border-bottom="false" :background="{ background: 'rgba(250,250,249,0.85)' }" />

		<view class="hero">
			<image
				class="hero-img"
				src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUYOYE3eHaXprsTo-dGLpTzqTvWBMS2zBMP0akeoFAK2TL6TDAtqbDcF7QTu_AU4k37OjXU7H1Wcydn3UM5EoRlCIGIE-gdJTCPWhHZ8bANHkjmapnqmJpaIqEpUxxVUMxjKdVHiyjrvFIOqE87Tj_flw9k5CVpLNxsXYhyJYF2Ww-f7BbYbyatE1zHBYHkp-C6u4HixlMz1z-iIUIIO0nW8okA9gFa0yXPAE1BBTvx5MmG2shvgV2zcTzkoitUBhVYdA6Bo1_tNo"
				mode="aspectFill"
			/>
			<view class="hero-grad"></view>
			<view class="hero-text">
				<u-text text="Private Sanctuary" size="20" color="#bc004f" />
				<text class="hero-title serif">爱的告白</text>
				<text class="hero-sub serif">Every whisper of the heart, captured in time.</text>
			</view>
		</view>

		<view class="body app-safe-bottom">
			<view class="paper">
				<u-icon class="quote-mark" name="chat" size="100" color="rgba(188,0,79,0.12)"></u-icon>
				<u-text text="Message of the Day" size="22" color="rgba(188,0,79,0.65)" />
				<view class="quote-rule"></view>
				<view class="article serif">
					<text class="p">致我最亲爱的：</text>
					<text class="p indent">
						在这本日记里，每一页都写满了我们的故事。但有些话，我想用最郑重的方式告诉你。在那场夏天的午后，当光影穿过树叶洒在你的侧脸，我突然意识到，那一刻的宁静就是我追寻许久的永恒。
					</text>
					<text class="p indent">
						爱你不仅仅是爱你的光芒，更是爱你面对风暴时的坚定，爱你平凡日子里的琐碎，爱你所有的不完美。
					</text>
					<view class="sign">
						<text class="name">你的布布</text>
						<u-text text="Forever" type="info" size="22" margin="8rpx 0 0" />
					</view>
				</view>
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
.serif {
	font-family: Georgia, "Times New Roman", serif;
}
.hero {
	position: relative;
	height: 46vh;
	min-height: 320rpx;
}
.hero-img {
	width: 100%;
	height: 100%;
}
.hero-grad {
	position: absolute;
	inset: 0;
	background: linear-gradient(to bottom, rgba(254, 248, 244, 0) 0%, rgba(254, 248, 244, 1) 100%);
}
.hero-text {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 0 32rpx 32rpx;
}
.hero-title {
	display: block;
	font-size: 64rpx;
	font-weight: 700;
	color: #1d1b19;
	line-height: 1.15;
	margin-top: 8rpx;
}
.hero-sub {
	display: block;
	font-size: 28rpx;
	color: #564241;
	font-style: italic;
	margin-top: 8rpx;
}
.body {
	padding: 0 32rpx 48rpx;
	margin-top: -24rpx;
	position: relative;
	z-index: 2;
}
.paper {
	position: relative;
	background: #fff;
	border-radius: 32rpx;
	padding: 48rpx 40rpx 56rpx;
	box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.06);
	overflow: hidden;
}
.quote-mark {
	position: absolute;
	top: 24rpx;
	right: 24rpx;
	pointer-events: none;
}
.quote-rule {
	width: 80rpx;
	height: 4rpx;
	background: rgba(188, 0, 79, 0.2);
	border-radius: 999rpx;
	margin: 16rpx 0 32rpx;
}
.article {
	font-size: 30rpx;
	line-height: 1.85;
	color: #1d1b19;
}
.p {
	display: block;
	margin-bottom: 24rpx;
}
.indent {
	padding-left: 2em;
}
.sign {
	margin-top: 40rpx;
	text-align: right;
}
.name {
	font-size: 30rpx;
	font-style: italic;
	font-weight: 700;
	color: #bc004f;
}
</style>
