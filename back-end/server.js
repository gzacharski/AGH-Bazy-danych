const app=require('./app');
const serverPort=require('./config/appconfig');

app.set('port', process.env.PORT || serverPort);

const server=app.listen(app.get('port'), ()=>{
    console.log(`Listening on ${server.address().port}`);
});