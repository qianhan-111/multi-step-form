<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useMultiStepFormStore } from "../stores/multiStepForm";

const router = useRouter();
const formStore = useMultiStepFormStore();

const hasTriedNext = ref(false);
const errors = ref({});

watch(
  () => formStore.stepOne,
  () => {
    formStore.clearSubmission();
    if (hasTriedNext.value) {
      errors.value = formStore.validateStep(1);
    }
  },
  { deep: true }
);

function goNext() {
  hasTriedNext.value = true;
  errors.value = formStore.validateStep(1);

  if (Object.keys(errors.value).length > 0) {
    return;
  }

  router.push({ name: "step-two" });
}
</script>

<template>
  <div class="step-page">
    <div class="step-page__head">
      <div>
        <p class="step-page__kicker">Step 1</p>
        <h2>填写基本信息</h2>
      </div>
      <p class="step-page__tip">完成基础资料</p>
    </div>

    <div class="form-grid">
      <label class="field">
        <span>姓名</span>
        <input v-model.trim="formStore.stepOne.fullName" class="input" type="text" placeholder="例如：张三" />
        <small v-if="errors.fullName" class="error-text">{{ errors.fullName }}</small>
      </label>

      <label class="field">
        <span>专业</span>
        <input v-model.trim="formStore.stepOne.major" class="input" type="text" placeholder="例如：软件工程" />
        <small v-if="errors.major" class="error-text">{{ errors.major }}</small>
      </label>

      <label class="field field--wide">
        <span>当前阶段</span>
        <select v-model="formStore.stepOne.stage" class="input">
          <option disabled value="">请选择当前阶段</option>
          <option value="大一">大一</option>
          <option value="大二">大二</option>
          <option value="大三">大三</option>
          <option value="大四">大四</option>
          <option value="研究生">研究生</option>
          <option value="已工作">已工作</option>
        </select>
        <small v-if="errors.stage" class="error-text">{{ errors.stage }}</small>
      </label>
    </div>

    <div class="actions">
      <div class="actions__hint">完成后点击下一步。</div>
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
