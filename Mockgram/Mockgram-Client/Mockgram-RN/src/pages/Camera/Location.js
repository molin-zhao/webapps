import React from "react";
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  Keyboard,
  Text
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { SkypeIndicator } from "react-native-indicators";
import { createStackNavigator, Header } from "react-navigation";
import { connect } from "react-redux";
import { MapView, Constants } from "expo";
const { Marker, Callout } = MapView;

import CreateLocation from "./CreateLocation";
import SearchBarView from "../../components/SearchBarView";
import SectionTitle from "../../components/SectionTitle";

import window from "../../utils/getDeviceInfo";
import baseUrl from "../../common/baseUrl";
import config from "../../common/config";
import { parseIdFromObjectArray } from "../../utils/idParser";
import theme from "../../common/theme";
import { locale } from "../../common/locale";

class Location extends React.Component {
  mounted = false;
  constructor(props) {
    super(props);
    let lat = this.props.navigation.getParam("latitude");
    let long = this.props.navigation.getParam("longitude");
    this.state = {
      // data related
      latChanges: lat,
      longChanges: long,
      latDefault: lat,
      longDefault: long,
      nearbyLocations: [],
      searchedLocations: [],
      selectedLocation: this.props.navigation.getParam("location", null),
      error: null,

      // indicator properties
      isSearching: false,
      loading: false,
      searchValue: "",
      returnValue: "",
      hasMore: true,
      loadingMore: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        borderBottomColor: "transparent",
        borderBottomWidth: 0,
        shadowColor: "transparent",
        elevation: 0
      },
      title: navigation.getParam("locationTitle"),
      headerTitleStyle: {
        fontSize: 14
      },
      headerLeft: (
        <TouchableOpacity
          style={{ marginLeft: theme.headerIconMargin }}
          onPress={() => {
            navigation.popToTop();
          }}
        >
          <Ionicons name="ios-arrow-back" size={theme.iconMd} />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity
          style={{
            marginRight: 10,
            height: Header.HEIGHT * 0.5,
            width: Header.HEIGHT * 0.8,
            borderRadius: Header.HEIGHT * 0.1,
            backgroundColor: theme.primaryGreen,
            alignItems: "center",
            justifyContent: "center"
          }}
          onPress={() => {
            let passChoosedLocationBack = navigation.getParam(
              "passChoosedLocationBack"
            );
            let getLocation = navigation.getParam("getLocation");
            passChoosedLocationBack(getLocation());
            navigation.popToTop();
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12 }}>
            {navigation.getParam("locationDone")}
          </Text>
        </TouchableOpacity>
      )
    };
  };

  componentDidMount() {
    this.mounted = true;
    const { navigation, appLocale } = this.props;
    navigation.setParams({
      getLocation: () => this.state.selectedLocation,
      locationTitle: `${locale[appLocale]["ADD_TITLE"](
        locale[appLocale]["LOCATION"]
      )}`,
      locationDone: `${locale[appLocale]["DONE"]}`
    });
    // fetch nearby locations by lat and long
    this.setState(
      {
        loading: true
      },
      () => {
        this.getNearbyLocations()
          .then(() => {
            this.setState({
              loading: false
            });
          })
          .catch(err => {
            this.setState({
              loading: false,
              error: err
            });
          });
      }
    );
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getNearbyLocations = () => {
    const {
      latDefault,
      longDefault,
      nearbyLocations,
      loadingMore
    } = this.state;
    return fetch(`${baseUrl.api}/post/search/location/coordinate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        coordinate: {
          latitude: latDefault,
          longitude: longDefault
        },
        limit: config.SEARCH_RETURN_LIMIT,
        lastQueryDataIds: parseIdFromObjectArray(nearbyLocations),
        maxDistance: config.MAX_DISTANCE
      })
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.status === 200) {
          if (this.mounted) {
            this.setState({
              hasMore:
                resJson.data.length < config.SEARCH_RETURN_LIMIT ? false : true,
              nearbyLocations: loadingMore
                ? nearbyLocations.concat(resJson.data)
                : resJson.data
            });
          }
        }
      });
  };

  renderCustomCallout = () => {
    return (
      <Callout tooltip={true}>
        <View
          style={{
            width: 80,
            height: 30,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              borderColor: "black",
              borderWidth: 1,
              borderStyle: "dashed",
              borderRadius: 5,
              backgroundColor: theme.primaryGrey
            }}
            onPress={() => {
              const { navigation } = this.props;
              navigation.navigate("CreateLocation", {
                currentCoordinates: {
                  latitude: this.state.latDefault,
                  longitude: this.state.longDefault
                }
              });
            }}
          >
            <FontAwesome name="plus" size={theme.iconSm} />
            <Text style={{ fontSize: 14 }}>{` location`}</Text>
          </TouchableOpacity>
        </View>
      </Callout>
    );
  };

  renderMapViewAndNearbyLocationTitle = () => {
    const { searchedLocations, searchValue } = this.state;
    return (
      <View
        style={{
          height: searchedLocations && searchValue ? 0 : window.height * 0.2,
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%"
        }}
      >
        <View
          style={{
            height: "80%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <MapView
            provider={null}
            style={{
              height: "100%",
              width: "100%"
            }}
            region={{
              latitude: this.state.latChanges,
              longitude: this.state.longChanges,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            initialRegion={{
              latitude: this.state.latDefault,
              longitude: this.state.longDefault,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            onRegionChangeComplete={e => {
              this.setState({
                latChanges: e.latitude,
                longChanges: e.longitude
              });
            }}
          >
            <Marker
              coordinate={{
                latitude: this.state.latDefault,
                longitude: this.state.longDefault
              }}
            >
              {this.renderCustomCallout()}
            </Marker>
            <Ionicons
              name="md-locate"
              size={theme.iconMd}
              style={{
                position: "absolute",
                top: 5,
                right: 5
              }}
              onPress={() => {
                this.setState({
                  latChanges: this.state.latDefault,
                  longChanges: this.state.longDefault
                });
              }}
            />
          </MapView>
        </View>
        <SectionTitle
          containerStyle={{ height: "20%" }}
          iconLabel={() => <Ionicons name="md-pin" size={theme.iconSm} />}
          label="Nearby locations"
        />
      </View>
    );
  };

  _renderNearbyLocationBtn = item => {
    const { selectedLocation } = this.state;
    if (selectedLocation) {
      if (selectedLocation._id === item._id) {
        return (
          <Ionicons
            name="ios-checkmark"
            size={theme.iconLg}
            color={theme.primaryGreen}
          />
        );
      }
      return null;
    }
    return (
      <TouchableOpacity
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={() => {
          this.setState({
            selectedLocation: item
          });
        }}
      >
        <Text>Add</Text>
      </TouchableOpacity>
    );
  };

  _renderLocationListItem = (item, index) => {
    return (
      <View
        key={index}
        style={{
          width: window.width,
          height: window.height * 0.08,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row"
        }}
      >
        <View
          style={{
            width: "10%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Ionicons name="ios-pin" size={theme.iconSm} />
        </View>
        <View
          style={{
            width: "70%",
            height: "100%",
            justifyContent: "center",
            alignItems: "flex-start"
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              marginLeft: theme.paddingToWindow
            }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >{`${item.name}`}</Text>
          <Text
            style={{
              marginTop: 3,
              fontSize: 12,
              fontWeight: "normal",
              color: "grey",
              marginLeft: theme.paddingToWindow
            }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >{`${item.meta.country}, ${item.meta.state}, ${item.address}`}</Text>
        </View>
        <View
          style={{
            width: "20%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this._renderNearbyLocationBtn(item)}
        </View>
      </View>
    );
  };

  renderSelectedLocation = () => {
    const { selectedLocation } = this.state;
    if (selectedLocation) {
      return (
        <View
          style={{
            width: "100%",
            height: window.height * 0.05,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View
            style={{
              width: "95%",
              height: "95%",
              backgroundColor: theme.primaryGrey,
              borderRadius: window.height * 0.01,
              borderWidth: 1,
              borderColor: "grey",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: "80%",
                height: "100%",
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <Ionicons
                name="ios-pin"
                size={theme.iconSm}
                style={{ marginLeft: theme.paddingToWindow }}
              />
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{ marginLeft: theme.paddingToWindow }}
              >{`${selectedLocation.name}`}</Text>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{
                  marginLeft: theme.paddingToWindow,
                  color: "grey"
                }}
              >{`${selectedLocation.address}`}</Text>
            </View>
            <TouchableOpacity
              style={{
                width: "20%",
                height: "100%",
                justifyContent: "center",
                alignItems: "flex-end"
              }}
              onPress={() => {
                this.setState({
                  selectedLocation: null
                });
              }}
            >
              <Ionicons
                style={{ marginRight: theme.paddingToWindow }}
                name="ios-close"
                size={theme.iconMd}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };

  renderNearbyEmpty = () => {
    const { appLocale } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Ionicons name="ios-add-circle-outline" size={theme.iconLg} />
        <Text>{`${locale[appLocale]["NO_NEARBY_LOCATIONS"]}`}</Text>
      </TouchableOpacity>
    );
  };

  renderLocationList = () => {
    const { searchedLocations, searchValue, nearbyLocations } = this.state;
    if (searchedLocations && searchValue) {
      return (
        <FlatList
          ListHeaderComponent={this.renderContentHeader}
          stickyHeaderIndices={[0]}
          style={{ backgroundColor: "#fff", width: "100%" }}
          extraData={this.state}
          keyExtractor={item => item._id}
          data={searchedLocations}
          renderItem={({ item, index }) =>
            this._renderLocationListItem(item, index)
          }
        />
      );
    }
    return (
      <FlatList
        ListHeaderComponent={this.renderContentHeader}
        stickyHeaderIndices={[0]}
        style={{ backgroundColor: "#fff", width: "100%" }}
        data={nearbyLocations}
        ListEmptyComponent={this.renderNearbyEmpty}
        extraData={this.state}
        keyExtractor={item => item._id}
        renderItem={({ item, index }) =>
          this._renderLocationListItem(item, index)
        }
      />
    );
  };

  renderContentHeader = () => {
    return (
      <View
        style={{
          width: "100%",
          backgroundColor: "#fff",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        {this.renderSelectedLocation()}
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            height: Header.HEIGHT
          }}
        >
          <SearchBarView
            showSearchingIndicator={true}
            searching={this.state.isSearching}
            containerStyle={{ width: window.width, height: "80%" }}
            searchBarFocusedWidth={window.width * 0.85}
            duration={100}
            onChangeText={text => {
              clearTimeout(this.state.timer);
              this.setState(
                {
                  searchBarInput: text
                },
                () => {
                  if (text.length > 0) {
                    this.setState({
                      isSearching: true,
                      timer: setTimeout(() => {
                        this.setState(
                          {
                            searchValue: text,
                            timer: null
                          },
                          () => {
                            clearTimeout(this.state.timer);
                            this.startSearch()
                              .then(() => {
                                this.setState({
                                  isSearching: false
                                });
                              })
                              .catch(err => {
                                this.setState({
                                  isSearching: false,
                                  error: err
                                });
                              });
                          }
                        );
                      }, 1000)
                    });
                  } else {
                    this.setState({
                      isSearching: false,
                      timer: null,
                      searchValue: ""
                    });
                  }
                }
              );
            }}
          />
        </View>
        {this.renderMapViewAndNearbyLocationTitle()}
      </View>
    );
  };

  renderContentView = () => {
    const { loading } = this.state;
    if (loading) {
      return (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <SkypeIndicator size={theme.indicatorLg} />
        </View>
      );
    }
    return this.renderLocationList();
  };

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
        style={styles.container}
      >
        {this.renderContentView()}
      </TouchableWithoutFeedback>
    );
  }

  startSearch = () => {
    const { searchValue, searchedLocations, returnValue } = this.state;
    // if last query returned value equals this query search value
    // two queries' values are same -> loading more
    let isLoadingMore = returnValue === searchValue;
    return fetch(`${baseUrl.api}/post/search/location/name`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        value: searchValue,
        limit: config.SEARCH_RETURN_LIMIT,
        lastQueryDataIds: isLoadingMore
          ? parseIdFromObjectArray(searchedLocations)
          : []
      })
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.status === 200) {
          if (this.mounted) {
            this.setState({
              searchedLocations:
                this.state.returnValue === this.state.searchValue
                  ? this.state.searchedLocations.concat(resJson.data)
                  : resJson.data,
              returnValue: resJson.value,
              hasMore:
                resJson.data.length < config.SEARCH_RETURN_LIMIT ? false : true
            });
          }
        } else {
          if (this.mounted) {
            this.setState({
              error: resJson.msg,
              returnValue: "",
              hasMore: false
            });
          }
        }
      })
      .catch(err => {
        if (this.mounted) {
          this.setState({
            error: err
          });
        }
      });
  };
}

const mapStateToProps = state => ({
  appLocale: state.app.appLocale
});

const styles = StyleSheet.create({
  container: {
    width: window.width,
    height: window.height - Constants.statusBarHeight,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center"
  }
});

export default createStackNavigator(
  {
    Location: connect(
      mapStateToProps,
      null
    )(Location),
    CreateLocation
  },
  {
    cardStyle: {
      backgroundColor: "#fff"
    }
  }
);
