import { useState, useEffect } from 'react'
import { decode } from 'html-entities'
import { nanoid } from "nanoid"
import { ThreeDots  } from 'react-loader-spinner' //loading animation 
import AllAnswers from './AllAnswers'

export default function Quiz() {
    const [question, setQuestion] = useState([])
    const [noClickedAnswerWarning, setNoClickedAnswerWarning] = useState(0) //  reset animations for not clicked answers
    const [activeQuestions, setActiveQuestions] = useState(0)
    const [correctAnswers, setCorrectAnswers] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [newGame, setNewGame] = useState(false)
    
    function generateQuestionsParameters(answer, correctAnswer) {
        return {
            answer:answer,
            id:nanoid(),
            isClicked:false,
            correctAnswer:correctAnswer
        }
    }

    useEffect(()=>{
        fetch(`https://opentdb.com/api.php?amount=5`)
            .then(res=>res.json())
            .then(data=>{
                const newArray= data.results.map(quest=>{
                    const questionsArray = [generateQuestionsParameters(quest.correct_answer,true)]
                            quest.incorrect_answers.map(inc=>{
                                Math.random() > 0.4 ?
                                questionsArray.unshift(
                                    generateQuestionsParameters(decode(inc), false)
                                ) 
                                :questionsArray.push(
                                    generateQuestionsParameters(decode(inc), false))
                        })
                    return {
                        id:nanoid(),
                        isClicked:false,
                        quest: decode(quest.question),
                        answers: questionsArray,
                    }
                })
                setQuestion(newArray)
            })
    },[newGame])

    function clickAnswer(id) {
        setNoClickedAnswerWarning(0)
        
        if (!gameOver) {
            setActiveQuestions(0)
            setQuestion(prevQuest=>{
                let newArray = prevQuest.map(quest=>{
                    let answerID = quest.answers.find(item=> item.id=== id)
                    if (answerID) {
                        return quest.answers.map(ans=>{
                            return id===ans.id ? {...ans, isClicked:!ans.isClicked} : {...ans, isClicked:false}
                        })
                        
                    } else {
                        return quest.answers.map(ans=>{
                            return ans
                        })
                    }
                })
                return prevQuest.map((quest,number)=>{
                    return {...quest, answers:newArray[number]}
                })
            })
            isAnswerClicked()
        }
    }

    function isAnswerClicked() {
        setQuestion(prevQuest=>{
            return prevQuest.map(quest=>{
                let answerIsClicked = quest.answers.find(item=> item.isClicked=== true)
                answerIsClicked ? setActiveQuestions(prevValue=> prevValue +1) : ""

                return answerIsClicked ? {...quest, isClicked:true} : {...quest, isClicked:false}

            })
        })
    }

    function checkCorrectAnswers() {
        setNoClickedAnswerWarning(prev=>prev+1)

        if (question.length === activeQuestions) { // check if all answers were clicked
            setCorrectAnswers(0)
            question.map(quest=>{
                quest.answers.map(ans=>{
                    ans.isClicked && ans.correctAnswer ? setCorrectAnswers(prevValue=>prevValue+1) :""
                })
            })
            setGameOver(true)
        }
        if (gameOver) {
            setActiveQuestions(0)
            setNoClickedAnswerWarning(0)
            setGameOver(false)
            setQuestion([{answers:[{answer:""}], }])
            setNewGame(prev=> !prev)

        }
        
    }
    const quest = question.map((ques)=>{

        const styles = {
            animation: !ques.isClicked && noClickedAnswerWarning>0  ? "answerWarning 1500ms" : "none"
        }
        return (
            
        <div className="question--container" key={nanoid()} style={styles} id={ques.id}>
            <h2 className="question--question">{ques.quest}</h2>
            <div>
                {ques.answers.map(ans=>{
                    return <AllAnswers
                        key={nanoid()}
                        id={ans.id}
                        answer={ans.answer}
                        switchAnswer={()=>clickAnswer(ans.id)} 
                        isClicked={ans.isClicked}
                        isGameOver={gameOver}
                        correctAnswer={ans.correctAnswer}
            />
        })}
            </div>
            <span className="question--underline"></span>
        </div>
        )
    })
    return (
        <div>
            {
                quest.length===questionsQty ?  
                <div className="all--questions--container">
                    {quest}
                    <div className="answers--div">
                        {gameOver && <h3>You scored {correctAnswers}/{question.length} correct answers</h3>}

                    <button className="answers--button" onClick={checkCorrectAnswers}>{gameOver ?"Play again" : "Check answers"}</button>
                    </div>
                </div>
                :
                <div className='loading--screen'>
                    <ThreeDots 
                        height="100" 
                        width="100" 
                        color="#4D5B9E" 
                        ariaLabel="three-dots-loading"
                    />
                </div>

            }
        </div>
        
    )
}
