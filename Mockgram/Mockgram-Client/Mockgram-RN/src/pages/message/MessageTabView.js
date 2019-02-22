import React from 'react';
import { StyleSheet } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';

import FollowingPage from './Following';
import YouPage from './You';
import CustomTabBar from '../../components/CustomTabBar';

class MessageTabView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { client, navigation } = this.props;
        if (!client) {
            navigation.navigate('Auth');
        }
    }

    render() {
        return (
            <ScrollableTabView
                style={{ backgroundColor: '#fff' }}
                renderTabBar={() => <CustomTabBar tabNames={['Following', 'You']} />}
                tabBarPosition='top'
                initialPage={1}>
                <FollowingPage tabLabel='Following' />
                <YouPage tabLabel='You' />
            </ScrollableTabView>
        );
    }
}

const mapStateToProps = state => (
    {
        client: state.client.client,
        message: state.message.message
    }
);


export default connect(mapStateToProps, null)(MessageTabView);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});