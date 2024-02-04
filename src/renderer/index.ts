import * as Mfm from "mfm-js";
import { HyperScript } from "./HyperScript.js";
import {
  MfmComponents,
  MfmComponentsFactory,
  createComponentsFactory,
} from "./components.js";

export interface IRenderer<T> {
  mfmToNode(node: Mfm.MfmNode): T;
}

export class NormalRenderer<T> implements IRenderer<T | string> {
  private components: MfmComponents<T | string>;

  constructor(
    private h: HyperScript<T | string, T>,
    factory: MfmComponentsFactory<T | string> = createComponentsFactory(h)
  ) {
    this.components = factory(this);
  }

  mfmToNode(node: Mfm.MfmNode): T | string {
    switch (node.type) {
      case "text": {
        return this.h(
          "span",
          {},
          ...node.props.text
            .split(/(\r\n|\r|\n)/)
            .map((x) => (/\r\n|\r|\n/.test(x) ? this.h("br", {}) : x))
        );
      }

      case "bold": {
        return this.h(this.components.Bold, { children: node.children });
      }

      case "italic": {
        return this.h(this.components.Italic, { children: node.children });
      }

      case "strike": {
        return this.h(this.components.Strike, { children: node.children });
      }

      case "hashtag": {
        return this.h(this.components.HashTag, node.props);
      }

      case "emojiCode": {
        return this.h(this.components.CustomEmoji, node.props);
      }

      case "unicodeEmoji": {
        return this.h(this.components.UnicodeEmoji, node.props);
      }

      case "blockCode": {
        return this.h(this.components.BlockCode, node.props);
      }

      case "inlineCode": {
        return this.h(this.components.InlineCode, node.props);
      }

      case "mathBlock": {
        return this.h(this.components.MathBlock, node.props);
      }

      case "mathInline": {
        return this.h(this.components.MathInline, node.props);
      }

      case "url": {
        return this.h(this.components.Url, node.props);
      }

      case "link": {
        return this.h(this.components.Link, {
          ...node.props,
          children: node.children,
        });
      }

      case "mention": {
        return this.h(this.components.Mention, node.props);
      }

      case "plain": {
        return this.h(this.components.Plain, { children: node.children });
      }

      case "small": {
        return this.h(this.components.Small, { children: node.children });
      }

      case "center": {
        return this.h(this.components.Center, { children: node.children });
      }

      case "quote": {
        return this.h(this.components.Quote, { children: node.children });
      }

      case "search": {
        return this.h(this.components.Search, node.props);
      }

      case "fn": {
        return this.h(this.components.Fn, {
          ...node.props,
          children: node.children,
        });
      }
    }
  }
}
