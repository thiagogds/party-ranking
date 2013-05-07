/** Categoria de voto
 *
 * @author : Rafael Erthal
 * @since : 2013-05
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    categorySchema;

categorySchema = new Schema({
    name : {type : String, trim : true, required : true}
});

module.exports = mongoose.model('Category', categorySchema);