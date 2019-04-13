import React from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Header } from "react-navigation";
import { SkypeIndicator } from "react-native-indicators";

import PostCardComponent from "../../components/PostCardComponent";
import baseUrl from "../../common/baseUrl";
import window from "../../utils/getDeviceInfo";

class PostDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      loading: false,
      error: null
    };
  }

  componentDidMount() {
    const { navigation, client } = this.props;
    let postId = navigation.getParam("_id", null);
    this.setState(
      {
        loading: true
      },
      () => {
        fetch(`${baseUrl.api}/post/detail`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            postId: postId,
            userId: client && client.user ? client.user._id : null
          })
        })
          .then(res => res.json())
          .then(res => {
            this.setState({
              dataSource: res.status === 200 ? res.data : null,
              error: res.status === 200 ? null : res.msg
            });
          })
          .then(() => {
            this.setState({
              loading: false
            });
          })
          .catch(err => {
            this.setState({
              error: err
            });
          });
      }
    );
  }

  renderPost = () => {
    if (this.state.loading || !this.state.dataSource) {
      return (
        <View
          style={{
            height: window.height - Header.HEIGHT - 50,
            width: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <SkypeIndicator size={24} />
        </View>
      );
    } else {
      if (this.state.error) {
        return (
          <View
            style={{
              height: window.height - Header.HEIGHT - 50,
              width: "100%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text>Cannot get post detail</Text>
          </View>
        );
      }
      return <PostCardComponent dataSource={this.state.dataSource} />;
    }
  };
  render() {
    return <View style={styles.container}>{this.renderPost()}</View>;
  }
}

const mapStateToProps = state => ({
  client: state.client.client
});

export default connect(
  mapStateToProps,
  null
)(PostDetail);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  }
});
