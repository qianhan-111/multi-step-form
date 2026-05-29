# 题目11：多步骤表单（Vue3 + Vue Router + Pinia）

## 1. 项目说明

本项目对应实践任务 **题目11：多步骤表单**，实现内容包括：

- 使用 **Vue Router** 管理 3 个步骤页面
- 使用 **Pinia** 暂存每一步表单数据
- 支持 **上一步 / 下一步** 跳转
- 支持 **数据回显**
- 最后一步 **汇总全部数据并提交**
- 包含 **步骤条组件** 显示当前进度

## 2. 运行方式

```bash
npm install
npm run dev
```

默认开发地址：

```text
http://localhost:5173
```

部署链接：

## 3. 核心要求对应文件

### 3.1 使用路由管理三个步骤

- `src/router/index.js`
- `src/layouts/FormLayout.vue`
- `src/views/StepOneView.vue`
- `src/views/StepTwoView.vue`
- `src/views/StepThreeView.vue`

说明：

- `/step-1` 对应基本信息
- `/step-2` 对应联系方式
- `/step-3` 对应确认提交
- 路由守卫会阻止用户跳过未完成的步骤

### 3.2 每步数据暂存到 Pinia

- `src/stores/multiStepForm.js`
- `src/pinia.js`

说明：

- `stepOne`、`stepTwo`、`stepThree` 分别存储三步表单数据
- 在不同页面切换时，已填数据会自动保留

### 3.3 上一步 / 下一步 / 数据回显

- `src/views/StepOneView.vue`
- `src/views/StepTwoView.vue`
- `src/views/StepThreeView.vue`

说明：

- 第一步完成后进入第二步
- 第二步支持返回第一步
- 第三步会展示前两步的汇总信息

### 3.4 步骤条组件显示当前进度

- `src/components/StepProgress.vue`

说明：

- 根据当前路由高亮当前步骤
- 已完成步骤显示完成状态
- 未解锁步骤不可直接点击跳转

## 4. 关键代码说明

1. 使用 `meta.step` 标记每个路由步骤，再结合 Pinia 中的 `firstAvailableStep()` 判断当前路由是否可进入。
2. 三个步骤的数据全部存放在同一个 Pinia store 中，页面切换时不丢失，天然支持数据回显。
3. 最后一步通过 `submitForm()` 模拟异步提交，既能体现表单汇总，也能展示提交状态切换。
4. 每个步骤页面都在本地维护 `errors`，并在用户尝试进入下一步后进行实时校验更新。

## 5. 技术难点总结

### 难点1：如何防止用户跳步

- 问题：用户可能直接修改地址进入第三步。
- 解决：在 `src/router/index.js` 中加入路由守卫，未完成前置步骤时自动跳回可进入的步骤。

### 难点2：如何在多页面之间保留表单数据

- 问题：表单拆成多个路由页面后，切换页面容易丢数据。
- 解决：所有步骤数据统一存在 Pinia 的 `multiStepForm` store 中。

### 难点3：如何实现最终汇总提交

- 问题：最后一步不仅要展示当前字段，还要展示前两步所有数据。
- 解决：通过 `currentSummary` 汇总 getter，统一读取前面所有步骤的数据。

## 6. 提交建议

你提交这道题时，建议准备：

- 完整代码
- `package.json`
- 运行截图
- 关键代码说明
- 技术难点总结

建议截图至少 3 张：

1. 第一步页面
2. 第二步页面（体现数据回显）
3. 第三步页面或提交成功状态

## 7. 文件结构

```text
task11-multi-step-form
├─ index.html
├─ package.json
├─ vite.config.js
├─ src
│  ├─ App.vue
│  ├─ main.js
│  ├─ pinia.js
│  ├─ styles.css
│  ├─ components
│  │  └─ StepProgress.vue
│  ├─ layouts
│  │  └─ FormLayout.vue
│  ├─ router
│  │  └─ index.js
│  ├─ stores
│  │  └─ multiStepForm.js
│  └─ views
│     ├─ StepOneView.vue
│     ├─ StepTwoView.vue
│     └─ StepThreeView.vue
└─ README.md
```
