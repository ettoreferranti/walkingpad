import React from 'react';
import Button from '@material-ui/core/Button';
import Pad from './Pad';

class PadGUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pad: Pad()};
  }

  async componentDidMount() {
      
  }

  async componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h2>
          <Button variant="contained" color="primary">
            Connect
          </Button>
          <Button variant="contained" color="secondary">
            Disconnect
          </Button>
        </h2>
        <h1>Current Status:</h1>
        <h2> Steps: {this.state.pad.state.status.steps}</h2>
        <h2> Distance: {this.state.pad.state.status.distance} km</h2>
        <h2> Time: {this.state.pad.state.status.time} s</h2>
      </div>
    );
  }
}

export default PadGUI;