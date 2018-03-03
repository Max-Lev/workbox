const webpush = require('web-push');
var path = require('path');
var express = require('express');
var app = express();
var cors = require('cors');
var Datastore = require('nedb');
var db = new Datastore();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(__dirname + '/register'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/register/server-api.html');
});

app.use(require("body-parser").json())

app.post('/api/save-subscription/', (req, res) => {
    // Check the request body has at least an endpoint.
    if (!req.body || !req.body.endpoint) {
        // Not a valid subscription.
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            error: {
                id: 'no-endpoint',
                message: 'Subscription must have an endpoint.'
            }
        }));
        return false;
    } else {
        saveSubscriptionToDatabase(req.body);
        return true;
    }
});

function saveSubscriptionToDatabase(subscription) {
    return new Promise(function (resolve, reject) {
        db.insert(subscription, function (err, newDoc) {
            if (err) {
                reject(err);
                return;
            }
            // console.log('getAllData: ', db.getAllData());
            resolve(newDoc._id);
        });
    });
};

const vapidKeys = {
    publicKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
    privateKey: 'UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTfKc-ls'
};
webpush.generateVAPIDKeys(vapidKeys.publicKey, vapidKeys.privateKey);

webpush.setVapidDetails('mailto:web-push-book@gauntface.com', vapidKeys.publicKey, vapidKeys.privateKey);

app.post('/api/trigger-push-msg/', function (req, res) {
    return getSubscriptionsFromDatabase().then(function (subscriptions) {
        console.log('trigger subscriptions: ', subscriptions);
        let promiseChain = Promise.resolve();
        for (let i = 0; i < subscriptions.length; i++) {
            const subscription = subscriptions[i];
            promiseChain = promiseChain.then(() => {
                console.log(subscription);
                return triggerPushMsg(res, subscription, 'dataToSend');
            });
        }
        return promiseChain;
    });
});

function getSubscriptionsFromDatabase() {
    return new Promise(function (resolve, reject) {
        var data = db.getAllData();
        resolve(data);
    });
};

const triggerPushMsg = function (res, subscription, dataToSend) {
    subscription.keys = {
        auth: '5I2Bu2oKdyy9CwL8QVF0NQ==',
        p256dh: 'BLc4xRzKlKORKWlbdgFaBrrPK3ydWAHo4M0gs0i1oEKgPpWC5cW8OCzVrOQRv-1npXRWk8udnW3oYhIO4475rds='
    };

    // const s = {
    //     // endpoint: 'https://fcm.googleapis.com/fcm/send/dLrb97aSFhg:APA91bFBFLNas-R33frcm6CRPOQWzIrOknsmQmvZLNLsoLuzach8lNF3nYPD7SKljznS9Fxc7oB5R9VfsVWeMXjcTy8KrQQ5pAx5XPeMFeMgPjwg8K_S60edodd2D2OBve3Oq5hQvaFx',
    //     endpoint: 'http://localhost:4200',
    //     keys:
    //         {
    //             p256dh: 'BORZi3TTCZbVQ7ReaBah6tCNRyr_ooxowjpjXuS0DOxMMtZ8vg__46do3cS8ky-vMjVRTGCIcMau79HNzra1u0A=',
    //             auth: 'xhvMLfKDkwZ0CR_kb_adKw=='
    //         }
    // };

    // return webpush.sendNotification(s, dataToSend).then(() => {
    return webpush.sendNotification(subscription, dataToSend).then(() => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ data: { success: true } }));
    }).catch(function (err) {
        res.status(500);
        // res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            error:
                {
                    id: 'unable-to-send-messages',
                    message: `We were unable to send messages to all subscriptions : ${err.message}`
                }
        }));
    }).catch((err) => {
        console.log(err);
        if (err.statusCode === 410) {
            return deleteSubscriptionFromDatabase(subscription._id);
        } else {
            console.log('Subscription is no longer valid: ', err);
        }
    });
};


app.listen(process.env.PORT || 4201, () => { console.log('http://localhost:4201'); });


