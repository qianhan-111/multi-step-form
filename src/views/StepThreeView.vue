<script setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useMultiStepFormStore } from "../stores/multiStepForm";

const router = useRouter();
const formStore = useMultiStepFormStore();

const hasTriedSubmit = ref(false);
const errors = ref({});

const summaryItems = computed(() => [
  { label: "姓名", value: formStore.stepOne.fullName || "-" },
  { label: "专业", value: formStore.stepOne.major || "-" },
  { label: "当前阶段", value: formStore.stepOne.stage || "-" },
  { label: "邮箱", value: formStore.stepTwo.email || "-" },
  { label: "手机号", value: formStore.stepTwo.phone || "-" },
  { label: "城市", value: formStore.stepTwo.city || "-" }
]);

watch(
  () => formStore.stepThree,
  () => {
    formStore.clearSubmission();
    if (hasTriedSubmit.value) {
      errors.value = formStore.validateStep(3);
    }
  },
  { deep: true }
);

function goPrevious() {
  router.push({ name: "step-two" });
}

async function submitForm() {
  hasTriedSubmit.value = true;
  errors.value = formStore.validateStep(3);

  if (Object.keys(errors.value).length > 0) {
    return;
  }

  await formStore.submitForm();
}

function restartForm() {
  formStore.resetForm();
  router.push({ name: "step-one" });
}
</script>

<template>
  <div class="step-page">
    <div class="step-page__head">
      <div>
        <p class="step-page__kicker">Step 3</p>
        <h2>确认信息并提交</h2>
      </div>
      <p class="step-page__tip"></p>
    </div>

    <div class="review-card">
      <div class="review-card__head">
        <h3>信息总览</h3>
        <span class="review-card__tag"></span>
      </div>

      <div class="review-grid">
        <div v-for="item in summaryItems" :key="item.label" class="review-item">
          <small>{{ item.label }}</small>
          <strong>{{ item.value }}</strong>
        </div>
      </div>
    </div>

    <div class="form-grid">
      <label class="field">
        <span>意向方向</span>
        <select v-model="formStore.stepThree.track" class="input">
          <option disabled value="">请选择方向</option>
          <option value="前端开发">前端开发</option>
          <option value="后端开发">后端开发</option>
          <option value="全栈开发">全栈开发</option>
          <option value="产品设计">产品设计</option>
        </select>
        <small v-if="errors.track" class="error-text">{{ errors.track }}</small>
      </label>

      <label class="field field--wide">
        <span>报名说明</span>
        <textarea
          v-model.trim="formStore.stepThree.motivation"
          class="input input--textarea"
          placeholder="简要说明你的学习目标、项目经历或报名原因"
        ></textarea>
        <small v-if="errors.motivation" class="error-text">{{ errors.motivation }}</small>
      </label>
    </div>

    <label class="check-row">
      <input v-model="formStore.stepThree.agree" type="checkbox" />
      <span>我确认以上信息真实有效，并同意提交该报名表。</span>
    </label>
    <small v-if="errors.agree" class="error-text">{{ errors.agree }}</small>

    <div v-if="formStore.submitStatus === 'success'" class="status-banner status-banner--success">
      <strong>提交成功</strong>
      <span>表单已于 {{ formStore.submittedAt }} 完成汇总提交。</span>
    </div>

    <div class="actions">
      <button type="button" class="button button--ghost" @click="goPrevious">上一步</button>
      <div class="actions__group">
        <button type="button" class="button button--light" @click="restartForm">重新填写</button>
        <button
          type="button"
          class="button button--primary"
          :disabled="formStore.submitStatus === 'submitting'"
          @click="submitForm"
        >
          {{ formStore.submitStatus === "submitting" ? "提交中..." : "提交全部数据" }}
        </button>
      </div>
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

.review-card {
  margin-bottom: 20px;
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(247, 245, 255, 0.92), rgba(255, 255, 255, 0.96));
}

.review-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.review-card__head h3 {
  margin: 0;
  font-size: 1.08rem;
}

.review-card__tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(109, 74, 255, 0.1);
  color: var(--accent-strong);
  font-size: 0.82rem;
  font-weight: 600;
}

.review-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.review-item {
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.85);
}

.review-item small {
  display: block;
  margin-bottom: 6px;
  color: var(--text-soft);
}

.review-item strong {
  color: var(--text-main);
  font-size: 1rem;
}

.check-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 4px;
  color: var(--text-main);
  line-height: 1.7;
}

.check-row input {
  margin-top: 4px;
}

.status-banner {
  display: grid;
  gap: 4px;
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 18px;
}

.status-banner--success {
  border: 1px solid rgba(34, 197, 94, 0.28);
  background: rgba(34, 197, 94, 0.08);
  color: #166534;
}

.actions__group {
  display: flex;
  gap: 10px;
}

@media (max-width: 860px) {
  .review-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .step-page__head {
    flex-direction: column;
  }

  .review-grid {
    grid-template-columns: 1fr;
  }

  .actions__group {
    width: 100%;
  }

  .actions__group .button {
    flex: 1;
  }
}
</style>
