export default function Start(props) {
    return (

    <div className="start--container">
        <h1 className="start--container--title">Quizzical</h1>
        <h2 className="start--container--body">Try answer to five random questions</h2>
        <button className="start--container--button" onClick={props.gameStart}>Start quiz</button>
      </div>
    )
}