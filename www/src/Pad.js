import React from 'react';
import Button from '@material-ui/core/Button';
import TimeField from './TimeField';
import StepsField from './StepsField';
import DistanceField from './DistanceField';
import TimeSeries from './TimeSeries';
import Speed from './Speed';
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
        mode: 0
      },
      connected: false,
      running: false,
      simulation: false,
      api_url : "localhost:8000",
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.get_status = this.get_status.bind(this);

  }

  async componentDidMount() {
    this.setState({ simulation: configData.simulation });
    this.setState({ api_url: configData.address.ip + ':' + configData.address.port });
  }

  async componentWillUnmount() {
    clearInterval(this.timerID);
  }

  async connect() {
    let data = {};
    if (this.state.simulation) {
      console.log("SIMULATION");
      data = {
        "action": "Connect",
        "result": "Success"
      }
    }
    else {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {}
      };
      const response = await fetch(this.state.api_url+'/api/v1/resources/walkingpad/connect', requestOptions);
      data = await response.json();
    }
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
    let data = {}
    if (this.state.simulation) {
      console.log("SIMULATION");
      data = {
        "action": "Disconnect",
        "result": "Success"
      }
    }
    else {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {}
      };
      const response = await fetch(this.state.api_url+'/api/v1/resources/walkingpad/disconnect', requestOptions);
      data = await response.json();
    }
    if (data.result === "Success") {
      this.setState({ connected: false });
      clearInterval(this.timerID);
    }
    console.log('Disconnected: ' + JSON.stringify(data, null, 2));
  }

  async get_status() {
    if (this.state.connected) {
      let data = {};
      if (this.state.simulation) {
        console.log("SIMULATION");
        data = {
          steps: this.state.status.steps + 1,
          distance: this.state.status.distance + 1,
          time: this.state.status.time + 1
        };
      }
      else {
        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        };
        const response = await fetch(this.state.api_url+'/api/v1/resources/walkingpad/status', requestOptions);
        data = await response.json();
      }
      this.setState({ status: data });
    }
  }

  render() {
    return (
      <div>
        <h2>
          <Button variant="contained" color="primary" onClick={this.connect}>
            Connect
          </Button>
          <Button variant="contained" color="secondary" onClick={this.disconnect}>
            Disconnect
          </Button>
        </h2>
        <h2><Mode mode={this.state.status.mode} simulation={this.state.simulation} url={this.state.api_url}/></h2>
        <h2><StepsField steps={this.state.status.steps} /></h2>
        <h2><DistanceField distance={this.state.status.distance} /></h2>
        <h2><TimeField time={this.state.status.time} /></h2>
        <h2><Speed speed={this.state.status.speed} simulation={this.state.simulation} url={this.state.api_url}/></h2>
        <h2><TimeSeries data={this.state.cumulative} /></h2>
      </div>
    );
  }
}

export default Pad;