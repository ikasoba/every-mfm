import { createElement, useMemo } from "react"
import { parse } from "mfm-js"
import { NormalRenderer } from "@ikasoba000/every-mfm"

export function MfmRender({ text }: { text: string }) {
  const render = useMemo(() => new NormalRenderer(createElement), [])

  return parse(text).map(node => render.mfmToNode(node))
}