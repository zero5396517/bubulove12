<script>
export default {
	onLaunch() {},
	onShow() {},
	onHide() {},
};
</script>

<style lang="scss">
@import "uview-pro/index.scss";

page {
	min-height: 100%;
	background-color: #fef8f4;
	font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
	touch-action: manipulation;
}

.app-safe-bottom {
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}

.app-safe-top {
	padding-top: constant(safe-area-inset-top);
	padding-top: env(safe-area-inset-top);
}
</style>
