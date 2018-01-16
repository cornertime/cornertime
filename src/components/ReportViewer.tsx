import { deserializeReport } from '../serialization';
import * as React from 'react';
import { Report } from '../models';
import ReportCard from './ReportCard';


interface ReportViewerProps {
    onBack(): void;
}


interface ReportViewerState {
    reportSource: string;
    report?: Report;
}


export default class ReportViewer extends React.Component<ReportViewerProps, ReportViewerState> {
    state: ReportViewerState = {
        reportSource: '',
    };

    render() {
        return (
            <div className="container my-4">
                <h2>View the Report of a Previous Punishment</h2>

                <button className="btn btn-secondary btn-block btn-lg my-4" onClick={this.props.onBack}>
                    Back
                </button>

                <form className="form">
                    <div className="form-group">
                        <label>Punishment report:</label>
                        <textarea
                            className="form-control"
                            rows={12}
                            cols={90}
                            value={this.state.reportSource}
                            onChange={this.onChange}
                        />
                        <small className="form-text text-muted">
                            If you instructed someone to take a punishment and received a punishment report
                            from them, enter the report here to view its contents.
                        </small>
                    </div>
                </form>

                {this.state.report ? <ReportCard report={this.state.report} /> : null}
            </div>
        );
    }

    onChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
        let reportSource = event.currentTarget.value;
        let report: Report | undefined = undefined;

        try {
            report = deserializeReport(reportSource);
        } catch (e) {
            // Wasn't a valid report. Won't show anything.
        }

        this.setState({ report, reportSource });
    }
}
