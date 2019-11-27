<template>
  <div class="scrollfix">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";

@Component
export default class ScrollFix extends Vue {
  private posY!: number;
  private maxscroll!: number;
  private scrollTop!: number;
  private data() {
    return {
      posY: 0,
      maxscroll: 0,
      scrollTop: 0
    };
  }

  private created(): void {
    document.addEventListener("touchstart", this.eventStart, {
      passive: false
    });
    document.addEventListener("touchmove", this.eventMove, { passive: false });
  }

  private destroyed(): void {
    document.addEventListener("touchstart", this.eventStart, {
      passive: false
    });
    document.addEventListener("touchmove", this.eventMove, { passive: false });
  }

  private eventStart(e: any): void {
    let elScroll = e.target.offsetParent || e.target;
    let events = e.touches[0] || e;
    this.posY = events.pageY;
    this.maxscroll = elScroll.scrollHeight - elScroll.clientHeight;
    this.scrollTop = elScroll.scrollTop;
  }

  private eventMove(e: any) {
    const excludeEl = document.querySelectorAll(".can-scroll");
    const isExclude = [].some.call(excludeEl, (el: any) =>
      el.contains(e.target)
    );
    if (isExclude) {
      let elScroll = e.target.offsetParent || e.target;
      // 当前的滚动高度
      this.scrollTop = elScroll.scrollTop;
      // 现在移动的垂直位置，用来判断是往上移动还是往下
      let events = e.touches[0] || e;
      // 移动距离
      let distanceY = events.pageY - this.posY;
      // 上下边缘检测
      if (distanceY > 0 && this.scrollTop == 0) {
        // 往上滑，并且到头
        // 禁止滚动的默认行为
        e.preventDefault();
        return;
      }
      // 下边缘检测
      if (distanceY < 0 && this.scrollTop + 1 >= this.maxscroll) {
        // 往下滑，并且到头
        // 禁止滚动的默认行为
        e.preventDefault();
        return;
      }
      return true;
    }
    e.preventDefault();
  }
}
</script>

<style lang="scss" scoped>
html {
  touch-action: none;
}
</style>
