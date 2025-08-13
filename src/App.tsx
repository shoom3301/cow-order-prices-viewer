import { useState } from 'react'
import './App.css'

export function App() {
    const [count] = useState(0)

    return (
        <div>Start here {count}</div>
    )
}
