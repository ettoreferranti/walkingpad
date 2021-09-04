import React from 'react';
import Button from '@material-ui/core/Button';
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
        <h2>
          <Button variant="contained" color="primary" onClick={this.connect}>
            Connect
          </Button>
          <Button variant="contained" color="secondary" onClick={this.disconnect}>
            Disconnect
          </Button>
        </h2>
        <h2><Mode belt={this.state.status.mode}/></h2>
        <h2><Belt belt={this.state.status.belt} url={this.state.api_url} /></h2>
        <h2><StepsField steps={this.state.status.steps} /></h2>
        <h2><DistanceField distance={this.state.status.distance} /></h2>
        <h2><TimeField time={this.state.status.time} /></h2>
        <h2><Speed speed={this.state.status.speed} url={this.state.api_url} /></h2>
      </div>
    );
  }
}

export default Pad;