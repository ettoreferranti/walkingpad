import React from 'react';
import {Button,Typography} from '@material-ui/core';

class Belt extends React.Component {

  constructor(props) {
    super(props);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  async componentDidMount() {
  }

  async componentWillUnmount() {
  }

  async start() {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {}
    };
    const response = await fetch(this.props.url + '/api/v1/resources/walkingpad/start', requestOptions);
    let data = await response.json();

    console.log('Started: ' + JSON.stringify(data, null, 2));
  }

  async stop() {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {}
    };
    const response = await fetch(this.props.url + '/api/v1/resources/walkingpad/stop', requestOptions);
    let data = await response.json();

    console.log('Stopped: ' + JSON.stringify(data, null, 2));

  }

  render() {
    return (
      <div>
          <Button color="primary" onClick={this.start}>
            <Typography variant="h4">Start</Typography>
          </Button>
          <div>Belt: {this.props.belt}</div>
          <Button color="secondary" onClick={this.stop}>
            <Typography variant="h4">Stop</Typography>
          </Button>
      </div>
    );
  }
}

export default Belt;