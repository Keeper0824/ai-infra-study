import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";

const workspaceDir = "E:/Lessons/研究生/预学习材料/ai-infra-study";
const skillDir = "C:/Users/sun/.codex/plugins/cache/openai-primary-runtime/presentations/26.1105.12137/skills/presentations";
const artifactToolPath = "C:/Users/sun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";
const runtimePython = "C:/Users/sun/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe";
process.env.RUNTIME_NODE = "C:/Users/sun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe";
process.env.RUNTIME_NODE_MODULES = "C:/Users/sun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
process.env.RUNTIME_BIN_DIR = "C:/Users/sun/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override";
const { FileBlob, PresentationFile } = await import(pathToFileURL(artifactToolPath).href);
const { finalizePresentation } = await import(pathToFileURL(path.join(skillDir, "container_tools/artifact_tool_utils.mjs")).href);

const inputPath = path.join(workspaceDir, "inputs/poster-edit/原始海报_图文增强版.pptx");
const effectPath = path.join(workspaceDir, "outputs/poster-edit/assets/效果指标总览.png");
const costPath = path.join(workspaceDir, "outputs/poster-edit/assets/资源开销总览.png");
const buildDir = path.join(workspaceDir, ".tmp/poster-edit/build");
const outputDir = path.join(workspaceDir, "outputs/poster-edit");
const candidatePath = path.join(buildDir, "candidate.pptx");
const finalPath = path.join(outputDir, "作业3_孙浩然_126034910388_A0海报_结果图精简版.pptx");
const receiptPath = path.join(buildDir, "poster-edit.validation.json");

await fs.mkdir(buildDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });

const sourceBytes = await fs.readFile(inputPath);
const referenceSha256 = crypto.createHash("sha256").update(sourceBytes).digest("hex");
const presentation = await PresentationFile.importPptx(await FileBlob.load(inputPath));
const slide = presentation.resolve("sl/y90nupkv");

const before = await presentation.export({ slide, format: "png", scale: 1 });
await fs.writeFile(path.join(buildDir, "before.png"), new Uint8Array(await before.arrayBuffer()));

const effectImage = presentation.resolve("im/zidgfixg");
const costImage = presentation.resolve("im/xgzi9wzu");

const effectBytes = await fs.readFile(effectPath);
effectImage.replace({
  blob: effectBytes,
  contentType: "image/png",
  alt: "语音与通信任务的四项效果指标总览",
  fit: "contain",
});
effectImage.frame = { left: 120, top: 2061.77, width: 2935, height: 668.23 };
effectImage.crop = { left: 0, top: 0, right: 0, bottom: 0 };
effectImage.geometry = "rect";
effectImage.borderRadius = 0;
effectImage.rotation = 0;
effectImage.lockAspectRatio = false;

const costBytes = await fs.readFile(costPath);
costImage.replace({
  blob: costBytes,
  contentType: "image/png",
  alt: "四种模型的参数量与六十秒语音推理耗时总览",
  fit: "contain",
});
costImage.frame = { left: 1995.83, top: 2750, width: 1058.34, height: 452 };
costImage.crop = { left: 0, top: 0, right: 0, bottom: 0 };
costImage.geometry = "rect";
costImage.borderRadius = 0;
costImage.rotation = 0;
costImage.lockAspectRatio = false;

presentation.delete([
  "im/0jmxony1",
  "sh/mx4v6hoz",
  "sh/p4bu5s76",
]);

const after = await presentation.export({ slide, format: "png", scale: 1 });
await fs.writeFile(path.join(buildDir, "after.png"), new Uint8Array(await after.arrayBuffer()));
const layout = await slide.export({ format: "layout" });
await fs.writeFile(path.join(buildDir, "after.layout.json"), await layout.text(), "utf8");

await (await PresentationFile.exportPptx(presentation)).save(candidatePath);

const result = await finalizePresentation({
  explicitTotalSlideCount: 1,
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable: runtimePython,
  integrityValidatorPath: path.join(skillDir, "container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(skillDir, "container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs: [
    "--expected-slide-size-emu", "30275213,42803763",
    "--validate-bullet-geometry",
    "--validate-heading-fit",
  ],
  fontPolicy: {
    basis: "reference",
    families: ["Microsoft YaHei"],
    referencePath: inputPath,
    referenceSha256,
  },
  verifyArtifactToolImport: true,
  receiptPath,
});

console.log(JSON.stringify({
  finalPath,
  candidatePath,
  beforePreview: path.join(buildDir, "before.png"),
  afterPreview: path.join(buildDir, "after.png"),
  receiptPath,
  finalizer: result,
}, null, 2));
