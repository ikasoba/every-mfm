import type {
  MfmCodeBlock,
  MfmEmojiCode,
  MfmHashtag,
  MfmInlineCode,
  MfmLink,
  MfmMathBlock,
  MfmMathInline,
  MfmMention,
  MfmPlain,
  MfmUnicodeEmoji,
  MfmUrl,
} from "mfm-js";
import { DomApi } from "./dom.js";
import { Component } from "./ComponentManager.js";

export interface MfmComponents {
  HashTag: Component<MfmHashtag["props"]>;
  CustomEmoji: Component<MfmEmojiCode["props"]>;
  UnicodeEmoji: Component<MfmUnicodeEmoji["props"]>;
  BlockCode: Component<MfmCodeBlock["props"]>;
  InlineCode: Component<MfmInlineCode["props"]>;
  MathBlock: Component<MfmMathBlock["props"]>;
  MathInline: Component<MfmMathInline["props"]>;
  Url: Component<MfmUrl["props"]>;
  Link: Component<MfmLink["props"] & { children: Node[] }>;
  Mention: Component<MfmMention["props"]>;
  Plain: Component<{ children: Node[] }>;
  Small: Component<{ children: Node[] }>;
}

export const createDefaultComponents = (
  dom: DomApi,
  instance = "https://misskey.io/"
): MfmComponents => {
  return {
    HashTag() {
      return (props) => {
        const a = dom.document.createElement("a");
        a.href = new URL(
          `/tags/${encodeURIComponent(props.hashtag)}`,
          instance
        ).toString();

        a.append(dom.document.createTextNode("#" + props.hashtag));

        return a;
      };
    },
    CustomEmoji() {
      return (props) => {
        const span = dom.document.createElement("span");
        span.append(dom.document.createTextNode(`:${props.name}:`));

        return span;
      };
    },
    UnicodeEmoji() {
      return (props) => {
        const span = dom.document.createElement("span");
        span.append(dom.document.createTextNode(props.emoji));

        return span;
      };
    },
    BlockCode() {
      return (props) => {
        const pre = dom.document.createElement("pre");
        const code = dom.document.createElement("code");

        code.append(dom.document.createTextNode(props.code));

        pre.append(code);

        return pre;
      };
    },
    InlineCode() {
      return (props) => {
        const code = dom.document.createElement("code");

        code.append(dom.document.createTextNode(props.code));

        return code;
      };
    },
    MathBlock() {
      return (props) => {
        const pre = dom.document.createElement("pre");
        const code = dom.document.createElement("code");

        code.append(dom.document.createTextNode(props.formula));

        pre.append(code);

        return pre;
      };
    },
    MathInline() {
      return (props) => {
        const code = dom.document.createElement("code");

        code.append(dom.document.createTextNode(props.formula));

        return code;
      };
    },
    Url() {
      return (props) => {
        const a = dom.document.createElement("a");
        a.href = props.url;

        a.append(dom.document.createTextNode(props.url));

        return a;
      };
    },
    Link() {
      return (props) => {
        const a = dom.document.createElement("a");
        a.href = props.url;

        if (props.children.length) {
          a.append(...props.children);
        } else {
          a.append(dom.document.createTextNode(props.url));
        }

        return a;
      };
    },
    Mention() {
      return (props) => {
        const a = dom.document.createElement("a");
        a.href = new URL(`/${props.acct}`, instance).toString();

        a.append(dom.document.createTextNode(props.acct));

        return a;
      };
    },
    Plain() {
      return (props) => {
        const span = dom.document.createElement("span");

        span.append(...props.children);

        return span;
      };
    },
    Small() {
      return (props) => {
        const span = dom.document.createElement("span");

        span.style.fontSize = "0.8em";
        span.style.opacity = "0.8";

        span.append(...props.children);

        return span;
      };
    },
  };
};
