import React from 'react';
import Button from '@material-ui/core/Button';

class Mode extends React.Component {

    async componentDidMount() {
    }
  
    async componentWillUnmount() {
    }

    async start() {
      let data = {};
      if (this.props.simulation) {
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
    }
  
    async stop() {
      let data = {};
      if (this.props.simulation) {
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

    }

    render() {
        return (
            <div>
                <div>Mode: {this.props.mode} </div>
                <div>
                    <Button variant="contained" color="primary" onClick={this.start}>
                        Start
                    </Button>
                    <Button variant="contained" color="secondary" onClick={this.stop}>
                        Stop
                    </Button>
                </div>
            </div>
        );
    }
}

export default Speed;