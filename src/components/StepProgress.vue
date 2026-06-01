<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useMultiStepFormStore } from "../stores/multiStepForm";

const props = defineProps({
  currentStep: {
    type: Number,
    default: 1
  }
});

const router = useRouter();
const formStore = useMultiStepFormStore();

const steps = [
  {
    id: 1,
    title: "基本信息",
    desc: "姓名、专业、阶段"
  },
  {
    id: 2,
    title: "联系方式",
    desc: "邮箱、手机、城市"
  },
  {
    id: 3,
    title: "确认提交",
    desc: "方向、说明、总览"
  }
];

const stepRouteNameMap = {
  1: "step-one",
  2: "step-two",
  3: "step-three"
};

const progressWidth = computed(() => `${((props.currentStep - 1) / (steps.length - 1)) * 100}%`);

function getState(stepId) {
  if (props.currentStep === stepId) {
    return "active";
  }

  if (formStore.isStepComplete(stepId)) {
    return "done";
  }

  if (formStore.firstAvailableStep(stepId) !== stepId) {
    return "locked";
  }

  return "idle";
}

function goToStep(stepId) {
  if (formStore.firstAvailableStep(stepId) !== stepId) {
    return;
  }

  router.push({ name: stepRouteNameMap[stepId] });
}
</script>

<template>
  <section class="stepper">
    <div class="stepper__track">
      <div class="stepper__track-fill" :style="{ width: progressWidth }"></div>
    </div>

    <div class="stepper__grid">
      <button
        v-for="step in steps"
        :key="step.id"
        type="button"
        class="stepper__item"
        :class="`stepper__item--${getState(step.id)}`"
        @click="goToStep(step.id)"
      >
        <span class="stepper__index">{{ step.id }}</span>
        <span class="stepper__content">
          <strong>{{ step.title }}</strong>
          <small>{{ step.desc }}</small>
        </span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.stepper {
  position: relative;
  margin-bottom: 22px;
  padding: 22px 18px 18px;
  border: 1px solid var(--border);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(14px);
  box-shadow: 0 16px 32px rgba(56, 38, 92, 0.08);
}

.stepper__track {
  position: absolute;
  top: 38px;
  left: calc(100% / 6);
  right: calc(100% / 6);
  height: 3px;
  border-radius: 999px;
  background: rgba(182, 160, 226, 0.25);
}

.stepper__track-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #6d4aff, #38bdf8);
  transition: width 0.25s ease;
}

.stepper__grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.stepper__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 0 12px 8px;
  border: 0;
  border-radius: 18px;
  background: transparent;
  text-align: center;
  cursor: pointer;
  transition: transform 0.18s ease, background 0.18s ease;
}

.stepper__item:hover {
  transform: translateY(-1px);
  background: rgba(109, 74, 255, 0.06);
}

.stepper__item--locked {
  cursor: not-allowed;
  opacity: 0.62;
}

.stepper__item--locked:hover {
  transform: none;
  background: transparent;
}

.stepper__index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: white;
  color: var(--text-soft);
  font-size: 0.92rem;
  font-weight: 700;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.stepper__content {
  display: grid;
  gap: 2px;
  justify-items: center;
  margin-top: 6px;
}

.stepper__content strong {
  color: var(--text-main);
  font-size: 0.98rem;
}

.stepper__content small {
  color: var(--text-soft);
  font-size: 0.82rem;
}

.stepper__item--active .stepper__index,
.stepper__item--done .stepper__index {
  border-color: transparent;
  color: white;
  background: linear-gradient(135deg, #6d4aff, #22c55e);
}

.stepper__item--active {
  background: rgba(109, 74, 255, 0.08);
}

@media (max-width: 820px) {
  .stepper__track {
    display: none;
  }

  .stepper__grid {
    grid-template-columns: 1fr;
  }
}
</style>
