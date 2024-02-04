<script lang="ts">
import { h as _h, Component, defineComponent, VNodeArrayChildren } from 'vue'
import { parse } from "mfm-js";
import { NormalRenderer } from "@ikasoba000/every-mfm/src/index"

function h(name: string | Component, props: object, ...children: VNodeArrayChildren) {
  return _h(name, props, children)
}

const renderer = new NormalRenderer(h)

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return () => parse(props.text).map(node => renderer.mfmToNode(node))
  }
})
</script>