<template>
  <div ref="pulldown" class="pulldown">
    <svg
      v-show="svgshow"
      ref="J_svg"
      class="pulldownloading"
      :class="{ active: activeClass, hidescale: hidescaleClass }"
      :style="{ top: svgTop + 'px' }"
    >
      <g id="J_svg_g">
        <marker
          id="J_svg_marker"
          markerWidth="10"
          markerHeight="10"
          refX="0"
          refY="5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            id="J_svg_marker"
            ref="J_svg_marker_path"
            d="M0,0 L0,10 L5,5 L0,0"
            style="fill: #07D2F4"
          ></path>
        </marker>
        <path
          stroke-width="2"
          stroke-linecap="round"
          ref="J_svg_path"
          marker-end="url(#J_svg_marker)"
          d="M20,9 A11,11 0 1,1 10.5,14.5"
          style="stroke: #07D2F4; fill: none;"
        ></path>
        <circle
          id="J_svg_circle"
          class="path"
          fill="none"
          stroke-width="2"
          stroke-linecap="round"
          cx="25"
          cy="25"
          r="11"
        ></circle>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class PullDown extends Vue {
  @Prop() private func!: any;
  private svgshow: boolean = false;
  private svgTop: number = -44; // 距顶位置
  private startPos: number = 0; // 滑动开始位置
  private isTop: boolean = false; // 顶部判断标志
  private pullDownLoadDataTimer: any = null; // 定时器
  private pullDownLoading: any = null; // 下拉动画
  private isSwipeDown: boolean = false; // 确定向下滑
  private touchDistance: number = 0; // 滑动距离
  private TOUCH_DISTANCE: number = 200; // 规定滑动加载距离
  private touchDistanceFlag: boolean = true; // 滑动方向判断标志
  private activeClass: boolean = false; //旋转动画
  private hidescaleClass: boolean = false; //缩小隐藏动画
  private mounted(): void {
    document.body.addEventListener("touchstart", this.tStart, {
      passive: false
    });
    document.body.addEventListener("touchend", this.tEnd, { passive: false });
    document.body.addEventListener("touchmove", this.tMove, { passive: false });
  }
  tStart(e: any): void {
    // 防止重复快速下拉
    clearTimeout(this.pullDownLoadDataTimer);
    this.startPos = e.touches[0].pageY;
    if (
      (document.body.scrollTop ||
        document.documentElement.scrollTop ||
        window.pageYOffset) <= 0
    ) {
      this.isTop = true;
    } else {
      this.isTop = false;
    }
    // 点击时动画与高度初始化
    this.svgshow = false;
    this.activeClass = false;
    this.hidescaleClass = false;
    (this.$refs.J_svg as any).style.top = this.svgTop + "px";
  }
  tEnd(e: any): void {
    (this.$refs.J_svg as any).style.transition = "all 0.4s";
    // 达到下拉阈值 启动数据加载
    if (this.isSwipeDown) {
      if (this.touchDistance >= this.TOUCH_DISTANCE) {
        (this.$refs.J_svg as any).style.top =
          this.svgTop + this.TOUCH_DISTANCE / 3 + "px";
        this.activeClass = true;
        clearTimeout(this.pullDownLoadDataTimer);
        this.pullDownLoadDataTimer = setTimeout(() => {
          let timeout: any = setTimeout(() => {
            console.error("下拉刷新超时");
            this.hide();
          }, 10000);
          this.func().then(() => {
            clearTimeout(timeout);
            this.hide();
          });
        }, 500);
      } else {
        (this.$refs.J_svg as any).style.top = this.svgTop + "px";
      }
    }
    this.touchDistanceFlag = true;
    this.isSwipeDown = false;
  }
  tMove(e: any): void {
    (this.$refs.J_svg as any).style.transition = "none";
    var py = e.touches[0].pageY;
    this.touchDistance = py - this.startPos;
    // 根据用户开始的滑动手势判断用户是向下滑还是向上滑
    if (this.isTop && this.touchDistanceFlag && this.touchDistance > 0) {
      this.isSwipeDown = true;
      // 根据刚开始的滑动值进行判断，后面用户无论怎么滑都不会触发浏览器滚动。
      this.touchDistanceFlag = false;
    }
    if (this.isTop && this.isSwipeDown) {
      this.svgshow = true;
      if (this.touchDistance >= this.TOUCH_DISTANCE + 80) {
        this.touchDistance = this.TOUCH_DISTANCE + 80;
      }
      // 滑动时透明度变化
      (this.$refs.J_svg as any).style.opacity =
        this.touchDistance / this.TOUCH_DISTANCE;
      // 滑动时图标高度变化
      (this.$refs.J_svg as any).style.top =
        this.svgTop + this.touchDistance / 3 + "px";
      // 滑动时图标旋转度变化
      (this.$refs.J_svg as any).style.transform =
        "rotate(" + (this.touchDistance / this.TOUCH_DISTANCE) * 720 + "deg)";
      e.preventDefault();
    }
  }
  hide(): void {
    this.hidescaleClass = true;
    this.activeClass = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.pulldown {
  .pulldownloading {
    display: block;
    width: 40px;
    height: 40px;
    position: absolute;
    top: 1.4rem;
    left: 50%;
    z-index: 99;
    margin-left: -20px;
    opacity: 0;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 0px 10px #ccc;
    // transition: top 0.5s;
  }
  .pulldownloading.active {
    animation: myrotate 1s linear infinite;
  }
  .hidescale {
    animation: scaleload 0.1s linear forwards;
  }
  @keyframes scaleload {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(0);
      opacity: 0;
    }
  }
  @keyframes myrotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
