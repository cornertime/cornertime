import * as React from 'react';
import { Report, Event } from '../models';
import { formatDuration } from '../time';
import { serializeReport } from '../serialization';


function formatEventMessage(event: Event) {
    switch (event.eventType) {
        case 'getReady':
            return `Preparation started.`;

        case 'start':
            return `Punishment started.`;

        case 'scold':
            return `Scolded for moving.`;

        case 'encourage':
            return `Encouragement given.`;

        case 'penalize':
            return `Penalized for moving. Time added: ${formatDuration(event.adjustment)}`;

        case 'end':
            return `Punishment finished.`;

        default:
            return `Unknown event type!`;
    }
}


interface ReportCardProps {
    report: Report;
    showMessage?: boolean;
}


export default class ReportCard extends React.Component<ReportCardProps, {}> {
    render() {
        const report = this.props.report;

        return (
            <div className="container my-4">
                {this.props.showMessage ? (
                    <div className="jumbotron">
                        <h1 className="display-3">Your punishment is over.</h1>
                        <p className="lead">
                            I hope you have learned your lesson. If not, I'll be seeing you again!
                        </p>
                        <a href="/" className="btn btn-primary btn-block btn-lg">
                            I did not Learn My Lesson! I need another punishment.
                        </a>
                    </div>
                ) : null}

                <h2 className="my-3">Punishment report</h2>

                <table className="table">
                    <tbody>
                        {/* <tr>
                            <td>Name:</td>
                            <td>{report.name}</td>
                        </tr>

                        <tr>
                            <td>Preset:</td>
                            <td>{report.presetTitle}</td>
                        </tr> */}

                        <tr>
                            <td>Started at:</td>
                            <td>{report.startedAt}</td>
                        </tr>

                        <tr>
                            <td>Initial duration:</td>
                            <td>{formatDuration(report.initialDuration)}</td>
                        </tr>

                        <tr>
                            <td>Total duration:</td>
                            <td>{formatDuration(report.totalDuration)}</td>
                        </tr>

                        <tr>
                            <td>Number of movement violations:</td>
                            <td>{report.violations}</td>
                        </tr>
                    </tbody>
                </table>

                <table className="table my-4">
                    <thead>
                        <tr>
                            <th className="text-right">Time</th>
                            <th>Event</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.events.filter(event =>
                            event.eventType !== 'getReady' && event.eventType !== 'start'
                        ).map(event => (
                            <tr key={event.time}>
                                <td className="text-right">{formatDuration(event.time)}</td>
                                <td>{formatEventMessage(event)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {this.props.showMessage ? (
                    <div>
                        <p className="my-4"><small>
                            If you were instructed by someone to take this punishment, you can give them this encoded
                            report that contains the same information as you see above:
                        </small></p>

                        <pre>{serializeReport(report)}</pre>
                    </div>
                ) : null}
            </div>
        );
    }
}
