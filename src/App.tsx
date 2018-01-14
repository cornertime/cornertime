import * as React from 'react';
import './App.css';
import PunishmentStateMachine, { Listener } from './state';
import { defaultPreset } from './models';
import getMotion, { Motion } from './motion';


class App extends React.Component {
  fsm = new PunishmentStateMachine();
  listener: Listener;
  motion: Motion;

  state = {
    presetJSON: JSON.stringify(defaultPreset, null, 2),
    motionMagnitude: 0,
  };

  componentDidMount() {
    this.fsm.addListener(this.handleFsmUpdate);
    this.motion = getMotion();
    this.motion.onUpdate(this.handleMotionUpdate);
  }

  componentWillUnmount() {
    this.fsm.removeListener(this.handleFsmUpdate);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>{this.fsm.state} {this.state.motionMagnitude.toFixed(2)}</h2>
          <div className="App-diffy-container" />
        </div>
        <div className="App-intro">
          <p>
            <button onClick={this.start} disabled={this.fsm.state !== 'waiting'}>Start</button>
            <button onClick={this.movementDetected} disabled={this.fsm.state !== 'punishment'}>
              Movement detected
            </button>
          </p>
          {this.fsm.state === 'waiting' ? (
            <form>
              <textarea rows={48} cols={80} value={this.state.presetJSON} onChange={this.onChange} />
            </form>
          ) : null}
          {this.fsm.state === 'finished' ? (
            <pre>{JSON.stringify(this.fsm.report(), null, 2)}</pre>
          ) : null}
        </div>
      </div>
    );
  }

  onChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    this.setState({ presetJSON: event.currentTarget.value });
  }

  start = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.fsm.preset = JSON.parse(this.state.presetJSON);
    this.fsm.reset();
    this.fsm.getReady();
  }

  movementDetected = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.fsm.movementDetected();
  }

  handleFsmUpdate = () => {
    this.forceUpdate();
  }

  handleMotionUpdate = (magnitude: number) => {
    this.setState({ motionMagnitude: magnitude });
    this.fsm.handleMotionUpdate(magnitude);
  }
}

export default App;
