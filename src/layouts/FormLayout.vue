<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import StepProgress from "../components/StepProgress.vue";

const route = useRoute();

const currentStep = computed(() => Number(route.meta.step || 1));
</script>

<template>
  <div class="shell">
    <div class="shell__mesh"></div>
    <main class="app-frame">
      <header class="hero">
        <div>
          <p class="hero__eyebrow">题目11 · Vue Router + Pinia</p>
          <h1>多步骤表单</h1>
          <p class="hero__desc">
            使用路由拆分三个步骤，表单数据暂存在 Pinia 中，支持上一步、下一步和最终汇总提交。
          </p>
        </div>
        <div class="hero__badge">
          <span>{{ currentStep }}/3</span>
          <small>当前进度</small>
        </div>
      </header>

      <StepProgress :current-step="currentStep" />

      <section class="panel">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.hero__eyebrow {
  margin: 0 0 10px;
  color: var(--accent-strong);
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
}

.hero__desc {
  max-width: 760px;
  margin: 12px 0 0;
  color: var(--text-soft);
  font-size: 1rem;
  line-height: 1.7;
}

.hero__badge {
  min-width: 116px;
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(246, 242, 255, 0.92));
  box-shadow: 0 18px 40px rgba(40, 25, 72, 0.14);
  text-align: center;
}

.hero__badge span {
  display: block;
  color: var(--text-main);
  font-size: 2rem;
  font-weight: 700;
}

.hero__badge small {
  color: var(--text-soft);
  font-size: 0.82rem;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
  }

  .hero__badge {
    width: 100%;
  }
}
</style>
