const app=require('./app');
const serverPort=require('./config/appconfig');

app.set('port', process.env.PORT || serverPort);

const server=app.listen(app.get('port'), '0.0.0.0', ()=>{
    console.log(`Listening on ${server.address().port}`);
});