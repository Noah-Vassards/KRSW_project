export const CreateTitleQuestion = (movie, titles, onClickFunc) => {
    const allTitles = [movie.title, ...titles]
    allTitles.sort((a, b) => 0.5 - Math.random())

    const checkAnswer = (idx) => {
        return allTitles[idx] === movie.title
    }

    return (
        <div className="Question">
            <img src={movie.thumbnail} alt='image' width="180" height="240"></img>
            <label>What is this movie ?</label>
            <div className="AnswerGrid">
                <button onClick={() => onClickFunc(checkAnswer(0))} className='Answer' id="first">{allTitles[0]}</button>
                <button onClick={() => onClickFunc(checkAnswer(1))} className='Answer' id="second">{allTitles[1]}</button>
                <button onClick={() => onClickFunc(checkAnswer(2))} className='Answer' id="third">{allTitles[2]}</button>
                <button onClick={() => onClickFunc(checkAnswer(3))} className='Answer' id="fourth">{allTitles[3]}</button>
            </div>
        </div>
    )
}

export const createActorQuestion = (movie, actors, onClickFunc) => {
    const allActors = [movie.actor[Math.floor(Math.random() * (movie.actor.length - 1))].replaceAll('_', ' ').split('/').pop(), ...actors]
    allActors.sort((a, b) => 0.5 - Math.random())

    const checkAnswer = (idx) => {
        return movie.actor.includes(allActors[idx])
    }
    return (
        <div className="Question">
            <label>Who played in {movie.title} ?</label>
            <div className="AnswerGrid">
                <button onClick={() => onClickFunc(checkAnswer(0))} className="Answer" id="first">{allActors[0]}</button>
                <button onClick={() => onClickFunc(checkAnswer(1))} className="Answer" id="second">{allActors[1]}</button>
                <button onClick={() => onClickFunc(checkAnswer(2))} className="Answer" id="third">{allActors[2]}</button>
                <button onClick={() => onClickFunc(checkAnswer(3))} className="Answer" id="fourth">{allActors[3]}</button>
            </div>
        </div>
    )
}

export const createDirectorQuestion = (movie, directors, onClickFunc) => {
    const allDirectors = [movie.director[Math.floor(Math.random() * (movie.director.length - 1))].replaceAll('_', ' ').split('/').pop(), ...directors]
    allDirectors.sort((a, b) => 0.5 - Math.random())

    const checkAnswer = (idx) => {
        return movie.director.includes(allDirectors[idx])
    }
    return (
        <div className="Question">
            <label className="Question">Who directed in {movie.title} ?</label>
            <div className="AnswerGrid">
                <button onClick={() => onClickFunc(checkAnswer(0))} className="Answer" id="first">{allDirectors[0]}</button>
                <button onClick={() => onClickFunc(checkAnswer(1))} className="Answer" id="second">{allDirectors[1]}</button>
                <button onClick={() => onClickFunc(checkAnswer(2))} className="Answer" id="third">{allDirectors[2]}</button>
                <button onClick={() => onClickFunc(checkAnswer(3))} className="Answer" id="fourth">{allDirectors[3]}</button>
            </div>
        </div>
    )
}