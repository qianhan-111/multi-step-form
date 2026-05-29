import { createRouter, createWebHashHistory } from "vue-router";
import { pinia } from "../pinia";
import { useMultiStepFormStore } from "../stores/multiStepForm";

const stepRouteNameMap = {
  1: "step-one",
  2: "step-two",
  3: "step-three"
};

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../layouts/FormLayout.vue"),
      children: [
        {
          path: "",
          redirect: { name: "step-one" }
        },
        {
          path: "step-1",
          name: "step-one",
          component: () => import("../views/StepOneView.vue"),
          meta: {
            step: 1,
            title: "基本信息"
          }
        },
        {
          path: "step-2",
          name: "step-two",
          component: () => import("../views/StepTwoView.vue"),
          meta: {
            step: 2,
            title: "联系方式"
          }
        },
        {
          path: "step-3",
          name: "step-three",
          component: () => import("../views/StepThreeView.vue"),
          meta: {
            step: 3,
            title: "确认提交"
          }
        }
      ]
    }
  ]
});

router.beforeEach((to) => {
  const targetStep = to.meta.step;
  if (!targetStep) {
    return true;
  }

  const formStore = useMultiStepFormStore(pinia);
  const availableStep = formStore.firstAvailableStep(targetStep);

  if (availableStep !== targetStep) {
    return { name: stepRouteNameMap[availableStep] };
  }

  return true;
});

export default router;
