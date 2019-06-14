import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  PixelRatio
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Surface } from "gl-react-expo";
import GLImage from "gl-react-image";
import { Header } from "react-navigation";
import { SkypeIndicator } from "react-native-indicators";
import { takeSnapshotAsync } from "expo";
import { connect } from "react-redux";

import Modal from "../../components/Modal";
import MyHeader from "../../components/Header";

import Brannan from "../../filters/Brannan";
import Earlybird from "../../filters/Earlybird";
import Hudson from "../../filters/Hudson";
import Nashville from "../../filters/Nashville";
import Valencia from "../../filters/Valencia";
import Normal from "../../filters/Normal";

import theme from "../../common/theme";
import window from "../../utils/getDeviceInfo";

const shaderNames = {
  Normal: "Normal",
  Brannan: "Brannan",
  Earlybird: "Earlybird",
  Hudson: "Hudson",
  Nashville: "Nashville",
  Valencia: "Valencia"
};

const modalStyle = {
  width: window.width,
  height: window.height * 0.3,
  borderTopWidth: 1,
  borderTopColor: "lightgrey",
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  backgroundColor: "#fff",
  justifyContent: "flex-start",
  alignItems: "center"
};

const targetPixelCount = 720;
const pixelRatio = PixelRatio.get();
const pixels = targetPixelCount / pixelRatio;
const opt = {
  format: "jpg",
  height: pixels,
  width: pixels
};

class ImageFilterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUri: this.props.navigation.getParam("image", null),
      filteredImageUri: "",
      filterModalVisible: false,
      metaModalVisible: false,
      filterInitProcess: [],
      filterSelection: shaderNames.Normal,
      filterChoosed: shaderNames.Normal
    };
  }

  renderMainImage = () => {
    const { filterSelection, imageUri } = this.state;
    return (
      <View style={styles.mainImage}>
        <View
          ref={o => (this._mainImageView = o)}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "transparent"
          }}
        >
          <Image
            source={{ uri: imageUri.uri }}
            style={[
              {
                position: "absolute",
                top: 0,
                width: "100%",
                height: "100%",
                zIndex: 1
              },
              { opacity: filterSelection === shaderNames.Normal ? 1 : 0 }
            ]}
            resizeMode="center"
          />
          <Surface
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              height: "100%"
            }}
          >
            <Normal on={filterSelection === shaderNames.Normal}>
              <Brannan on={filterSelection === shaderNames.Brannan}>
                <Earlybird on={filterSelection === shaderNames.Earlybird}>
                  <Hudson on={filterSelection === shaderNames.Hudson}>
                    <Nashville on={filterSelection === shaderNames.Nashville}>
                      <Valencia on={filterSelection === shaderNames.Valencia}>
                        <GLImage
                          source={{ uri: imageUri.uri }}
                          resizeMode="center"
                        />
                      </Valencia>
                    </Nashville>
                  </Hudson>
                </Earlybird>
              </Brannan>
            </Normal>
          </Surface>
        </View>
      </View>
    );
  };

  _filterInitialized = filterName => {
    const { filterInitProcess } = this.state;
    if (!filterInitProcess.includes(filterName)) {
      filterInitProcess.push(filterName);
    }
    this.setState({
      filterInitProcess
    });
  };

  _checkFilterInitStatus = () => {
    const { filterInitProcess } = this.state;
    if (filterInitProcess.length !== Object.keys(shaderNames).length) {
      return false;
    }
    return true;
  };

  _setFilterName = filterName => {
    this.setState({
      filterSelection: filterName
    });
  };

  _renderFilterCase = filterName => {
    const { imageUri } = this.state;
    switch (filterName) {
      case shaderNames.Normal:
        return (
          <Normal on={true}>
            <GLImage source={{ uri: imageUri.uri }} resizeMode="cover" />
          </Normal>
        );
      case shaderNames.Brannan:
        return (
          <Brannan on={true}>
            <GLImage source={{ uri: imageUri.uri }} resizeMode="cover" />
          </Brannan>
        );
      case shaderNames.Earlybird:
        return (
          <Earlybird on={true}>
            <GLImage source={{ uri: imageUri.uri }} resizeMode="cover" />
          </Earlybird>
        );
      case shaderNames.Hudson:
        return (
          <Hudson on={true}>
            <GLImage source={{ uri: imageUri.uri }} resizeMode="cover" />
          </Hudson>
        );
      case shaderNames.Nashville:
        return (
          <Nashville on={true}>
            <GLImage source={{ uri: imageUri.uri }} resizeMode="cover" />
          </Nashville>
        );
      case shaderNames.Valencia:
        return (
          <Valencia on={true}>
            <GLImage source={{ uri: imageUri.uri }} resizeMode="cover" />
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
          this._setFilterName(filterName);
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
              width: window.width * 0.23,
              height: window.width * 0.23,
              borderRadius: 2
            }}
            onLoad={() => {
              this._filterInitialized(filterName);
            }}
          >
            {this._renderFilterCase(filterName)}
          </Surface>
        </View>
      </TouchableOpacity>
    );
  };

  renderFilterModal = () => {
    const { i18n } = this.props;
    return (
      <Modal visible={this.state.filterModalVisible} style={modalStyle}>
        <View style={styles.modalContent}>
          <MyHeader
            style={{ height: "20%", marginTop: 10 }}
            headerTitle={`${i18n.t("CHOOSE_FILTER")}`}
            rightIconButton={() => (
              <FontAwesome
                name="check"
                size={theme.iconSm}
                onPress={() => {
                  // confirm filter selection
                  const { filterSelection } = this.state;
                  this.setState({
                    filterModalVisible: false,
                    filterChoosed: filterSelection
                  });
                }}
              />
            )}
            leftIconButton={() => (
              <FontAwesome
                name="chevron-down"
                size={theme.iconSm}
                onPress={() => {
                  // cancel filter selection
                  const { filterChoosed } = this.state;
                  this.setState({
                    filterModalVisible: false,
                    filterSelection: filterChoosed
                  });
                }}
              />
            )}
          />
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
        </View>
      </Modal>
    );
  };

  renderMetaModal = () => {
    const { i18n } = this.props;
    return (
      <Modal visible={this.state.metaModalVisible} style={modalStyle}>
        <View style={styles.modalContent}>
          <MyHeader
            style={{ height: "20%", marginTop: 10 }}
            headerTitle={`${i18n.t("META")}`}
            rightIconButton={() => (
              <FontAwesome
                name="check"
                size={theme.iconSm}
                onPress={() => {
                  // confirm filter selection
                  this.setState({
                    metaModalVisible: false
                  });
                }}
              />
            )}
            leftIconButton={() => (
              <FontAwesome
                name="chevron-down"
                size={theme.iconSm}
                onPress={() => {
                  this.setState({
                    metaModalVisible: false
                  });
                }}
              />
            )}
          />
          <View
            style={{
              height: "80%",
              width: "100%",
              justifyContent: "space-around",
              flexDirection: "row",
              alignItems: "center"
            }}
          />
        </View>
      </Modal>
    );
  };

  renderImageBackground = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          // close modal
          this.setState({
            filterModalVisible: false,
            metaModalVisible: false
          });
        }}
        style={styles.imageBackground}
      >
        <Image
          style={{ width: "100%", height: "100%", opacity: 0.5 }}
          blurRadius={30}
          source={{ uri: this.state.imageUri.uri }}
          resizeMode="cover"
        />
      </TouchableWithoutFeedback>
    );
  };

  renderFilterIcon = () => {
    if (this._checkFilterInitStatus()) {
      return <FontAwesome name="sliders" size={theme.iconMd} />;
    }
    return <SkypeIndicator size={theme.iconMd} />;
  };

  renderMetaIcon = () => {
    return <FontAwesome name="tags" size={theme.iconMd} />;
  };

  renderBottomBar = () => {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: window.width,
          height: window.height * 0.1,
          backgroundColor: "transparent",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            const { filterModalVisible } = this.state;
            if (!filterModalVisible) {
              this.setState({
                metaModalVisible: false,
                filterModalVisible: true
              });
            }
          }}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {this.renderFilterIcon()}
        </TouchableOpacity>
        <View
          style={{
            flex: 3
          }}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            const { metaModalVisible } = this.state;
            if (!metaModalVisible) {
              this.setState({
                filterModalVisible: false,
                metaModalVisible: true
              });
            }
          }}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {this.renderMetaIcon()}
        </TouchableOpacity>
      </View>
    );
  };

  next = async () => {
    const { navigation } = this.props;
    const result = await takeSnapshotAsync(this._mainImageView, opt);
    navigation.push("PostPreview", {
      imageUri: result
    });
  };

  render() {
    const { i18n } = this.props;
    return (
      <View style={styles.container}>
        {this.renderImageBackground()}
        <View style={styles.imageContentView}>
          <MyHeader
            style={{ backgroundColor: "transparent" }}
            headerTitle={`${i18n.t("EDIT_PHOTO")}`}
            rightIconButton={() => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{ justifyContent: "center", alignItems: "center" }}
                  onPress={() => {
                    this.next();
                  }}
                >
                  <Text style={{ color: "black", fontSize: 15 }}>{`${i18n.t(
                    "NEXT"
                  )}`}</Text>
                </TouchableOpacity>
              );
            }}
            leftIconButton={() => {
              return (
                <FontAwesome
                  name="chevron-left"
                  size={theme.iconSm}
                  onPress={() => {
                    const { navigation } = this.props;
                    navigation.dismiss();
                  }}
                />
              );
            }}
          />
          {this.renderMainImage()}
          {this.renderBottomBar()}
        </View>
        {this.renderFilterModal()}
        {this.renderMetaModal()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  i18n: state.app.i18n
});

export default connect(
  mapStateToProps,
  null
)(ImageFilterPage);

const styles = StyleSheet.create({
  container: {
    height: window.height,
    width: window.width,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  modalContent: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  imageBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: window.width,
    height: window.height,
    justifyContent: "center",
    alignItems: "center"
  },
  imageContentView: {
    position: "absolute",
    top: 0,
    left: 0,
    width: window.width,
    height: window.height - Header.HEIGHT,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  mainImage: {
    marginTop: (window.height * 0.9 - 200 - window.width * 0.85) / 2,
    width: window.width * 0.85,
    height: window.width * 0.85,
    justifyContent: "center",
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
