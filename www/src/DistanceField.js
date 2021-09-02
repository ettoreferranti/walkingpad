import React from 'react';

class DistanceField extends React.Component {

    render() {
        return (
            <div> Distance: {this.props.distance} km </div>
        );
    }
}

export default DistanceField;