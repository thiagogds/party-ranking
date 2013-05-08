/** Controle de festas
 *
 * @author : Rafael Erthal
 * @since : 2013-05
 */

module.exports = function (app) {
    "use strict";

    /** Exibe festa
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     */
    app.get('/party/:id', function (request, response) {

        console.log(request.user);

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var data = {
            'access_token' : request.param('token'),
            'fields'       : 'attending.fields(gender,link,name), name'
        };

        /* Pegando evento na Graph */
        require('restler').get(
            'https://graph.facebook.com/' + request.params.id + '?' + require('querystring').stringify(data)
        ).on('fail', function (data) {
            response.send({error : data});
        }).on('success',function (data) {
            /* Pegando votos no banco */
            require('../models/Vote').find({party : request.params.id}, function (error, votes) {
                if (error) {
                    response.send({error : error});
                } else {
                    response.send({party : {
                        votes      : votes,
                        name       : data.name,
                        attendings : data.attending ? data.attending.data : []
                    }});
                }
            });
        });
    });
};
