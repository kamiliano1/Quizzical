import { decode } from 'html-entities'
export default function AllAnswers(props) {
    let backgroundColor = ""
    if (props.isGameOver) {
        props.correctAnswer && props.isClicked ? backgroundColor = "#94D7A2" : ""
        !props.correctAnswer && props.isClicked ? backgroundColor = "#94D7A2" : ""
        props.correctAnswer && !props.isClicked ? backgroundColor = "#F8BCBC" : ""
    } else {
        props.isClicked? backgroundColor="#D6DBF5" : backgroundColor= "none"
    }
    const styles={
        backgroundColor: backgroundColor,
        opacity: (props.isGameOver && props.correctAnswer && !props.isClicked) 
        || (props.isGameOver && !props.correctAnswer && !props.isClicked) ? 0.5 : 1,
        border: props.isClicked? "#94D7A2" : ""
    }
    return (
         <button className="question--button" 
            style={styles} 
            id={props.id} 
            onClick={props.switchAnswer}>
                {decode(props.answer)}
         </button>
        )
    }