import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Carousel, { getInputRangeFromIndexes } from "react-native-snap-carousel";

export default class CustomCarousel extends React.Component {
  _scrollInterpolator(index, carouselProps) {
    const range = [3, 2, 1, 0, -1];
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
    const outputRange = range;

    return { inputRange, outputRange };
  }

  _animatedStyles(index, animatedValue, carouselProps) {
    const sizeRef = carouselProps.vertical
      ? carouselProps.itemHeight
      : carouselProps.itemWidth;
    const translateProp = carouselProps.vertical ? "translateY" : "translateX";
    if (Platform.OS === "android") {
      return {
        elevation: carouselProps.data.length - index,
        opacity: animatedValue.interpolate({
          inputRange: [2, 3],
          outputRange: [1, 0]
        }),
        transform: [
          {
            rotate: animatedValue.interpolate({
              inputRange: [-1, 0, 1, 2, 3],
              outputRange: ["-25deg", "0deg", "-3deg", "1.8deg", "0deg"],
              extrapolate: "clamp"
            })
          },
          {
            [translateProp]: animatedValue.interpolate({
              inputRange: [-1, 0, 1, 2, 3],
              outputRange: [
                -sizeRef * 0.5,
                0,
                -sizeRef, // centered
                -sizeRef * 2, // centered
                -sizeRef * 3 // centered
              ],
              extrapolate: "clamp"
            })
          }
        ]
      };
    } else {
      return {
        zIndex: carouselProps.data.length - index,
        opacity: animatedValue.interpolate({
          inputRange: [2, 3],
          outputRange: [1, 0]
        }),
        transform: [
          {
            rotate: animatedValue.interpolate({
              inputRange: [-1, 0, 1, 2, 3],
              outputRange: ["-25deg", "0deg", "-3deg", "1.8deg", "0deg"],
              extrapolate: "clamp"
            })
          },
          {
            [translateProp]: animatedValue.interpolate({
              inputRange: [-1, 0, 1, 2, 3],
              outputRange: [
                -sizeRef * 0.5,
                0,
                -sizeRef, // centered
                -sizeRef * 2, // centered
                -sizeRef * 3 // centered
              ],
              extrapolate: "clamp"
            })
          }
        ]
      };
    }
  }

  render() {
    const {
      renderItem,
      data,
      sliderWidth,
      sliderHeight,
      itemWidth,
      itemHeight,
      containerStyle
    } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <Carousel
          renderItem={renderItem}
          data={data}
          sliderWidth={sliderWidth}
          sliderHeight={sliderHeight}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
          scrollInterpolator={this._scrollInterpolator}
          slideInterpolatedStyle={this._animatedStyles}
          useScrollView={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});
