import type {
  MfmBold,
  MfmCenter,
  MfmCodeBlock,
  MfmEmojiCode,
  MfmFn,
  MfmHashtag,
  MfmInlineCode,
  MfmItalic,
  MfmLink,
  MfmMathBlock,
  MfmMathInline,
  MfmMention,
  MfmPlain,
  MfmQuote,
  MfmSearch,
  MfmSmall,
  MfmStrike,
  MfmUnicodeEmoji,
  MfmUrl,
} from "mfm-js";
import { HyperScript } from "./HyperScript.js";
import { IRenderer } from "./index.js";
import { urlWithParams } from "../utils/url.js";
import { createMisskeyFunctions } from "./functions.js";

export type Component<Props extends object, T> = (props: Props) => T;

export interface MfmComponents<T> {
  HashTag: Component<MfmHashtag["props"], T>;
  CustomEmoji: Component<MfmEmojiCode["props"], T>;
  UnicodeEmoji: Component<MfmUnicodeEmoji["props"], T>;
  BlockCode: Component<MfmCodeBlock["props"], T>;
  InlineCode: Component<MfmInlineCode["props"], T>;
  MathBlock: Component<MfmMathBlock["props"], T>;
  MathInline: Component<MfmMathInline["props"], T>;
  Url: Component<MfmUrl["props"], T>;
  Link: Component<MfmLink["props"] & Pick<MfmFn, "children">, T>;
  Mention: Component<MfmMention["props"], T>;
  Plain: Component<Pick<MfmPlain, "children">, T>;
  Small: Component<Pick<MfmSmall, "children">, T>;
  Italic: Component<Pick<MfmItalic, "children">, T>;
  Bold: Component<Pick<MfmBold, "children">, T>;
  Center: Component<Pick<MfmCenter, "children">, T>;
  Quote: Component<Pick<MfmQuote, "children">, T>;
  Search: Component<MfmSearch["props"], T>;
  Fn: Component<MfmFn["props"] & Pick<MfmFn, "children">, T>;
  Strike: Component<Pick<MfmStrike, "children">, T>;
}

export interface MfmComponentsFactory<T> {
  (renderer: IRenderer<T | string>): MfmComponents<T>;
}

export interface CreateComponentsFactoryOptions<T> {
  instance: URL;
  searchUrl: URL;
  functions(props: {
    name: string;
    params: Record<string, string | true>;
    children: T[];
  }): T;
}

export const createComponentsFactory =
  <T>(
    h: HyperScript<T | string, T>,
    {
      instance = new URL("https://misskey.io/"),
      searchUrl = new URL("https://duckduckgo.com/"),
      functions = createMisskeyFunctions(h),
    }: Partial<CreateComponentsFactoryOptions<string | T>> = {}
  ): MfmComponentsFactory<string | T> =>
  (renderer) => {
    return {
      HashTag: (props) => {
        return h("a", {}, props.hashtag);
      },
      CustomEmoji: (props) => {
        return h("span", { alt: props.name }, `:${props.name}:`);
      },
      UnicodeEmoji: (props) => {
        return h("span", {}, props.emoji);
      },
      BlockCode: (props) => {
        return h("pre", {}, h("code", {}, props.code));
      },
      InlineCode: (props) => {
        return h(
          "pre",
          { style: { display: "inline" } },
          h("code", {}, props.code)
        );
      },
      MathBlock: (props) => {
        return h("pre", {}, h("code", {}, props.formula));
      },
      MathInline: (props) => {
        return h(
          "pre",
          { style: { display: "inline" } },
          h("code", {}, props.formula)
        );
      },
      Url: (props) => {
        return h("a", { href: props.url }, props.url);
      },
      Link: (props) => {
        return h(
          "a",
          { href: props.url },
          ...props.children.map((node) => renderer.mfmToNode(node))
        );
      },
      Mention: (props) => {
        return h(
          "a",
          { href: new URL(`./${props.acct}`, instance) },
          props.acct
        );
      },
      Plain: (props) => {
        return h(
          "span",
          {},
          ...props.children.map((node) => renderer.mfmToNode(node))
        );
      },
      Small: (props) => {
        return h(
          "span",
          { style: { fontSize: "0.8em", opacity: 0.8 } },
          ...props.children.map((node) => renderer.mfmToNode(node))
        );
      },
      Italic: (props) => {
        return h(
          "i",
          {},
          ...props.children.map((node) => renderer.mfmToNode(node))
        );
      },
      Bold: (props) => {
        return h(
          "b",
          {},
          ...props.children.map((node) => renderer.mfmToNode(node))
        );
      },
      Center: (props) => {
        return h(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            },
          },
          ...props.children.map((node) => renderer.mfmToNode(node))
        );
      },
      Quote: (props) => {
        return h(
          "div",
          {},
          h("q", {}, ...props.children.map((node) => renderer.mfmToNode(node)))
        );
      },
      Search: (props) => {
        return h(
          "div",
          {},
          h(
            "a",
            { href: urlWithParams(searchUrl, { q: props.query }) },
            props.content
          )
        );
      },
      Strike: (props) => {
        return h(
          "s",
          {},
          ...props.children.map((node) => renderer.mfmToNode(node))
        );
      },
      Fn: (props) => {
        if (functions) {
          return functions({
            name: props.name,
            params: props.args,
            children: props.children.map((node) => renderer.mfmToNode(node)),
          });
        }

        return "";
      },
    };
  };
