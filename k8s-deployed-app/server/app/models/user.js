module.exports = function(mongoose) {
  var messageSchema = require('./message')(mongoose);

    var userSchema = mongoose.Schema({
        name: String,
        messages: [messageSchema],
        image: String
    }, {
        timestamps: true
    });
    return userSchema;
}
