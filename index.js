const express=require("express");
const path=require("path");
var bodyParser = require('body-parser');

const app=express();

//Set Values
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 3000));



//static files
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('assets'));





//Get Request
app.get('/',function(req,res){
    res.render('home');

});


app.listen(app.get('port'),function(){
    console.log('Listening to 3000')
})