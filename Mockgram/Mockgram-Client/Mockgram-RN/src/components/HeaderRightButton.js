import React from "react";
import { connect } from "react-redux";
import Ionicon from "react-native-vector-icons/Ionicons";
import { UIActivityIndicator } from "react-native-indicators";

import theme from "../common/theme";

class HeaderRightButton extends React.Component {
  renderHeaderRightButton = () => {
    const { uploading } = this.props;
    if (uploading) {
      return (
        <UIActivityIndicator size={theme.iconMd} color={theme.primaryBlue} />
      );
    }
    return (
      <Ionicon name="md-send" size={theme.iconMd} color={theme.primaryBlue} />
    );
  };

  render() {
    return this.renderHeaderRightButton();
  }
}

const mapStateToProps = state => ({
  uploading: state.feed.uploading
});

export default connect(
  mapStateToProps,
  null
)(HeaderRightButton);
