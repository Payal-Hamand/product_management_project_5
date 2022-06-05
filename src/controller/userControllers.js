const user = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { uploadFile } = require("../middleware/aws");
const { isValidRequestBody, isValid, isValidName, isValidEmail, isValidPhone, isValidCity, isValidPincode, isValidPassword } = require("../validations/validations");

/**************************************Create User Api****************************************************/

const createUser = async (req, res) => {
    try {
        let data = req.body;

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "invalid request parameters.plzz provide user details" });
        }

        //Validate attributes --
        let { fname, lname, email, password, phone, address } = data ;

        if (!fname) {
            return res.status(400).send({ status: false, message: " first name is a required field" });
        }

        if (!isValid(fname)) {
            return res.status(400).send({ status: false, message: " first name is required" });
        }
        if (!isValidName(fname)) {
            return res.status(400).send({ status: false, message: "Please enter valid user first name." });
        }

        // name validation
        if (!lname) {
            return res.status(400).send({ status: false, message: "last name is a required field" });
        }

        if (!isValid(lname)) {
            return res.status(400).send({ status: false, message: "last name is required" });
        }

        //this will validate the type of name including alphabets and its property withe the help of regex.
        if (!isValidName(lname)) {
            return res.status(400).send({ status: false, message: "Please enter valid user last name." });
        }

        //Email Validation --
        if (!email) {
            return res.status(400).send({ status: false, message: "email is a required field" });
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "plzz enter email" });
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "This is not a valid email" });
        }

        email = email.toLowerCase().trim();
        const emailExt = await user.findOne({ email: email });
        if (emailExt) {
            return res.status(409).send({ status: false, message: "Email already exists" });
        }

        //Password Validations--
        if (!password) {
            return res.status(400).send({ status: false, message: "password is a required field" });
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "plzz enter password" });
        }

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "password should be 8-15 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);

        //Phone Validations--
        if (!phone) {
            return res.status(400).send({ status: false, message: "Phone is a required field" });
        }

        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "plzz enter mobile" });
        }

        //this regex will to set the phone no. length to 10 numeric digits only.
        if (!isValidPhone(phone)) {
            return res.status(400).send({ status: false, message: "Please enter valid 10 digit mobile number." });
        }

        const phoneExt = await user.findOne({ phone: phone });
        if (phoneExt) {
            return res.status(409).send({ status: false, message: "phone number already exists" });
        }

        //for address--
        if (!address) {
            return res.status(400).send({ status: false, msg: "please provide address" })
        }


        if (!isValid(address)) {
            return res.status(400).send({ status: false, msg: "please provide valid address." })
        }


        if (!address.shipping) {
            return res.status(400).send({ status: false, msg: "please provide shipping details" })
        }


        if (!isValid(address.shipping)) {
            return res.status(400).send({ status: false, msg: "please provide valid address." })
        }


        if (!address.shipping.street) {
            return res.status(400).send({ status: false, msg: "please provide shipping street details" })
        }


        if (!isValid(address.shipping.street)) {
            return res.status(400).send({ status: false, msg: "please provide valid shipping street address." })
        }

        if (!address.shipping.city) {
            return res.status(400).send({ status: false, msg: "please provide shipping city details" })
        }


        if (!isValid(address.shipping.city)) {
            return res.status(400).send({ status: false, msg: "please provide valid shipping city address." })
        }

        if (!address.shipping.pincode) {
            return res.status(400).send({ status: false, msg: "please provide shipping pincode details" })
        }

        if (!isValid(address.shipping.pincode)) {
            return res.status(400).send({ status: false, msg: "please provide valid shipping pincode address." })
        }

        // if (!/^[1-9][0-9]{5}$/.test(address.billing.pincode)) {
        //     return res.status(400).send({ status: false, msg: "please provide a 6 digit pincode" })
        // }


        if (!(address.shipping.pincode).length == 6) {
            return res.status(400).send({ status: false, msg: "please provide valid 6 digit pincode ." })
        }



        if (!address.billing) {
            return res.status(400).send({ status: false, msg: "please provide billing details" })
        }


        if (!isValid(address.billing)) {
            return res.status(400).send({ status: false, msg: "please provide valid billing address." })
        }


        if (!address.billing.street) {
            return res.status(400).send({ status: false, msg: "please provide billing street details" })
        }


        if (!isValid(address.billing.street)) {
            return res.status(400).send({ status: false, msg: "please provide valid billing street address." })
        }

        if (!address.billing.city) {
            return res.status(400).send({ status: false, msg: "please provide city details for billing" })
        }


        if (!isValid(address.billing.city)) {
            return res.status(400).send({ status: false, msg: "please provide valid city address for billing." })
        }

        if (!address.billing.pincode) {
            return res.status(400).send({ status: false, msg: "please provide billing pincode details" })
        }

        if (!isValid(address.billing.pincode)) {
            return res.status(400).send({ status: false, msg: "please provide valid billing pincode address." })
        }


        // if (!/^[1-9][0-9]{5}$/.test(address.billing.pincode)) {
        //     return res.status(400).send({ status: false, msg: "please provide a 6 digit pincode" })
        // }

        if (!(address.billing.pincode).length == 6) {
            return res.status(400).send({ status: false, msg: "please provide valid 6 digit pincode ." })
        }

        let file = req.files;
        console.log(file);
        if (file && file.length > 0) {

            // if(!isValidFile(file)){
            //     return res.status(400).send({status : false, message : "This is not a valid image file"})
            // }

            let uploadedFileURL = await uploadFile(file[0]);

            data["profileImage"] = uploadedFileURL;
        } else {
            return res.status(400).send({ status: false, message: "No file found" });
        }

        let saveData = await user.create(data);
        return res.status(201).send({ status: true, message: "success", data: saveData });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
};

