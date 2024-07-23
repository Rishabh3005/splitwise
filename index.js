const express=require("express");
const path=require("path");
var bodyParser = require('body-parser');
const mstuserDAO = require('./dao/MstUserDAO');
const friendsDAO = require('./dao/FriendsMethodDAO');
const groupDAO = require('./dao/GroupsMethodDAO');
const trnDAO = require('./dao/TrnMethodDAO');
const bcrypt = require('bcrypt');
const sessions = require('express-session');

const app=express();

const saltRounds = 10;

//Set Values
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 3000));



// creating 24 hours from milliseconds
//const oneDay = 1000 * 60 * 60 * 24;

const oneDay = 1000 * 120 * 10;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));




//static files
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('assets'));





//session checker
var sessionChecker = (req, res, next) => {    
    
    if (req.session.profile) {
        
        next();
    } else {
        
        res.redirect('/login');
    }
};


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

app.get('/addexpenses',sessionChecker,async (req,res)=>{
    
    
    const userid= req.session.profile[0].userid;
    
    try {
        const groupdList=await groupDAO.getGroups(userid);
        res.render('grouphome',{groupdList:groupdList});
       
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
    

});

app.get('/addgroup',sessionChecker,async(req,res)=>{


    const userid= req.session.profile[0].userid;
   
    try {
        const friendList=await friendsDAO.getFirendsList(userid);
        res.render('addgroup' , {friendList:friendList});
       
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }

});

app.get('/myfriends',sessionChecker,async (req,res)=>{

    const userid= req.session.profile[0].userid;

    try {
        // Example: fetch data from database with pagination
        const friendsList=await friendsDAO.getFirendsList(userid);
        res.render('myfriends',{friendsList:friendsList});
       
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
   

});


app.get('/addfriends',sessionChecker,function(req,res){
    res.render('addfriends');

});

app.get('/request',sessionChecker,async (req,res)=>{
    const userid= req.session.profile[0].userid;
    try {
        // Example: fetch data from database with pagination
        const pendingReq=await friendsDAO.getPendingRequest(userid);
        res.render('pendingrequest',{pendingReqList:pendingReq});
       
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }



    

});



app.get('/getuserlist',sessionChecker, async (req, res) => {
    const userid= req.session.profile[0].userid;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword ;
    try {
        // Example: fetch data from database with pagination
        const data = await friendsDAO.fetchData(page, limit,keyword,userid);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.get('/sendRequest',sessionChecker, async (req, res) => {
   
    const friendid = parseInt(req.query.friendid) ;
    const userid= req.session.profile[0].userid;
   
    try {
        // Example: fetch data from database with pagination
        await friendsDAO.sendRequest(userid, friendid);
       
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});




// Post Request


app.post('/signup',function(req,res){
    

  
   
    
    const firstName= req.body.firstName ;
    const lastName= req.body.lastName ;
    const emailid= req.body.emailid;
    const password= req.body.password;
   
   
   
    ( async ()=>{
        
        try {
            
        const salt = await bcrypt.genSalt(saltRounds );
        
        const hash =await bcrypt.hash(password, salt);

        await mstuserDAO.saveuser(firstName,lastName,emailid,hash);
        
        return res.redirect("/login");
        
        }catch (error){
            console.log(error);
            return res.jsonp("Something Went Wrong.");
        }

        
        })();
    
    
});






app.post('/login',function(req,res){

    var emailid=req.body.emailid;
    var password=req.body.password;


   
    
  
        
    ( async ()=>{
        
        try{
        const hashPassword=await mstuserDAO.hashPassword(emailid);
        //console.log(hashPassword);
        if(hashPassword[0]==null)
            return res.jsonp("Username doesn't exist.");
        else{
            var hashPass=hashPassword[0].password;
            const result= await bcrypt.compare(password, hashPass);
            
            if(result){
            const loginUser=await mstuserDAO.loginUser(emailid);
           
            req.session.profile=loginUser;
            return res.redirect("/addexpenses");
            }else{
                return res.jsonp("Password is incorrect");
            }
        }
        

        }
        catch (error){
            console.log(error);
            return res.jsonp("Something Went Wrong.");
        }

    })();
    




    

   





})






app.post('/acceptFriend',sessionChecker,async (req,res)=>{
    const friendid = parseInt(req.body.friendid) ;
    const userid= req.session.profile[0].userid;
    
    try {
        // Example: fetch data from database with pagination
        await friendsDAO.acceptFriend(userid,friendid);
        
       
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }



    

});





app.post('/rejectFriend',sessionChecker,async (req,res)=>{
    const friendid = parseInt(req.query.friendid) ;
    const userid= req.session.profile[0].userid;
    try {
        // Example: fetch data from database with pagination
        await friendsDAO.rejectFriend(userid,friendid);
        
       
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }



    

});





app.post('/removeFriend',sessionChecker,async (req,res)=>{
    const friendid = parseInt(req.body.friendid) ;
    const userid= req.session.profile[0].userid;
    
    try {
        // Example: fetch data from database with pagination
        await friendsDAO.removeFriend(userid,friendid);
        
       
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }



    

});




app.post('/addgroup',sessionChecker,async(req,res)=>{
    const userid= req.session.profile[0].userid;
    const groupname= req.body.groupname;
    const members= req.body.membersList;


    //If one friend is selected then the members is not coming as array. Needs to make it as an array
    var membersList=[];

    for (var i = 0; i <members.length; i++) { 
        membersList.push(members[i]);
    }

    try{
        await groupDAO.addGroups(userid,groupname,membersList)
        const friendList=await friendsDAO.getFirendsList(userid);
        res.render('addgroup' , {friendList:friendList});

    }
    catch(err){
        res.status(500).json({ error: 'Internal server error' });
    }
    

});




app.post('/loadTrnData',sessionChecker,async (req,res)=>{
    const groupid = parseInt(req.body.groupid) ;
    const userid= req.session.profile[0].userid;
    
    try {
       
        
       const trnData= await trnDAO.loadTrn(userid, groupid);
       
       // Money given to others
       const oweWise = trnData[0];

       // Money taken from Others
       const owedWise = trnData[1];
        
       var amountMap = new Map();

       
       oweWise.forEach(element => {
            var key= [element.owedbyid, element.owedbyname, element.owedbyemailid];
            var value=parseFloat(element.amount);



            if (amountMap.has(JSON.stringify(key))) {
                let currentTotal = amountMap.get(JSON.stringify(key));
                amountMap.set(JSON.stringify(key), currentTotal + value); // Sum up values for the same key
            } else {
                amountMap.set(JSON.stringify(key), value); // Initialize if key doesn't exist
            }



            
           
       });
       

       owedWise.forEach(element => {
        var key= [element.paidbyid, element.paidbyname, element.paidbyemailid];
        var value=parseFloat(element.amount);



        if (amountMap.has(JSON.stringify(key))) {
            let currentTotal = amountMap.get(JSON.stringify(key));
            amountMap.set(JSON.stringify(key), currentTotal - value); // Sum up values for the same key
        } else {
            amountMap.set(JSON.stringify(key), value); // Initialize if key doesn't exist
        }
       

   });
       
  // console.log(amountMap)
   var allData = [];
    amountMap.forEach((amount, key) => {
                

                // Destructuring assignment to extract values
        const [id, name, email] = JSON.parse(key);

    


        allData.push({  name:name, emailid:email,amount:amount });
    });
    

       


      res.json(allData);
       
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }



    

});






app.post('/getGroupDetails',sessionChecker,async (req,res)=>{
    const groupid = parseInt(req.body.groupid) ;
    const userid= req.session.profile[0].userid;
    
    try {
       
       const groupDetails= await groupDAO.getOneGroupDetails( groupid);
       
    


       


      res.json(groupDetails);
       
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }



    

});






app.post('/addtrn',sessionChecker,async(req,res)=>{
    const userid= req.session.profile[0].userid;
    const amount= req.body.amount;
    const details= req.body.details;
    const paidby= req.body.paidby;
    const groupid= req.body.groupid;
    var splitinto= req.body.splitinto;
    splitinto= Array.isArray(splitinto)? splitinto:[splitinto]
    
   
   

    
    try{
        await trnDAO.saveTrn(userid,amount,details, paidby, splitinto,groupid)
       
        return res.redirect('addexpenses' );

    }
    catch(err){
        res.status(500).json({ error: 'Internal server error' });
    }
    

});


app.post('/groupTrnDetails',sessionChecker,async(req,res)=>{
    const userid= req.session.profile[0].userid;
   
    const groupid= req.body.groupid;
    const groupname= req.body.groupname;
   
   
   

    
    try{
       const grpTrn= await groupDAO.getGroupsTrnDetails(groupid)
       
        return res.render('GroupTrnDetails', {grpTrn,groupname} );

    }
    catch(err){
        res.status(500).json({ error: 'Internal server error' });
    }
    

});





















app.listen(app.get('port'),function(){
    console.log('Listening to 3000')
})