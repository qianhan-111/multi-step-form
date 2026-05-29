import { defineStore } from "pinia";

function createInitialState() {
  return {
    stepOne: {
      fullName: "",
      major: "",
      stage: ""
    },
    stepTwo: {
      email: "",
      phone: "",
      city: ""
    },
    stepThree: {
      track: "",
      motivation: "",
      agree: false
    },
    submitStatus: "idle",
    submittedAt: "",
    submittedSnapshot: null
  };
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^1[3-9]\d{9}$/;

export const useMultiStepFormStore = defineStore("multi-step-form", {
  state: () => createInitialState(),
  getters: {
    currentSummary(state) {
      return {
        ...state.stepOne,
        ...state.stepTwo,
        ...state.stepThree
      };
    }
  },
  actions: {
    validateStep(step) {
      switch (step) {
        case 1:
          return this.validateStepOne();
        case 2:
          return this.validateStepTwo();
        case 3:
          return this.validateStepThree();
        default:
          return {};
      }
    },
    validateStepOne() {
      const errors = {};

      if (!this.stepOne.fullName.trim()) {
        errors.fullName = "请输入姓名";
      }

      if (!this.stepOne.major.trim()) {
        errors.major = "请输入专业";
      }

      if (!this.stepOne.stage) {
        errors.stage = "请选择当前阶段";
      }

      return errors;
    },
    validateStepTwo() {
      const errors = {};

      if (!this.stepTwo.email.trim()) {
        errors.email = "请输入邮箱";
      } else if (!emailPattern.test(this.stepTwo.email.trim())) {
        errors.email = "邮箱格式不正确";
      }

      if (!this.stepTwo.phone.trim()) {
        errors.phone = "请输入手机号";
      } else if (!phonePattern.test(this.stepTwo.phone.trim())) {
        errors.phone = "请输入有效的 11 位手机号";
      }

      if (!this.stepTwo.city.trim()) {
        errors.city = "请输入所在城市";
      }

      return errors;
    },
    validateStepThree() {
      const errors = {};

      if (!this.stepThree.track) {
        errors.track = "请选择意向方向";
      }

      if (!this.stepThree.motivation.trim()) {
        errors.motivation = "请输入报名说明";
      } else if (this.stepThree.motivation.trim().length < 15) {
        errors.motivation = "报名说明至少填写 15 个字";
      }

      if (!this.stepThree.agree) {
        errors.agree = "请先勾选同意条款";
      }

      return errors;
    },
    isStepComplete(step) {
      return Object.keys(this.validateStep(step)).length === 0;
    },
    firstAvailableStep(targetStep) {
      for (let step = 1; step < targetStep; step += 1) {
        if (!this.isStepComplete(step)) {
          return step;
        }
      }

      return targetStep;
    },
    async submitForm() {
      const hasBlockingError =
        !this.isStepComplete(1) ||
        !this.isStepComplete(2) ||
        !this.isStepComplete(3);

      if (hasBlockingError) {
        throw new Error("表单尚未填写完整");
      }

      this.submitStatus = "submitting";

      await new Promise((resolve) => {
        window.setTimeout(resolve, 900);
      });

      this.submittedAt = new Date().toLocaleString("zh-CN");
      this.submittedSnapshot = JSON.parse(JSON.stringify(this.currentSummary));
      this.submitStatus = "success";
    },
    clearSubmission() {
      if (this.submitStatus !== "success") {
        return;
      }

      this.submitStatus = "idle";
      this.submittedAt = "";
      this.submittedSnapshot = null;
    },
    resetForm() {
      Object.assign(this, createInitialState());
    }
  }
});
