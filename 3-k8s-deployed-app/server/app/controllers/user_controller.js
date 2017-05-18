var models = require('../models');
var multer = require("multer");


var fotoPath = process.env.UPLOAD_PATH || "./uploads";
var proxyPath = process.env.MEDIA_PROXY_PATH || "media";
var ALLOWED_IMG_TYPES = ["png", "jpg", "jpeg"];

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, fotoPath);
    },
    filename: function (req, file, callback) {
        var splits = file.originalname.split(".");
        var ending = splits[splits.length - 1];
        callback(null, file.fieldname + '-' + Date.now() + "." + ending);
    }
});
var upload = multer({
    storage: storage
}).single('userPhoto');

exports.getUser = function (username, cb) {
    models.User.findByName(username, function (err, user) {
        if (user) {
            //console.log(user.messages);
            // take only the last 5 
            if (user.messages.length > 5) {
                user.messages.splice(0, user.messages.length - 5);
            }

            cb(user);
        } else {
            addUser(username, cb);
        }
    });
};

exports.addMsg = function (username, msg, cb) {
    //console.log("addMsg: " + JSON.stringify(msg));
    models.User.findByName(username, function (err, user) {
        if (user) {
            var message = new models.Message({
                text: msg.text,
                createdAt: new Date(msg.createdAt)
            });
            user.addMsg(message, function (err, user) {
                cb(message);
            });
        }
    });
};

var addUser = function (userName, cb) {
    var newUser = new models.User({
        name: userName,
        messages: [],
        image: "/images/github.png"
    });

    newUser.save(function (err, user) {
        if (err) return console.error(err);
        console.log(user.name + " -> SAVED");
        cb(user);
    });
};

exports.uploadFoto = function (req, res, cb) {
    var controller = this;
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        }
        controller.getUser(req.session.user.name, function (user) {
            user.image = proxyPath + "/" + req.file.filename;

            user.save(function (err, user)  {
                if (err) return console.error(err);
                console.log("Image saved in path: " + user.image);
                cb(user);
            });
        })
    });
};