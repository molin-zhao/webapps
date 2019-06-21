import React from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Header } from "react-navigation";
import { SkypeIndicator } from "react-native-indicators";

import PostCardComponent from "../../components/PostCardComponent";
import baseUrl from "../../common/baseUrl";
import window from "../../utils/getDeviceInfo";
import theme from "../../common/theme";

class PostDetail extends React.Component {
  mounted = false;
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      loading: false,
      error: null
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { navigation, client } = this.props;
    let postId = navigation.getParam("_id");
    this.setState(
      {
        loading: true
      },
      () => {
        let url = `${baseUrl.api}/post/detail`;
        fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            postId,
            userId: client && client.user ? client.user._id : null
          })
        })
          .then(res => res.json())
          .then(res => {
            if (this.mounted) {
              if (res.status === 200) {
                this.setState({
                  dataSource: res.data
                });
              } else {
                this.setState({
                  error: res.msg
                });
              }
            }
          })
          .then(() => {
            if (this.mounted) {
              this.setState({
                loading: false
              });
            }
          })
          .catch(err => {
            console.log(err);
            if (this.mounted) {
              this.setState({
                error: err
              });
            }
          });
      }
    );
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  renderPost = () => {
    const { loading, dataSource } = this.state;
    const { i18n } = this.props;
    if (loading || !dataSource) {
      return (
        <View
          style={{
            height: window.height - 2 * Header.HEIGHT,
            width: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <SkypeIndicator size={theme.indicatorLg} />
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
            <Text>{`${i18n.t("RESOLVE_RESOURCE_ERROR")}`}</Text>
          </View>
        );
      }
      return <PostCardComponent dataSource={dataSource} />;
    }
  };

  render() {
    return <View style={styles.container}>{this.renderPost()}</View>;
  }
}

const mapStateToProps = state => ({
  client: state.client.client,
  i18n: state.app.i18n
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
