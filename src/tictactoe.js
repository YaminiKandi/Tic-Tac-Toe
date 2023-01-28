import React from "react";

function Square(props){
    return(
        <button className={'square ' + (props.value === 'X' ? 'square-x ' : props.value === 'O' ? 'square-o ' : '') + (props.isWinner ? 'square-win ' : '') } onClick={props.onClick}>
            {props.value} 
        </button>
    );
}
class Board extends React.Component{
    renderSquare(i){
        const winArr = getWinArr(this.props.squares)
        const isWinner = winArr && winArr.includes(i)
        return(
            <Square
                value = {this.props.squares[i]}
                isWinner = {isWinner}
                onClick = {() => this.props.onClick(i)}
            />
        );
    }
    render(){
        return(
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }
    return null;
}
function checkDraw(squares) {
    if (!calculateWinner(squares)) {
        return squares.every(sq => !!sq)
    }
    return null;
}
function getWinArr(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return lines[i];
        }
    }
    return null;
}
class Game extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }
    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step){
        const history = this.state.history.slice(0,step+1) 
        this.setState({
            history: history,
            stepNumber: step,
            xIsNext: (step%2) === 0,
        });
    }
    render(){
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
            'Go to move #' + move :
            'Go to game start';
            return (
                <li key={move}>
                    <button className="history-btns" onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        })
        let status;
        if (winner) {
            status = `Player ${winner} wins!`;
        } else if (checkDraw(current.squares)) {
            status = 'It\'s a Draw!';
        }else{
            status = 'Current turn: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return(
            <div className="game">
                <div className="game-info-one">
                    <div>{status}</div>
                </div>
                <div className="game-board">
                    <Board
                        squares = {current.squares}
                        onClick = {(i) => {this.handleClick(i)}}
                    /> 
                </div>
                <div className="game-info-2">
                    <ul>{moves}</ul>
                </div>
            </div>
        );
    }
}

export default Game;