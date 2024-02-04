import { useState } from 'react'
import { MfmRender } from './components/MfmRender'

function App() {
  const [text, setText] = useState("")

  return (
    <>
      <textarea value={text} onChange={e => setText(e.target.value)}></textarea><br/>
      <MfmRender text={text} />
    </>
  )
}

export default App
