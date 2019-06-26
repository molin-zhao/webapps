import React from "react";
import { Text } from "react-native";
import { Localization } from "expo";
import { connect } from "react-redux";
import { locale } from "../common/locale";
import PropTypes from "prop-types";

class I18nTabBarLabel extends React.Component {
  static defaultProps = {
    size: 12
  };

  static propTypes = {
    size: PropTypes.number
  };
  renderLabel = () => {
    const { appLocale, name } = this.props;
    if (appLocale) return `${locale[appLocale][name]}`;
    else if (locale[Localization.locale])
      return `${locale[Localization.locale][name]}`;
    else return `${locale["en-US"][name]}`;
  };
  render() {
    const { tintColor, focused, size } = this.props;
    return (
      <Text style={[{ color: focused ? tintColor : "black", fontSize: size }]}>
        {this.renderLabel()}
      </Text>
    );
  }
}

const mapStateToProps = state => ({
  appLocale: state.app.appLocale
});

export default connect(
  mapStateToProps,
  null
)(I18nTabBarLabel);
