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
import Icon from "react-native-vector-icons/FontAwesome";
import window from "../../utils/getDeviceInfo";
import { Surface } from "gl-react-expo";
import GLImage from "gl-react-image";
import { Header } from "react-navigation";
import MyHeader from "../../components/Header";
import { SkypeIndicator, BallIndicator } from "react-native-indicators";
import { takeSnapshotAsync } from "expo";

import Modal from "../../components/Modal";

import Brannan from "../../filters/Brannan";
import Earlybird from "../../filters/Earlybird";
import Hudson from "../../filters/Hudson";
import Nashville from "../../filters/Nashville";
import Valencia from "../../filters/Valencia";
import Normal from "../../filters/Normal";

import theme from "../../common/theme";

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
  height: window.height * 0.25,
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

export default class ImageFilterPage extends React.Component {
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

  renderFilterImage = (filterName, key) => {
    const { filterSelection } = this.state;
    return (
      <TouchableOpacity
        key={key}
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
    return (
      <Modal visible={this.state.filterModalVisible} style={modalStyle}>
        <View style={styles.modalContent}>
          <MyHeader
            style={{ height: "20%", marginTop: 10 }}
            headerTitle="Choose a filter"
            rightIconButton={<Icon name="check" size={20} />}
            rightButtonOnPress={() => {
              // confirm filter selection
              const { filterSelection } = this.state;
              this.setState({
                filterModalVisible: false,
                filterChoosed: filterSelection
              });
            }}
            leftIconButton={<Icon name="chevron-down" size={20} />}
            leftButtonOnPress={() => {
              // cancel filter selection
              const { filterChoosed } = this.state;
              this.setState({
                filterModalVisible: false,
                filterSelection: filterChoosed
              });
            }}
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
            {this.renderFilterImage(shaderNames.Normal, 0)}
            {this.renderFilterImage(shaderNames.Brannan, 1)}
            {this.renderFilterImage(shaderNames.Earlybird, 2)}
            {this.renderFilterImage(shaderNames.Hudson, 3)}
            {this.renderFilterImage(shaderNames.Nashville, 4)}
            {this.renderFilterImage(shaderNames.Valencia, 5)}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  renderMetaModal = () => {
    return (
      <Modal visible={this.state.metaModalVisible} style={modalStyle}>
        <View style={styles.modalContent}>
          <MyHeader
            style={{ height: "20%", marginTop: 10 }}
            headerTitle="Add tags"
            rightIconButton={<Icon name="check" size={20} />}
            rightButtonOnPress={() => {
              // confirm filter selection
              this.setState({
                metaModalVisible: false
              });
            }}
            leftIconButton={<Icon name="chevron-down" size={20} />}
            leftButtonOnPress={() => {
              this.setState({
                metaModalVisible: false
              });
            }}
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
          console.log("touched");
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
        <View />
      </TouchableWithoutFeedback>
    );
  };

  renderFilterIcon = () => {
    if (this._checkFilterInitStatus()) {
      return <Icon name="sliders" size={20} />;
    }
    return <SkypeIndicator size={20} />;
  };

  renderMetaIcon = () => {
    return <Icon name="tags" size={20} />;
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
    return (
      <View style={styles.container}>
        {this.renderImageBackground()}
        <View style={styles.imageContentView}>
          <MyHeader
            style={{ backgroundColor: "transparent" }}
            headerTitle="Edit your photo"
            rightIconButton={
              <Text style={{ color: "black", fontSize: 15 }}>Next</Text>
            }
            rightButtonOnPress={() => {
              this.next();
            }}
            leftIconButton={<Icon name="chevron-left" size={20} />}
            leftButtonOnPress={() => {
              const { navigation } = this.props;
              navigation.dismiss();
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
