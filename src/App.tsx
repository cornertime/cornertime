import * as React from 'react';
import './App.css';
import PunishmentStateMachine, { Listener } from './state';
import { defaultPreset } from './models';
import getSettings from './settings';
import { create } from 'diffyjs';
import { serializeReport, serializePreset, deserializePreset } from './serialization';

const MOTION_MAX = 255;


interface State {
    preset: string;
}


class App extends React.Component<{}, State> {
    fsm = new PunishmentStateMachine();
    settings = getSettings();
    listener: Listener;
    diffy: {};

    state: State = {
        preset: JSON.stringify(defaultPreset, null, 2),
    };

    componentDidMount() {
        this.fsm.addListener(this.handleFsmUpdate);

        // Debug globals
        if (typeof window !== 'undefined') {
            const anyWindow: any = window;
            anyWindow.cornertime = anyWindow.cornertime || {};
            anyWindow.cornertime.fsm = this.fsm;
        }

        if (process.env.NODE_ENV !== 'test') {
            this.diffy = create({
                ...this.settings.diffy,
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
                    <h2>{this.fsm.state}</h2>
                </div>
                <div className="App-intro">
                    <p>
                        <button onClick={this.start} disabled={this.fsm.state !== 'waiting'}>Start</button>
                        <button onClick={this.movementDetected} disabled={this.fsm.state !== 'punishment'}>
                            Movement detected
                        </button>
                    </p>
                    {this.fsm.state === 'waiting' ? (
                        <div>
                            <form>
                                <label>
                                    <p>Preset (JSON or encoded):</p>
                                    <textarea rows={48} cols={90} value={this.state.preset} onChange={this.onChange} />
                                </label>
                            </form>

                            <p>
                                To have someone else use this preset without seeing its content, have them paste this
                                in the above field:
                            </p>
                            <pre>{this.getSerializedPreset()}</pre>
                        </div>
                    ) : null}
                    {this.fsm.state === 'finished' ? (
                        <pre>{serializeReport(this.fsm.report())}</pre>
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
        this.setState({ preset: event.currentTarget.value });
    }

    start = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.fsm.preset = this.loadPreset();

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
        // matrix elements seem to be 0–255 with 255 meaning "no movement", 0 meaning "chaos"
        // we turn it into a a single number 0.0–1.0 by taking busiest cell
        const minValue = Math.min(...matrix.map(row => Math.min(...row)));
        const magnitude = (MOTION_MAX - minValue) / MOTION_MAX;
        // this.setState({ magnitude });
        this.fsm.handleMotionUpdate(magnitude);
    }

    loadPreset() {
        try {
            return deserializePreset(this.state.preset);
        } catch (e) {
            return JSON.parse(this.state.preset);
        }
    }

    getSerializedPreset = () => {
        return serializePreset(this.loadPreset());
    }
}

export default App;
