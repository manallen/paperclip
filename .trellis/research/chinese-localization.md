# Paperclip 中文分支与本地端口

状态：已完成本地合并和端口配置；全站汉化仍有覆盖缺口。

## 维护方式与冻结版本

- 仓库：`/Users/zlb/orca/paperclip`。`origin` 是 `manallen/paperclip`，`upstream` 是 `paperclipai/paperclip`。
- `master` 保留官方主线，`zh-cn` 是中文维护分支。用户授权合入 PR #11251，并把本地访问端口设为 3333。
- 官方基线：`e977c3b9220bf6402ff100d01887478c81ffc81a`。
- 中文 PR：`54f703cecd78187f0a20401dbafe8cbdfc8f189e`。
- 合并提交：`bfbe08c02`。解决 34 个冲突文件，保留两条提交历史。
- 端口提交：`47457cb0a`。示例环境、服务端默认值、TS/JS 启动器和 Vite API 代理均改为 3333。本地被 Git 忽略的 `.env` 另已设置 `PORT=3333`。
- 用户原有 `.gitattributes`、`AGENTS.md` 和 Trellis/Claude/Codex 配置未纳入代码提交。

## 实现边界

- 保留当前官方的 Coordinator 导航、Monitoring 状态、状态投影、限流筛选、查询和认证恢复行为。
- 汉化沿用 PR 的 i18next 和 Vite 构建时字面量转换；补充当前页面需要的 10 对中英文键和 23 条字面量覆盖。
- 插件作者提供的 description 保持原文，只翻译系统缺省提示。API payload、状态枚举、用户数据、命令和路由保持原有语义。

## 已执行验证

- i18n、转换器、状态与筛选：8 个文件、53 项测试通过。
- 受影响的导航、列表、状态选择器和入门流程：10 个文件、434 项测试通过。
- 端口代理：1 个文件、5 项测试通过。合计 19 个定向文件、492 项测试。
- 前端类型检查和生产构建通过。初次类型检查缺少 Runner 依赖，补齐后通过；端口改动后再次通过受影响的类型检查、构建与代理测试，语言功能测试复用原结果。
- Node 环境读取确认 PORT=3333，API 代理默认目标匹配 `http://localhost:3333`。配置及启动文件通过 `node --check`。
- 使用真实前端构建产物、只读模拟 API，在 1280×800 和 390×844 检查中英文页面、输入保留、html lang、语言记忆和无横向溢出；未连接真实后端或提交登录。
- Orca 引用点击曾未命中语言按钮；通过 DOM 事件、键盘和页面状态断言继续验证，未因此修改应用逻辑。

## 已知缺口与证据

- 本轮开始时重新审计为 1129 条未覆盖；补译后的当前审计退出 1：100 条，0 个占位符不匹配。其中 76 条仅属原型/设计样例，8 条为保留原文的技术标识或品牌，16 条为已有具体单复数等运行时译文的通用语法模板。未修改审计规则，也未用相同原文映射掩盖技术标识。
- 原合并验收证据：`/tmp/codex-evidence/paperclip-11251-merge/`；本轮完整清单、分类、退出码、日志和截图：`/tmp/codex-evidence/paperclip-zh-cn-maintenance/`。

## 后续同步

在 master 上执行 `git pull --ff-only upstream master`，再切回 zh-cn 执行 `git merge master`。按新源码补充翻译并检查受影响页面；不要拿旧 PR 页面覆盖官方新版功能。

## 2026-11-14 产品界面补译

- 独立本地提交：`262d0a5b6`（13 个本轮 UI 文件）；未推送。
- `legacy-zh-CN.overrides.json` 追加 1105 条，覆盖任务、智能体、设置、密钥、连接、错误、确认提示，并修正“秘密/价值/直播”等不合产品语境的译文。基础 legacy 词典、en.json、zh-CN.json、其他语言、构建转换器均未改动。
- 保持截图所示上游样式；6 个显示组件局部接入已有 `translateUiLiteral()`：ActiveAgentsPanel、ActivityCharts、CoordinatorSidebar、MobileBottomNav、ui/command、Secrets。未改 className、样式值、业务判断、权限、路由、数据结构或 3333 端口配置。置顶菜单只翻译第一方导航标签，保留智能体名称；语言变化会重新计算标签。
- 修正 `LegacyLiteralLocalizer.tsx` 模板优先级：按固定文字长度优先，再沿用正则长度排序，防止多占位符的宽泛模板抢先匹配“Name for …”“Open image: …”和运行计数。对比当前全部 legacy 模板样例，10 个结果得到正确匹配，0 个原正确样例退化。
- 生产匹配器对 1105 条新增映射的样例逐项核验通过，0 个匹配冲突；保留每条源短语占位符名称和数量。将英语单复数等纯语法插值拆成具体运行时词典变体，静态审计仍会列出这些通用模板。
- 本轮最终验证：i18n 5 文件/20 项、相关显示组件与转换器 6 文件/66 项，共 11 文件/86 项测试通过；UI 类型检查和构建通过；diff --check 通过。运行时间漏译与模板抢先匹配均先复现失败，再验证通过。构建仍有 Vite 原有配置兼容/分包体积警告。
- 使用本地真实 Vite 前端加隔离的只读模拟 API，检查仪表板、密钥列表和新建密钥对话框。桌面 1280×800、窄屏 390×844；中文显示、html lang、中英文切换、输入原样保留、无横向溢出通过，并人工查看截图。未接入真实实例数据；模拟端拒绝所有写请求，验收后已停止预览并关闭临时页面。
- 仍有静态审计不覆盖的动态对象标签/拆分句子：DecisionHistoryPanel 和 CoordinatorNeedsYou 的选项/分组/空状态、AgentRosterFilters 的第一方默认标签、MachineSignInSetup 的方法/提示、ArtifactsV1Filters/ArtifactTile 的标签和时间事实行、ProposalsTab 的到期提示、OnboardingWizard 的 Retry sign-in、Secrets 的 pushToast 对象标题及部分分片计数句。这些保留为下一批显示边界维护范围，不能把静态审计分类解释成全站完全汉化。详细路径与行号在本轮 review-0/1/2a/2b.md；本轮已修复的导航、运行时间、图例和密钥表单边界以当前源码为准。
- 用户原有 .gitattributes、AGENTS.md、dev-runner 三个文件和 Claude/Codex/Trellis 配置保持原有未提交状态；未进行分支合并、push 或部署。Trellis 研究与日志沿用本地知识文件状态，不纳入翻译代码提交。
