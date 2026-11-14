// @vitest-environment jsdom

import { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import { setLocale } from ".";
import {
  translateLegacyLiteral,
  translateUiLiteral,
  useUiLiteralLocale,
} from "./LegacyLiteralLocalizer";

afterEach(async () => setLocale("en"));

describe("static UI literal localization", () => {
  it("translates exact literals and preserves dynamic template values", () => {
    expect(translateLegacyLiteral("Advanced Permissions")).toBe("高级权限");
    expect(translateLegacyLiteral("Acting on behalf of Alice")).toBe("代表 Alice 行事");
    expect(translateLegacyLiteral("收藏 Chief of staff")).toBeNull();
  });

  it("only translates in the Chinese locale", async () => {
    await setLocale("zh-CN");
    expect(translateUiLiteral("Delete")).toBe("删除");
    expect(translateUiLiteral("A user-authored name")).toBe("A user-authored name");

    await setLocale("en");
    expect(translateUiLiteral("Delete")).toBe("Delete");
  });

  it("prefers specific product templates over broad templates and preserves interpolated names", () => {
    expect(translateLegacyLiteral("Name for OPENAI_API_KEY")).toBe("OPENAI_API_KEY 的名称");
    expect(translateLegacyLiteral("2 imported agents are paused and will not run.")).toBe("2 个导入的智能体已暂停，不会运行。");
    expect(translateLegacyLiteral("2 more active/recent runs")).toBe("还有 2 次正在进行或近期的运行");
    expect(translateLegacyLiteral("Open image: A user's image")).toBe("打开图片：A user's image");
    expect(translateLegacyLiteral("Open task: A user's task")).toBe("打开任务：A user's task");
    expect(translateLegacyLiteral("Open Plan draft in the sidebar")).toBe("在侧边栏打开 Plan draft");
    expect(translateLegacyLiteral("(1 sub-task)")).toBe("（1 个子任务）");
    expect(translateLegacyLiteral("(2 sub-tasks)")).toBe("（2 个子任务）");
  });

  it("uses product context for ambiguous UI terms", async () => {
    await setLocale("zh-CN");
    expect(translateUiLiteral("Disabled")).toBe("未启用");
    expect(translateUiLiteral("New secret")).toBe("新建密钥");
    expect(translateUiLiteral("Choose zip")).toBe("选择 ZIP 包");
    expect(translateUiLiteral("Alpha")).toBe("测试版");
  });

  it("updates literals without resetting component state", async () => {
    const container = document.createElement("div");
    const root = createRoot(container);

    function Harness() {
      useUiLiteralLocale();
      const [value, setValue] = useState("unsaved");
      return (
        <button onClick={() => setValue("edited")}>
          {translateUiLiteral("Delete")}: {value}
        </button>
      );
    }

    await act(async () => root.render(<Harness />));
    await act(async () => container.querySelector("button")?.click());
    await act(async () => setLocale("zh-CN"));

    expect(container.textContent).toBe("删除: edited");
    await act(async () => root.unmount());
  });
});
