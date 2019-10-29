import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Location, Permissions, FileSystem, ImagePicker, Video } from "expo";
import { createStackNavigator } from "react-navigation";
import { connect } from "react-redux";
import ActionSheet from "react-native-actionsheet";
import {
  addToHeadOfHomeFeed,
  uploadingPost,
  uploadedPost,
  removeAImage
} from "../../redux/actions/feedActions";
import { addToTopClientProfilePost } from "../../redux/actions/profileActions";

import DropdownAlert from "../../components/DropdownAlert";
import PostRightButton from "../../components/HeaderRightButton";
import TagPage from "./Tag";
import MentionPage from "./Mention";
import LocationPage from "./Location";

import window from "../../utils/getDeviceInfo";
import baseUrl from "../../common/baseUrl";
import theme from "../../common/theme";
import { locale } from "../../common/locale";
import * as Types from "../../common/types";
import config from "../../common/config";
import processImage from "../../utils/imageProcessing";

const imageThumbnailWidth = Math.round(window.width * 0.32);
const imageThumbnailMargin = Math.floor(window.width * 0.01);

class PostPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      location: null,
      selectedTags: {},
      mentionedUsers: {},
      error: null,
      info: "Success!"
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      borderBottomColor: "transparent",
      borderBottomWidth: 0,
      shadowColor: "transparent",
      elevation: 0
    },
    title: navigation.getParam("previewTitle"),
    headerTitleStyle: {
      fontSize: 14
    },
    headerLeft: (
      <TouchableOpacity
        style={{ marginLeft: theme.headerIconMargin }}
        onPress={() => {
          let previewDismiss = navigation.getParam("previewDismiss");
          return previewDismiss();
        }}
      >
        <Ionicons name="ios-arrow-back" size={theme.iconMd} />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        style={{ marginRight: theme.headerIconMargin }}
        onPress={() => {
          let handlePost = navigation.getParam("handlePost");
          return handlePost();
        }}
      >
        <PostRightButton />
      </TouchableOpacity>
    )
  });

  componentDidMount() {
    const { navigation, appLocale } = this.props;
    navigation.setParams({
      handlePost: this.makePost,
      previewDismiss: this.dismiss,
      previewTitle: `${locale[appLocale]["EDIT_POST"]}`
    });
  }

  dismiss = () => {
    this._actionSheet.show();
  };

  makePost = () => {
    const { description, selectedTags, mentionedUsers, location } = this.state;
    const {
      client,
      navigation,
      addToHomeFeed,
      addToCLientProfilePost,
      uploadingPost,
      uploadedPost,
      appLocale,
      uploadImages
    } = this.props;
    let images = uploadImages.map(img => {
      let fileName = img.uri.split("/").pop();
      let match = /\.(\w+)$/.exec(fileName);
      let type = null;
      if (img.type === Types.PHOTO) {
        type = match ? `image/${match[1]}` : `image`;
      } else {
        type = match ? `video/${match[1]}` : `video`;
      }
      return {
        uri: img.uri,
        name: fileName,
        type
      };
    });
    let formData = new FormData();
    images.forEach(img => formData.append("post", img));
    formData.append("description", description);
    formData.append("tags", JSON.stringify(Object.keys(selectedTags)));
    formData.append("mention", JSON.stringify(Object.keys(mentionedUsers)));
    formData.append("location", JSON.stringify(location));
    if (!client) return navigation.navigate("Auth");
    this.setState({
      error: null
    });
    uploadingPost();
    // let url = `${baseUrl.upload}/upload/post`;
    let url = `http://10.1.3.33:3032/upload/post`;
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
        if (resJson.status === 200) {
          addToHomeFeed(resJson.data);
          addToCLientProfilePost(resJson.data);
          setTimeout(() => {
            navigation.navigate("Home");
          }, 4000);
          this.setState(
            {
              info: `${locale[appLocale]["UPLOAD_POST_SUCCESS"]}`,
              error: null
            },
            () => {
              this._dropdown.show();
              uploadedPost();
            }
          );
        } else {
          this.setState(
            {
              info: null,
              error: `${locale[appLocale]["UPLOAD_POST_ERROR"]}`
            },
            () => {
              this._dropdown.show();
              uploadedPost();
            }
          );
        }
      })
      .catch(err => {
        console.log(err);
        this.setState(
          {
            info: null,
            error: `${locale[appLocale]["NETWORK_REQUEST_ERROR"]}`
          },
          () => {
            this._dropdown.show();
            uploadedPost();
          }
        );
      });
  };

  generateLocation = (coords, address) => {
    return {
      name: address.name,
      country: address.country,
      isoCountryCode: address.isoCountryCode,
      city: address.city,
      region: address.region,
      postalCode: address.postalCode,
      street: address.street,
      coordinates: {
        type: "Point",
        coords: {
          latitude: coords.latitude,
          longitude: coords.longitude
        }
      }
    };
  };

  getLocationAsync = async () => {
    // check if app has already been granted access to location
    const getLocationResponse = await Permissions.getAsync(
      Permissions.LOCATION
    );
    if (getLocationResponse.status !== "granted") {
      const askLocationResponse = await Permissions.askAsync(
        Permissions.LOCATION
      );
      if (askLocationResponse.status !== "granted") {
        return this.setState(
          {
            error: "You should allow permission to access your location"
          },
          () => {
            this._dropdown.show();
          }
        );
      }
    }
    let { coords } = await Location.getCurrentPositionAsync();
    const { latitude, longitude } = coords;
    return { latitude, longitude };
  };

  renderDropdownAlert = () => {
    const { error, info } = this.state;
    if (!error) {
      return (
        <View style={[styles.dropdown]}>
          <View
            style={{
              marginLeft: theme.paddingToWindow,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <Ionicons
              name="ios-checkmark-circle-outline"
              size={theme.iconMd}
              color={theme.primaryGreen}
            />
            <Text
              style={{ marginLeft: 10, color: theme.primaryGreen }}
            >{`${info}`}</Text>
          </View>
          <Ionicons
            name="md-close"
            size={theme.iconSm}
            color="black"
            style={{ marginRight: theme.paddingToWindow }}
            onPress={() => {
              this._dropdown.hide();
            }}
          />
        </View>
      );
    }
    return (
      <View style={[styles.dropdown, { borderColor: theme.primaryDanger }]}>
        <View
          style={{
            marginLeft: theme.paddingToWindow,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Ionicons
            name="ios-close-circle-outline"
            size={theme.iconMd}
            color={theme.primaryDanger}
          />
          <Text
            style={{ marginLeft: 10, color: theme.primaryDanger }}
          >{`${error}`}</Text>
        </View>
        <Ionicons
          name="md-close"
          size={theme.iconSm}
          color="black"
          style={{ marginRight: theme.paddingToWindow }}
          onPress={() => {
            this._dropdown.hide();
          }}
        />
      </View>
    );
  };

  renderImages = () => {
    const { uploadImages, removeAImage } = this.props;
    return (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          alignItems: "flex-start"
        }}
      >
        {uploadImages.map((img, index) => (
          <View
            key={index}
            style={{
              width: imageThumbnailWidth,
              height: imageThumbnailWidth,
              marginLeft: (index + 1) % 3 === 0 ? imageThumbnailMargin : 0,
              marginRight: (index + 1) % 3 === 0 ? imageThumbnailMargin : 0,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {img.type === Types.PHOTO ? (
              <Image
                source={{ uri: img.uri }}
                style={{
                  width: "90%",
                  height: "90%",
                  borderRadius: 5
                }}
              />
            ) : (
              <Video
                source={{ uri: img.uri }}
                style={{
                  width: "90%",
                  height: "90%",
                  borderRadius: 5
                }}
                shouldPlay
                isLooping
                isMuted
                resizeMode="cover"
              />
            )}

            {index > 0 ? (
              <FontAwesome
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  backgroundColor: "transparent"
                }}
                size={theme.iconLg}
                name="times"
                onPress={() => {
                  removeAImage(img);
                }}
              />
            ) : null}
          </View>
        ))}
        {uploadImages.length < config.MAX_COUNT_UPLOAD ? (
          <TouchableOpacity
            style={{
              width: imageThumbnailWidth,
              height: imageThumbnailWidth,
              marginLeft:
                (uploadImages.length - 1) % 3 === 0 ? imageThumbnailMargin : 0,
              marginRight:
                (uploadImages.length - 1) % 3 === 0 ? imageThumbnailMargin : 0,
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => {
              this._addImageSheet.show();
            }}
          >
            <View
              style={{
                width: "90%",
                height: "90%",
                borderRadius: 5,
                backgroundColor: theme.primaryGrey,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Ionicons size={theme.iconLg} name="md-add" />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  render() {
    const { selectedTags, mentionedUsers, location } = this.state;
    const { navigation, appLocale, uploadImages } = this.props;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          {this.renderImages()}
          <View style={styles.descriptionView}>
            <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder={`${locale[appLocale]["WRITE_A_DES"]}`}
              style={{
                height: "95%",
                width: "100%",
                borderColor: null,
                borderWidth: 0,
                backgroundColor: "#fff"
              }}
              value={this.state.description}
              onChangeText={text => {
                this.setState({ description: text });
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.item}
            activeOpacity={1}
            onPress={() => {
              navigation.navigate("TagPage", {
                passSelectedTagsBack: selectedTags => {
                  this.setState({
                    selectedTags
                  });
                },
                selectedTags
              });
            }}
          >
            <View style={styles.itemLabel}>
              <FontAwesome
                name="hashtag"
                size={theme.iconSm - 2}
                style={{ marginLeft: theme.paddingToWindow }}
              />
              <Text style={{ marginLeft: theme.paddingToWindow }}>{`${
                locale[appLocale]["TAG"]
              }`}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  marginRight: theme.paddingToWindow,
                  color: "grey"
                }}
              >
                {Object.keys(selectedTags).length > 0
                  ? `${Object.keys(selectedTags).length} ${
                      locale[appLocale]["TAGS"]
                    }`
                  : null}
              </Text>
              <FontAwesome
                name="arrow-right"
                size={theme.iconSm}
                style={{ marginRight: theme.paddingToWindow }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            activeOpacity={1}
            onPress={() => {
              navigation.navigate("MentionPage", {
                passMentionedUsersBack: mentionedUsers => {
                  this.setState({
                    mentionedUsers
                  });
                },
                mentionedUsers
              });
            }}
          >
            <View style={styles.itemLabel}>
              <FontAwesome
                name="at"
                size={theme.iconSm}
                style={{ marginLeft: theme.paddingToWindow }}
              />
              <Text style={{ marginLeft: theme.paddingToWindow }}>{`${
                locale[appLocale]["MENTION"]
              }`}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  marginRight: theme.paddingToWindow,
                  color: "grey"
                }}
              >
                {Object.keys(mentionedUsers).length > 0
                  ? `${Object.keys(mentionedUsers).length} ${
                      locale[appLocale]["USERS"]
                    }`
                  : null}
              </Text>
              <FontAwesome
                name="arrow-right"
                size={theme.iconSm}
                style={{ marginRight: theme.paddingToWindow }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            activeOpacity={1}
            onPress={async () => {
              let { latitude, longitude } = await this.getLocationAsync();
              navigation.navigate("LocationPage", {
                latitude,
                longitude,
                passChoosedLocationBack: location => {
                  this.setState({
                    location
                  });
                },
                location
              });
            }}
          >
            <View style={styles.itemLabel}>
              <FontAwesome
                name="map-marker"
                size={theme.iconSm}
                style={{ marginLeft: theme.paddingToWindow }}
              />
              <Text style={{ marginLeft: theme.paddingToWindow }}>
                {`${locale[appLocale]["LOCATION"]}`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  marginRight: theme.paddingToWindow,
                  color: "grey",
                  width: window.width * 0.25
                }}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {location ? `${location.name}` : null}
              </Text>
              <FontAwesome
                name="arrow-right"
                size={theme.iconSm}
                style={{ marginRight: theme.paddingToWindow }}
              />
            </View>
          </TouchableOpacity>
          <DropdownAlert
            ref={o => (this._dropdown = o)}
            timeout={3000}
            animationDirection={"SlideInUp"}
          >
            {this.renderDropdownAlert()}
          </DropdownAlert>
          <ActionSheet
            ref={o => (this._actionSheet = o)}
            title={locale[appLocale]["DISCARD_TITLE"]}
            options={[
              `${locale[appLocale]["DISCARD"]}`,
              `${locale[appLocale]["CANCEL"]}`
            ]}
            cancelButtonIndex={1}
            destructiveButtonIndex={0}
            onPress={async index => {
              if (index === 0) {
                uploadImages.map(img => {
                  FileSystem.deleteAsync(img.uri)
                    .then(() => {
                      console.log(`deleted file: ${img.uri}`);
                    })
                    .catch(err => {
                      console.log(err);
                      console.log(`cannot delete file: ${img.uri}`);
                    });
                });
                navigation.navigate("Home");
              }
            }}
          />
          <ActionSheet
            ref={o => (this._addImageSheet = o)}
            options={[
              `${locale[appLocale]["CHOOSE_A_PHOTO"]}`,
              `${locale[appLocale]["TAKE_A_PHOTO"]}`,
              `${locale[appLocale]["CANCEL"]}`
            ]}
            cancelButtonIndex={2}
            onPress={async index => {
              switch (index) {
                case 0:
                  const resLib = await Permissions.getAsync(
                    Permissions.CAMERA_ROLL
                  );
                  if (resLib.status === "granted") {
                    let capturedImage = await ImagePicker.launchImageLibraryAsync(
                      {
                        allowsEditing: true,
                        aspect: [1, 1]
                      }
                    );
                    if (!capturedImage.cancelled) {
                      let processedImage = await processImage(
                        capturedImage.uri
                      );
                      navigation.push("ImageFilter", {
                        image: processedImage
                      });
                    }
                  }
                  break;
                case 1:
                  navigation.push("Camera");
                  break;
                default:
                  return;
              }
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client.client,
  appLocale: state.app.appLocale,
  uploadImages: state.feed.uploadImages
});

const mapDispatchToProps = dispatch => ({
  addToHomeFeed: feed => dispatch(addToHeadOfHomeFeed(feed)),
  addToCLientProfilePost: data =>
    dispatch(addToTopClientProfilePost(Types.CREATED_POST, data)),
  uploadingPost: () => dispatch(uploadingPost()),
  uploadedPost: () => dispatch(uploadedPost()),
  removeAImage: uri => dispatch(removeAImage(uri))
});

export default createStackNavigator(
  {
    PostPreview: {
      screen: connect(
        mapStateToProps,
        mapDispatchToProps
      )(PostPreview)
    },
    TagPage: {
      screen: TagPage,
      navigationOptions: () => {
        return {
          header: null
        };
      }
    },
    MentionPage,
    LocationPage: {
      screen: LocationPage,
      navigationOptions: () => {
        return {
          header: null
        };
      }
    }
  },
  {
    cardStyle: {
      backgroundColor: "#fff"
    }
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  descriptionView: {
    alignItems: "center",
    justifyContent: "center",
    height: window.width * 0.3,
    width: "95%",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey"
  },
  item: {
    marginTop: 10,
    height: window.height * 0.05,
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 0.5
  },
  itemLabel: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  },
  dropdown: {
    width: "95%",
    height: "95%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5,
    zIndex: 1,
    elevation: 1,
    backgroundColor: "#fff"
  }
});
