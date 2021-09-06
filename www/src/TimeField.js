import React from 'react';

class TimeField extends React.Component {

    constructor(props) {
        super(props);
        this.secondsToHms = this.secondsToHms.bind(this);
      }

    secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
    
        var hDisplay = h < 10 ? "0"+h : h;
        var mDisplay = m < 10 ? "0"+m : m;
        var sDisplay = s < 10 ? "0"+s : s;

        return hDisplay + ":" + mDisplay + ":" + sDisplay; 
    }

    render() {
        return (
            <div> Time: {this.secondsToHms(this.props.time)} </div>
        );
    }
}

export default TimeField;