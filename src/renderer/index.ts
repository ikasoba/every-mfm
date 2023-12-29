import type { MfmNode } from "mfm-js";
import { Ref } from "../utils/ref.js";
import { DomApi } from "./dom.js";
import { MfmComponents } from "./components.js";
import { equalObject } from "../utils/equalObject.js";
import { ComponentManager } from "./ComponentManager.js";
import { equalElement } from "./equalElement.js";

export interface RenderContext {
  scale: number;
}

export class Renderer {
  constructor(
    public classPrefix: string,
    public components: MfmComponents,
    public dom: DomApi,
    public componentManager = new ComponentManager()
  ) {}

  render(nodes: MfmNode[], root: Node) {
    for (
      let i = 0, j = 0;
      i < nodes.length || j < root.childNodes.length;
      i++, j++
    ) {
      const mfmNode = nodes[i];
      const domNode = root.childNodes[j];

      if (mfmNode) {
        const res = this.renderNode(mfmNode, domNode);
        if (domNode == null && res.domNode) {
          root.appendChild(res.domNode);
        } else if (domNode && res.domNode == null) {
          root.removeChild(domNode);
          j--;
        } else if (domNode && res.domNode && domNode !== res.domNode) {
          if (domNode.parentNode === root) {
            root.replaceChild(res.domNode, domNode);
          }
        }
      } else {
        root.removeChild(domNode);
        j--;
      }
    }
  }

  renderToArray(nodes: MfmNode[], arr: Node[]) {
    for (let i = 0, j = 0; i < nodes.length || j < arr.length; i++, j++) {
      const mfmNode = nodes[i];
      const domNode = arr[j];

      if (mfmNode) {
        const res = this.renderNode(mfmNode, domNode);
        if (domNode == null && res.domNode) {
          arr.push(res.domNode);
        } else if (domNode && res.domNode == null) {
          arr.splice(j, 1);
          j--;
        } else if (domNode && res.domNode && domNode !== res.domNode) {
          arr.splice(j, 1, res.domNode);
        }
      } else {
        arr.splice(j, 1);
        j--;
      }
    }
  }

  renderText(text: string, root: Node) {
    const lines = text.split(/(\r\n|\r|\n)/);

    for (
      let i = 0, j = 0;
      i < lines.length || j < root.childNodes.length;
      i++, j++
    ) {
      const line = lines[i];
      const node = root.childNodes[j];

      if (line == "\r\n" || line == "\r" || line == "\n") {
        if (!(node instanceof this.dom.Element && node.tagName === "BR")) {
          const br = this.dom.document.createElement("br");
          if (node) {
            root.replaceChild(br, node);
          } else {
            root.appendChild(br);
          }
        }
      } else if (line) {
        if (node instanceof this.dom.Text) {
          if (node.textContent !== line) node.textContent = line;
        } else {
          const text = this.dom.document.createTextNode(line);
          if (node) {
            root.replaceChild(text, node);
          } else {
            root.appendChild(text);
          }
        }
      } else if (node) {
        root.removeChild(node);
        j--;
      }
    }
  }

