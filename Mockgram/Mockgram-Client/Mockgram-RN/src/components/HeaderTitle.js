import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class HeaderTitle extends React.Component {
  static defaultProps = {
    titleStyle: {
      fontSize: 14,
      fontWeight: "bold"
    }
  };
  static propTypes = {
    titleStyle: PropTypes.object
  };
  render() {
    const { title, titleStyle, i18n } = this.props;
    return (
      <View style={styles.titleContainer}>
        <Text style={titleStyle}>{`${i18n.t(title)}`}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = state => ({
  i18n: state.app.i18n
});

export default connect(
  mapStateToProps,
  null
)(HeaderTitle);
