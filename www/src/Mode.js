import React from 'react';
import { Button, Typography } from '@material-ui/core';

class Mode extends React.Component {

    constructor(props) {
        super(props);
        this.mode = 'Unknown';
        switch(props.mode) {
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
        this.plus = this.plus.bind(this);
        this.minus = this.minus.bind(this);
        this.set_mode = this.set_mode.bind(this);
    }

    async componentDidMount() {
    }

    async componentWillUnmount() {
    }

    async plus() {
        let newMode = this.props.mode + 1;
        if (newMode > 2) {
            newMode = 0;
        }
        this.set_mode(newMode)
    }

    async minus() {
        let newMode = this.props.mode - 1;
        if (newMode < 0) {
            newMode = 2;
        }
        this.set_mode(newMode)
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
                <Button color="secondary" onClick={this.minus}>
                    <Typography variant="h4">-</Typography>
                </Button>
                Mode: {this.mode}
                <Button color="primary" onClick={this.plus}>
                    <Typography variant="h4">+</Typography>
                </Button>
            </div>
        );
    }
}

export default Mode;