import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import Liked from './ProfilePostGridView';
import Posts from './ProfilePostGridView';
import Mentioned from './ProfilePostGridView';

import window from '../../utils/getDeviceInfo';
import theme from '../../common/theme';

class ProfileTabView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0, // by default the first tab
            activeColor: theme.primaryColor,
            inactiveColor: 'black'
        }
    }

    activeStyle = index => {
        return this.state.activeIndex === index ? this.state.activeColor : this.state.inavtiveColor
    }

    tabSelected = index => {
        this.setState({
            activeIndex: index
        })
    }

    renderSection = () => {
        const { userId, refreshing,numColumns, clientUpdate, created, liked, mentioned } = this.props;
        if (!userId) {
            return (
                <View style={{
                    height: window.height * 0.3,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>no user id provide</Text>
                </View>
            );
        } else {
            if (this.state.activeIndex === 0) {
                return <Posts type="CREATED" userId={userId} refreshing={refreshing} dataSource={clientUpdate ? created : null} numColumns={numColumns} />
            } else if (this.state.activeIndex === 1) {
                return <Liked type="LIKED" userId={userId} refreshing={refreshing} dataSource={clientUpdate ? liked : null} numColumns={numColumns} />
            } else {
                return <Mentioned type="MENTIONED" userId={userId} refreshing={refreshing} dataSource={clientUpdate ? mentioned : null} numColumns={numColumns} />
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.tab}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.tabCell} onPress={() => this.tabSelected(0)}>
                        <Icon name="md-images" style={{ fontSize: 24, color: this.activeStyle(0) }} />
                        <Text style={{ fontSize: 10, color: this.activeStyle(0) }}>Posts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.tabCell} onPress={() => this.tabSelected(1)}>
                        <Icon name="md-heart" style={{ fontSize: 24, color: this.activeStyle(1) }} />
                        <Text style={{ fontSize: 10, color: this.activeStyle(1) }}>Liked</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.tabCell} onPress={() => this.tabSelected(2)}>
                        <Icon name="ios-people" style={{ fontSize: 24, color: this.activeStyle(2) }} />
                        <Text style={{ fontSize: 10, color: this.activeStyle(2) }}>Mentioned</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {this.renderSection()}
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        created: state.profile.created,
        liked: state.profile.liked,
        mentioned: state.profile.mentioned
    }
}

export default connect(mapStateToProps, null)(ProfileTabView)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    tab: {
        width: window.width,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eae5e5',
        borderBottomWidth: 0.5,
        borderBottomColor: '#eae5e5'
    },
    tabCell: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        width: '33%'
    }
});