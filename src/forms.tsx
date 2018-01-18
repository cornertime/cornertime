import * as React from 'react';


export interface FieldProps {
    name: string;
    label: string;
    helpText?: string;
}


export interface TextFieldProps extends FieldProps {
    value: string;
    onChange(event: React.FormEvent<HTMLInputElement>): void;
}


export const TextField = (props: TextFieldProps) => (
    <div className="form-group row">
        <label className="col-sm-3 col-form-label">{props.label}</label>
        <div className="col-sm-9">
            <input
                className="form-control"
                name={props.name}
                type="text"
                maxLength={255}
                value={props.value}
                onChange={props.onChange}
            />
            {props.helpText ? <small className="form-text text-muted">{props.helpText}</small> : null}
        </div>
    </div>
);


export interface NumericFieldProps extends FieldProps {
    value: number;
    onChange(event: React.FormEvent<HTMLInputElement>): void;
}


export const SecondsField = (props: NumericFieldProps) => (
    <div className="form-group row">
        <label className="col-sm-3 col-form-label">{props.label}</label>
        <div className="col-sm-9">
            <input
                className="form-control"
                name={props.name}
                type="number"
                min={0}
                max={86400}
                value={props.value}
                onChange={props.onChange}
            />
            {props.helpText ? <small className="form-text text-muted">{props.helpText}</small> : null}
        </div>
    </div>
);


export const ProbabilityField = (props: NumericFieldProps) => (
    <div className="form-group row">
        <label className="col-sm-3 col-form-label">{props.label}</label>
        <div className="col-sm-9">
            <input
                className="form-control"
                name={props.name}
                type="number"
                min={0.0}
                max={1.0}
                step={0.01}
                value={props.value}
                onChange={props.onChange}
            />
            {props.helpText ? <small className="form-text text-muted">{props.helpText}</small> : null}
        </div>
    </div>
);


export interface MultiLineFieldProps extends FieldProps {
    value: string;
    onChange(event: React.FormEvent<HTMLTextAreaElement>): void;
}


export const MultiLineField = (props: MultiLineFieldProps) => (
    <div className="form-group row">
        <label className="col-sm-3 col-form-label">{props.label}</label>
        <div className="col-sm-9">
            <textarea
                rows={6}
                className="form-control"
                name={props.name}
                value={props.value}
                onChange={props.onChange}
            />
            {props.helpText ? <small className="form-text text-muted">{props.helpText}</small> : null}
        </div>
    </div>
);
