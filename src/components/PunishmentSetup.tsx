import { deserializePreset, serializePreset } from '../serialization';
import PunishmentStateMachine from '../state';
import * as React from 'react';
import { defaultPreset } from '../models';


interface PunishmentSetupProps {
    fsm: PunishmentStateMachine;
    onBack(): void;
}

interface PunishmentSetupState {
    preset: string;
}


export default class WelcomeScreen extends React.Component<PunishmentSetupProps, PunishmentSetupState> {
    state = {
        preset: JSON.stringify(defaultPreset, null, 4),
    };

    render() {
        return (
            <div className="container my-4">
                <h2>Design or Carry Out a Custom Punishment</h2>

                <div className="row my-3">
                    <div className="col-md-10">
                        <button className="btn btn-primary btn-block btn-lg" onClick={this.start}>
                            Start the Custom Punishment Now
                        </button>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-secondary btn-block btn-lg" onClick={this.props.onBack}>
                            Back
                        </button>
                    </div>
                </div>

                <form className="form">
                    <div className="form-group">
                        <label>Custom punishment:</label>
                        <textarea
                            className="form-control"
                            rows={24}
                            cols={90}
                            value={this.state.preset}
                            onChange={this.onChange}
                        />
                        <small className="form-text text-muted">
                            In either JSON or "BEGIN CORNERTIME CUSTOM PUNISHMENT" format.
                        </small>
                    </div>
                </form>

                <p>
                    To have someone else use this preset without seeing its content, have them paste this
                    in the above field instead:
                </p>

                <pre>{this.getSerializedPreset()}</pre>
            </div>
        );
    }

    start = (event: React.MouseEvent<HTMLButtonElement>) => {
        const fsm = this.props.fsm;
        fsm.preset = this.loadPreset();

        // TODO having to call reset before getReady is implementation leaking out from the fsm
        fsm.reset();
        fsm.getReady();
    }

    loadPreset() {
        try {
            return deserializePreset(this.state.preset);
        } catch (e) {
            return JSON.parse(this.state.preset);
        }
    }

    getSerializedPreset = () => {
        try {
            return serializePreset(this.loadPreset());
        } catch (e) {
            return e.message;
        }
    }

    onChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
        this.setState({ preset: event.currentTarget.value });
    }
}
