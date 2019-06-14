import React from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Permissions, ImagePicker } from "expo";
import { connect } from "react-redux";
import processImage from "../../utils/imageProcessing";

import theme from "../../common/theme";

class Libray extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      permissionAllowed: false
    };
  }

  async componentWillMount() {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    this.setState({
      permissionAllowed: status === "granted" ? true : false
    });
  }

  choosePhotoFromLibrary = async () => {
    let capturedImage = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });
    if (!capturedImage.cancelled) {
      let processedImage = await processImage(capturedImage.uri);
      this.props.navigation.navigate("ImageFilter", {
        image: processedImage
      });
    }
  };
  render() {
    const { i18n } = this.props;
    return (
      <View style={styles.container}>
        {this.state.permissionAllowed ? (
          <Button
            title={`${i18n.t("CHOOSE_A_PHOTO")}`}
            onPress={() => {
              this.choosePhotoFromLibrary();
            }}
          />
        ) : (
          <View>
            <Text>{`${i18n.t("SHOULD_ALLOW_ACCESS_FIRST", {
              value: i18n.t("LIBRARY")
            })}`}</Text>
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={async () => {
                const { status } = await Permissions.askAsync(
                  Permissions.CAMERA_ROLL
                );
                this.setState({
                  permissionAllowed: status === "granted" ? true : false
                });
              }}
            >
              <Text style={{ color: theme.primaryBlue }}>
                {`${i18n.t("TAP_TO_ALLOW_ACCESS")}`}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  i18n: state.app.i18n
});

export default connect(
  mapStateToProps,
  null
)(Libray);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
