<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <Header />
  <div class="main-container">
    <div class="container">
      <RouterView />
    </div>
  </div>

</template>

<script>
import Header from './components/Header.vue';
</script>

<style scoped>
.main-container {
  width: 100%;
  height: 100%;
}

.main-container > .container{
  margin: 0 auto;
  padding: 40px;
  width: 1400px;
}
</style>
