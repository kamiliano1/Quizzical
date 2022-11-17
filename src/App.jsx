import { useState } from 'react'
import Start from "./Start"
import Quiz from "./Quiz"

function App() {
  const [startGame, setStartGame] = useState(false)

  function startQuiz() {
    setStartGame(true)
  }

  return (

    <div className="container">
  
      {startGame ? <Quiz /> 
      :<Start gameStart={startQuiz}/>
      }
    </div>
  )
}

export default App
