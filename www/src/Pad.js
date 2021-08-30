import React from 'react';

class Pad extends React.Component {
  constructor(props) {
    super(props);
    this.state = { status: { 
                        steps: "0",
                        distance: "0",
                        time: "0"
                    },
                    connected: false
                };
  }

  async connect() {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {}
    };
    const response = await fetch('http://192.168.1.131:8000/api/v1/resources/walkingpad/connect', requestOptions);
    const data = await response.json();
    this.setState(prevState => {
        let currentState = Object.assign({}, prevState);
        currentState.connected = true;            
        return { currentState };
      })
    console.log('Connected: ' + JSON.stringify(data, null, 2));
  }

  async disconnect() {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {}
      };
      const response = await fetch('http://192.168.1.131:8000/api/v1/resources/walkingpad/disconnect', requestOptions);
      const data = await response.json();
      this.setState(prevState => {
        let currentState = Object.assign({}, prevState);
        currentState.connected = false;            
        return { currentState };
      })
      console.log('Disconnected: ' + data)
  }

  async get_status() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    const response = await fetch('http://192.168.1.131:8000/api/v1/resources/walkingpad/status', requestOptions);
    const data = await response.json();
    console.log('Status: ' + JSON.stringify(data, null, 2));
    this.setState(prevState => {
        let currentState = Object.assign({}, prevState);
        currentState.status = data;            
        return { currentState };
      })
  }

  async start () {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {}
    };
    const response = await fetch('http://192.168.1.131:8000/api/v1/resources/walkingpad/start', requestOptions);
    const data = await response.json();
    console.log('Started: ' + JSON.stringify(data, null, 2));
  }

  async stop () {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {}
    };
    const response = await fetch('http://192.168.1.131:8000/api/v1/resources/walkingpad/stop', requestOptions);
    const data = await response.json();
    console.log('Started: ' + JSON.stringify(data, null, 2));
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
}

export default Pad;