import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { SkypeIndicator } from "react-native-indicators";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import ActionSheet from "react-native-actionsheet";
import { MapView } from "expo";
const { Polygon, Marker } = MapView;
import Proptypes from "prop-types";

import Modal from "./Modal";
import Button from "./Button";
import AjaxInput from "./AjaxInput";
import IconInput from "./IconInput";

import window from "../utils/getDeviceInfo";
import theme from "../common/theme";

const ASPECT_RATIO = window.width / window.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class PolygonCreator extends React.Component {
  static propTypes = {
    coordinates: Proptypes.object,
    onLocationCreated: Proptypes.func,
    client: Proptypes.object
  };
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: this.props.coordinates.latitude,
        longitude: this.props.coordinates.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      markerPos: {
        latitude: this.props.coordinates.latitude,
        longitude: this.props.coordinates.longitude
      },
      polygons: [],
      editing: false,
      editingPolygon: null,
      creating: false,
      created: false,
      nameValid: false,
      locationDetails: {
        name: "",
        address: ""
      }
    };
  }

  componentDidMount() {
    Keyboard.addListener("keyboardDidShow", frames => {
      // keyboard height -> endCoordinates.height
      this.modal.slideToPosition(frames.endCoordinates.height, 100);
    });
    Keyboard.addListener("keyboardDidHide", () => {
      this.modal.slideToPosition(0, 100);
    });
  }

  componentWillUnmount() {
    Keyboard.removeAllListeners("keyboardDidShow", "keyboardDidHide");
  }

  finish = () => {
    const { polygons, editing, editingPolygon } = this.state;
    if (editing) {
      if (editingPolygon && editingPolygon.coordinates.length >= 3) {
        this.setState({
          polygons: polygons.concat(editingPolygon),
          editingPolygon: null,
          editing: false
        });
      } else {
        this.setState({
          editingPolygon: null,
          editing: false
        });
      }
    }
  };

  resetPolygon = () => {
    const { editingPolygon } = this.state;
    if (editingPolygon) {
      this.setState({
        editingPolygon: null
      });
    }
  };

  deleteVertex = () => {
    const { editingPolygon } = this.state;
    if (editingPolygon && editingPolygon.coordinates.length > 0) {
      this.setState({
        editingPolygon: {
          ...editingPolygon,
          coordinates: editingPolygon.coordinates.slice(0, -1)
        }
      });
    }
  };

  createVertex = coordinate => {
    const { editing, editingPolygon } = this.state;
    if (editing) {
      // map onPress triggered when it is being editting
      /**
       * note that in order to work with mongodb geojson,
       * longitude should be specified in the first element
       */
      let newVertex = [coordinate.longitude, coordinate.latitude];
      // check if editing polygon exists
      // if it exists, push new vertex to its coordinates
      // if it doesn't exist, create a new polygon
      if (!editingPolygon) {
        newPolygon = {
          id: Date.now(),
          coordinates: [newVertex]
        };
        this.setState({
          editingPolygon: newPolygon
        });
      } else {
        this.setState({
          editingPolygon: {
            ...editingPolygon,
            coordinates: [...editingPolygon.coordinates].concat([newVertex])
          }
        });
      }
    }
  };

  renderResetBtn = () => {
    const { editingPolygon } = this.state;
    if (editingPolygon) {
      return (
        <TouchableOpacity
          style={{
            width: window.width * 0.1,
            height: "100%",
            borderRightColor: "lightgrey",
            borderRightWidth: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.primaryGrey,
            borderRadius: 5
          }}
        >
          <FontAwesome
            name="trash"
            size={theme.iconSm}
            color="black"
            onPress={() => {
              this.resetPolygon();
            }}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  renderDeleteBtn = () => {
    const { editingPolygon } = this.state;
    if (editingPolygon && editingPolygon.coordinates.length > 0) {
      return (
        <TouchableOpacity
          style={{
            width: window.width * 0.1,
            height: "100%",
            borderRightColor: "lightgrey",
            borderRightWidth: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.primaryGrey,
            borderRadius: 5
          }}
        >
          <FontAwesome
            name="undo"
            size={theme.iconSm}
            color={theme.primaryDanger}
            onPress={() => {
              this.deleteVertex();
            }}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  renderFinishBtn = () => {
    return (
      <TouchableOpacity
        style={{
          width: window.width * 0.1,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.primaryGrey,
          borderRadius: 5
        }}
      >
        <FontAwesome
          name="check"
          size={theme.iconSm}
          color={theme.primaryGreen}
          onPress={() => {
            this.finish();
          }}
        />
      </TouchableOpacity>
    );
  };

  renderBtns = () => {
    const { editing } = this.state;
    if (editing) {
      return (
        <View
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            backgroundColor: "transparent"
          }}
        >
          {this.renderResetBtn()}
          {this.renderDeleteBtn()}
          {this.renderFinishBtn()}
        </View>
      );
    } else {
      return (
        <FontAwesome
          name="cog"
          size={theme.iconSm}
          color="black"
          onPress={() => {
            this.ActionSheet.show();
          }}
        />
      );
    }
  };

  renderCreateBtn = () => {
    const {
      locationDetails,
      creating,
      created,
      nameValid,
      polygons,
      markerPos
    } = this.state;
    let valid = locationDetails.name && locationDetails.address && nameValid;
    return (
      <Button
        loading={creating}
        title={created ? "created" : "create"}
        titleStyle={{ color: "#fff", fontSize: 12 }}
        iconLeft={() => {
          if (valid) {
            return null;
          }
          return (
            <Ionicons
              name="ios-remove-circle-outline"
              size={theme.iconSm}
              color="#fff"
            />
          );
        }}
        iconRight={() => {
          if (created) {
            return (
              <Ionicons name="md-checkmark" size={theme.iconSm} color="#fff" />
            );
          }
          return null;
        }}
        disabled={!valid || created}
        onPress={() => {
          const { client } = this.props;
          if (client && client.token) {
            return fetch(`${baseUrl.api}/post/create/location`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: this.props.client.token
              },
              body: JSON.stringify({
                name: locationDetails.name.trim(),
                address: locationDetails.address.trim(),
                polygons: polygons.map(polygon => polygon.coordinates),
                coordinates: [markerPos.longitude, markerPos.latitude]
              })
            })
              .then(res => res.json())
              .then(resJson => {
                if (resJson.status === 200) {
                  this.setState({
                    created: true
                  });
                } else {
                  this.setState({
                    created: false
                  });
                }
              })
              .then(() => {
                this.setState({
                  creating: false
                });
              })
              .catch(err => {
                console.log(err);
                this.setState({
                  creating: false
                });
              });
          }
        }}
        containerStyle={StyleSheet.flatten(styles.createBtn)}
        loadingIndicator={() => (
          <SkypeIndicator size={theme.iconSm} color={theme.primaryGrey} />
        )}
      />
    );
  };

  renderFinishedPolygons = () => {
    const { polygons } = this.state;
    return polygons.map(polygon => {
      let coordinates = polygon.coordinates.map(c => {
        return { latitude: c[1], longitude: c[0] };
      });
      return (
        <Polygon
          key={polygon.id}
          coordinates={coordinates}
          strokeColor="black"
          fillColor="rgba(255,0,0,0.3)"
          strokeWidth={1}
        />
      );
    });
  };

  renderEditingPolygon = () => {
    const { editing, editingPolygon } = this.state;
    if (editing && editingPolygon) {
      let coordinates = editingPolygon.coordinates.map(c => {
        return { latitude: c[1], longitude: c[0] };
      });
      return (
        <Polygon
          key={editingPolygon.id}
          coordinates={coordinates}
          strokeColor="grey"
          fillColor="rgba(220,220,220,0.3)"
          strokeWidth={1}
        />
      );
    }
    return null;
  };

  renderFinishedPolygonsCenterMarker = () => {
    const { polygons, editing } = this.state;
    return polygons.map((polygon, index) => {
      let x = polygon.coordinates.map(c => c[1]);
      let y = polygon.coordinates.map(c => c[0]);
      let minX = Math.min.apply(null, x);
      let maxX = Math.max.apply(null, x);
      let minY = Math.min.apply(null, y);
      let maxY = Math.max.apply(null, y);
      return (
        <Marker
          key={polygon.id}
          coordinate={{
            latitude: (minX + maxX) / 2,
            longitude: (minY + maxY) / 2
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <Text>{`Area ${index + 1}`}</Text>
            {editing ? (
              <Ionicons
                name="ios-trash"
                size={theme.iconSm}
                style={{ marginLeft: 2 }}
                onPress={() => {
                  this.setState({
                    polygons: polygons.filter(ele => {
                      return ele.id !== polygon.id;
                    })
                  });
                }}
              />
            ) : null}
          </View>
        </Marker>
      );
    });
  };

  render() {
    const { editing, region, markerPos, locationDetails } = this.state;
    const { coordinates } = this.props;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <MapView
            ref={o => (this.map = o)}
            style={styles.map}
            initialRegion={region}
            onPress={e => this.createVertex(e.nativeEvent.coordinate)}
            onMarkerDragEnd={e => {
              this.setState({
                markerPos: e.nativeEvent.coordinate
              });
            }}
            scrollEnabled={editing ? false : true}
          >
            <Marker draggable coordinate={markerPos} />
            {this.renderFinishedPolygons()}
            {this.renderEditingPolygon()}
            {this.renderFinishedPolygonsCenterMarker()}
          </MapView>
          <View style={styles.buttonContainer}>{this.renderBtns()}</View>
          <Modal
            ref={o => (this.modal = o)}
            visible={!this.state.editing}
            style={{
              width: window.width,
              height: window.height * 0.4,
              backgroundColor: "transparent",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: "90%",
                height: "95%",
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10
              }}
            >
              <View
                style={{
                  height: "15%",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottomColor: "lightgrey",
                  borderBottomWidth: 1
                }}
              >
                <Text>Location Information</Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "65%"
                }}
              >
                <View style={styles.input}>
                  <View
                    style={{
                      width: "30%",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "flex-end"
                    }}
                  >
                    <Text>Coordinates:</Text>
                  </View>
                  <View
                    style={{
                      width: "70%",
                      height: "100%",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center"
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Text>latitude</Text>
                      <Text
                        style={{ fontSize: 12, color: "grey" }}
                        ellipsizeMode="tail"
                      >
                        {markerPos.latitude}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Text>longitude</Text>
                      <Text
                        style={{ fontSize: 12, color: "grey" }}
                        ellipsizeMode="tail"
                      >
                        {markerPos.longitude}
                      </Text>
                    </View>
                  </View>
                </View>
                s
                <View style={styles.input}>
                  <AjaxInput
                    label={() => {
                      return <Text>{`Name:`}</Text>;
                    }}
                    textInputContainerStyle={{
                      borderWidth: 1,
                      borderColor: "lightgrey",
                      borderRadius: 10
                    }}
                    fetchUrl={`${baseUrl.api}/discovery/location/available`}
                    placeholder="name for location..."
                    containerStyle={{ width: "100%", height: "100%" }}
                    onValid={searchValue => {
                      this.setState({
                        nameValid: true,
                        locationDetails: {
                          ...locationDetails,
                          name: searchValue
                        }
                      });
                    }}
                    onInValid={searchValue => {
                      this.setState({
                        nameValid: true,
                        locationDetails: {
                          ...locationDetails,
                          name: searchValue
                        }
                      });
                    }}
                  />
                </View>
                <View style={styles.input}>
                  <IconInput
                    placeholder="address for location..."
                    label={() => <Text>Address:</Text>}
                    textInputContainerStyle={{
                      borderWidth: 1,
                      borderColor: "lightgrey",
                      borderRadius: 10
                    }}
                    containerStyle={{ width: "100%", height: "65%" }}
                    onChangeText={text => {
                      this.setState({
                        locationDetails: {
                          ...this.state.locationDetails,
                          address: text
                        }
                      });
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  height: "20%",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderTopColor: "lightgrey",
                  borderTopWidth: 1
                }}
              >
                {this.renderCreateBtn()}
              </View>
            </View>
          </Modal>
          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            title="Map options"
            options={["edit area", "reset", "cancel"]}
            cancelButtonIndex={2}
            onPress={index => {
              switch (index) {
                case 0:
                  let destRegion = {
                    latitude: markerPos.latitude,
                    longitude: markerPos.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                  };
                  this.map.animateToRegion(destRegion, 500);
                  this.setState({
                    editing: true
                  });
                  break;
                case 1:
                  this.map.animateToRegion(region, 500);
                  this.setState({
                    markerPos: {
                      latitude: coordinates.latitude,
                      longitude: coordinates.longitude
                    },
                    polygons: [],
                    editingPolygon: null
                  });
                  break;
                default:
                  console.log("cancel");
              }
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  buttonContainer: {
    position: "absolute",
    width: window.width * 0.3,
    height: 30,
    zIndex: 1,
    top: theme.paddingToWindow,
    right: theme.paddingToWindow,
    justifyContent: "flex-start",
    alignItems: "flex-end"
  },
  createBtn: {
    width: window.width * 0.2,
    height: window.height * 0.04,
    backgroundColor: theme.primaryColor
  },
  input: {
    width: "90%",
    height: "30%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default PolygonCreator;
