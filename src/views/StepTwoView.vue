<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useMultiStepFormStore } from "../stores/multiStepForm";

const router = useRouter();
const formStore = useMultiStepFormStore();

const hasTriedNext = ref(false);
const errors = ref({});

watch(
  () => formStore.stepTwo,
  () => {
    formStore.clearSubmission();
    if (hasTriedNext.value) {
      errors.value = formStore.validateStep(2);
    }
  },
  { deep: true }
);

function goPrevious() {
  router.push({ name: "step-one" });
}

function goNext() {
  hasTriedNext.value = true;
  errors.value = formStore.validateStep(2);

  if (Object.keys(errors.value).length > 0) {
    return;
  }

  router.push({ name: "step-three" });
}
</script>

<template>
  <div class="step-page">
    <div class="step-page__head">
      <div>
        <p class="step-page__kicker">Step 2</p>
        <h2>填写联系方式</h2>
      </div>
      <p class="step-page__tip"></p>
    </div>

    <div class="form-grid">
      <label class="field">
        <span>邮箱</span>
        <input
          v-model.trim="formStore.stepTwo.email"
          class="input"
          type="email"
          placeholder="例如：hello@example.com"
        />
        <small v-if="errors.email" class="error-text">{{ errors.email }}</small>
      </label>

      <label class="field">
        <span>手机号</span>
        <input
          v-model.trim="formStore.stepTwo.phone"
          class="input"
          type="tel"
          placeholder="请输入 11 位手机号"
        />
        <small v-if="errors.phone" class="error-text">{{ errors.phone }}</small>
      </label>

      <label class="field field--wide">
        <span>所在城市</span>
        <input v-model.trim="formStore.stepTwo.city" class="input" type="text" placeholder="例如：上海" />
        <small v-if="errors.city" class="error-text">{{ errors.city }}</small>
      </label>
    </div>

    <div class="actions">
      <button type="button" class="button button--ghost" @click="goPrevious">上一步</button>
      <button type="button" class="button button--primary" @click="goNext">下一步</button>
    </div>
  </div>
</template>

<style scoped>
.step-page__head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.step-page__kicker {
  margin: 0 0 8px;
  color: var(--accent-strong);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.step-page__head h2 {
  margin: 0;
  font-size: 1.7rem;
}

.step-page__tip {
  max-width: 320px;
  margin: 0;
  color: var(--text-soft);
  line-height: 1.7;
}

@media (max-width: 768px) {
  .step-page__head {
    flex-direction: column;
  }
}
</style>
