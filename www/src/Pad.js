import React from 'react';
import { Button, Grid, Typography,Paper } from '@material-ui/core';
import TimeField from './TimeField';
import StepsField from './StepsField';
import DistanceField from './DistanceField';
import Speed from './Speed';
import Belt from './Belt';
import Mode from './Mode';
import configData from './config.json'

class Pad extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      status: {
        steps: 0,
        distance: 0,
        time: 0,
        speed: 0,
        belt: 0,
        mode: 0,
      },
      connected: false,
      api_url: "localhost:8000",
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.get_status = this.get_status.bind(this);

  }

  async componentDidMount() {
    this.setState({ api_url: configData.address.ip + ':' + configData.address.port });
  }

  async componentWillUnmount() {
    clearInterval(this.timerID);
  }

  async connect() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {}
    };
    const response = await fetch(this.state.api_url + '/api/v1/resources/walkingpad/connect', requestOptions);
    let data = await response.json();
    if (data.result === "Success") {
      this.setState({ connected: true });
      this.timerID = setInterval(
        async () => await this.get_status(),
        1000
      );
    }

    console.log('Connected: ' + JSON.stringify(data, null, 2));
  }

  async disconnect() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {}
    };
    const response = await fetch(this.state.api_url + '/api/v1/resources/walkingpad/disconnect', requestOptions);
    let data = await response.json();

    if (data.result === "Success") {
      this.setState({ connected: false });
      clearInterval(this.timerID);
    }
    console.log('Disconnected: ' + JSON.stringify(data, null, 2));
  }

  async get_status() {
    if (this.state.connected) {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      };
      const response = await fetch(this.state.api_url + '/api/v1/resources/walkingpad/status', requestOptions);
      let data = await response.json();

      this.setState({ status: data });
    }
  }

  render() {
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={6} align="center">
            <Button color="primary" onClick={this.connect}>
              <Typography variant="h3">Connect</Typography>
              </Button>
          </Grid>
          <Grid item xs={6} align="center">
            <Button color="secondary" onClick={this.disconnect}>
            <Typography variant="h3">Disconnect</Typography>
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4} align="center">
            <Paper elevation={1}>
          <Typography variant="h4">
          <Mode mode={this.state.status.mode} />
          </Typography>
          </Paper>
          </Grid>
          <Grid item xs={4} align="center">
          <Paper elevation={1}>
          <Typography variant="h4">
            <Belt belt={this.state.status.belt} url={this.state.api_url} />
            </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4} align="center">
          <Paper elevation={1}>
          <Typography variant="h4">
            <Speed speed={this.state.status.speed} url={this.state.api_url} />
            </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4} align="center">
          <Paper elevation={1}>
          <Typography variant="h4">
            <StepsField steps={this.state.status.steps} />
            </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4} align="center">
          <Paper elevation={1}>
          <Typography variant="h4">
            <DistanceField distance={this.state.status.distance} />
            </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4} align="center">
          <Paper elevation={1}>
          <Typography variant="h4">
            <TimeField time={this.state.status.time} />
            </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>

    );
  }
}

export default Pad;