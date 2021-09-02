import React from 'react';

class StepsField extends React.Component {

    render() {
        return (
            <div> Move: {this.props.steps} steps </div>
        );
    }
}

export default StepsField;