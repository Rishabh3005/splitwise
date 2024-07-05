const express=require("express");
const path=require("path");
var bodyParser = require('body-parser');
const mstuserDAO = require('./dao/MstUserDAO');
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


app.get('/login',function(req,res){
    res.render('login');

});


app.get('/signup',function(req,res){
    res.render('signup');

});


app.get('/',function(req,res){
    res.render('home');

});

app.get('/addexpenses',function(req,res){
    res.render('grouphome');

});

app.get('/addgroup',function(req,res){
    res.render('addgroup');

});

app.get('/myfriends',function(req,res){
    res.render('myfriends');

});


app.get('/addfriends',function(req,res){
    res.render('addfriends');

});

app.get('/request',function(req,res){
    res.render('pendingrequest');

});






// Post Request


app.post('/signup',function(req,res){
    

  
   
    
    const firstName= req.body.firstName ;
    const lastName= req.body.lastName ;
    const emailid= req.body.emailid;
    const password= req.body.password;
   
   
   
    (async ()=>{
       try{
          
            await mstuserDAO.saveuser(firstName,lastName,emailid,password);
          
            return res.jsonp("Everything is fine");
       }
       catch (error){
           console.log(error);
           return res.jsonp("Something Went Wrong.");
       }
   


    })();
    
    
})





app.listen(app.get('port'),function(){
    console.log('Listening to 3000')
})