/* Autenticando o app no facebook */
Accounts.loginServiceConfiguration.insert({
    service: "facebook",
    appId: process.env.FACEBOOK_APP_ID,
    secret: process.env.FACEBOOK_APP_SECRET
});

Meteor.methods({
    /*
     * Insere as mulheres do evento na minha lista de pessoas
     *
     * @author : Thiago
     * @since : 2013-02
     *
     * @param eventId: id do evento que ira fornecer as tchutchucas
     */
    getAttendings: function (eventId) {
        var data,
            attendings;

        if(Meteor.users.findOne(this.userId)) {
            /* Dados para conversar com API do facebook */
            data = {
                fields       : 'attending.fields(gender,link), name',
                method       : 'GET',
                format       : 'json',
                access_token : Meteor.users.findOne(this.userId).services.facebook.accessToken
            };

            /*Pegando dados do facebook*/
            facebookData = Meteor.http.get('https://graph.facebook.com/' + eventId, {params : data}).data;

            if(! facebookData.error) {
                /* Salva o Evento */
                event = FacebookEvents.findOne({id: facebookData.id})

                if (!event) {
                    FacebookEvents.insert(
                            {
                                name: facebookData.name,
                                id: facebookData.id
                            }
                    );
                }

                /* Pegando participantes do evento no facebook */
                attendings = facebookData.attending.data;

                /* Innserindo novas vadias na lista de pessoas */
                _.each(attendings, function(att) {
                    var attending = Attendings.findOne({id : att.id});
                    if (!attending) {
                        att.events = [eventId];
                        Attendings.insert(att);
                    } else if (attending.events.indexOf(eventId) === -1) {
                        attending.events.push(eventId);
                    }
                });
            }
        }
    }
});

/* Publicando os votos */
Meteor.publish("Votes", function () {
    return Votes.find();
});

/* Publicando os participantes de eventos */
Meteor.publish("Attendings", function () {
    return Attendings.find();
});

/* Publicando os eventos */
Meteor.publish("Events", function () {
    return Events.find();
});

/* Publicando os eventos do facebook */
Meteor.publish("FacebookEvents", function () {
    return FacebookEvents.find();
});
