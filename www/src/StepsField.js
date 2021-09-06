import React from 'react';
import GaugeChart from 'react-gauge-chart';

class StepsField extends React.Component {

    render() {
        return (
            <div>
                <div> Move: {this.props.steps} steps </div>
                <GaugeChart
                    id="steps_gauge"
                    nrOfLevels={20}
                    percent={this.props.steps / this.props.maxsteps}
                    animate={false}
                    hideText={true}
                />
            </div>

        );
    }
}

export default StepsField;