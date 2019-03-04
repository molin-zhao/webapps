import React from 'react';
import { View, StyleSheet, Keyboard, Animated, TouchableOpacity, Text, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

import window from '../utils/getDeviceInfo';
import theme from '../common/theme';

export default class SearchBarView extends React.Component {

    static defaultProps = {
        style: { width: window.width, height: 50 },
    }

    static propTypes = {
        style: PropTypes.object,
    }


    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            container: this.props.container,
            searchBarWidth: new Animated.Value(this.props.style.width * 0.9),
            buttonWidth: new Animated.Value(this.props.style.width * 0.1)
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        let width = this.props.style.width;
        Animated.parallel([
            Animated.timing(
                this.state.searchBarWidth,
                {
                    toValue: width * 0.8,
                    duration: 100
                }
            ),
            Animated.timing(
                this.state.buttonWidth,
                {
                    toValue: width * 0.2,
                    duration: 100
                }
            )
        ]).start();
        this.setState({
            focused: true
        })
    }

    _keyboardDidHide = () => {
        let width = this.props.style.width;
        Animated.parallel([
            Animated.timing(
                this.state.searchBarWidth,
                {
                    toValue: width * 0.9,
                    duration: 100
                }
            ),
            Animated.timing(
                this.state.buttonWidth,
                {
                    toValue: width * 0.1,
                    duration: 100
                }
            )
        ]).start()
        this.setState({
            focused: false
        })
    }

    renderButton = () => {
        const { focused } = this.state;
        if (focused) {
            return (
                <TouchableOpacity
                    style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}
                    onPress={() => {
                        Keyboard.dismiss()
                    }}
                    activeOpacity={0.8}
                >
                    <Text style={{ fontSize: 14, color: theme.primaryBlue }}>cancel</Text>
                </TouchableOpacity>
            );
        }
        return (
            <Icon name="md-qr-scanner" size={18} />
        );
    }

    render() {
        const { style } = this.props;
        return (
            <View style={[styles.searchBarViewContainer, style]}>
                <Animated.View style={[{ justifyContent: 'center', alignItems: 'center', height: '100%' }, { width: this.state.searchBarWidth }]}>
                    <View style={styles.searchBar}>
                        <View style={{ width: '15%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name='ios-search' size={18} />
                        </View>
                        <TextInput
                            style={{ width: '85%' }}
                            onChangeText={(text) => {
                                // search bar is not empty
                                let container = this.state.container;
                                clearTimeout(container.state.timer);
                                container.setState({
                                    searchBarInput: text,
                                }, () => {
                                    if (text.length > 0) {
                                        container.setState({
                                            isSearching: true,
                                            timer: setTimeout(() => {
                                                container.setState({
                                                    searchValue: text,
                                                    timer: null
                                                }, () => {
                                                    clearTimeout(container.state.timer);
                                                    container.startSearch();
                                                });
                                            }, 1000)
                                        })
                                    } else {
                                        container.setState({
                                            isSearching: false,
                                            timer: null,
                                            searchValue: '',
                                        });
                                    }
                                })
                            }}
                            placeholder='search...'
                        />
                    </View>
                </Animated.View>
                <Animated.View style={[{ justifyContent: 'center', alignItems: 'center', height: '100%' }, { width: this.state.buttonWidth }]}>
                    {this.renderButton()}
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    searchBarViewContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 0
    },
    searchBar: {
        width: '95%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 20
    }
})