/**************************************Login User Api****************************************************/
const logIn = async (req, res) => {
    try {
        let data = req.body;
        let { email, password } = data;

        if (!email || email.trim().length == 0) {
            return res.status(400).send({ status: false, message: "Email must be provide" });
        }

        if (email) {
            if (!isValidEmail(email)) {
                return res.status(400).send({ status: false, message: "please provide a valid email" });
            }
        }
        if (!password) {

            return res.status(400).send({ status: false, message: "please provide password" });

        }

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "password should be 8-15 characters long" });
        }

        let emailExt = await user.findOne({ email: email });

        if (!emailExt) {
            return res.status(404).send({ status: false, message: "an account with this email does not exists" });
        }

        let comparePassword = await bcrypt.compare(password, emailExt.password);

        if (!comparePassword) {
            return res.status(400).send({ status: false, message: "Please provide right password" });
        } else {
            let params = {
                userId: emailExt._id,
                iat: Date.now(),
            };

            let secretKey = "vjfjdaehvkxfpekfpekfojdsopfjsdaoifji";

            let token = jwt.sign(params, secretKey, { expiresIn: "2h" });

            res.header("x-api-key", token);

            return res.status(200).send({
                status: true,
                message: "User logIn Successfull",
                data: { userId: emailExt._id, token: token },
            });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

/**************************************Find User Profile Api****************************************************/

const findProfile = async (req, res) => {
    try {
        let userId = req.params.userId;
        if (!userId) {
            return res.status(400).send({
                status: false,
                message: "User ID is required to do this action",
            });
        }

        let validUserId = mongoose.isValidObjectId(userId);

        if (!validUserId) {
            return res.status(400).send({ status: false, message: "please Provide a valid object Id" });
        }
        let findUser = await user.findOne({ _id: userId });

        if (!findUser) {
            return res.status(404).send({ status: false, message: "no user with this id exists" });
        } else {
            return res.status(200).send({ status: true, message: "success", data: findUser });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

/**************************************Update User Profile Api****************************************************/

const updateProfile = async (req, res) => {
    try {
        let data = req.body
        let id = req.params.userId;

        let { fname, lname, email, password, phone, address, profileImage } = data;

        if (!id) {
            return res.status(400).send({
                status: false,
                message: "User id is required to do this action",
            });
        }

        let verifyId = mongoose.isValidObjectId(id);

        if (!verifyId) {
            return res.status(400).send({ status: false, message: "please Provide a valid user Id" });
        }

        if (req.userId != req.params.userId) { //auhtorization
            return res.status(403).send({ status: false, message: "you are not authorized" });
        }

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "please provide data to update" });
        }

        let findUser = await user.findOne({ _id: id });

        if (!findUser) {
            return res.status(404).send({ status: false, message: "No user with this Id exists" });
        }

        if (fname == "") {
            return res.status(400).send({ status: false, message: "fname is invalid" });
        } else if (fname) {
            if (!isValid(fname))
                return res.status(400).send({ status: false, msg: "fname is missing" });

            if (!isValidName(fname)) {
                return res.status(400).send({ status: false, message: "name should contain only alphabets." })
            }
        }

        if (lname == "") {
            return res.status(400).send({ status: false, message: "last name is invalid" });
        } else if (lname) {
            if (!isValid(lname))
                return res.status(400).send({ status: false, msg: "last name is missing" });

            if (!isValidName(lname)) {
                return res.status(400).send({ status: false, message: "last name should contain only alphabets." })
            }
        }

        if (email == "") {
            return res.status(400).send({ status: false, messgae: "Email is invalid" })
        } else if (email) {
            if (!isValid(email)) {
                return res.status(400).send({ status: false, message: "plzz enter email" });
            }
            if (!isValidEmail(email)) {
                return res.status(400).send({ status: false, message: "This is not a valid email" });
            }

            email = email.toLowerCase().trim();

            const emailExt = await user.findOne({ email: email });
            if (emailExt) {
                return res.status(409).send({ status: false, message: "Email already exists" });
            }
        }

        if (phone == "") {
            return res.status(400).send({ status: false, message: "phone number is invalid" })
        } else if (phone) {
            if (!isValid(phone)) {
                return res
                    .status(400)
                    .send({ status: false, message: "plzz enter mobile" });
            }

            //this regex will to set the phone no. length to 10 numeric digits only.
            if (!isValidPhone(phone)) {
                return res.status(400).send({
                    status: false,
                    message: "Please enter valid 10 digit mobile number.",
                });
            }

            const phoneExt = await user.findOne({ phone: phone });
            if (phoneExt) {
                return res.status(409).send({ status: false, message: "phone number already exists" });
            }
        }

        if (password == "") {
            return res.status(400).send({ status: false, message: "please enter a valid password" })
        } else if (password) {
            if (!isValid(password)) {
                return res.status(400).send({ status: false, message: "plzz enter password" });
            }

            if (!isValidPassword(password)) {
                return res.status(400).send({ status: false, message: "password should be 8-15 characters long" });
            }

            let findPassword = await user.findById(req.params.userId);

            let same = bcrypt.compareSync(password, findPassword.password);
            if (same)
                return res.status(400).send({
                    status: false,
                    msg: "password is same as the last one, try another password or login again",
                });

            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(password, salt);
        }

        if (address) {

            // let userAddress1 = JSON.stringify(data.address)
            // data.address = userAddress1


            let Address =JSON.parse(JSON.stringify(data.address))
            data.address = Address

            if (Address.shipping) {
                if (Address.shipping.street) {
                    if (!isValid(Address.shipping.street)) {
                        return res.status(400).send({ status: false, message: "Please provide address shipping street" });
                    }
                    data.address.shipping.street = Address.shipping.street
                }
                if (Address.shipping.city) {
                    if (!isValid(Address.shipping.city)) {
                        return res.status(400).send({ status: false, message: "Please provide address shipping city" });
                    }
                    data.address.shipping.city = Address.shipping.city
                }
                if (Address.shipping.pincode) {
                    if (!isValid(Address.shipping.pincode)) {
                        return res.status(400).send({ status: false, message: "Please provide address shipping pincode" });
                    }
                    data.address.shipping.pincode = Address.shipping.pincode
                }
            }

            if (Address.billing) {
                if (Address.billing.street) {
                    if (!isValid(Address.billing.street)) {
                        return res.status(400).send({ status: false, message: "Please provide address billing street" });
                    }
                    data.address.billing.street = Address.billing.street
                }
                if (Address.billing.city) {
                    if (!isValid(Address.billing.city)) {
                        return res.status(400).send({ status: false, message: "Please provide address billing city" });
                    }
                    data.address.billing.city = Address.billing.city
                }
                if (Address.billing.pincode) {
                    if (!isValid(Address.billing.pincode)) {
                        return res.status(400).send({ status: false, message: "Please provide address billing pincode" });
                    }
                    data.address.billing.pincode = Address.billing.pincode
                }
            }
        }
        if (profileImage) {
            if (files) {

                if (!(files && files.length > 0))
                    return res.status(400).send({ status: false, message: "please provide profile image" })

                let userImage = await aws_s3.uploadFile(files[0])
                userDetails.profileImage = userImage
            }
        }

        let updateData = await user.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: data , updateAt: Date.now() },
            { new: true, upsert: true }
        );

        return res.status(200).send({
            status: true,
            message: "User Profile updated successfully",
            data: updateData,
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = { createUser, logIn, findProfile, updateProfile };
