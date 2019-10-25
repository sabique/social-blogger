const mongodb = require('mongodb');

let connectionString = 'mongodb+srv://todoAppUser:todoAppUserPWD@clusternodejs-bt3dh.mongodb.net/social-blogger?retryWrites=true&w=majority';

mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    module.exports = client.db();
    const app = require('./app');
    app.listen(process.env.PORT || 3000);
});