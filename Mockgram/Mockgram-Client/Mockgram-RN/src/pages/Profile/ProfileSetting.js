import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SkypeIndicator } from "react-native-indicators";
import { ImagePicker, Permissions, FileSystem } from "expo";
import { connect } from "react-redux";
import {
  updateClientProfile,
  removeClientProfileAvatar
} from "../../redux/actions/profileActions";

import Thumbnail from "../../components/Thumbnail";
import Button from "../../components/Button";

import ActionSheet from "react-native-actionsheet";
import window from "../../utils/getDeviceInfo";
import baseUrl from "../../common/baseUrl";
import theme from "../../common/theme";
import { locale } from "../../common/locale";
import processImage from "../../utils/imageProcessing";

class ProfileSetting extends React.Component {
  mounted = false;
  constructor(props) {
    super(props);
    this.state = {
      avatarUri: "",
      nickname: "",
      bio: "",
      choosedImage: null,
      error: null,
      bioHeight: window.height * 0.1,
      processing: false
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <TouchableOpacity
        style={{ marginLeft: 20 }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <FontAwesome name="chevron-left" size={theme.iconMd} />
      </TouchableOpacity>
    )
  });

  componentDidMount() {
    this.mounted = true;
  }

  componentWillMount() {
    this.mounted = false;
  }

  removeProfileAvatar = () => {
    const { client, removeClientProfileAvatar } = this.props;
    let url = `${baseUrl.upload}/upload/profile/remove/avatar`;
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: client.token
      }
    })
      .then(res => res.json())
      .then(resJson => {
        console.log(resJson);
        if (this.mounted) {
          if (resJson.status === 200) {
            removeClientProfileAvatar();
          } else {
            this.setState({
              error: resJson.msg
            });
          }
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: err
        });
      });
  };

  uploadProfile = () => {
    const { client, updateProfile } = this.props;
    const { avatarUri, bio, nickname } = this.state;
    let formData = new FormData();
    formData.append("bio", bio);
    formData.append("nickname", nickname);
    if (avatarUri) {
      let fileName = avatarUri.split("/").pop();
      let match = /\.(\w+)$/.exec(fileName);
      let type = match ? `image/${match[1]}` : `image`;
      formData.append("avatar", {
        uri: avatarUri,
        name: fileName,
        type: type
      });
    }
    let url = `${baseUrl.upload}/upload/profile`;
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: client.token
      },
      body: formData
    })
      .then(res => res.json())
      .then(resJson => {
        console.log(resJson);
        if (this.mounted) {
          if (resJson.status === 200) {
            // should update client profile
            updateProfile(resJson.data);
          } else {
            this.setState({
              error: resJson.msg
            });
          }
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: err
        });
      });
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  updateHeight = height => {
    this.setState({
      bioHeight: height
    });
  };

  choosePhotoFromCamera = async () => {
    const { status } = await Permissions.getAsync(Permissions.CAMERA);
    if (status === "granted") {
      let capturedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1]
      });
      if (!capturedImage.cancelled) {
        let processedImage = await processImage(capturedImage.uri);
        this.setState({
          avatarUri: processedImage.uri
        });
      }
    }
    return;
  };

  choosePhotoFromLibrary = async () => {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      let capturedImage = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1
      });
      if (!capturedImage.cancelled) {
        let processedImage = await processImage(capturedImage.uri);
        this.setState({
          avatarUri: processedImage.uri
        });
      }
    }
  };

  resetAvatar = () => {
    let uri = this.state.avatarUri;
    this.setState({
      avatarUri: ""
    });
    FileSystem.deleteAsync(uri)
      .then(() => {
        console.log("file deleted");
      })
      .catch(err => {
        console.log(err);
      });
  };

  _getProfileAvatar = () => {
    const { profile } = this.props;
    if (profile) {
      return profile.avatar;
    }
    return "";
  };

  render() {
    const { profile, appLocale } = this.props;
    const { avatarUri, nickname, bio } = this.state;
    let _avatar = this._getProfileAvatar();
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            title={`${locale[appLocale]["CHANGE_PROFILE_AVATAR_TITLE"]}`}
            options={[
              `${locale[appLocale]["CHOOSE_A_PHOTO"]}`,
              `${locale[appLocale]["TAKE_A_PHOTO"]}`,
              `${locale[appLocale]["RESET"]}`,
              `${locale[appLocale]["REMOVE"]}`,
              `${locale[appLocale]["CANCEL"]}`
            ]}
            cancelButtonIndex={4}
            destructiveButtonIndex={3}
            onPress={index => {
              if (index === 0) {
                this.choosePhotoFromLibrary();
              } else if (index === 1) {
                this.choosePhotoFromCamera();
              } else if (index === 2) {
                this.resetAvatar();
              } else if (index === 3) {
                this.removeProfileAvatar();
              }
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={this.showActionSheet}
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: theme.marginTop,
              width: 80,
              height: 80
            }}
          >
            <Thumbnail
              style={{ width: 80, height: 80 }}
              source={avatarUri ? avatarUri : _avatar}
            />
          </TouchableOpacity>
          <View style={styles.profile}>
            <View style={styles.itemCol}>
              <View style={styles.itemLabel}>
                <Text>{`${locale[appLocale]["NICKNAME"]}`}</Text>
              </View>
              <TextInput
                style={{ width: "100%" }}
                placeholder={profile ? profile.nickname : ""}
                value={nickname}
                onChangeText={text => {
                  this.setState({ nickname: text });
                }}
              />
            </View>
            <View style={[styles.itemCol, { height: this.state.bioHeight }]}>
              <View style={styles.itemLabel}>
                <Text>{`${locale[appLocale]["BIO"]}`}</Text>
              </View>
              <TextInput
                style={{ width: "100%" }}
                editable={true}
                multiline={true}
                numberOfLines={3}
                placeholder={profile ? profile.bio : ""}
                value={bio}
                onChangeText={text => {
                  this.setState({ bio: text });
                }}
              />
            </View>
            <Button
              loading={this.state.processing}
              title={`${locale[appLocale]["UPDATE"]}`}
              titleStyle={{ color: "#fff", fontSize: 12 }}
              iconLeft={() => {
                let valid = avatarUri || bio || nickname;
                if (valid) {
                  return null;
                }
                return <FontAwesome name="ban" size={18} color="#fff" />;
              }}
              disabled={
                this.state.processing || !(avatarUri || bio || nickname)
              }
              onPress={() => this.uploadProfile()}
              containerStyle={StyleSheet.flatten(styles.updateBtn)}
              loadingIndicator={() => (
                <SkypeIndicator size={theme.iconSm} color={theme.primaryGrey} />
              )}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client.client,
  profile: state.profile.profile,
  appLocale: state.app.appLocale
});

const mapDispatchToProps = dispatch => ({
  updateProfile: profile => dispatch(updateClientProfile(profile)),
  removeClientProfileAvatar: () => dispatch(removeClientProfileAvatar())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileSetting);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white"
  },
  profile: {
    marginTop: 30,
    width: window.width,
    alignItems: "center",
    justifyContent: "center"
  },
  itemCol: {
    marginTop: 20,
    height: window.height * 0.08,
    width: "80%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey"
  },
  itemLabel: {
    justifyContent: "center",
    alignItems: "flex-start",
    height: window.height * 0.03
  },
  updateBtn: {
    width: 90,
    height: 40,
    backgroundColor: theme.primaryColor,
    marginTop: 50
  }
});
