import React from 'react';

class TimeField extends React.Component {

    render() {
        return (
            <div> Time: {this.props.time} s </div>
        );
    }
}

export default TimeField;