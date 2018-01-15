import * as React from 'react';
import { Report, Event } from '../models';
import { formatDuration } from '../time';


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
}


export default class ReportCard extends React.Component<ReportCardProps, {}> {
    render() {
        const report = this.props.report;

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <strong>Punishment report</strong>
                </div>
                <table className="table table-striped">
                    <tbody>
                        <tr>
                            <th>Name:</th>
                            <td>{report.name}</td>
                        </tr>

                        <tr>
                            <th>Preset:</th>
                            <td>{report.presetTitle}</td>
                        </tr>

                        <tr>
                            <th>Started at:</th>
                            <td>{report.startedAt}</td>
                        </tr>

                        <tr>
                            <th>Initial duration:</th>
                            <td>{formatDuration(report.initialDuration)}</td>
                        </tr>

                        <tr>
                            <th>Total duration:</th>
                            <td>{formatDuration(report.totalDuration)}</td>
                        </tr>

                        <tr>
                            <th>Number of violations:</th>
                            <td>{report.violations}</td>
                        </tr>

                        <tr>
                            <th>Events</th>
                            <td>
                                <table className="table table-bordered table-striped">
                                    <tbody>
                                        {report.events.map(event => (
                                            <tr key={event.time}>
                                                <td className="text-right">{formatDuration(event.time)}</td>
                                                <td>{formatEventMessage(event)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
