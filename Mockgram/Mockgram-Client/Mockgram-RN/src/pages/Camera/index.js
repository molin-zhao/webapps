import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Easing,
  CameraRoll,
  Image,
  PixelRatio,
  ScrollView,
  Alert
} from "react-native";
import {
  Camera,
  ImagePicker,
  Permissions,
  Video,
  FileSystem,
  takeSnapshotAsync
} from "expo";
import { Header, createStackNavigator } from "react-navigation";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { Surface } from "gl-react-expo";
import GLImage from "gl-react-image";
import { SkypeIndicator } from "react-native-indicators";

// pages
import PostPreview from "./PostPreview";

import FlipButton from "../../components/FlipButton";
import CircularProgress from "../../components/CircularProgress";
import ModalDropdown from "../../components/ModalDropdown";
import CustomHeader from "../../components/Header";

// filters
import Brannan from "../../filters/Brannan";
import Earlybird from "../../filters/Earlybird";
import Hudson from "../../filters/Hudson";
import Nashville from "../../filters/Nashville";
import Valencia from "../../filters/Valencia";
import Normal from "../../filters/Normal";

import window from "../../utils/getDeviceInfo";
import theme from "../../common/theme";
import { locale } from "../../common/locale";
import processImage from "../../utils/imageProcessing";
import { PHOTO, VIDEO } from "../../common/types";
import { addAImage } from "../../redux/actions/feedActions";

const targetPixelCount = 720;
const pixelRatio = PixelRatio.get();
const pixels = targetPixelCount / pixelRatio;
const opt = {
  format: "jpg",
  height: pixels,
  width: pixels
};

const shaderNames = {
  Normal: "Normal",
  Brannan: "Brannan",
  Earlybird: "Earlybird",
  Hudson: "Hudson",
  Nashville: "Nashville",
  Valencia: "Valencia"
};

class CameraIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: Camera.Constants.Type.back,
      showMetor: true,
      flashOn: Camera.Constants.FlashMode.auto,
      mediaSource: null,
      mediaType: null,
      album: null,
      modeindex: 0,
      recording: false,
      photoing: false,

      // imagefilter related
      filteredImageUri: null,
      filterInitProcess: [],
      filterSelection: shaderNames.Normal,
      filterChoosed: shaderNames.Normal,

      // video related
      shouldPlay: true,
      muted: false
    };
  }

  componentDidMount() {
    CameraRoll.getPhotos({ first: 1 })
      .then(data => {
        this.setState({
          album: data.edges
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  removeMedia = () => {
    const { mediaSource } = this.state;
    FileSystem.deleteAsync(mediaSource.uri)
      .then(() => {
        console.log(`removed file ${mediaSource.uri}`);
        this.setState({
          mediaSource: null,
          mediaType: null
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          mediaSource: null,
          mediaType: null
        });
      });
  };

  next = async () => {
    const { mediaSource, mediaType } = this.state;
    const { navigation, addAImage } = this.props;
    if (mediaType === PHOTO) {
      const result = await takeSnapshotAsync(this._mainImageView, opt);
      addAImage({
        uri: result,
        type: PHOTO
      });
      FileSystem.deleteAsync(mediaSource.uri)
        .then(() => console.log(`deleted file ${mediaSource.uri}`))
        .catch(err => console.log(err));
    } else {
      addAImage({
        uri: mediaSource.uri,
        type: VIDEO
      });
    }
    navigation.navigate("PostPreview");
  };

  renderHeader = () => {
    const { mediaSource, mediaType } = this.state;
    const { appLocale, navigation } = this.props;
    return (
      <CustomHeader
        style={{ backgroundColor: "#fff" }}
        headerTitle={`${locale[appLocale]["CAMERA"]}`}
        rightIconButton={() => {
          if (mediaSource && mediaType) {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={() => {
                  this.next();
                }}
              >
                <Text style={{ color: "black", fontSize: 15 }}>{`${
                  locale[appLocale]["NEXT"]
                }`}</Text>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              style={{ marginRight: theme.headerIconMargin }}
              onPress={() => {
                navigation.dismiss();
              }}
            >
              <Ionicons name="md-close" size={theme.iconMd} />
            </TouchableOpacity>
          );
        }}
        leftIconButton={() => {
          if (mediaSource && mediaType) {
            return (
              <TouchableOpacity
                style={{ marginLeft: theme.headerIconMargin }}
                onPress={() => {
                  this.removeMedia();
                }}
              >
                <Ionicons name="ios-arrow-back" size={theme.iconMd} />
              </TouchableOpacity>
            );
          }
          return null;
        }}
      />
    );
  };

  renderMetor = () => {
    const { showMetor } = this.state;
    if (showMetor) {
      return (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent"
          }}
        >
          <View
            style={{
              position: "absolute",
              width: "40%",
              height: "100%",
              borderLeftColor: theme.primaryColor,
              borderRightColor: theme.primaryColor,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              left: "30%"
            }}
          />
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "40%",
              top: "30%",
              borderTopColor: theme.primaryColor,
              borderBottomColor: theme.primaryColor,
              borderTopWidth: 1,
              borderBottomWidth: 1
            }}
          />
        </View>
      );
    }
    return null;
  };

  renderOptions = () => {
    const { appLocale } = this.props;
    const { type, showMetor, flashOn } = this.state;
    return (
      <View style={styles.optionWrapper}>
        <View style={styles.flipButtonWrapper}>
          <FlipButton
            containerStyle={{
              width: "90%",
              height: "80%"
            }}
            onValueChange={() => {
              this.setState({
                flashOn:
                  flashOn === Camera.Constants.FlashMode.auto
                    ? Camera.Constants.FlashMode.off
                    : Camera.Constants.FlashMode.auto
              });
            }}
            renderFrontLabel={() => (
              <Ionicons
                name="ios-flash"
                size={theme.iconMd}
                color={theme.primaryColor}
              />
            )}
            renderFrontText={() => (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ fontSize: 10, color: theme.primaryColor }}
              >{`${locale[appLocale]["FLASH_ON"]}`}</Text>
            )}
            renderBackLabel={() => (
              <Ionicons name="ios-flash-off" size={theme.iconMd} />
            )}
            renderBackText={() => (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ fontSize: 10 }}
              >{`${locale[appLocale]["FLASH_OFF"]}`}</Text>
            )}
          />
        </View>
        <View style={styles.flipButtonWrapper}>
          <FlipButton
            containerStyle={{
              width: "90%",
              height: "80%"
            }}
            onValueChange={() => {
              this.setState({
                type:
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
              });
            }}
            renderFrontLabel={() => (
              <Ionicons name="md-reverse-camera" size={theme.iconMd} />
            )}
            renderFrontText={() => (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ fontSize: 10 }}
              >{`${locale[appLocale]["CAMERA_BACK"]}`}</Text>
            )}
            renderBackLabel={() => (
              <Ionicons name="md-reverse-camera" size={theme.iconMd} />
            )}
            renderBackText={() => (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ fontSize: 10 }}
              >{`${locale[appLocale]["CAMERA_FRONT"]}`}</Text>
            )}
          />
        </View>
        <View style={styles.flipButtonWrapper}>
          <FlipButton
            containerStyle={{
              width: "90%",
              height: "80%"
            }}
            onValueChange={() => {
              this.setState({
                showMetor: !showMetor
              });
            }}
            renderFrontLabel={() => (
              <Ionicons name="md-grid" size={theme.iconMd} />
            )}
            renderFrontText={() => (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ fontSize: 10 }}
              >{`${locale[appLocale]["GRID_ON"]}`}</Text>
            )}
            renderBackLabel={() => (
              <Ionicons name="ios-grid" size={theme.iconMd} />
            )}
            renderBackText={() => (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ fontSize: 10 }}
              >{`${locale[appLocale]["GRID_OFF"]}`}</Text>
            )}
          />
        </View>
      </View>
    );
  };

  renderAlbum = () => {
    const { album } = this.state;
    if (album) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={async () => {
            const { status } = await Permissions.getAsync(
              Permissions.CAMERA_ROLL
            );
            if (status !== "granted") {
              const ask = await Permissions.askAsync(Permissions.CAMERA_ROLL);
              if (ask.status !== "granted") {
                return;
              }
            }
            let captured = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1
            });
            if (!captured.cancelled) {
              let processedImage = await processImage(captured.uri);
              this.setState({
                mediaSource: processedImage,
                mediaType: PHOTO
              });
            }
          }}
          style={{
            width: "100%",
            height: window.width * 0.2,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {album.map((p, i) => (
            <Image
              key={i}
              source={{ uri: p.node.image.uri }}
              style={{
                width: window.width * 0.1,
                height: window.width * 0.1,
                borderRadius: 10
              }}
            />
          ))}
        </TouchableOpacity>
      );
    }
    return null;
  };

  renderMode = () => {
    const { appLocale } = this.props;
    return (
      <ModalDropdown
        defaultTextStyle={{
          fontSize: 10,
          color: "grey",
          fontWeight: "bold"
        }}
        defaultButtonStyle={{
          width: window.width * 0.25,
          height: window.width * 0.05
        }}
        onSelect={async (option, index) => {
          if (index === 1) {
            let { status } = await Permissions.getAsync(
              Permissions.AUDIO_RECORDING
            );
            if (status !== "granted") {
              let askpmsn = await Permissions.askAsync(
                Permissions.AUDIO_RECORDING
              );
              if (askpmsn.status !== "granted") return;
            }
          }
          this.setState({
            modeindex: index
          });
        }}
        defaultIndex={0}
        options={[
          `${locale[appLocale]["ONLY_CAMERA"]}`,
          `${locale[appLocale]["CAMERA_AND_VIDEO"]}`
        ]}
        renderOptionRow={(option, index) => (
          <View
            style={{
              width: "100%",
              height: window.width * 0.05,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 10,
                fontWeight: "bold",
                color:
                  index === this.state.modeindex ? theme.primaryColor : "grey"
              }}
            >
              {option}
            </Text>
          </View>
        )}
      />
    );
  };

  renderPreview = () => {
    const { mediaType, mediaSource, filterSelection } = this.state;
    if (mediaType === PHOTO) {
      return (
        <View
          ref={o => (this._mainImageView = o)}
          style={[
            styles.preview,
            { justifyContent: "center", alignItems: "center" }
          ]}
        >
          <Surface
            style={{
              width: "100%",
              height: "100%"
            }}
          >
            <Brannan on={filterSelection === shaderNames.Brannan}>
              <Earlybird on={filterSelection === shaderNames.Earlybird}>
                <Hudson on={filterSelection === shaderNames.Hudson}>
                  <Nashville on={filterSelection === shaderNames.Nashville}>
                    <Valencia on={filterSelection === shaderNames.Valencia}>
                      <GLImage
                        source={{ uri: mediaSource.uri }}
                        resizeMode="center"
                      />
                    </Valencia>
                  </Nashville>
                </Hudson>
              </Earlybird>
            </Brannan>
          </Surface>
        </View>
      );
    } else if (mediaType === VIDEO) {
      return (
        <Video
          ref={o => (this._mainVideoView = o)}
          style={styles.preview}
          source={{ uri: mediaSource.uri }}
          resizeMode="cover"
          shouldPlay={this.state.shouldPlay}
          isLooping
          isMuted={this.state.muted}
        />
      );
    } else {
      return null;
    }
  };

  renderCamera = () => {
    const { mediaSource, type, flashOn } = this.state;
    if (!mediaSource)
      return (
        <Camera
          ref={o => (this._camera = o)}
          ratio={"1:1"}
          type={type}
          style={{ width: window.width, height: window.width }}
          flashMode={flashOn}
        >
          {this.renderMetor()}
        </Camera>
      );
    return null;
  };

  // _filterInitialized = filterName => {
  //   const { filterInitProcess } = this.state;
  //   if (!filterInitProcess.includes(filterName)) {
  //     filterInitProcess.push(filterName);
  //   }
  //   this.setState({
  //     filterInitProcess
  //   });
  // };

  _renderFilterCase = filterName => {
    const { mediaSource } = this.state;
    switch (filterName) {
      case shaderNames.Normal:
        return (
          <Normal on={true}>
            <GLImage source={{ uri: mediaSource.uri }} resizeMode="cover" />
          </Normal>
        );
      case shaderNames.Brannan:
        return (
          <Brannan on={true}>
            <GLImage source={{ uri: mediaSource.uri }} resizeMode="cover" />
          </Brannan>
        );
      case shaderNames.Earlybird:
        return (
          <Earlybird on={true}>
            <GLImage source={{ uri: mediaSource.uri }} resizeMode="cover" />
          </Earlybird>
        );
      case shaderNames.Hudson:
        return (
          <Hudson on={true}>
            <GLImage source={{ uri: mediaSource.uri }} resizeMode="cover" />
          </Hudson>
        );
      case shaderNames.Nashville:
        return (
          <Nashville on={true}>
            <GLImage source={{ uri: mediaSource.uri }} resizeMode="cover" />
          </Nashville>
        );
      case shaderNames.Valencia:
        return (
          <Valencia on={true}>
            <GLImage source={{ uri: mediaSource.uri }} resizeMode="cover" />
          </Valencia>
        );
      default:
        return null;
    }
  };

  renderFilterImage = filterName => {
    const { filterSelection } = this.state;
    return (
      <TouchableOpacity
        key={filterName}
        activeOpacity={0.8}
        onPress={() => {
          this.setState({
            filterSelection: filterName
          });
        }}
        style={styles.filterImageCell}
      >
        <Text>{filterName}</Text>
        <View
          style={[
            styles.filterImage,
            {
              borderColor:
                filterSelection === filterName ? theme.primaryColor : null
            },
            { borderWidth: filterSelection === filterName ? 2 : 0 }
          ]}
        >
          <Surface
            style={{
              width: Math.floor(window.width * 0.23),
              height: Math.floor(window.width * 0.23),
              borderRadius: 2
            }}
            // onLoad={() => {
            //   this._filterInitialized(filterName);
            // }}
          >
            {this._renderFilterCase(filterName)}
          </Surface>
        </View>
      </TouchableOpacity>
    );
  };

  _renderFilterLoading = () => {
    const { filterInitProcess } = this.state;
    if (filterInitProcess.length !== Object.keys(shaderNames).length) {
      return (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            elevation: 1
          }}
        >
          <SkypeIndicator size={theme.indicatorLg} />
        </View>
      );
    }
    return null;
  };

  renderContent = () => {
    const { mediaSource, mediaType } = this.state;
    const { appLocale } = this.props;
    if (mediaSource && mediaType) {
      if (mediaType === PHOTO) {
        // render image filters
        return (
          <View style={styles.contentContainer}>
            <ScrollView
              style={{ height: "80%" }}
              contentContainerStyle={{
                justifyContent: "space-between",
                alignItems: "center",
                paddingStart: 10,
                paddingEnd: 10
              }}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            >
              {this.renderFilterImage(shaderNames.Normal)}
              {this.renderFilterImage(shaderNames.Brannan)}
              {this.renderFilterImage(shaderNames.Earlybird)}
              {this.renderFilterImage(shaderNames.Hudson)}
              {this.renderFilterImage(shaderNames.Nashville)}
              {this.renderFilterImage(shaderNames.Valencia)}
            </ScrollView>
            {/* {this._renderFilterLoading()} */}
          </View>
        );
      } else {
        // render video editing
        return (
          <View style={styles.contentContainer}>
            <View style={styles.optionWrapper}>
              <View style={styles.flipButtonWrapper}>
                <FlipButton
                  containerStyle={{
                    width: "90%",
                    height: "80%"
                  }}
                  onValueChange={() => {
                    this.setState({
                      muted: !this.state.muted
                    });
                  }}
                  renderFrontLabel={() => (
                    <Ionicons name="md-volume-high" size={theme.iconMd} />
                  )}
                  renderFrontText={() => (
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ fontSize: 10 }}
                    >{`${locale[appLocale]["MUTED"]}`}</Text>
                  )}
                  renderBackLabel={() => (
                    <Ionicons name="md-volume-off" size={theme.iconMd} />
                  )}
                  renderBackText={() => (
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ fontSize: 10 }}
                    >{`${locale[appLocale]["MUTED"]}`}</Text>
                  )}
                />
              </View>
            </View>
            <View
              style={{
                height: "80%",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <View
                style={{
                  width: "30%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Ionicons
                  name={this.state.shouldPlay ? "md-pause" : "md-play"}
                  size={theme.indicatorLg}
                  color={this.state.shouldPlay ? theme.primaryColor : "black"}
                  onPress={() => {
                    this.setState({
                      shouldPlay: !this.state.shouldPlay
                    });
                  }}
                />
              </View>
              <View
                style={{
                  width: "35%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  right: 0
                }}
              >
                <Ionicons
                  name="md-musical-notes"
                  size={theme.indicatorLg}
                  onPress={() => {
                    Alert.alert(
                      `${locale[appLocale]["ALERT_INFO"]}`,
                      `${locale[appLocale]["FUNCTION_UNAVAILABLE"]}`,
                      [
                        {
                          text: `${locale[appLocale]["CONFIRM"]}`,
                          style: "cancel"
                        }
                      ],
                      {
                        cancelable: true
                      }
                    );
                  }}
                />
              </View>
            </View>
          </View>
        );
      }
    }
    return (
      <View style={styles.contentContainer}>
        {this.renderOptions()}
        <View
          style={{
            height: "80%",
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff"
          }}
        >
          <View
            style={{
              position: "absolute",
              left: 0,
              width: "35%",
              height: "100%",
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "flex-end"
            }}
          >
            {this.renderMode()}
          </View>
          <CircularProgress
            rotation={0}
            tintColor={theme.primaryColor}
            ref={o => (this._circular = o)}
            size={window.width * 0.25}
            width={window.width * 0.03}
            backgroundWidth={window.width * 0.03}
            backgroundColor={theme.primaryGrey}
            prefill={0}
            onAnimationComplete={() => {
              if (this._camera) {
                this._camera.stopRecording();
                this._record
                  .then(video => {
                    this.setState({
                      mediaSource: video,
                      mediaType: VIDEO,
                      recording: false
                    });
                  })
                  .catch(err => {
                    console.log(err);
                    this.setState({
                      recording: false
                    });
                  });
              }
            }}
          >
            {fill => (
              <TouchableOpacity
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "lightgrey"
                }}
                disabled={this.state.mediaSource ? true : false}
                activeOpacity={0.8}
                onLongPress={async () => {
                  if (this.state.modeindex === 1) {
                    // photo and video
                    if (this._camera) {
                      this.setState({
                        recording: true
                      });
                      this._record = this._camera.recordAsync({
                        quality: Camera.Constants.VideoQuality["480p"]
                      });
                      this._circular.animate(100, 15 * 1000, Easing.linear);
                    }
                  }
                }}
                onPressOut={async () => {
                  let percent = this._circular.getValue();
                  if (percent > 0 && percent < 100) {
                    this._circular.interruptAnimate();
                  } else {
                    if (
                      this._camera &&
                      !this.state.recording &&
                      !this.state.photoing &&
                      !this.state.mediaSource
                    ) {
                      this.setState({
                        photoing: true
                      });
                      let photo = await this._camera.takePictureAsync({
                        skipProcessing: true
                      });
                      let processedImage = await processImage(photo.uri);
                      this.setState({
                        photoing: false,
                        mediaSource: processedImage,
                        mediaType: PHOTO
                      });
                    }
                  }
                }}
              />
            )}
          </CircularProgress>
          <View
            style={{
              position: "absolute",
              right: 0,
              width: "35%",
              height: "100%",
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {this.renderAlbum()}
            <Text
              style={{ color: "grey", fontSize: 10, fontWeight: "bold" }}
            >{`${locale[appLocale]["FROM_LIBRARY"]}`}</Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View
          style={{
            width: window.width,
            height: window.width,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.renderCamera()}
          {this.renderPreview()}
        </View>
        {this.renderContent()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client.client,
  appLocale: state.app.appLocale,
  profile: state.profile.profile
});

const mapDispatchToProps = dispatch => ({
  addAImage: uri => dispatch(addAImage(uri))
});

export default createStackNavigator(
  {
    Camera: {
      screen: connect(
        mapStateToProps,
        mapDispatchToProps
      )(CameraIndex),
      navigationOptions: {
        header: null
      }
    },
    PostPreview
  },
  {
    headerMode: "none",
    cardStyle: {
      backgroundColor: "#fff"
    }
  }
);

const styles = StyleSheet.create({
  container: {
    width: window.width,
    height: window.height - Header.HEIGHT,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  flipButtonWrapper: {
    width: "20%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  optionWrapper: {
    height: "20%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#fff"
  },
  lineStyle: {
    backgroundColor: theme.primaryColor,
    width: Math.floor(window.width / 4),
    left: Math.floor(window.width / 8)
  },

  preview: {
    width: window.width,
    height: window.width,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    elevation: 1
  },
  contentContainer: {
    height: window.height - window.width - Header.HEIGHT,
    width: window.width,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  filterImageCell: {
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    height: "100%"
  },
  filterImage: {
    borderRadius: 4,
    height: window.width * 0.25,
    width: window.width * 0.25,
    justifyContent: "center",
    alignItems: "center"
  }
});
