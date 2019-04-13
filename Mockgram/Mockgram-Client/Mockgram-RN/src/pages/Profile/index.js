import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from "react-native";
import { connect } from "react-redux";

import Thumbnail from "../../components/Thumbnail";
import TabView from "../../components/TabView";
import Icon from "react-native-vector-icons/Ionicons";
import PostsGridView from "./PostsGridView";

import window from "../../utils/getDeviceInfo";
import { getClientProfile } from "../../redux/actions/profileActions";
import theme from "../../common/theme";
import * as Types from "../../common/types";

class ProfileIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialProfile: {
        avatar: "",
        postCount: 0,
        followerCount: 0,
        followingCount: 0,
        bio: "no bio yet"
      },
      refreshing: false
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title", "username"),
    headerRight: (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{ marginRight: 20 }}
        onPress={() => {
          navigation.navigate("Settings");
        }}
      >
        <Icon name="ios-settings" size={24} />
      </TouchableOpacity>
    )
  });

  componentDidMount() {
    const { navigation, profile } = this.props;
    if (profile) {
      navigation.setParams({
        title: profile.username
      });
    }
  }

  onRefresh = () => {
    const { client, getClientProfile } = this.props;
    if (client && client.token) {
      this.setState(
        {
          refreshing: true
        },
        () => {
          getClientProfile(client.token)
            .then(() => {
              this.setState({
                refreshing: false
              });
            })
            .catch(err => {
              this.setState(
                {
                  refreshing: false
                },
                () => {
                  console.log(err);
                }
              );
            });
        }
      );
    }
  };

  render() {
    const { initialProfile } = this.state;
    const { profile, navigation, created, liked, mentioned } = this.props;
    let userProfile = profile ? profile : initialProfile;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-start"
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        horizontal={false}
      >
        <Thumbnail
          style={{ marginTop: 30, height: 80, width: 80 }}
          source={userProfile.avatar}
        />
        <View style={styles.count}>
          <TouchableOpacity style={styles.countSubview} activeOpacity={0.8}>
            <Text style={styles.countText}>{userProfile.postCount}</Text>
            <Text style={styles.countText}>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.countSubview}
            activeOpacity={0.8}
            onPress={() => {
              navigation.push("UserList", {
                userId: userProfile._id,
                type: "Following"
              });
            }}
          >
            <Text style={styles.countText}>{userProfile.followingCount}</Text>
            <Text style={styles.countText}>Following</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.countSubview}
            activeOpacity={0.8}
            onPress={() => {
              navigation.push("UserList", {
                userId: userProfile._id,
                type: "Follower"
              });
            }}
          >
            <Text style={styles.countText}>{userProfile.followerCount}</Text>
            <Text style={styles.countText}>Follower</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bio}>
          <Text style={styles.bioText}>{userProfile.bio}</Text>
        </View>
        <View style={styles.embeddedTabView}>
          <TabView
            activeColor={theme.primaryColor}
            inactiveColor={"black"}
            tabBarComponents={[
              {
                icon: {
                  name: "md-images"
                },
                text: {
                  title: "Posts"
                }
              },
              {
                icon: {
                  name: "md-heart"
                },
                text: {
                  title: "Liked"
                }
              },
              {
                icon: {
                  name: "ios-people"
                },
                text: {
                  title: "Mentioned"
                }
              }
            ]}
          >
            <PostsGridView
              type={Types.CREATED_POST}
              userId={userProfile._id}
              refreshing={this.state.refreshing}
              dataSource={created}
              numColumns={3}
            />
            <PostsGridView
              type={Types.LIKED_POST}
              userId={userProfile._id}
              refreshing={this.state.refreshing}
              dataSource={liked}
              numColumns={3}
            />
            <PostsGridView
              type={Types.MENTIONED_POST}
              userId={userProfile._id}
              refreshing={this.state.refreshing}
              dataSource={mentioned}
              numColumns={3}
            />
          </TabView>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff"
  },
  count: {
    marginTop: 20,
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: window.height * 0.1
  },
  countSubview: {
    width: "30%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  countText: {
    alignSelf: "center",
    fontSize: 15
  },
  bio: {
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 50
  },
  bioText: {
    fontSize: 12
  },
  embeddedTabView: {
    marginTop: 15
  }
});

const mapStateToProps = state => {
  return {
    profile: state.profile.profile,
    client: state.client.client,
    created: state.profile.created,
    liked: state.profile.liked,
    mentioned: state.profile.mentioned
  };
};

const mapDispatchToProps = dispatch => ({
  getClientProfile: token => dispatch(getClientProfile(token))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileIndex);
