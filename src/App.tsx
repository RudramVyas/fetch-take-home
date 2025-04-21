import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      Count is {count}
      <br />
      <button onClick={() => setCount((c) => c + 1)}>
        Increment
      </button>
      <button onClick={() => setCount((c) => c - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
      <button onClick={() => setCount((c) => c * 2)}>
        Double
      </button>
      <button onClick={() => setCount((c) => c / 2)}>
        Halve
      </button> 
    </>
  )
}

export default App
