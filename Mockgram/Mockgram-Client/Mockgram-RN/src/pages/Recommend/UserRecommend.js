import React from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { Constants } from "expo";
import { connect } from "react-redux";
import { withNavigation, Header } from "react-navigation";
import { WaveIndicator } from "react-native-indicators";

import CustomCarousel from "../../components/CustomCarousel";
import Carousel from "react-native-snap-carousel";
import RecommendUserCard from "../../components/RecommendUserCard";

import baseUrl from "../../common/baseUrl";
import config from "../../common/config";
import window from "../../utils/getDeviceInfo";
import { locale } from "../../common/locale";
import theme from "../../common/theme";

const sliderHeight =
  window.height - 2 * Header.HEIGHT - Constants.statusBarHeight;
const carouselStyle = {
  sliderWidth: Math.floor(window.width),
  sliderHeight: Math.floor(sliderHeight),
  itemWidth: Math.floor(window.width * 0.7),
  itemHeight: Math.floor(window.height * 0.5)
};

class UserRecommend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      fetching: false,
      error: null
    };
  }
  componentDidMount() {
    this.fetchUserList();
  }

  fetchUserList = () => {
    const { client, navigation } = this.props;
    if (client && client.token) {
      this.setState(
        {
          fetching: true
        },
        () => {
          return fetch(
            `${baseUrl.api}/recommend/user?limit=${config.USER_RETURN_LIMIT}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: client.token
              }
            }
          )
            .then(res => res.json())
            .then(resJson => {
              if (resJson.status === 200) {
                this.setState({
                  userList: resJson.data,
                  fetching: false
                });
              } else {
                this.setState({
                  fetching: false,
                  error: resJson.msg
                });
              }
            })
            .catch(err => {
              this.setState(
                {
                  fetching: false,
                  error: err
                },
                () => {
                  console.log(err);
                }
              );
            });
        }
      );
    } else {
      navigation.push("Auth");
    }
  };

  _renderItem = ({ item, index }) => {
    return (
      <RecommendUserCard
        key={index}
        dataSource={item}
        itemWidth={carouselStyle.itemWidth}
        itemHeight={carouselStyle.itemHeight}
      />
    );
  };

  renderCarouselSlider = () => {
    const { userList } = this.state;
    if (Platform.OS === "android") {
      return (
        <Carousel
          contentContainerCustomStyle={{
            justifyContent: "center",
            alignItems: "center"
          }}
          sliderWidth={carouselStyle.sliderWidth}
          sliderHeight={carouselStyle.sliderHeight}
          itemWidth={carouselStyle.itemWidth}
          itemHeight={carouselStyle.itemHeight}
          data={userList}
          renderItem={({ item, index }) => {
            return (
              <RecommendUserCard
                key={index}
                dataSource={item}
                itemWidth={carouselStyle.itemWidth}
                itemHeight={carouselStyle.itemHeight}
              />
            );
          }}
        />
      );
    }
    return (
      <CustomCarousel
        contentContainerCustomStyle={{
          justifyContent: "center",
          alignItems: "center"
        }}
        sliderWidth={carouselStyle.sliderWidth}
        sliderHeight={carouselStyle.sliderHeight}
        itemWidth={carouselStyle.itemWidth}
        itemHeight={carouselStyle.itemHeight}
        data={userList}
        renderItem={({ item, index }) => {
          return (
            <RecommendUserCard
              key={index}
              dataSource={item}
              itemWidth={carouselStyle.itemWidth}
              itemHeight={carouselStyle.itemHeight}
            />
          );
        }}
      />
    );
  };

  renderCarousel = () => {
    const { fetching, userList } = this.state;
    const { appLocale } = this.props;
    if (!fetching && userList.length !== 0) {
      return (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
              position: "absolute",
              top: theme.marginTop
            }}
          >
            {`${locale[appLocale]["FOLLOW_USER_TO_SEE_STORY"]}`}
          </Text>
          <View style={{ width: "100%", height: "100%" }}>
            {this.renderCarouselSlider()}
          </View>
        </View>
      );
    } else {
      return <WaveIndicator size={theme.indicatorLg} />;
    }
  };

  render() {
    return <View style={styles.container}>{this.renderCarousel()}</View>;
  }
}

const mapStateToProps = state => ({
  client: state.client.client,
  appLocale: state.app.appLocale
});

export default connect(mapStateToProps)(withNavigation(UserRecommend));

const styles = StyleSheet.create({
  container: {
    width: window.width,
    height: window.height - 2 * Header.HEIGHT - Constants.statusBarHeight,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  }
});
