import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { locale } from "../common/locale";

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
    const { title, titleStyle, appLocale } = this.props;
    return (
      <View style={styles.titleContainer}>
        <Text style={titleStyle}>{`${locale[appLocale][title]}`}</Text>
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
  appLocale: state.app.appLocale
});

export default connect(
  mapStateToProps,
  null
)(HeaderTitle);
