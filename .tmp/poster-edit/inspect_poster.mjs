import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const artifactToolPath = "C:/Users/sun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";
const { FileBlob, PresentationFile } = await import(pathToFileURL(artifactToolPath).href);

const workspace = "E:/Lessons/研究生/预学习材料/ai-infra-study";
const input = path.join(workspace, "inputs/poster-edit/原始海报_图文增强版.pptx");
const outDir = path.join(workspace, ".tmp/poster-edit/inspection");
await fs.mkdir(outDir, { recursive: true });

const presentation = await PresentationFile.importPptx(await FileBlob.load(input));
const inspected = await presentation.inspect({
  select: "$.slides[*]",
  include: [
    "id", "index", "title", "position", "layout",
    "elements.id", "elements.kind", "elements.name", "elements.text",
    "elements.alt", "elements.position", "elements.style"
  ],
});
await fs.writeFile(path.join(outDir, "poster-inspect.ndjson"), inspected.ndjson, "utf8");

for (const [index, slide] of presentation.slides.items.entries()) {
  const png = await presentation.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(outDir, `slide-${index + 1}.png`), new Uint8Array(await png.arrayBuffer()));
  const layout = await slide.export({ format: "layout" });
  await fs.writeFile(path.join(outDir, `slide-${index + 1}.layout.json`), await layout.text(), "utf8");
}

console.log(JSON.stringify({
  slideCount: presentation.slides.items.length,
  inspectPath: path.join(outDir, "poster-inspect.ndjson"),
  renderDir: outDir,
}));
