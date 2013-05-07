/** Controle de categorias de voto
 *
 * @author : Rafael Erthal
 * @since : 2013-05
 */

module.exports = function (app) {
    "use strict";

    /** Lista categorias de votos
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     */
    app.get('/categories', function (request, response) {
        require('../models/Category').find(function (error, categories) {
            if (error) {
                response.send({error : error});
            } else {
                response.send({categories : categories});
            }
        });
    });
};