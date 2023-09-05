const { User } = require('./database');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const otpStopService = require('../services/otp-stop-service')
const mailService = require('../services/mail')
const globalData = require('../global/global_data');

class Queries {

    async createUser(username, password, email) {
        let check = await User.findOne({
            where: {
                username: username
            }
        })

        if (check) {
            return {
                alreadyAUser: true
            }
        } else {
            const saltRounds = 10
            let salt = await bcrypt.genSalt(saltRounds);

            let hashedPassword = await bcrypt.hash(password, salt);

            let result = await User.create({
                username: username,
                password: hashedPassword,
                email: email
            })

            return { userCreated: true }
        }

    }

    async validateAndLogin(username, passowrd) {
        let user = await User.findOne({
            where: {
                username: username
            }
        })

        if (user) {
            let result = await bcrypt.compare(passowrd, user.dataValues.password);
            if (result) {
                return { validUser: true }
            } else {
                return { incorrectCredentials: false }
            }
        } else {
            return { incorrectCredentials: false }
        }

    }

    async sendOtp(email) {
        let user = await User.findOne({
            where: {
                email: email
            }
        })
        if (user) {
            let otp = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
            let tempObj = globalData.otpArr.find(obj => obj.email === email);
            if (tempObj) {
                tempObj.otp = otp
            } else {
                globalData.otpArr.push({ email, otp });
            }
            await mailService.sendMail(email, otp);
            otpStopService.clearOtp(email);
            return { otpSent: true, registeredId: true }

        } else {
            return { registeredId: false }
        }
    }

    validateOtp(email, otp) {
        let otpObj = globalData.otpArr.find((obj) => obj.email == email);
        if (otpObj && otpObj.otp === Number(otp)) {
            return { validOtp: true }
        } else {
            return { validOtp: false }
        }
    }

    async changePassword(email, password) {
        const saltRounds = 10
        let salt = await bcrypt.genSalt(saltRounds);

        let hashedPassword = await bcrypt.hash(password, salt);
        let result = await User.update({ password: hashedPassword }, {
            where: {
                email: email
            }
        })
        if (result[0]) {
            return { passwordUpdated: true }
        } else {
            return { passwordUpdated: false }
        }
    }
}

module.exports = Queries;