import React from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import window from '../utils/getWindowSize';


class PushPopView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transitionOpacity: new Animated.Value(0),
            transitionX: new Animated.Value(window.width)
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }


    pushView = () => {
        Animated.parallel([
            Animated.timing(
                this.state.transitionOpacity,
                {
                    toValue: 1,
                    duration: 200
                }
            ).start(),
            Animated.timing(
                this.state.transitionX,
                {
                    toValue: 0,
                    duration: 200
                }
            ).start()
        ])
    }

    popView = () => {
        Animated.parallel([
            Animated.timing(
                this.state.transitionOpacity,
                {
                    toValue: 0,
                    duration: 200
                }
            ).start(),
            Animated.timing(
                this.state.transitionX,
                {
                    toValue: window.width,
                    duration: 200
                }
            ).start()
        ])
    }

    render() {
        return (
            <Animated.View
                style={{
                    ...this.props.style,
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    top: 0,
                    opacity: this.state.transitionOpacity,
                    transform: [{
                        translateX: this.state.transitionX
                    }]
                }}
            >
                {this.props.children}
            </Animated.View>
        );
    }
}


class StackNavigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            props: this.props.props,
            pages: this.props.pages, // a page stack array
            pageStack: []
        }
    }

    getFirstPage = () => {
        const pages = this.state.pages;
        return pages[Object.keys(pages)[0]];
    }

    createPageWithPushPopView = (childrenComponents, level) => {
        return (
            <PushPopView key={level} onRef={ref => { this.child = ref }} style={{ backgroundColor: 'transparent', height: '100%', width: '100%', zIndex: level }}>
                {childrenComponents}
            </PushPopView>
        );
    }

    goTo = (pageString) => {
        const page = this.state.pages[pageString];
        if (page) {
            // page name exists, then create a component
            const pageWithProps = React.cloneElement(page, { navigator: this });
            const newPage = this.createPageWithPushPopView(pageWithProps, this.state.pageStack.length + 1);
            this.setState({
                pageStack: [...this.state.pageStack, newPage]
            }, () => {
                // const lastIndex = this.state.pageStack.length - 1;
                // this.state.pageStack[lastIndex].pushView();
                this.child.pushView();
            })
        }
    }

    goBack = () => {
        const stackCopy = this.state.pageStack;
        const lastPage = stackCopy.pop();
        this.setState({
            pageStack: stackCopy
        }, () => {
            this.child.popView();
        })

    }

    renderPages = () => {
        if (this.state.pageStack.length !== 0) {
            return this.state.pageStack.map((page) => {
                return (
                    page
                );
            })
        } else {
            const firstPage = this.getFirstPage();
            const pageWithProps = React.cloneElement(firstPage, { navigator: this });
            return (
                <View style={{ flex: 1 }}>
                    {pageWithProps}
                </View>
            );
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderPages()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgrey'
    }
});


export default createStackNavigator = (pages, props, navigationOptions) => {
    return <StackNavigator pages={pages} props={props} navigationOptions={navigationOptions} />

}