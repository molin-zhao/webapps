import React from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Permissions, ImagePicker } from "expo";
import { connect } from "react-redux";

import processImage from "../../utils/imageProcessing";
import theme from "../../common/theme";
import { locale } from "../../common/locale";
import * as LocalKeys from "../../common/localKeys";
import { updateAppPermission } from "../../redux/actions/appActions";

class Camera extends React.Component {
  constructor(props) {
    super(props);
  }

  choosePhotoFromCamera = async () => {
    let capturedImage = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1]
    });
    if (!capturedImage.cancelled) {
      let processedImage = await processImage(capturedImage.uri);
      this.props.navigation.push("ImageFilter", {
        image: processedImage
      });
    }
  };

  render() {
    const { appLocale, cameraPermission, updateAppPermission } = this.props;
    return (
      <View style={styles.container}>
        {cameraPermission ? (
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
                let val = status === "granted" ? true : false;
                updateAppPermission(LocalKeys.PERMISSION_CAMERA, val);
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
  appLocale: state.app.appLocale,
  cameraPermission: state.app.cameraPermission
});

const mapDispatchToProps = dispatch => ({
  updateAppPermission: (type, value) =>
    dispatch(updateAppPermission(type, value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Camera);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
