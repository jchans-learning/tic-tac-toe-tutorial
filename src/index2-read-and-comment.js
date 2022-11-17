import React from "react";
import * as ReactDOMClient from "react-dom/client";
import PropTypes from "prop-types";
import "./index.css";

// prop-types is imported for prop types validation

// prop types validation for Square
Square.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
};

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// prop types validation for Board
Board.propTypes = {
  squares: PropTypes.array,
  onClick: PropTypes.func,
};

class Board extends React.Component {
  // render 1 Square
  // the value of the squares are from the array "squares" from props,
  // and the value of a square is "squares[i]"
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      // render the board of 9 squares
      // the array "squares" is designed to have 9 elements,
      // so we have the Board render each element by index "i"
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

class Game extends React.Component {
  // define props
  // constructor is how you define props, which has a state, in class components
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  // this handleClick function is what define most of the behavior is this game
  //
  // slice method: https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
  // concat method: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // if there's a winner or the square is already assigned value, return
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // assign value to the square "squares[i]"
    squares[i] = this.state.xIsNext ? "X" : "O";

    // state: add new element to history, change stepNumber, and change xIsNext
    this.setState({
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  // jump to certain step in history by changing the stepNumber in state
  // not changing history if a user wants to jump to other existing steps
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button
            onClick={() => {
              this.jumpTo(move);
            }}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => {
              this.handleClick(i);
            }}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// Move the calulateWinner function here is purely my preference...
// Not sure if there's a difference in where you put the function
// TODO: read about: "hoist", "lexical declarations", "temporal dead zone"
// ref:
// "hoist": https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
// You Don't Know JS 1st ed: https://github.com/getify/You-Dont-Know-JS/tree/f0d591b6502c080b92e18fc470432af8144db610
// You Don't Know JS 2nd ed: https://github.com/getify/You-Dont-Know-JS
// ========
function calculateWinner(squares) {
  // win conditions
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
  // check every win condition if there's any one is true
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // check value of squares[j] on line[i] is all the same value
    // that is: square[a] = square[b] = square[c]
    // if true, return square[a]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
// ========================================

// TODO: check what these two lines do
const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(<Game />);
