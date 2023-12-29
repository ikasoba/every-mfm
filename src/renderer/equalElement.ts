import { equalObject, isIndexable } from "../utils/equalObject.js";

type ExtractObjectEntry<O, T> = {
  [K in keyof O]: Extract<O[K], T>;
};

export interface ElementOptions {
  name: string;
  classList?: string[];
  style?: ExtractObjectEntry<CSSStyleDeclaration, string>;
}

export const equalElement = (
  element: Element | HTMLElement,
  options: ElementOptions
): boolean => {
  if (element.tagName !== options.name) return false;

  if (element.classList.length !== (options.classList?.length ?? 0))
    return false;

  if (
    options.classList &&
    options.classList.some((x) => !element.classList.contains(x))
  )
    return false;

  if ("style" in element) {
    const style: Record<string, string | undefined> = options.style ?? {};
    const keys = new Set(Object.keys(style).concat(Object.keys(element.style)));

    for (const key of keys) {
      if (
        /^[0-9]$/.test(key) ||
        key == "cssText" ||
        (isIndexable(element.style, key) &&
          typeof element.style[key] !== "string")
      )
        continue;

      if (
        !(
          isIndexable(element.style, key) &&
          element.style[key] === (style[key] ?? "")
        )
      ) {
        return false;
      }
    }
  }

  return true;
};
