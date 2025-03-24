<template>
    <header class="header">
    <div class="header-content">
      <div class="logo">
        <img src="@/assets/db-guard.png" alt="Element logo" />
      </div>
      <div class="header-nav">
        <RouterLink tag="li" class="header-nav-item" active-class="active" to="/">
          <el-link type="primary" :underline="false">数据库表</el-link>
        </RouterLink>
        <!-- <RouterLink tag="li" class="header-nav-item" active-class="active" to="about"><el-link type="primary"
            :underline="false">应用管理</el-link></RouterLink> -->
        <RouterLink tag="li" class="header-nav-item" active-class="active" to="db-config"><el-link type="primary"
            :underline="false">数据库配置</el-link></RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>


<style scoped>
.header {
  /* background-color: #fff; */
  width: 100%;
  position: sticky;
  height: 60px;
  top: 0;
  left: 0;
  z-index: 999;
  border-bottom: 1px solid var(--el-border-color);

}

.header>.header-content {
  width: 1400px;
  height: 60px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;

  background-image: radial-gradient(transparent 1px, rgb(255, 255, 255) 1px);
  background-size: 4px 5px;
  backdrop-filter: saturate(50%) blur(5px);

}

.header-content>.logo {
  background-color: white;
  width: 160px;
  height: 60px;
  display: flex;
  align-items: center;
}

.header-content>.logo>img {
  width: 140px;
  height: 40px;
}

.header-nav>ul {
  display: flex;
  list-style: none;
}

.header-nav>.header-nav-item {
  height: 60px;
  padding: 0 30px;
  line-height: 60px;
  display: inline-block;
}

.header-nav>.header-nav-item.active {
  box-sizing: border-box;
  border-bottom: 2px solid #409EFF;
}
</style>