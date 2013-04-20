party-ranking
=============

Meteor app to rank people at Facebook events.

# How to run

* Install [NPM](https://npmjs.org/)
* Install [Meteorite](https://github.com/oortcloud/meteorite)
* Run `mrt`

Meteorite will download and configure everything to run meteor.

Instead of use `meteor` commands you have to use `mrt`, like `mrt reset` instead of `meteor reset`

Meteorite let you add packages from [Atmosphere](https://atmosphere.meteor.com/) using `mrt add package`

## How to test local

On server/server.js change

```
Accounts.loginServiceConfiguration.insert({
    service: "facebook",
    appId: process.env.FACEBOOK_APP_ID,
    secret: process.env.FACEBOOK_APP_SECRET
});
```

Change the **appId** and **secret** to use the app Localpartyranking. This info are [facebook developers app page](https://developers.facebook.com/apps). If you don't have access to it, ask someone :P

#DO NOT COMMIT THIS CHANGES, IT'S ONLY FOR LOCAL TEST. AT PRODUCTION WE USE ENV VARIABLES
