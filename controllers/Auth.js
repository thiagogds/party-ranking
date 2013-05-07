/** Controle de autenticação
 *
 * @author : Rafael Erthal
 * @since : 2013-05
 */

module.exports = function (app) {
    var passport = require('passport'),
        FacebookStrategy = require('passport-facebook').Strategy,
        config = require('../config');

    "use strict";

    passport.use(new FacebookStrategy({
        clientID: config.facebook.appid,
        clientSecret: config.facebook.secret,
        callbackURL: 'http://' + config.server.host + ':' + config.server.port + '/auth/callback'
    }, function(accessToken, refreshToken, profile, done) {
        return done(null, {
            token : accessToken,
            name  : profile.displayName,
            id    : profile.id
        });
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(err, user);
    });

    /** Chama a API do facebook para autenticação
     *
     * @autor : Rafael Erthal
     * @since : 2013-05
     */
    app.get('/auth', passport.authenticate('facebook'));

    /** Chamada após a autenticação
     *
     * @autor : Rafael Erthal
     * @since : 2013-05
     */
    app.get('/auth/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(request, response) {
        response.send({user : request.user});
    });
};