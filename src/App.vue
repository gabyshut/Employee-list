<template>
  <div id="app">
    <EmployeeView />
  </div>
</template>

<script>
import EmployeeView from './views/EmployeeView.vue';

export default {
  name: 'App',
  components: {
    EmployeeView
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
  padding: 20px;
}
</style>