const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User copy');
const route = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
const passport = require('passport');
const _ = require('lodash');

const User = mongoose.model('User');

//read all data , http://localhost:3000/api/userModel
route.get('/', async (req, res) => {
    User.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retrieving User :' + JSON.stringify(err, undefined, 2)); }
    });
});

//create
route.post('/', (req, res) => {
    const { firstname, lastname, email, password, address, city, country, postalCode, about, rateCVs, sendMails, interview } = req.body;
    let user = {};
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.password = password;
    user.address = address;
    user.city = city;
    user.country = country;
    user.postalCode = postalCode;
    user.about = about;
    //user.accessLevel = accessLevel;
    user.rateCVs = rateCVs;
    user.sendMails = sendMails;
    user.interview = interview;


    let userModel = new User(req.body);
    userModel.save((err, doc) => {
        if (!err) { res.send(doc); }
        else {
            console.log('Error in User Save :' + JSON.stringify(err, undefined, 2));
            res.json(err);
        }

    });
    //res.json(userModel);
});


route.post('/authenticate', (req, res, next) => {
    // call for passport authentication
    console.log('called auth')
    passport.authenticate('local', (err, user, info) => {
        console.log(user)
        console.log(err)
            // error from passport middleware

        if (user) return res.status(200).json({ "token": user.generateJwt() });

        else if (err)
            return res.status(400).json(err);
        // registered use
        // unknown user or wrong password
        else return res.status(404).json(info);


    })(req, res);
})


//Read
route.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('No record with given id : $(req.params.id)');

    User.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Reieving User :' + JSON.stringify(err, undefined, 2)); }
    });
});

//Update
route.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('No record with given id : $(req.params.id)');

    var user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
        postalCode: req.body.postalCode,
        about: req.body.about,
        //accessLevel: req.body.accessLevel,
        rateCVs: req.body.rateCVs,
        sendMails: req.body.sendMails,
        interview: req.body.interview
    };

    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, doc) => {
        console.log(doc)
        if (!err) { res.send(doc); }
        else { console.log('Error in User update :' + JSON.stringify(err, undefined, 2)); }
    });
});

//delete
route.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('No record with given id : $(req.params.id)');

    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in User Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

// module.exports.test = (req, res, next) => {
//     res.status(200).json({ test: 'hello' });
// }


// //user profile
// module.exports.userProfile = (req, res, next) => {
//     User.findOne({ _id: req._id },
//         (err, user) => {
//             if (!user)
//                 return res.status(404).json({ status: false, message: 'User record not found.' });
//             else
//                 return res.status(200).json({ status: true, user: _.pick(user, ['userName', 'email']) });
//         }
//     );
// }


module.exports = route;