  renderNode(mfmNode: MfmNode, domNode?: Node): { domNode?: Node } {
    switch (mfmNode.type) {
      case "text": {
        if (
          !(
            domNode instanceof this.dom.Element &&
            !equalElement(domNode, {
              name: "SPAN",
            })
          )
        ) {
          const span = this.dom.document.createElement("span");
          if (domNode?.parentNode) {
            domNode?.parentNode.replaceChild(span, domNode);
          }

          domNode = span;
        }

        this.renderText(mfmNode.props.text, domNode);
        break;
      }

      case "bold": {
        let element: Element;
        if (domNode instanceof this.dom.Element && domNode.tagName === "B") {
          element = domNode;
        } else {
          const b = this.dom.document.createElement("b");
          if (domNode?.parentNode) {
            domNode?.parentNode.replaceChild(b, domNode);
          }

          domNode = b;
          element = b;
        }

        if (!element.classList.contains(`${this.classPrefix}-bold`)) {
          element.classList.add(`${this.classPrefix}-bold`);
        }

        this.render(mfmNode.children, element);
        break;
      }

      case "italic": {
        let element: Element;
        if (domNode instanceof this.dom.Element && domNode.tagName === "I") {
          element = domNode;
        } else {
          const b = this.dom.document.createElement("i");
          if (domNode?.parentNode) {
            domNode?.parentNode.replaceChild(b, domNode);
          }

          domNode = b;
          element = b;
        }

        if (!element.classList.contains(`${this.classPrefix}-italic`)) {
          element.classList.add(`${this.classPrefix}-italic`);
        }

        this.render(mfmNode.children, element);
        break;
      }

      case "strike": {
        let element: Element;
        if (domNode instanceof this.dom.Element && domNode.tagName === "S") {
          element = domNode;
        } else {
          const b = this.dom.document.createElement("s");
          if (domNode?.parentNode) {
            domNode?.parentNode.replaceChild(b, domNode);
          }

          domNode = b;
          element = b;
        }

        if (!element.classList.contains(`${this.classPrefix}-strike`)) {
          element.classList.add(`${this.classPrefix}-strike`);
        }

        this.render(mfmNode.children, element);
        break;
      }

      case "unicodeEmoji": {
        domNode = this.componentManager.render(
          this.components.UnicodeEmoji,
          mfmNode.props,
          domNode
        );
        break;
      }

      case "emojiCode": {
        domNode = this.componentManager.render(
          this.components.CustomEmoji,
          mfmNode.props,
          domNode
        );
        break;
      }

      case "hashtag": {
        domNode = this.componentManager.render(
          this.components.HashTag,
          mfmNode.props,
          domNode
        );
        break;
      }

      case "url": {
        domNode = this.componentManager.render(
          this.components.Url,
          mfmNode.props,
          domNode
        );
        break;
      }

      case "link": {
        const children =
          (domNode && this.componentManager.getOuterState<Node[]>(domNode)) ??
          [];

        if (mfmNode.children) {
          this.renderToArray(mfmNode.children, children);
        }

        domNode = this.componentManager.render(
          this.components.Link,
          {
            ...mfmNode.props,
            children: children,
          },
          domNode
        );

        this.componentManager.setOuterState(domNode, children);
        break;
      }

      case "mention": {
        domNode = this.componentManager.render(
          this.components.Mention,
          mfmNode.props,
          domNode
        );
        break;
      }

      case "plain": {
        const children =
          (domNode && this.componentManager.getOuterState<Node[]>(domNode)) ??
          [];

        if (mfmNode.children) {
          this.renderToArray(mfmNode.children, children);
        }

        domNode = this.componentManager.render(
          this.components.Plain,
          { children },
          domNode
        );

        this.componentManager.setOuterState(domNode, children);
        break;
      }

      case "small": {
        const children =
          (domNode && this.componentManager.getOuterState<Node[]>(domNode)) ??
          [];

        if (mfmNode.children) {
          this.renderToArray(mfmNode.children, children);
        }

        domNode = this.componentManager.render(
          this.components.Small,
          { children },
          domNode
        );

        this.componentManager.setOuterState(domNode, children);
        break;
      }

      case "blockCode": {
        domNode = this.componentManager.render(
          this.components.BlockCode,
          mfmNode.props,
          domNode
        );
        break;
      }

      case "inlineCode": {
        domNode = this.componentManager.render(
          this.components.InlineCode,
          mfmNode.props,
          domNode
        );
        break;
      }

      case "mathBlock": {
        domNode = this.componentManager.render(
          this.components.MathBlock,
          mfmNode.props,
          domNode
        );
        break;
      }

      case "mathInline": {
        domNode = this.componentManager.render(
          this.components.MathInline,
          mfmNode.props,
          domNode
        );
        break;
      }
    }

    return {
      domNode,
    };
  }
}
