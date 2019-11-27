<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title" />
  </div>
</template>

<script lang="ts">
import "normalize.css";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {
  private created(): void {
    (window as any).initTouchSlop = () => {
      console.log("initTouchSlop");
    };
    (window as any).viewDidDisAppear = () => {
      console.log("viewDidDisAppear");
    };
    (window as any).viewDidAppear = () => {
      console.log("viewDidAppear");
    };
    (window as any).onRestart = () => {
      console.log("onRestart");
    };
  }
}
</script>

<style lang="scss">
@import "./style/index.scss";
#app {
  max-width: 750px;
  margin: auto;
  height: 100%;
}
</style>
