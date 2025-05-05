const validator = require('validator');
const {ALLOWED_CONNECTION_STATUS} = require('../constants/constants');

function isValidateReqData(data) {
    const {firstName, lastName, emailId, password} = data;
    if(!firstName || !lastName) {
        throw new Error('Please provide the names');
    } else if(firstName.length < 4 || firstName.length > 50) {
        throw new Error('Please enter valid firstname');
    } else if(!validator.isEmail(emailId)) {
        throw new Error('Please enter valid email id');
    } else if(!validator.isStrongPassword(password)) {
        throw new Error('Password is too weak.')
    } else {
        return true;
    }
}

function isValidConnectionStatus(status) {
    if(ALLOWED_CONNECTION_STATUS.includes(status)) {
        return true;
    }
    return false;
}
module.exports = {
    isValidateReqData,
    isValidConnectionStatus
}