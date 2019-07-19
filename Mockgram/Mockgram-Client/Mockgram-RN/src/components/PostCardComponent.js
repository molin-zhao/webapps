import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ViewMoreText from "react-native-view-more-text";
import ActionSheet from "react-native-actionsheet";
import Carousel from "react-native-banner-carousel";

import Thumbnail from "./Thumbnail";
import ProgressiveImage from "./ProgressiveImage";

import { connect } from "react-redux";
import { withNavigation } from "react-navigation";

import window from "../utils/getDeviceInfo";
import baseUrl from "../common/baseUrl";
import theme from "../common/theme";
import * as Types from "../common/types";
import { locale } from "../common/locale";
import { dateConverter, numberConverter } from "../utils/unitConverter";
import {
  addToTopClientProfilePost,
  removeClientProfilePost
} from "../redux/actions/profileActions";

export class CardItemRow extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={[styles.cardItemRow, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}

export class CardItemCol extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={[styles.cardItemCol, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}

export class CardBody extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={[styles.cardBody, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}

export class Left extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={[styles.left, this.props.style]}>{this.props.children}</View>
    );
  }
}

export class Right extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={[styles.right, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}

class PostCardComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource,
      activeIndex: 0
    };
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  handleLike = () => {
    const {
      client,
      addLikePostToProfile,
      removeLikePostFromProfile,
      navigation
    } = this.props;
    const { dataSource } = this.state;
    if (client && client.token) {
      const url = `${baseUrl.api}/post/liked`;
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: client.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          postId: dataSource._id,
          addLike: !dataSource.liked
        })
      })
        .then(res => res.json())
        .then(res => {
          if (res.status === 200) {
            dataSource.likeCount = dataSource.liked
              ? dataSource.likeCount - 1
              : dataSource.likeCount + 1;
            dataSource.liked = !dataSource.liked;
            this.setState(
              {
                dataSource: dataSource
              },
              () => {
                if (dataSource.creator !== client.user._id) {
                  // client liked other user's post, push this post to local profile
                  if (dataSource.liked) {
                    addLikePostToProfile([dataSource]);
                  } else {
                    removeLikePostFromProfile(dataSource._id);
                  }
                }
              }
            );
          }
        });
    } else {
      navigation.navigate("Auth");
    }
  };

  handleComment = () => {
    const { dataSource } = this.state;
    const { navigation } = this.props;
    navigation.navigate("Comment", {
      postId: dataSource._id,
      creatorId: dataSource.creator
    });
  };

  handleShare = async () => {
    const { client } = this.props;
    try {
      const result = await Share.share(
        {
          message: "check this out"
        },
        {
          excludedActivityTypes: [
            "com.apple.UIKit.activity.PostToFacebook",
            "com.apple.UIKit.activity.PostToTwitter",
            "com.apple.UIKit.activity.PostToWeibo",
            "com.apple.UIKit.activity.Message",
            "com.apple.UIKit.activity.Mail",
            "com.apple.UIKit.activity.Print",
            "com.apple.UIKit.activity.CopyToPasteboard",
            "com.apple.UIKit.activity.AssignToContact",
            "com.apple.UIKit.activity.SaveToCameraRoll",
            "com.apple.UIKit.activity.AddToReadingList",
            "com.apple.UIKit.activity.PostToFlickr",
            "com.apple.UIKit.activity.PostToVimeo",
            "com.apple.UIKit.activity.PostToTencentWeibo",
            "com.apple.UIKit.activity.AirDrop",
            "com.apple.UIKit.activity.OpenInIBooks",
            "com.apple.UIKit.activity.MarkupAsPDF",
            "com.apple.reminders.RemindersEditorExtension", //Reminders
            "com.apple.mobilenotes.SharingExtension", // Notes
            "com.apple.mobileslideshow.StreamShareService", // iCloud Photo Sharing
            "com.linkedin.LinkedIn.ShareExtension", //LinkedIn
            "pinterest.ShareExtension", //Pinterest
            "com.google.GooglePlus.ShareExtension", //Google +
            "com.tumblr.tumblr.Share-With-Tumblr", //Tumblr
            "wefwef.YammerShare", //Yammer
            "com.hootsuite.hootsuite.HootsuiteShareExt", //HootSuite
            "net.naan.TwitterFonPro.ShareExtension-Pro", //Echofon
            "com.hootsuite.hootsuite.HootsuiteShareExt", //HootSuite
            "net.whatsapp.WhatsApp.ShareExtension" //WhatsApp
          ]
        }
      );
      if (result.action === Share.sharedAction) {
        if (client && client.token) {
          const { dataSource } = this.state;
          const url = `${baseUrl.api}/post/shared`;
          fetch(url, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              Authorization: client.token,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              postId: dataSource._id
            })
          })
            .then(res => res.json())
            .then(res => {
              if (res.status === 200) {
                dataSource.sharedCount = dataSource.sharedCount + 1;
                this.setState({
                  dataSource: dataSource
                });
              }
            })
            .catch(err => {
              alert(err.message);
            });
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("dismiss");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  handleMoreOptions = () => {
    this.showActionSheet();
  };

  _renderHeaderMeta = () => {
    const { dataSource } = this.state;
    if (dataSource.location) {
      return (
        <Text ellipsizeMode="tail" numberOfLines={1}>
          {dataSource.location.name}
        </Text>
      );
    } else if (dataSource.ad) {
      return <Text>{`${locale[appLocale]["SPONSORED"]}`}</Text>;
    } else {
      return null;
    }
  };

  _renderOptions = () => {
    const { appLocale } = this.props;
    return [
      `${locale[appLocale]["SHARE"]}`,
      `${locale[appLocale]["MUTE"]}`,
      `${locale[appLocale]["CANCEL"]}`
    ];
  };

  renderHeader = () => {
    const headerStyle = { fontWeight: "bold" };
    const { dataSource } = this.state;
    return (
      <View
        style={{
          marginLeft: 10,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={headerStyle}>{dataSource.postUser.username}</Text>
        {this._renderHeaderMeta()}
      </View>
    );
  };

  renderImage = () => {
    const { dataSource } = this.state;
    if (dataSource.image.length > 1) {
      // use banner to show images
      return (
        <View
          style={{
            width: window.width,
            height: window.width,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff"
          }}
        >
          <Carousel
            activePageIndicatorStyle={{ backgroundColor: theme.primaryColor }}
            pageIndicatorStyle={{ backgroundColor: "lightgrey" }}
            pageSize={window.width}
            loop={false}
            autoplay={false}
            onPageChanged={index => {
              this.setState({
                activeIndex: index
              });
            }}
          >
            {dataSource.image.map((img, index) => (
              <ProgressiveImage
                key={index}
                thumbnailSource={{ uri: img.thumbnail }}
                source={{ uri: img.file }}
                style={{
                  height: window.width,
                  width: window.width,
                  backgroundColor: theme.primaryGrey
                }}
                resizeMode="cover"
              />
            ))}
          </Carousel>
        </View>
      );
    }
    let image = dataSource.image[0];
    return (
      <ProgressiveImage
        thumbnailSource={{ uri: image.thumbnail }}
        source={{ uri: image.file }}
        style={{
          height: window.width,
          width: window.width
        }}
        resizeMode="cover"
      />
    );
  };

  renderPagination = () => {
    const { dataSource, activeIndex } = this.state;
    let images = dataSource.image;
    if (images.length > 1) {
      return (
        <View
          style={{
            width: "30%",
            height: "100%",
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          {images.map((img, index) => {
            return (
              <View
                key={index}
                style={{
                  marginLeft: 1,
                  marginRight: 1,
                  width: index === activeIndex ? 8 : 6,
                  height: index === activeIndex ? 8 : 6,
                  borderRadius: index === activeIndex ? 4 : 3,
                  backgroundColor:
                    index === activeIndex ? theme.primaryColor : "lightgrey"
                }}
              />
            );
          })}
        </View>
      );
    }
    return null;
  };
  /**
   * if you need to update some components of the dataSource,
   * you should declare another variable object to hold the reference of the dataSource,
   * otherwise you cannot make any changes by directly manipulating the dataSource from props.
   */
  render() {
    const { dataSource } = this.state;
    const { client, navigation, appLocale } = this.props;
    return (
      <View
        style={[styles.card, this.props.style]}
        key={dataSource._id}
        ref={o => (this._card = o)}
      >
        <CardItemRow>
          <Left>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                height: "100%"
              }}
              onPress={() => {
                if (client && client.user._id === dataSource.creator) {
                  navigation.navigate("Profile");
                } else {
                  navigation.push("UserProfile", {
                    username: dataSource.postUser.username,
                    avatar: dataSource.postUser.avatar,
                    _id: dataSource.postUser._id
                  });
                }
              }}
            >
              <Thumbnail
                source={dataSource.postUser.avatar}
                style={{ height: 40, width: 40 }}
              />
              <this.renderHeader />
            </TouchableOpacity>
          </Left>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.handleMoreOptions();
            }}
            style={styles.right}
          >
            <Ionicons name="md-more" style={{ fontSize: 20 }} />
          </TouchableOpacity>
        </CardItemRow>
        <CardBody>{this.renderImage()}</CardBody>
        <CardItemRow
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginTop: 10,
            height: 50
          }}
        >
          <Left>
            <View style={styles.cardLabels}>
              <TouchableOpacity
                style={styles.cardLabelIonicons}
                onPress={() => {
                  this.handleLike();
                }}
              >
                {dataSource.liked ? (
                  <Ionicons name="md-heart" size={theme.iconMd} color="red" />
                ) : (
                  <Ionicons name="md-heart-empty" size={theme.iconMd} />
                )}
              </TouchableOpacity>
              <View style={styles.cardLabelText}>
                <Text style={{ fontSize: 12 }}>
                  {numberConverter(dataSource.likeCount)}
                </Text>
              </View>
            </View>
            <View style={styles.cardLabels}>
              <TouchableOpacity
                style={styles.cardLabelIonicons}
                onPress={() => {
                  this.handleComment();
                }}
              >
                <Ionicons name="md-chatboxes" size={theme.iconMd} />
              </TouchableOpacity>
              <View styles={styles.cardLabelText}>
                <Text style={{ fontSize: 12 }}>
                  {numberConverter(dataSource.commentCount)}
                </Text>
              </View>
            </View>
            <View style={styles.cardLabels}>
              <TouchableOpacity
                style={styles.cardLabelIonicons}
                onPress={() => {
                  this.handleShare();
                }}
              >
                <Ionicons name="md-open" size={theme.iconMd} />
              </TouchableOpacity>
              <View style={styles.cardLabelText}>
                <Text style={{ fontSize: 12 }}>
                  {numberConverter(dataSource.sharedCount)}
                </Text>
              </View>
            </View>
          </Left>
        </CardItemRow>
        <CardItemCol style={styles.cardItemCol}>
          <ViewMoreText
            numberOfLines={3}
            renderViewMore={onPress => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onPress}
                  style={{
                    marginTop: 2,
                    height: 15,
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "flex-start"
                  }}
                >
                  <Text style={{ color: theme.primaryBlue }}>
                    {`${locale[appLocale]["SHOW_MORE"]} `}
                    <Ionicons name="md-arrow-dropdown" />
                  </Text>
                </TouchableOpacity>
              );
            }}
            renderViewLess={onPress => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onPress}
                  style={{
                    marginTop: 2,
                    height: 15,
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "flex-start"
                  }}
                >
                  <Text style={{ color: theme.primaryBlue }}>
                    {`${locale[appLocale]["SHOW_LESS"]} `}
                    <Ionicons name="md-arrow-dropup" />
                  </Text>
                </TouchableOpacity>
              );
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {dataSource.postUser.username}
              <Text style={{ fontWeight: "normal" }}>
                {`  ${dataSource.description}`}
              </Text>
            </Text>
          </ViewMoreText>
          <View
            style={{
              marginTop: 5,
              height: 20,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 12, color: "grey" }}>{`${
              locale[appLocale]["PUBLISHED"]
            } ${dateConverter(dataSource.createdAt)}`}</Text>
          </View>
        </CardItemCol>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          options={this._renderOptions()}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={index => {
            if (index === 0) {
              console.log("Share post");
            } else if (index === 1) {
              console.log("Mute post");
            } else {
              // PASS
            }
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client.client,
  appLocale: state.app.appLocale
});

const mapDispatchToProps = dispatch => ({
  addLikePostToProfile: data =>
    dispatch(addToTopClientProfilePost(Types.LIKED_POST, data)),
  removeLikePostFromProfile: id =>
    dispatch(removeClientProfilePost(Types.LIKED_POST, id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(PostCardComponent));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  cardLabels: {
    marginRight: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    height: Math.floor(window.height * 0.06),
    width: Math.floor(window.width * 0.08)
  },
  cardLabelIonicons: {
    height: "70%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  cardLabelText: {
    height: "30%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: window.width,
    marginTop: 0,
    marginBottom: 0,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  cardItemRow: {
    width: "95%",
    height: window.height * 0.08,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "nowrap"
  },
  cardItemCol: {
    width: "95%",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  cardBody: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "absolute",
    left: 0
  },
  right: {
    width: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "absolute",
    right: 0
  }
});
