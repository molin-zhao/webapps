import React from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Permissions, ImagePicker } from "expo";
import { connect } from "react-redux";
import processImage from "../../utils/imageProcessing";
import theme from "../../common/theme";
import { locale } from "../../common/locale";

class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      permissionAllowed: false
    };
  }
  async componentWillMount() {
    const { status } = await Permissions.getAsync(Permissions.CAMERA);
    this.setState({
      permissionAllowed: status === "granted" ? true : false
    });
  }

  choosePhotoFromCamera = async () => {
    let capturedImage = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1]
    });
    if (!capturedImage.cancelled) {
      let processedImage = await processImage(capturedImage.uri);
      this.props.navigation.navigate("ImageFilter", {
        image: processedImage
      });
    }
  };

  render() {
    const { appLocale } = this.props;
    return (
      <View style={styles.container}>
        {this.state.permissionAllowed ? (
          <Button
            title={`${locale[appLocale]["TAKE_A_PHOTO"]}`}
            onPress={() => {
              this.choosePhotoFromCamera();
            }}
          />
        ) : (
          <View>
            <Text>{`${locale[appLocale]["SHOULD_ALLOW_ACCESS_FIRST"](
              locale[appLocale]["CAMERA"]
            )}`}</Text>
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={async () => {
                const { status } = await Permissions.askAsync(
                  Permissions.CAMERA
                );
                this.setState({
                  permissionAllowed: status === "granted" ? true : false
                });
              }}
            >
              <Text style={{ color: theme.primaryBlue }}>
                {`${locale[appLocale]["TAP_TO_ALLOW_ACCESS"]}`}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  appLocale: state.app.appLocale
});

export default connect(
  mapStateToProps,
  null
)(Camera);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
