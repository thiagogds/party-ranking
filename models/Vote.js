/** Voto de um usuário
 *
 * @author : Rafael Erthal
 * @since : 2013-05
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    voteSchema;

voteSchema = new Schema({
    user     : {type : String, trim : true, required : true},
    voted    : {type : String, trim : true, required : true},
    party    : {type : String, trim : true, required : true},
    date     : {type : Date, required : true},
    category : {type : objectId, required : true}
});

module.exports = mongoose.model('Vote', voteSchema);