export default function formValidation(component, fieldState, fieldName, value, expectedType, expectedValue = value) {
    if (value.length === 0) {
        fieldState.status = true;
        fieldState.message = `${fieldName} is required`;
        component.setState({ valid: false });
    } else {
        if (expectedType === 'isAlphanumberic') {
            let reg = /^\w+$/;
            if (!reg.test(value)) {
                fieldState.status = true;
                fieldState.message = `${fieldName} should be alphnumberic.`;
                component.setState({ valid: false });
            } else {
                fieldState.status = false;
                fieldState.message = '';
                component.setState({ valid: true });
            }
        } else if (expectedType === 'isEmail') {
            let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (!reg.test(value)) {
                fieldState.status = true;
                fieldState.message = `${fieldName} should be a valid email address.`;
                component.setState({ valid: false });
            } else {
                fieldState.status = false;
                fieldState.message = '';
                component.setState({ valid: true });
            }
        } else if (expectedType === 'isPassword') {
            let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
            if (!reg.test(value)) {
                fieldState.status = true;
                fieldState.message = `${fieldName} length 8-16, should contain at least 1 lowercase letter, 1 uppercase letter and a number.`;
                component.setState({ valid: false });
            } else {
                fieldState.status = false;
                fieldState.message = '';
                component.setState({ valid: true });
            }
        } else if (expectedType === 'isConfirmPassword') {
            if (value !== expectedValue) {
                fieldState.status = true;
                fieldState.message = `${fieldName} doesn't match.`;
                component.setState({ valid: false });
            } else {
                fieldState.status = false;
                fieldState.message = '';
                component.setState({ valid: true });
            }
        }
    }
}