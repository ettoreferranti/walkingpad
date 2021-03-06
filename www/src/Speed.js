import React from 'react';
import { Button, Typography } from '@material-ui/core';
import GaugeChart from 'react-gauge-chart';

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
        <div>
        <Button color="secondary" onClick={this.decrease_speed}>
            <Typography variant="h4">-</Typography>
          </Button>
          Speed: {this.props.speed} km/h
          <Button color="primary" onClick={this.increase_speed}>
            <Typography variant="h4">+</Typography>
          </Button>
        </div>
        <GaugeChart
            id="speed_gauge"
            nrOfLevels={3}
            percent={this.props.speed/6.0}
            animate={false}
            hideText={true}
          />
      </div>
    );
  }
}

export default Speed;

/*
<GaugeChart
            id="speed_gauge"
            nrOfLevels={3}
            percent={this.props.speed/6.0}
            animate={false}
          />
          */