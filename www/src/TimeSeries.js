import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

class TimeSeries extends React.Component {

    render() {
        return (
            <LineChart
                width={1000}
                height={500}
                data={this.props.data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="steps" stroke="#8884d8" isAnimationActive={false} />
                <Line type="monotone" dataKey="distance" stroke="#82ca9d" isAnimationActive={false} />
            </LineChart>
        );
    }
}

export default TimeSeries;