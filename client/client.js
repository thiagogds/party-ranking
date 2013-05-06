/* Busca as coleções no server */
Meteor.subscribe('Votes');
Meteor.subscribe('Attendings');
Meteor.subscribe('Events');
Meteor.subscribe('FacebookEvents');

//var AppTracker = new Tracker();
//AppTracker.register(GoogleAnalyticsTracker, {account: 'UA-39154996-1'});

var eventIDFromUrl = History.getHashByState();
eventIDFromUrl = eventIDFromUrl.replace(/\//g, "");

Session.set("event", eventIDFromUrl);


/* Autenticando o usuário no facebook */
Meteor.loginWithFacebook({
    requestPermissions : ['email', 'user_events']
},function (err) {
    /* Caso de merda printa mensagem */
    if (err) {
        Session.set('errorMessage', err.reason || 'Unknown error');
    }
});

Meteor.call("getAttendings", Session.get("event"));

Meteor.autorun(function() {
  if (Meteor.user()) {
    Meteor.call("getAttendings", Session.get("event"));
  }
});

/*
 * Vota em uma pessoa
 *
 * @author : Rafael
 * @since : 2013-02
 *
 * @param eventId: id dA PUTARIA
 * @param userId: id do coitado
 */
function vote (eventId, userId) {
    /* Busca vitima */
    var attending = Attendings.findOne({id : userId});

    var canVote =  !Votes.findOne({
        voterId     : Meteor.userId(),
        attendingId : attending.id,
        event       : eventId
    });


    if (canVote) {
        Votes.insert({
            voterId     : Meteor.userId(),
            attendingId : attending.id,
            event       : eventId
        });
    }
}

/* Atualizando lista de pessoas do evento NAO ENTROU NESSA VERSAO/
setInterval(function () {
    if (Session.get("event")) {
        Meteor.call("getAttendings", Session.get("event"))
    }
}, 2000);
*/

/* Aguarda o usuário escolher o evento */
Template.search.events({
    'click #send' : function (evt) {
        evt.preventDefault();

        var eventId = $("#event").val();
        Session.set("event", $("#event").val());
        History.setHash("/" + eventId);
        Meteor.call("getAttendings", eventId);

        /* Registrando evento de visualizar evento */
        Events.insert({
            event : 'event view',
            date  : new Date(),
            user  : Meteor.user(),
            data  : {
                event : Session.get("event")
            }
        });
    }
});

/* Aguarda o usuário votar em uma pessoa */
Template.list.events({
    'click .vote' : function () {
        vote(Session.get("event"), this.id);

        /* Registrando evento de votar em gostosas */
        Events.insert({
            event : 'bitch vote',
            date  : new Date(),
            user  : Meteor.user(),
            data  : {
                event : Session.get("event"),
                attending : this.id
            }
        });
    }
});

/* Busca lista de pessoas no evento do sexo feminino e quantos votos ela tem */
Template.female.femaleAttendings = function () {
    /* Busca lista de pessoas no evento do sexo feminino */
    var attendings = Attendings.find({
        "events"  : {$in : [Session.get("event")]},
        "gender" : "female"
    }).fetch();

    /* Conta quantos votos a pessoa tem */
    _.each(attendings, function(attending) {
        attending.votes = Votes.find({
            attendingId : attending.id,
            event : Session.get("event")
        }).fetch().length;
    });

    /* Ordenando as mulheres por voto */
    attendings.sort(function(a,b) {
        var aVotes = a.votes || 0,
            bVotes = b.votes || 0;

        if (aVotes < bVotes) return  1;
        if (aVotes > bVotes) return -1;
        return 0;
    });

    return attendings;
};

/* Busca lista de pessoas no evento do sexo masculino e quantos votos ela tem */
Template.male.maleAttendings = function () {
    /* Busca lista de pessoas no evento do sexo masculino */
    var attendings = Attendings.find({
        "events"  : {$in : [Session.get("event")]},
        "gender" : "male"
    }).fetch();

    /* Conta quantos votos a pessoa tem */
    _.each(attendings, function(attending) {
        attending.votes = Votes.find({
            attendingId : attending.id,
            event : Session.get("event")
        }).fetch().length;
    });

    /* Ordenando os homens por voto */
    attendings.sort(function(a,b) {
        var aVotes = a.votes || 0,
            bVotes = b.votes || 0;

        if (aVotes < bVotes) return  1;
        if (aVotes > bVotes) return -1;
        return 0;
    });

    return attendings;
};

/* Contagem de mulheres no evento */
Template.list.females = function () {
    return  Attendings.find({
        "events"  : {$in : [Session.get("event")]},
        "gender" : "female"
    }).fetch().length;
}

/* Contagem de homens no evento */
Template.list.males = function () {
    return  Attendings.find({
        "events"  : {$in : [Session.get("event")]},
        "gender" : "male"
    }).fetch().length;
}

/*Pega o nome do evento*/
Template.list.event = function() {
    var eventId = Session.get("event");
    var event = FacebookEvents.findOne({id: eventId});
    return event
}

Template.loadingEvent.isLoading = function() {
    var attendings = Attendings.find({
        "events"  : {$in : [Session.get("event")]},
        "gender" : "female"
    }).fetch();

    var event = Session.get("event")

    return (attendings.length == 0 && !(event == ""));
}
