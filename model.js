Attendings = new Meteor.Collection("attendings");
Votes      = new Meteor.Collection("votes");
Events     = new Meteor.Collection("events");
FacebookEvents = new Meteor.Collection("facebookEvents");

/* Permitindo ao client inserir votos */
Votes.allow({
    insert : function (userId, vote) {
        return !Votes.findOne({
            voterId     : vote.voterId,
            attendingId : vote.attendingId,
            event       : vote.event
        });
    }
});

/* Permitindo ao client inserir eventos */
Events.allow({
    insert : function () {
        return true;
    }
});
