import * as React from 'react';
import './App.css';
import PunishmentStateMachine, { Listener } from './state';


class App extends React.Component {
  fsm = new PunishmentStateMachine();
  listener: Listener;

  componentDidMount() {
    this.listener = () => this.forceUpdate();
    this.fsm.addListener(this.listener);
  }

  componentWillUnmount() {
    this.fsm.removeListener(this.listener);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>{this.fsm.state}</h2>
        </div>
        <p className="App-intro">
          <button onClick={() => this.fsm.getReady()} disabled={this.fsm.state !== 'waiting'}>Start</button>
          <button
            onClick={() => this.fsm.movementDetected()}
            disabled={this.fsm.state !== 'punishment'}
          >
            Movement detected
          </button>
        </p>
      </div>
    );
  }
}

export default App;
