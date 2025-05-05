const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validator(value) {
            if(!validator.isEmail(value)) {
                throw new Email('Invalid Email')
            }
        }
    },
    password: {
        type: String,
        validator(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Email('provide the strong password')
            }
        }
    },
    age: {
        type: Number,
        validator(value) {
            if(!validator.isNumeric(value)) {
                throw new Email('Invalid age')
            }
        }
    },
    mobileNo: {
        type: String,
        validator(value) {
            if(!validator.isMobilePhone(value)) {
                throw new Email('Invalid mobile no')
            }
        }
    },
    skills: {
        type: [String],
        default: ['Javascript', 'Node js', "Aws", "Postgres", 'React', 'Typescript']
    },
    gender: {
        type: String,
        validate(value) {
            if(!['male', 'female', 'others'].includes(value)) {
                throw new Error("Validation failed")
            }
        }
    },
    profileUrl: {
        type: String,
        validator(value) {
            if(!validator.isURL(value)) {
                throw new Email('Invalid photo url')
            }
        }
    }
}, {timestamps: true});

userSchema.methods.getJWTToken = async function () {
    try {
        const user = this;
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn: '7d'});
        console.log("Token", token);
        return token;
    } catch (error) {
        throw new Error("Failed to generate the token");
    }
    
};

userSchema.methods.validatePassword = async function (password) {
    try {
        const user = this;
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        return isPasswordCorrect;
    } catch (error) {
        throw new Error("Password is incorrect");
    }
}
const User = mongoose.model('User', userSchema);

module.exports = User;