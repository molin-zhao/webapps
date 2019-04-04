import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";
import { withNavigation, Header } from "react-navigation";
import { WaveIndicator } from "react-native-indicators";

import CustomCarousel from "../../components/CustomCarousel";
import RecommendUserCard from "../../components/RecommendUserCard";

import baseUrl from "../../common/baseUrl";
import config from "../../common/config";
import window from "../../utils/getDeviceInfo";

const carouselStyle = {
  sliderWidth: window.width * 0.85,
  sliderHeight: window.height * 0.65,
  itemWidth: window.width * 0.7,
  itemHeight: window.height * 0.5
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
            `${baseUrl.api}/recommend/user?limit=${config.userListReturnLimit}`,
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
        dataSource={item}
        itemWidth={carouselStyle.itemWidth}
        itemHeight={carouselStyle.itemHeight}
      />
    );
  };

  renderCarousel = () => {
    const { fetching, userList } = this.state;
    if (!fetching && userList.length !== 0) {
      return (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Follow people to see there story
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 4
            }}
          >
            <CustomCarousel
              containerStyle={{
                height: "90%",
                width: "100%",
                marginTop: "10%"
              }}
              sliderWidth={carouselStyle.sliderWidth}
              sliderHeight={carouselStyle.sliderHeight}
              itemWidth={carouselStyle.itemWidth}
              itemHeight={carouselStyle.itemHeight}
              data={userList}
              renderItem={this._renderItem}
            />
          </View>
        </View>
      );
    } else {
      return <WaveIndicator size={30} />;
    }
  };

  render() {
    return <View style={styles.container}>{this.renderCarousel()}</View>;
  }
}

const mapStateToProps = state => ({
  client: state.client.client
});

export default connect(mapStateToProps)(withNavigation(UserRecommend));

const styles = StyleSheet.create({
  container: {
    width: window.width,
    height: window.height - 2 * Header.HEIGHT,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  }
});
