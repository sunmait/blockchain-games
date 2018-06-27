import React from 'react';
import PropTypes from 'prop-types';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

class NumberPicker extends React.Component {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    range: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      range: props.range || [1, 10],
    }
  }

  toggleDropdownButtonState = (elem) => {
    this.setState({
      title: elem,
    });
    this.props.handleValueChanged(elem);
  };

  renderMenuItems = () => {
    const range = [];
    for (let i = this.state.range[0]; i <= this.state.range[1]; i++) {
      range.push(i);
    }
    return range.map((elem) => {
      return (
        <MenuItem
          key={elem}
          onSelect={() => this.toggleDropdownButtonState(elem)}
        >
          {elem}
        </MenuItem>
      )
    })
  };

  render() {
    const {title, range, handleValueChanged, ...otherProps} = this.props;
    return (
      <DropdownButton
        {...otherProps}
        title={this.state.title}
        id={1}
      >
        {this.renderMenuItems()}
      </DropdownButton>
    );
  }
}

export default NumberPicker;