import React from 'react';
import Button from '@material-ui/core/Button';
import TimeField from './TimeField';
import StepsField from './StepsField';
import DistanceField from './DistanceField';
import TimeSeries from './TimeSeries';
import Speed from './Speed';
import Mode from './Mode';

class Pad extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      status: {
        steps: 0,
        distance: 0,
        time: 0,
        speed: 0
      },
      connected: false,
      running: false,
      simulation: false,
      cumulative: [
        {
          steps: 0,
          distance: 0.1,
          time: 0
        },
        {
          steps: 2,
          distance: 0.2,
          time: 1
        },
        {
          steps: 4,
          distance: 0.3,
          time: 2
        },
        {
          steps: 6,
          distance: 0.4,
          time: 3
        }
      ]
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.get_status = this.get_status.bind(this);

  }

  async componentDidMount() {
    this.timerID = setInterval(
      async () => await this.get_status(),
      1000
    );
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
      const response = await fetch('http://192.168.1.131:8000/api/v1/resources/walkingpad/connect', requestOptions);
      data = await response.json();
    }
    if (data.result === "Success") {
      this.setState({ connected: true });
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
      const response = await fetch('http://192.168.1.131:8000/api/v1/resources/walkingpad/disconnect', requestOptions);
      data = await response.json();
    }
    this.setState({ connected: false });
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
        const response = await fetch('http://192.168.1.131:8000/api/v1/resources/walkingpad/status', requestOptions);
        data = await response.json();
      }
      //console.log('Status: ' + JSON.stringify(data, null, 2));
      this.setState({ status: data });
      //let additional = this.state.cumulative;
      //additional.push(data);
      //this.setState({cumulative: additional});
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
        <h2>
          <Button variant="contained" color="primary" onClick={this.start}>
            Start
          </Button>
          <Button variant="contained" color="secondary" onClick={this.stop}>
            Stop
          </Button>
        </h2>
        <h1>Current Status:</h1>
        <h2><Mode mode={this.state.mode} simulation={this.state.simulation} /></h2>
        <h2><StepsField steps={this.state.status.steps} /></h2>
        <h2><DistanceField distance={this.state.status.distance} /></h2>
        <h2><TimeField time={this.state.status.time} /></h2>
        <h2><Speed speed={this.state.status.speed} simulation={this.state.simulation} /></h2>
        <h2><TimeSeries data={this.state.cumulative} /></h2>
      </div>
    );
  }
}

export default Pad;