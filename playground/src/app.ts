import { parse } from "mfm-js";
import { Renderer } from "../../src/renderer/index.ts";
import { createDefaultComponents } from "../../src/renderer/components.ts";

export function app() {
  const renderer = new Renderer("mfm", createDefaultComponents(window), window);
  const container = document.createElement("div");

  container.style.display = "flex";
  container.style.width = "100%";
  container.style.height = "100%";

  const input = document.createElement("textarea");

  input.style.width = "100%";
  input.style.padding = "0.5rem";

  const view = document.createElement("div");

  view.style.width = "100%";
  view.style.padding = "0.5rem";

  input.addEventListener("input", () => {
    const nodes = parse(input.value);
    console.log(nodes);

    renderer.render(nodes, view);
  });

  container.append(input, view);

  return container;
}
