import React from "react";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
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
      <Ionicons name="md-send" size={theme.iconMd} color={theme.primaryBlue} />
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
