import React from 'react';
import { StyleSheet, Animated, Text } from 'react-native';
import { withNavigation, Header } from 'react-navigation';
import PropTypes from 'prop-types'

import window from '../../utils/getDeviceInfo';

class PostRecommend extends React.Component {

    static defaultProps = {
        animationDuration: 200,
        style: {
            opacity: 0,
            zIndex: 0
        }
    }

    static propTypes = {
        animationDuration: PropTypes.number,
        style: PropTypes.object
    }


    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(this.props.style.opacity),
            zIndex: new Animated.Value(this.props.style.zIndex)
        }
    }

    show = () => {
        const { animationDuration } = this.props;
        Animated.parallel([
            Animated.timing(
                this.state.opacity,
                {
                    toValue: 1,
                    duration: animationDuration
                }
            ),
            Animated.timing(
                this.state.zIndex,
                {
                    toValue: 1,
                    duration: 0
                }
            )
        ]).start()
    }

    hide = () => {
        const { animationDuration } = this.props;
        Animated.parallel([
            Animated.timing(
                this.state.opacity,
                {
                    toValue: 0,
                    duration: animationDuration
                }
            ),
            Animated.timing(
                this.state.zIndex,
                {
                    toValue: 0,
                    duration: 0
                }
            )
        ]).start()
    }

    render() {
        const { opacity, zIndex } = this.state;
        return (
            <Animated.View style={[styles.container, { opacity: opacity, zIndex: zIndex }]}>
                <Text>Recommend Page</Text>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        height: window.height - Header.HEIGHT - 50,
        width: '100%',
        backgroundColor: '#fff'
    }
})

export default withNavigation(PostRecommend);