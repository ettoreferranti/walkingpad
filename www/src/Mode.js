import React from 'react';
import { IconButton, Typography } from '@material-ui/core';

class Mode extends React.Component {

    constructor(props) {
        super(props);
        this.mode = 'Unknown';
        switch (props.mode) {
            case 0:
                this.mode = 'Auto';
                break;
            case 1:
                this.mode = 'Manual';
                break;
            case 2:
                this.mode = 'Standby';
                break;
            default:
                this.mode = 'Unknown';
                break;
        }
        this.buttonS = this.mode === 'Standby' ? "secondary" : "primary";
        this.buttonM = this.mode === 'Manual' ? "secondary" : "primary";
        this.buttonA = this.mode === 'Auto' ? "secondary" : "primary";
        this.standby = this.standby.bind(this);
        this.manual = this.manual.bind(this);
        this.auto = this.auto.bind(this);
        this.set_mode = this.set_mode.bind(this);
    }

    async componentDidMount() {
    }

    async componentWillUnmount() {
    }

    async standby() {
        this.set_mode(2)
    }

    async manual() {
        this.set_mode(1)
    }

    async auto() {
        this.set_mode(0)
    }

    async set_mode(newMode) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'mode': newMode })
        };
        const response = await fetch(this.props.url + '/api/v1/resources/walkingpad/mode', requestOptions);
        let data = await response.json();

        console.log('Mode setting: ' + JSON.stringify(data, null, 2));
    }



    render() {
        return (
            <div>
                <IconButton color={this.buttonS} onClick={this.standby}>
                    <Typography variant="h2">S</Typography>
                </IconButton>
                <IconButton color={this.buttonM} onClick={this.manual}>
                    <Typography variant="h2">M</Typography>
                </IconButton>
                <IconButton color={this.buttonA} onClick={this.auto}>
                    <Typography variant="h2">A</Typography>
                </IconButton>
            </div>
        );
    }
}

export default Mode;