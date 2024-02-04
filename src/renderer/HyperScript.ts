export interface HyperScript<C, E> {
  (name: string, attrs: object, ...children: C[]): E;
  <F extends (props: P) => C, P>(name: F, attrs: P): C;
}
