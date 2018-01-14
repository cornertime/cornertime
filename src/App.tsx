import * as React from 'react';
import './App.css';
import PunishmentStateMachine, { Listener } from './state';
import { defaultPreset } from './models';
import getSettings from './settings';
import { create } from 'diffyjs';


const MOTION_MAX = 255;


class App extends React.Component {
  fsm = new PunishmentStateMachine();
  settings = getSettings();
  listener: Listener;
  diffy: {};

  state = {
    presetJSON: JSON.stringify(defaultPreset, null, 2),
    magnitude: 0,
  };

  componentDidMount() {
    this.fsm.addListener(this.handleFsmUpdate);

    if (process.env.NODE_ENV !== 'test') {
      this.diffy = create({
        ...this.settings.diffy,
        // magnitude seems to be 0–255 with 255 meaning "no movement", 0 meaning "chaos"
        onFrame: matrix => this.handleMotionUpdate(matrix),
      });
    }
  }

  componentWillUnmount() {
    this.fsm.removeListener(this.handleFsmUpdate);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>{this.fsm.state} {this.state.magnitude.toFixed(2)}</h2>
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
        <div className="App-footer">
          No data will be transferred from your webcam to the Internet.
          All image processing is done in your browser. <a
            href="https://github.com/cornertime/cornertime"
            target="_blank"
          >
            Source code
          </a>
        </div>
      </div>
    );
  }

  onChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    this.setState({ presetJSON: event.currentTarget.value });
  }

  start = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.fsm.preset = JSON.parse(this.state.presetJSON);

    // TODO having to call reset before getReady is implementation leaking out from the fsm
    this.fsm.reset();
    this.fsm.getReady();
  }

  movementDetected = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.fsm.movementDetected();
  }

  handleFsmUpdate = () => {
    this.forceUpdate();
  }

  handleMotionUpdate = (matrix: number[][]) => {
    const minValue = Math.min(...matrix.map(row => Math.min(...row)));
    const magnitude = (MOTION_MAX - minValue) / MOTION_MAX;
    this.setState({ magnitude });
    this.fsm.handleMotionUpdate(magnitude);
  }
}

export default App;
