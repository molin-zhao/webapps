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
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";
import { Location, Permissions } from "expo";
import { connect } from "react-redux";
import {
  addToHeadOfHomeFeed,
  uploadingPost,
  uploadedPost
} from "../../redux/actions/feedActions";
import { createStackNavigator } from "react-navigation";

import DropdownAlert from "../../components/DropdownAlert";
import PostRightButton from "../../components/HeaderRightButton";
import TagPage from "./Tag";
import MentionPage from "./Mention";
import LocationPage from "./Location";

import window from "../../utils/getDeviceInfo";
import baseUrl from "../../common/baseUrl";
import theme from "../../common/theme";

class PostPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUri: this.props.navigation.getParam("imageUri", null),
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
    title: "Edit your post",
    headerTitleStyle: {
      fontSize: 14
    },
    headerLeft: (
      <TouchableOpacity
        style={{ marginLeft: 20 }}
        onPress={() => {
          navigation.dismiss();
        }}
      >
        <Icon name="chevron-left" size={20} />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        style={{ marginRight: 20 }}
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
    this.props.navigation.setParams({
      handlePost: this.makePostTest
    });
  }

  makePostTest = () => {
    const { uploadingPost, uploadedPost } = this.props;
    uploadingPost();
    setTimeout(() => {
      this.setState(
        {
          info: null,
          error: "Failed to upload your post"
        },
        () => {
          this._dropdown.show();
          uploadedPost();
        }
      );
    }, 3000);
  };

  makePost = () => {
    const {
      imageUri,
      description,
      selectedTags,
      mentionedUsers,
      location
    } = this.state;
    const {
      client,
      navigation,
      addToHomeFeed,
      uploadingPost,
      uploadedPost
    } = this.props;
    let fileName = imageUri.split("/").pop();
    let match = /\.(\w+)$/.exec(fileName);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append("post", {
      uri: imageUri,
      name: fileName,
      type: type
    });
    formData.append("description", description);
    formData.append("tags", Object.keys(selectedTags));
    formData.append("mention", Object.keys(mentionedUsers));
    formData.append("location", JSON.stringify(location));
    if (client) {
      uploadingPost();
      fetch(`${baseUrl.upload}/upload/post`, {
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
          if (resJson.status === 200) {
            addToHomeFeed(resJson.data);
            setTimeout(() => {
              navigation.navigate("Home");
            }, 4000);
            this.setState(
              {
                info: "Successfully uploaded your post!",
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
                error: "Failed to upload your post."
              },
              () => {
                this._dropdown.show();
                uploadedPost();
              }
            );
          }
        })
        .catch(err => {
          this.setState(
            {
              info: null,
              error: "Network request failed."
            },
            () => {
              this._dropdown.show();
              uploadedPost();
            }
          );
        });
    } else {
      navigation.navigate("Auth");
    }
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
        <View style={[styles.dropdown, { borderColor: theme.primaryGreen }]}>
          <View
            style={{
              marginLeft: theme.paddingToWindow,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <Ionicon
              name="ios-checkmark-circle-outline"
              size={theme.iconMd}
              color={theme.primaryGreen}
            />
            <Text
              style={{ marginLeft: 10, color: theme.primaryGreen }}
            >{`${info}`}</Text>
          </View>
          <Ionicon
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
          <Ionicon
            name="ios-close-circle-outline"
            size={theme.iconMd}
            color={theme.primaryDanger}
          />
          <Text
            style={{ marginLeft: 10, color: theme.primaryDanger }}
          >{`${error}`}</Text>
        </View>
        <Ionicon
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

  render() {
    const { imageUri, selectedTags, mentionedUsers, location } = this.state;
    const { navigation } = this.props;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <View style={styles.descriptionView}>
            {/* <Image
            source={{ uri: imageUri }}
            style={{
              marginLeft: 5,
              width: window.width * 0.25,
              height: window.width * 0.25
            }}
          /> */}
            <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder="Write a description"
              style={{
                marginLeft: 20,
                marginRight: 5,
                height: window.width * 0.25,
                width: window.width * 0.65,
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
              <Icon
                name="hashtag"
                size={theme.iconSm - 2}
                style={{ marginLeft: theme.paddingToWindow }}
              />
              <Text style={{ marginLeft: theme.paddingToWindow }}>Tag</Text>
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
                  ? `${Object.keys(selectedTags).length} tag(s)`
                  : null}
              </Text>
              <Icon
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
              <Icon
                name="at"
                size={theme.iconSm}
                style={{ marginLeft: theme.paddingToWindow }}
              />
              <Text style={{ marginLeft: theme.paddingToWindow }}>Mention</Text>
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
                  ? `${Object.keys(mentionedUsers).length} user(s)`
                  : null}
              </Text>
              <Icon
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
              <Icon
                name="map-marker"
                size={theme.iconSm}
                style={{ marginLeft: theme.paddingToWindow }}
              />
              <Text style={{ marginLeft: theme.paddingToWindow }}>
                Location
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
              <Icon
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
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client.client
});

const mapDispatchToProps = dispatch => ({
  addToHomeFeed: feed => dispatch(addToHeadOfHomeFeed(feed)),
  uploadingPost: () => dispatch(uploadingPost()),
  uploadedPost: () => dispatch(uploadedPost())
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
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
    backgroundColor: "#fff"
  }
});