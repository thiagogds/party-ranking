/** Controle de votos
 *
 * @author : Rafael Erthal
 * @since : 2013-05
 */

module.exports = function (app) {
    "use strict";

    var Vote = require('../models/Vote');

    /** Cadastra voto
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     */
    app.post('/vote', function (request, response) {
        var data = {
            'access_token' : request.param('token'),
            'fields'       : 'name'
        };

        /* Pegando evento na Graph */
        require('restler').get(
            'https://graph.facebook.com/' + request.param('party', null) + '?' + require('querystring').stringify(data)
        ).on('fail', function (data) {
            response.send({error : data});
        }).on('success',function (data) {
            /* Verificando se o voto ja foi computado */
            Vote.find({
                user     : request.param('id', null),
                voted    : request.param('user', null),
                party    : request.param('party', null),
                category : request.param('category', null)
            }, function (error, votes) {
                if (error) {
                    response.send({error : error});
                } else if (votes.length > 0) {
                    response.send({error : {message : 'Duplicated vote'}});
                } else {
                    /* Criando voto */
                    var vote = new Vote({
                        user     : request.param('id', null),
                        voted    : request.param('user', null),
                        party    : request.param('party', null),
                        date     : new Date(),
                        category : request.param('category', null)
                    });
                    /* Salvando voto */
                    vote.save(function (error) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            response.send({vote : vote});
                        }
                    });
                }
            });
        });
    });

    /** Remove voto
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     */
    app.del('/vote/:id', function (request, response) {
        var data = {
            'access_token' : request.param('token'),
            'fields'       : 'name'
        };

        /* Pegando evento na Graph */
        require('restler').get(
            'https://graph.facebook.com/' + request.param('party', null) + '?' + require('querystring').stringify(data)
        ).on('fail', function (data) {
            response.send({error : data});
        }).on('success',function (data) {
            /* Buscando voto no banco */
            Vote.findById(request.params.id, function (error, vote) {
                if (error) {
                    response.send(error);
                } else {
                    vote.remove(function (error) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            response.send(null);
                        }
                    });
                }
            });
        });
    });
};
