import React from "react";
import { Text, View, FlatList } from "react-native";
import UserListCell from "./UserListCell";
import PlaceListCell from "./PlaceListCell";
import TagListCell from "./TagListCell";
import window from "../utils/getDeviceInfo";
import i18n from "../common/locale";
export default class ListCell extends React.Component {
  constructor(props) {
    super(props);
  }

  renderEmpty = type => {
    switch (type) {
      case "people":
        return i18n.t("NO_ACCOUNTS_FOUND");
      case "tag":
        return i18n.t("NO_TAGS_FOUND");
      case "place":
        return i18n.t("NO_LOCATIONS_FOUND");
      default:
        return "";
    }
  };

  renderSuggestedLabel = () => {
    return (
      <Text
        style={{
          marginLeft: 20,
          fontSize: 15,
          fontWeight: "bold",
          color: "black"
        }}
      >
        {i18n.t("SUGGEST")}
      </Text>
    );
  };

  render() {
    const { dataSource, resultType, type } = this.props;
    if (dataSource.length === 0 && resultType === "search") {
      return (
        <View style={{ marginTop: 10, width: window.width }}>
          <Text style={{ marginLeft: 20, fontSize: 13, color: "lightgrey" }}>
            {this.renderEmpty(type)}
          </Text>
        </View>
      );
    } else {
      if (resultType === "suggest") {
        if (dataSource.length === 0) {
          return (
            <View style={{ marginTop: 10, width: window.width }}>
              {this.renderSuggestedLabel()}
              <Text
                style={{
                  marginLeft: 20,
                  marginTop: 10,
                  fontSize: 13,
                  color: "lightgrey"
                }}
              >
                {i18n.t("NO_SUGGESTIONS_FOUND")}
              </Text>
            </View>
          );
        }
        return (
          <View style={{ marginTop: 10, width: window.width }}>
            <FlatList
              ListHeaderComponent={this.renderSuggestedLabel}
              stickyHeaderIndices={[0]}
              data={dataSource}
              keyExtractor={item => item._id}
              style={{ width: window.width, marginTop: 0 }}
              renderItem={({ item }) => {
                if (type === "people") {
                  return <UserListCell dataSource={item} />;
                } else if (type === "tag") {
                  return <TagListCell dataSource={item} />;
                } else if (type === "place") {
                  return <PlaceListCell dataSource={item} />;
                } else {
                  return null;
                }
              }}
            />
          </View>
        );
      }
      return (
        <FlatList
          data={dataSource}
          keyExtractor={item => item._id}
          style={{ width: window.width, marginTop: 0 }}
          renderItem={({ item }) => {
            switch (type) {
              case "people":
                return <UserListCell dataSource={item} />;
              case "tag":
                return <TagListCell dataSource={item} />;
              case "place":
                return <PlaceListCell dataSource={item} />;
              default:
                return null;
            }
          }}
        />
      );
    }
  }
}

ListCell.defaultProps = { resultType: "plain" };
