import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Badge from './Badge';

import window from '../utils/getDeviceInfo';

class CustomTabBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeColor: '#eb765a',
            inactiveColor: 'black'
        }
    }

    renderBadge = (tabName) => {
        const { message } = this.props;
        if (tabName === 'You') {
            return (
                <Badge style={{ position: 'relative' }} val={message.length} />
            );
        }

        return null;
    }

    renderUnderline = () => {
        const translateX = this.props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, window.width / 2],
        });

        return (
            <Animated.View
                style={[
                    styles.tabUnderline,
                    {
                        transform: [
                            { translateX }
                        ]
                    }
                ]}
            />
        )
    }

    renderTabOption(tab, i) {
        const { activeTab, tabNames } = this.props;
        const { activeColor, inactiveColor } = this.state;
        let color = activeTab === i ? activeColor : inactiveColor;
        let tabName = tabNames[i];

        return (
            <TouchableOpacity
                onPress={() => this.props.goToPage(i)}
                key={'tab' + i}
                style={[styles.tab]}
            >
                <View style={styles.tabLabel}>
                    <Text style={[styles.tabLabelText, { color: color }]}>
                        {tabName}
                    </Text>
                    {this.renderBadge(tabName)}
                </View>
            </TouchableOpacity>
        );
    }

    renderTabs = () => {
        let { tabs } = this.props;
        return tabs.map((tab, i) => this.renderTabOption(tab, i));
    }

    render() {
        return (
            <View style={styles.tabBar}>
                <View style={styles.tabBarLabels}>
                    {this.renderTabs()}
                </View>
                {this.renderUnderline()}
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        message: state.message.message
    }
}

CustomTabBar.propTypes = {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    tabNames: PropTypes.array,
};

export default connect(mapStateToProps, null)(CustomTabBar)

const styles = StyleSheet.create({
    tabUnderline: {
        backgroundColor: '#eb765a',
        width: '25%',
        height: '5%',
        left: '12.5%'
    },
    tabBar: {
        width: window.width,
        height: window.height * 0.080,
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    tabBarLabels: {
        width: '100%',
        height: '95%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tab: {
        width: '50%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    tabLabel: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabLabelText: {
        fontSize: 15
    }
})