import React from 'react';

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { steps: "0",
                  distance: "0",
                  time: "0"
                };
  }

  async componentDidMount() {
      // POST request using fetch with async/await
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: {}
      };
      const response = await fetch('http://192.168.1.131:8000/api/v1/resources/walkingpad/connect', requestOptions);
      const data = await response.json();
      console.log('Connected: ' + JSON.stringify(data, null, 2));
      //this.setState({ postId: data.id });

      this.timerID = setInterval(
      async () => await this.tick(),
      1000
    );
  }

  async componentWillUnmount() {
    clearInterval(this.timerID);
    /*const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {}
      };
      const response = await fetch('http://192.168.1.131:8000/api/v1/resources/walkingpad/disconnect', requestOptions);
      const data = await response.json();
      console.log('Disconnected: ' + data)*/
  }

  async tick() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    const response = await fetch('http://192.168.1.131:8000/api/v1/resources/walkingpad/status', requestOptions);
    const data = await response.json();
    console.log('Status: ' + JSON.stringify(data, null, 2));
    this.setState(data);
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2> Steps: {this.state.steps}</h2>
        <h2> Distance: {this.state.distance} km</h2>
        <h2> Time: {this.state.time} s</h2>
      </div>
    );
  }
}

export default Clock;