import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";
import { Location, Permissions, SecureStore } from "expo";
import { connect } from "react-redux";
import DropdownAlert from "react-native-dropdownalert";
import { addToHeadOfHomeFeed } from "../../redux/actions/feedActions";
import { UIActivityIndicator } from "react-native-indicators";
import { createStackNavigator } from "react-navigation";

import Header from "../../components/Header";
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
      uploading: false,
      imageUri: this.props.navigation.getParam("imageUri", null),
      description: "",
      location: null,
      selectedTags: {},
      mentionedUsers: {},
      allowLoation: false,
      switchValue: false
    };
  }

  componentWillMount() {
    SecureStore.getItemAsync("permission_location").then(permissionData => {
      if (permissionData) {
        let permissionInfo = JSON.parse(permissionData);
        if (permissionInfo.ALLOW_LOCATION) {
          this.setState({ allowLoation: true });
        }
      }
    });
    this.props.navigation.setParams({ handlePost: this.makePost });
  }

  makePost = () => {
    const { imageUri, description, label, location } = this.state;
    const { client, navigation, addToHomeFeed } = this.props;
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
    formData.append("label", label);
    formData.append("location", JSON.stringify(location));
    if (client) {
      this.setState(
        {
          uploading: true
        },
        () => {
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
              this.setState(
                {
                  uploading: false
                },
                () => {
                  if (resJson.status === 200) {
                    this._alert.alertWithType(
                      "success",
                      "Success",
                      "Your post was uploaded"
                    );
                    addToHomeFeed(resJson.data);
                    setTimeout(() => {
                      navigation.navigate("Home");
                    }, 4000);
                  } else {
                    this._alert.alertWithType(
                      "warn",
                      "Error",
                      "Your post was not upload successfully, try upload your post later"
                    );
                  }
                }
              );
            })
            .catch(err => {
              this.setState(
                {
                  uploading: false
                },
                () => {
                  this._alert.alertWithType(
                    "warn",
                    "Error",
                    "Your post was not upload successfully, try upload your post later"
                  );
                }
              );
            });
        }
      );
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

  getLocationAsync = async value => {
    if (value) {
      // add a location
      if (!this.state.allowLoation) {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === "granted") {
          this.setState({
            allowLoation: true,
            switchValue: true
          });
          let locationCoords = await Location.getCurrentPositionAsync({});
          let locationAddress = await Location.reverseGeocodeAsync(
            locationCoords.coords
          );
          let location = this.generateLocation(
            locationCoords.coords,
            locationAddress[0]
          );
          this.setState({
            location: location
          });
          SecureStore.setItemAsync(
            "permission_location",
            JSON.stringify({
              ALLOW_LOCATION: true
            })
          );
        } else {
          this.setState({
            switchValue: false
          });
        }
      } else {
        this.setState({ switchValue: true });
        let locationCoords = await Location.getCurrentPositionAsync({});
        let locationAddress = await Location.reverseGeocodeAsync(
          locationCoords.coords
        );
        let location = this.generateLocation(
          locationCoords.coords,
          locationAddress[0]
        );
        this.setState({
          location: location
        });
      }
    } else {
      // remove location
      this.setState({
        switchValue: false,
        location: null
      });
    }
  };

  renderHeaderRightButton = () => {
    const { uploading } = this.state;
    if (uploading) {
      return <UIActivityIndicator size={20} color={theme.primaryBlue} />;
    }
    return (
      <Ionicon
        name="md-send"
        size={20}
        color={theme.primaryBlue}
        onPress={() => {
          this.makePost();
        }}
      />
    );
  };

  render() {
    const { imageUri, selectedTags, mentionedUsers } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Header
          style={{ backgroundColor: "transparent" }}
          headerTitle="Edit your post"
          rightIconButton={this.renderHeaderRightButton}
          leftIconButton={() => (
            <Icon
              name="chevron-left"
              size={20}
              onPress={() => {
                const { navigation } = this.props;
                navigation.dismiss();
              }}
            />
          )}
          headerTitleStyle={{ fontSize: 14, fontWeight: "bold" }}
        />
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
                ? `${Object.keys(mentionedUsers).length} tag(s)`
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
            navigation.navigate("LocationPage");
          }}
        >
          <View style={styles.itemLabel}>
            <Icon
              name="map-marker"
              size={theme.iconSm}
              style={{ marginLeft: theme.paddingToWindow }}
            />
            <Text style={{ marginLeft: theme.paddingToWindow }}>Location</Text>
          </View>
          <Icon
            name="arrow-right"
            size={theme.iconSm}
            style={{ marginRight: theme.paddingToWindow }}
          />
        </TouchableOpacity>
        <DropdownAlert closeInterval={3000} ref={o => (this._alert = o)} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client.client
});

const mapDispatchToProps = dispatch => ({
  addToHomeFeed: feed => dispatch(addToHeadOfHomeFeed(feed))
});

export default createStackNavigator(
  {
    PostPreview: {
      screen: connect(
        mapStateToProps,
        mapDispatchToProps
      )(PostPreview),
      navigationOptions: () => {
        return {
          header: null
        };
      }
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
  }
});
