import React from 'react';
import Button from '@material-ui/core/Button';

class Speed extends React.Component {

    async componentDidMount() {
    }
  
    async componentWillUnmount() {
    }

    async increase_speed() {
        this.set_speed(this.props.speed + 0.5)
    }

    async decrease_speed() {
        if ( this.props.speed >= 0.5) 
        { this.set_speed(this.props.speed - 0.5)
        }
    }
  
    async set_speed(speed) {
      let data = {};
      if (this.props.simulation) {
        console.log("SIMULATION");
        data = {
          "action": "Set Speed",
          "result": "Success"
        }
      }
      else {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: { 'speed': speed}
        };
        const response = await fetch('http://192.168.1.131:8000/api/v1/resources/walkingpad/speed', requestOptions);
        data = await response.json();
      }
      console.log('Speed set: ' + JSON.stringify(data, null, 2));
    }

    render() {
        return (
            <div>
                <div>Speed: {this.props.speed} km/h</div>
                <div>
                    <Button variant="contained" color="secondary" onClick={this.decrease_speed}>
                        -
                    </Button>
                    <Button variant="contained" color="secondary" onClick={this.increase_speed}>
                        +
                    </Button>
                </div>
            </div>
        );
    }
}

export default Speed;