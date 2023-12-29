import { equalObject } from "../utils/equalObject.js";

export type Component<P extends object> = () => (props: P, prev?: Node) => Node;

export interface ManagerContext {
  component: Component<any>;
  prevProps?: any;
  outerState?: any;
  prevNode?: Node;
  render: ReturnType<Component<any>>;
}

export class ComponentManager {
  private contexts = new WeakMap<Node, ManagerContext>();

  getOuterState<S>(node: Node): S | undefined {
    const context = this.contexts.get(node);
    if (!context) return;

    return context.outerState;
  }

  setOuterState<S>(node: Node, state: S): void {
    const context = this.contexts.get(node);
    if (!context) return;

    context.outerState = state;
  }

  render<P extends object>(com: Component<P>, props: P, prev?: Node): Node {
    let context = prev ? this.contexts.get(prev) : undefined;

    if (context == null || context.component !== com) {
      context = {
        component: com,
        render: com(),
      };
    }

    let element: Node;
    if (
      prev == null ||
      context.prevNode == null ||
      prev != context.prevNode ||
      context.prevProps == null ||
      !equalObject(context.prevProps, props)
    ) {
      context.prevProps = props;
      context.prevNode = element = context.render(props, prev);
      if (prev) {
        this.contexts.delete(prev);

        if (prev != element) {
          prev.parentNode?.replaceChild(element, prev);
        }
      }

      this.contexts.set(element, context);
    } else {
      element = prev;
    }

    return element;
  }
}
