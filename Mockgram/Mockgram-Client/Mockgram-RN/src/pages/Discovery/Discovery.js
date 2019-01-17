import React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SearchBar } from 'react-native-elements';
import ListCell from '../../components/ListCell';
import baseUrl from '../../common/baseUrl';




export default class Discovery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            peopleSuggestResult: [],
            peopleSearchResult: [],
            tagSuggestResult: [],
            tagSearchResult: [],
            placeSuggestResult: [],
            placeSearchResult: [],
            isSearching: false,
            searchValue: '',
            typing: false,
            searchBarInput: '',
            timer: null,
            activeIndex: 0, // by default the first tab
            activeColor: '#eb765a',
            inactiveColor: 'black'
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            container: this
        });
    }
    static navigationOptions = ({ navigation }) => ({
        headerTitle: <SearchBar
            onChangeText={(text) => {
                // search bar is not empty
                let container = navigation.getParam('container');
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
            round
            lightTheme
            icon={{ type: 'font-awesome', name: 'search' }}
            containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0, backgroundColor: 'white', width: windowWidth }}
            inputStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: 'lightgrey' }}
        />
    });

    startSearch = () => {
        this.setState({
            isSearching: true
        })
        let category = '';
        if (this.state.activeIndex === 0) {
            category = 'people';
        } else if (this.state.activeIndex === 1) {
            category = 'tag';
        } else {
            category = 'place';
        }
        let url = `${baseUrl.api}/discovery/search/${category}/${this.state.searchValue}`;
        fetch(url).then(res => res.json()).then(res => {
            console.log(res);
            if (category === 'people') {
                this.setState({
                    peopleSearchResult: res.data,
                    isSearching: false
                });
            } else if (category === 'tag') {
                this.setState({
                    tagSearchResult: res.data,
                    isSearching: false
                })
            } else {
                this.setState({
                    placeSearchResult: res.data,
                    isSearching: false
                })
            }
        })
    }

    activeStyle = index => {
        return this.state.activeIndex === index ? this.state.activeColor : this.state.inavtiveColor
    }

    tabSelected = index => {
        this.setState({
            activeIndex: index
        }, () => {
            if (this.state.searchValue !== '') {
                console.log('should search')
                this.startSearch();
            }
        });
    }

    renderSection = () => {
        // if page is searching for user input
        if (this.state.isSearching) {
            return (
                <View style={{ marginTop: 10, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, color: 'lightgrey' }}>Searching for {this.state.searchBarInput} ...</Text>
                    <ActivityIndicator size='small' color='lightgrey' />
                </View>
            );
        } else {
            if (this.state.searchValue !== '') {
                // page should search for user input
                if (this.state.activeIndex === 0) {
                    return (<ListCell dataSource={this.state.peopleSearchResult} type='people' resultType='search' />);
                } else if (this.state.activeIndex === 1) {
                    return (<ListCell dataSource={this.state.tagSearchResult} type='tag' resultType='search' />);
                } else {
                    return (<ListCell dataSource={this.state.placeSearchResult} type='place' resultType='search' />);
                }
            } else {
                // page should show suggest to user
                if (this.state.activeIndex === 0) {
                    // search for first tab and render it out
                    return (<ListCell dataSource={this.state.peopleSuggestResult} type='people' resultType='suggest' />);
                } else if (this.state.activeIndex === 1) {
                    return (<ListCell dataSource={this.state.tagSuggestResult} type='tag' resultType='suggest' />);
                } else {
                    return (<ListCell dataSource={this.state.placeSuggestResult} type='place' resultType='suggest' />);
                }
            }
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.tabBarTop}>
                    <TouchableOpacity activeOpacity={0.5} style={styles.tabBarTab} onPress={() => this.tabSelected(0)}>
                        <Text style={{ fontSize: 15, color: this.activeStyle(0) }}>People</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} style={styles.tabBarTab} onPress={() => this.tabSelected(1)}>
                        <Text style={{ fontSize: 15, color: this.activeStyle(1) }}>Tag</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} style={styles.tabBarTab} onPress={() => this.tabSelected(2)}>
                        <Text style={{ fontSize: 15, color: this.activeStyle(2) }}>Place</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tabView}>
                    <this.renderSection />
                </View>
            </View>
        );
    }
}
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    tabBarTop: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        height: windowWidth * 0.15,
        width: windowWidth,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 0.5,
        justifyContent: 'space-between'
    },
    tabBarTab: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: windowWidth,
        marginTop: 0,
    }
});