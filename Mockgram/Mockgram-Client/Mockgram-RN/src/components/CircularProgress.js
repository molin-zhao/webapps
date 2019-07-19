import React from "react";
import PropTypes from "prop-types";
import { View, ViewPropTypes, Easing, Animated } from "react-native";
import { Svg } from "expo";
const { Path, G } = Svg;
class CircularProgress extends React.PureComponent {
  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }

  circlePath(x, y, radius, startAngle, endAngle) {
    var start = this.polarToCartesian(x, y, radius, endAngle * 0.9999);
    var end = this.polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    var d = [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y
    ];
    return d.join(" ");
  }

  clampFill = fill => Math.min(100, Math.max(0, fill));

  render() {
    const {
      size,
      width,
      backgroundWidth,
      tintColor,
      backgroundColor,
      style,
      rotation,
      lineCap,
      arcSweepAngle,
      fill,
      children,
      childrenContainerStyle
    } = this.props;

    const maxWidthCircle = backgroundWidth
      ? Math.max(width, backgroundWidth)
      : width;

    const backgroundPath = this.circlePath(
      size / 2,
      size / 2,
      size / 2 - maxWidthCircle / 2,
      0,
      arcSweepAngle
    );
    const circlePath = this.circlePath(
      size / 2,
      size / 2,
      size / 2 - maxWidthCircle / 2,
      0,
      (arcSweepAngle * this.clampFill(fill)) / 100
    );
    const offset = size - maxWidthCircle * 2;

    const localChildrenContainerStyle = {
      ...{
        position: "absolute",
        left: maxWidthCircle,
        top: maxWidthCircle,
        width: offset,
        height: offset,
        borderRadius: offset / 2,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      },
      ...childrenContainerStyle
    };

    return (
      <View style={style}>
        <Svg
          width={size}
          height={size}
          style={{ backgroundColor: "transparent" }}
        >
          <G rotation={rotation} originX={size / 2} originY={size / 2}>
            {backgroundColor && (
              <Path
                d={backgroundPath}
                stroke={backgroundColor}
                strokeWidth={backgroundWidth || width}
                strokeLinecap={lineCap}
                fill="transparent"
              />
            )}
            {fill > 0 && (
              <Path
                d={circlePath}
                stroke={tintColor}
                strokeWidth={width}
                strokeLinecap={lineCap}
                fill="transparent"
              />
            )}
          </G>
        </Svg>
        {children && (
          <View style={localChildrenContainerStyle}>{children(fill)}</View>
        )}
      </View>
    );
  }
}

CircularProgress.propTypes = {
  style: ViewPropTypes.style,
  size: PropTypes.number.isRequired,
  fill: PropTypes.number,
  width: PropTypes.number.isRequired,
  backgroundWidth: PropTypes.number,
  tintColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  rotation: PropTypes.number,
  lineCap: PropTypes.string,
  arcSweepAngle: PropTypes.number,
  children: PropTypes.func,
  childrenContainerStyle: ViewPropTypes.style
};

CircularProgress.defaultProps = {
  tintColor: "black",
  rotation: 90,
  lineCap: "butt",
  arcSweepAngle: 360
};

const AnimatedProgress = Animated.createAnimatedComponent(CircularProgress);

export default class AnimatedCircularProgress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fillAnimation: new Animated.Value(props.prefill)
    };
  }

  componentDidMount() {
    this.state.fillAnimation.addListener(({ value }) => (this._value = value));
  }

  reAnimate(prefill, toVal, dur, ease) {
    this.setState(
      {
        fillAnimation: new Animated.Value(prefill)
      },
      () => this.animate(toVal, dur, ease)
    );
  }

  animate(toVal, dur, ease) {
    console.log("start animate");
    const toValue = toVal >= 0 ? toVal : this.props.fill;
    const duration = dur || this.props.duration;
    const easing = ease || this.props.easing;

    const anim = Animated.timing(this.state.fillAnimation, {
      toValue,
      easing,
      duration
    });
    anim.start(() => {
      this.state.fillAnimation.setValue(this.props.prefill);
      return this.props.onAnimationComplete();
    });
    return anim;
  }

  interruptAnimate = () => {
    console.log("interrupt animate");
    this.state.fillAnimation.stopAnimation();
  };

  getValue = () => this._value;

  render() {
    const { fill, prefill, ...other } = this.props;

    return <AnimatedProgress {...other} fill={this.state.fillAnimation} />;
  }
}

AnimatedCircularProgress.propTypes = {
  ...CircularProgress.propTypes,
  prefill: PropTypes.number,
  duration: PropTypes.number,
  easing: PropTypes.func,
  onAnimationComplete: PropTypes.func
};

AnimatedCircularProgress.defaultProps = {
  duration: 500,
  easing: Easing.out(Easing.ease),
  prefill: 0
};
