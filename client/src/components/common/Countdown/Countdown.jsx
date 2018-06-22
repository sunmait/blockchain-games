import React from 'react';
import PropTypes from 'prop-types';

class Countdown extends React.Component {
  static propTypes = {
    start: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {
      elapsed: undefined,
      isDialShown: true,
    }
  }

  componentDidMount() {
    if (this.props.start + this.props.duration - Math.round(new Date()/1000)) {
      this.setState({
        isDialShown: false,
      });
    }
    this.timer = setInterval(this.tick, 1000);
  }

  componentWillMount() {
    clearInterval(this.timer);
  }

  tick = () => {
    if(this.state.elapsed <= 0) {
      clearInterval(this.timer);
      this.props.countdownEnded();
      this.setState({
        isDialShown: false,
      });
      return;
    }
    this.setState({
      elapsed: this.props.start + this.props.duration - Math.round(new Date()/1000),
    });
  };

  render() {
    const {start, countdownEnded, ...otherProps} = this.props;
    const days = Math.floor(this.state.elapsed / (60*60*24));
    const hours = Math.floor((this.state.elapsed % (60*60*24)) / (60*60));
    const minutes = Math.floor(((this.state.elapsed % (60*60*24)) % (60*60)) / 60);
    const seconds = ((this.state.elapsed % (60*60*24)) % (60*60)) % 60;

    if (this.state.isDialShown) {
      return (
        <div {...otherProps}>
          {days} D {hours} H {minutes} M {seconds} S
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Countdown;