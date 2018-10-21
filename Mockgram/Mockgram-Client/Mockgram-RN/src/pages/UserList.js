import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { List, ListItem } from 'react-native-elements';


export default class UserList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            lastItem: null,
            error: null,
            refreshing: false
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {

    }
}