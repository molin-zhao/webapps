import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { connect } from 'react-redux';

import { dismissInput } from '../redux/actions/appActions';


class DismissKeyboard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { children, inputPoppedUp, dismissInput } = this.props;
        return (
            <TouchableWithoutFeedback onPress={() => {
                if (inputPoppedUp) {
                    dismissInput()
                }
                Keyboard.dismiss();
            }}>
                {children}
            </TouchableWithoutFeedback>
        );
    }
}

const mapStateToProps = state => ({
    inputPoppedUp: state.app.inputPoppedUp
})

const mapDispatchToProps = dispatch => ({
    dismissInput: () => dispatch(dismissInput())
})

export default connect(mapStateToProps, mapDispatchToProps)(DismissKeyboard);