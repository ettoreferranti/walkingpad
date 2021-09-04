import React from 'react';
import Button from '@material-ui/core/Button';

class Speed extends React.Component {
  constructor(props) {
    super(props);
    this.set_speed = this.set_speed.bind(this);
    this.increase_speed = this.increase_speed.bind(this);
    this.decrease_speed = this.decrease_speed.bind(this);
  }

  async componentDidMount() {
  }

  async componentWillUnmount() {
  }

  async increase_speed() {
    this.set_speed(this.props.speed + 0.5)
  }

  async decrease_speed() {
    if (this.props.speed >= 0.5) {
      this.set_speed(this.props.speed - 0.5)
    }
  }

  async set_speed(speed) {
    console.log("Setting speed to " + speed);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'speed': speed })
    };
    const response = await fetch(this.props.url + '/api/v1/resources/walkingpad/speed', requestOptions);
    let data = await response.json();

    console.log('Speed set: ' + JSON.stringify(data, null, 2));
  }

  render() {
    return (
      <div>
        <div>Speed: {this.props.speed} km/h</div>
        <div>
          <Button variant="contained" color="primary" onClick={this.decrease_speed}>
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