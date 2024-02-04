import { HyperScript } from "./HyperScript.js";

export interface AnimationFunctionOptions {
  speed?: string;
  delay?: string;
}

export interface SpinFunctionOptions {
  left?: true;
  alternate?: true;
  x?: true;
  y?: true;
}

export interface FontFunctionOptions {
  serif?: true;
  monospace?: true;
  cursive?: true;
  fantasy?: true;
  emoji?: true;
  math?: true;
}

export interface ColorFunctionOptions {
  color?: string;
}

export interface BorderFunctionOptions extends ColorFunctionOptions {
  width?: string;
  radius: string;
  noclip?: true;
}

export interface MisskeyFunctions<Node> {
  (props: {
    name: "tada";
    params: AnimationFunctionOptions;
    children: Node[];
  }): Node;
  (props: {
    name: "jelly";
    params: AnimationFunctionOptions;
    children: Node[];
  }): Node;
  (props: {
    name: "twitch";
    params: AnimationFunctionOptions;
    children: Node[];
  }): Node;
  (props: {
    name: "shake";
    params: AnimationFunctionOptions;
    children: Node[];
  }): Node;
  (props: {
    name: "spin";
    params: SpinFunctionOptions;
    children: Node[];
  }): Node;
  (props: {
    name: "jump";
    params: AnimationFunctionOptions;
    children: Node[];
  }): Node;
  (props: {
    name: "bounce";
    params: AnimationFunctionOptions;
    children: Node[];
  }): Node;
  (props: {
    name: "flip";
    params: { h?: true; v?: true };
    children: Node[];
  }): Node;
  (props: { name: "x2"; params: {}; children: Node[] }): Node;
  (props: { name: "x3"; params: {}; children: Node[] }): Node;
  (props: { name: "x4"; params: {}; children: Node[] }): Node;
  (props: {
    name: "font";
    params: FontFunctionOptions;
    children: Node[];
  }): Node;
  (props: { name: "blur"; params: {}; children: Node[] }): Node;
  (props: {
    name: "rainbow";
    params: AnimationFunctionOptions;
    children: Node[];
  }): Node;
  (props: { name: "sparkle"; params: {}; children: Node[] }): Node;
  (props: { name: "rotate"; params: { deg?: string }; children: Node[] }): Node;
  (props: {
    name: "position";
    params: { x?: string; y?: string };
    children: Node[];
  }): Node;
  (props: {
    name: "scale";
    params: { x?: string; y?: string };
    children: Node[];
  }): Node;
  (props: { name: "fg"; params: ColorFunctionOptions; children: Node[] }): Node;
  (props: { name: "bg"; params: ColorFunctionOptions; children: Node[] }): Node;
  (props: {
    name: "border";
    params: BorderFunctionOptions;
    children: Node[];
  }): Node;
  (props: { name: "ruby"; params: {}; children: Node[] }): Node;
  (props: { name: "unixtime"; params: {}; children: Node[] }): Node;
  (props: {
    name: "clickable";
    params: { ev?: string };
    children: Node[];
  }): Node;
}

export function createMisskeyFunctions<C, N extends C>(
  h: HyperScript<C, N>
): MisskeyFunctions<N> {
  return (props) => {
    switch (props.name) {
      case "tada": {
        return h(
          "span",
          {
            style: {
              display: "inline-block",
              animation: `any-mfm-tada ${parseFloat(
                props.params.speed ?? "1"
              )}s linear ${parseFloat(
                props.params.delay ?? "0"
              )}s running infinite`,
              fontSize: "150%",
            },
          },
          ...props.children
        );
      }

      case "jelly": {
        return h(
          "span",
          {
            style: {
              display: "inline-block",
              animation: `any-mfm-jelly ${parseFloat(
                props.params.speed ?? "1"
              )}s linear ${parseFloat(
                props.params.delay ?? "0"
              )}s running infinite`,
            },
          },
          ...props.children
        );
      }

      case "twitch": {
        return h(
          "span",
          {
            style: {
              display: "inline-block",
              animation: `any-mfm-twitch ${parseFloat(
                props.params.speed ?? "0.5"
              )}s linear ${parseFloat(
                props.params.delay ?? "0"
              )}s running infinite`,
            },
          },
          ...props.children
        );
      }

      case "fg": {
        return h(
          "span",
          {
            style: {
              color: props.params.color,
            },
          },
          ...props.children
        );
      }

      case "bg": {
        return h(
          "span",
          {
            style: {
              backgroundColor: props.params.color,
            },
          },
          ...props.children
        );
      }

      default: {
        return h("span", {}, ...props.children);
      }
    }
  };
}
