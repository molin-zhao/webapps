import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ActionSheet from 'react-native-actionsheet';
import { withNavigation } from 'react-navigation';

import Button from './Button';
import Thumbnail from './Thumbnail';

import baseUrl from '../common/baseUrl';
import window from '../utils/getDeviceInfo';
import theme from '../common/theme';

class UserListCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }

    }

    showActionSheet = () => {
        this.ActionSheet.show();
    }

    followAction = (type) => {
        let { dataSource, client, navigation } = this.props;
        if (client && client.token) {
            this.setState({
                loading: true
            }, () => {
                return fetch(`${baseUrl.api}/user/follow`, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: client.token
                    },
                    body: JSON.stringify({
                        followingId: dataSource._id,
                        type: type
                    })
                }).then(res => res.json).then(resJson => {
                    this.setState({
                        loading: false
                    }, () => {
                        console.log(resJson);
                        if (resJson.status === 200) {
                            dataSource.followed = !dataSource.followed
                        }
                    })
                }).catch(err => {
                    this.setState({
                        loading: false
                    })
                    console.log(err)
                });
            })
        } else {
            navigation.navigate('Auth');
        }
    }

    renderButton = (dataSource) => {
        const { client } = this.props;
        const { _id, followed } = dataSource;
        if (client && client.user._id === _id) {
            return null
        }
        let followStyle = {
            width: 85,
            height: 35,
            backgroundColor: theme.primaryColor
        };
        let followingStyle = {
            width: 85,
            height: 35,
            backgroundColor: 'lightgrey',
            borderColor: 'black'
        }
        return (
            <Button
                containerStyle={followed ? followingStyle : followStyle}
                loading={this.state.loading}
                titleStyle={{ fontSize: 14, color: followed ? 'black' : '#fff' }}
                title={followed ? 'following' : 'follow'}
                onPress={() => {
                    followed ? this.showActionSheet() : this.followAction('Follow')
                }} />
        );

    }


    render() {
        const { dataSource } = this.props;
        return (
            <View style={{
                borderWidth: 0,
                width: window.width, height: 80,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start'
            }}>
                <View style={{
                    flex: 3,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: '20%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Thumbnail source={dataSource.avatar} style={{ width: 40, height: 40 }} />

                    </View>
                    <View style={{
                        width: '80%',
                        justifyContent: 'center',
                        alignItems: 'flex-start'
                    }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{dataSource.username}</Text>
                        <Text>{dataSource.nickname}</Text>
                    </View>
                </View>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {this.renderButton(dataSource)}
                </View>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title='Confirm this action to unfollow user'
                    message={`Do you want to unfollow user ${dataSource.username}? 
                 You will not receive any updates and messages from this user`}
                    options={['confirm', 'cancel']}
                    cancelButtonIndex={1}
                    onPress={index => {
                        if (index === 0) {
                            //unfollow user
                            this.followAction('Unfollow');
                        }
                    }}
                />
            </View>
        );
    }
}


const mapStateToProps = state => ({
    client: state.client.client
});

export default connect(mapStateToProps, null)(withNavigation(UserListCell))
