import React from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Permissions, ImagePicker } from "expo";
import { connect } from "react-redux";
import processImage from "../../utils/imageProcessing";

import { updateAppPermission } from "../../redux/actions/appActions";
import * as LocalKeys from "../../common/localKeys";
import theme from "../../common/theme";
import { locale } from "../../common/locale";

class Libray extends React.Component {
  constructor(props) {
    super(props);
  }

  choosePhotoFromLibrary = async () => {
    let capturedImage = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });
    if (!capturedImage.cancelled) {
      let processedImage = await processImage(capturedImage.uri);
      this.props.navigation.push("ImageFilter", {
        image: processedImage
      });
    }
  };
  render() {
    const { appLocale, libraryPermission, updateAppPermission } = this.props;
    return (
      <View style={styles.container}>
        {libraryPermission ? (
          <Button
            title={`${locale[appLocale]["CHOOSE_A_PHOTO"]}`}
            onPress={() => {
              this.choosePhotoFromLibrary();
            }}
          />
        ) : (
          <View>
            <Text>{`${locale[appLocale]["SHOULD_ALLOW_ACCESS_FIRST"](
              locale[appLocale]["LIBRARY"]
            )}`}</Text>
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={async () => {
                const { status } = await Permissions.askAsync(
                  Permissions.CAMERA_ROLL
                );
                let val = status === "granted" ? true : false;
                updateAppPermission(LocalKeys.PERMISSION_LIBRARY, val);
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
  libraryPermission: state.app.libraryPermission
});

const mapDispatchToProps = dispatch => ({
  updateAppPermission: (type, value) =>
    dispatch(updateAppPermission(type, value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Libray);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
