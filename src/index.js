import React from 'react';
import ReactDOM from 'react-dom';
import './index2.css';
import undoPic from './rotate-left-solid.svg';
function Square (props)
{
  
      return (
        <div className={getSquareClass(props.color)} onClick={props.onClick}>
          {props.value}
        </div>
      )
  }

  function getSquareClass(col){
    return "square "+col;
  }
  
  function calculateWinner(squares){
    const lines=[[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]];

    for(let i=0;i<lines.length;i++)
    { const [a,b,c]=lines[i];
      if(squares[a] && squares[a]===squares[b] && squares[b]===squares[c])
      {
        return squares[a];
      }
    }
    return null;
  }

  class Board extends React.Component {

    renderSquare(i) {
      let color=(this.props.squares[i]==='X')?'green':'red';
      return <Square value={this.props.squares[i]} onClick={()=>this.props.onClick(i)} color={color}/>;
    }
  
    render() {
      
      return (
       <div className="board">
          <div className="board-row" id="row1">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row" id="row2">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row" id="row3">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      )
    }
  }
  
function UndoButtons(props){

return(<div className={(!props.undolist)?"dropdown-list hide":"dropdown-list"} onClick={()=>props.onClick(false)}>
  {props.moves}
  </div>);
}

  class Game extends React.Component {

    constructor(props){
      super(props);
      this.state={history:[{squares:Array(9).fill(null)}],xIsNext:true,stepNumber:0,undolist:false};
    }

    jumpTo(move){
      this.setState({stepNumber:move,xIsNext:(move%2===0)});

    }
    
    handleUndoClick(value){
        this.setState((value)={
            undolist:value
        })
    }
    handleClick(i){
      const history = this.state.history.slice(0,this.state.stepNumber+1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      this.setState({undolist:false});
      if(calculateWinner(current.squares) || current.squares[i])
      {
        return;
      }
    squares[i] = this.state.xIsNext?"X":"O";
    this.setState({history:history.concat([{squares:squares}]),
      xIsNext:!this.state.xIsNext,
      stepNumber:history.length});

    }

    render() {
      const history=this.state.history;
      const current=history[this.state.stepNumber];
      const winner=calculateWinner(current.squares);
      let status;

      if(winner)
      status="Winner is "+winner;
      else if(history.length>=9 && !current.squares.some((square)=>square===null))
      {status="It's a Draw";
       console.log("history length "+this.state.history.length);
      }
      else
      status = 'Next player is: '+(this.state.xIsNext?'X':"O");
      
      let moves=history.map((data,move)=>{
        let mv=move?"jump to Step #"+move:"jump to start";
        return(
        <div key={move} id={move} className="undolist" onClick={()=>{this.jumpTo(move)}}>{mv}</div>
        )
      })
        
        const color=winner?(winner=="X"?"status green":"status red"):(this.state.xIsNext?"status green":"status red");
      return (
        <div className="game">
          <div className="game-board">
          <h1>Tic Tac Toe!!</h1>
            <div className={color}>{status}</div>
              <Board squares={current.squares} onClick={(i)=>this.handleClick(i)}/>      
          </div>
          <div className="game-info">
            <div className="dropdown-container">
            <button className="drpdown-btn" onClick={()=>this.handleUndoClick(true)}> Undo&nbsp;<img src={undoPic} height="20px" width="20px" alt="apple"></img></button>
            <UndoButtons moves={moves} undolist={this.state.undolist} onClick={(value)=>this.handleUndoClick(value)} child/>
            </div>
          </div>
        </div>
      )
    }
  }


  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  )
