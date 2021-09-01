import React from 'react';
import Button from '@material-ui/core/Button';

class Pad extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      status : { steps: 0,
        distance: 0,
        time: 0
      },
      connected : false,
      running : false,
      simulation : true
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.get_status = this.get_status.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  async componentDidMount() {
  }

  async componentWillUnmount() {
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
    this.setState({connected: true});
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
      this.setState({connected: false});
      console.log('Disconnected: ' + data)
  }

  async get_status() {
    let data = {};
    if (this.state.simulation) {
      console.log("SIMULATION");
      data = { steps: this.state.status.steps+1,
        distance: this.state.status.distance+1,
        time: this.state.status.time+1
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
    console.log('Status: ' + JSON.stringify(data, null, 2));
    this.setState({status: data});
  }

  async start () {
    let data = {};
    if (this.state.simulation) {
      console.log("SIMULATION");
      data = {
        "action": "Start",
        "result": "Success"
      }
    } 
    else {
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: {}
      };
      const response = await fetch('http://192.168.1.131:8000/api/v1/resources/walkingpad/start', requestOptions);
      data = await response.json();
    }
    console.log('Started: ' + JSON.stringify(data, null, 2));

    this.timerID = setInterval(
      async () => await this.get_status(),
      1000
    );
  }

  async stop () {
    let data = {};
    if (this.state.simulation) {
      console.log("SIMULATION");
      data = {
        "action": "Stop",
        "result": "Success"
      }
    } 
    else {
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: {}
      };
      const response = await fetch('http://192.168.1.131:8000/api/v1/resources/walkingpad/stop', requestOptions);
      data = await response.json();
    }
    console.log('Stopped: ' + JSON.stringify(data, null, 2));

    clearInterval(this.timerID);
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
        <h2> Steps: {this.state.status.steps}</h2>
        <h2> Distance: {this.state.status.distance} km</h2>
        <h2> Time: {this.state.status.time} s</h2>
      </div>
    );
  }
}

export default Pad;