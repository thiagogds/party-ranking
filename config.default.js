module.exports = {
    server : {
        port : 3000,
        host : 'localhost'
    },
    frontend : {
        port : 3001,
        host : 'localhost'
    },
    mongodb : {
        port : 27017,
        host : 'localhost',
        db   : 'partyranking',
        security : {
            username : undefined,
            password : undefined
        }
    },
    facebook : {
        appid  : '',
        secret : ''
    }
};
