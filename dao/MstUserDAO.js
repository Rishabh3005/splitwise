const dbPool = require('../db_connection/dbpool');

var data ={};








data.saveuser= async (firstName,lastName,emailid,password)=>{


  var query="INSERT INTO equisplitschema.mstusers(firstname,lastname,emailid,password,creationdate) "+
  "VALUES($1,$2,$3,$4,CURRENT_TIMESTAMP) ";
  
  


  const pool= dbPool.pool;

  try{

    
    
      await pool.query(query, [firstName,lastName,emailid,password]);
  
        
    



  }
  catch (error){
    throw new Error(error);
  } 



 
 

   

  
 
      
      




}  
  





data.hashPassword=async (emailid)=>{

 
  const pool= await dbPool.pool;

    var query=" select password from equisplitschema.mstusers where emailid =$1  ";
    
    
  
   
      try{
      
      const results=await pool.query(query, [emailid] );
      return results.rows;
      }
      catch(error){
        throw new Error(error);
      }
         

}



data.loginUser=async (emailid)=>{

  const pool= await dbPool.pool;

    var updateLogin="update equisplitschema.mstusers set lastlogin = CURRENT_TIMESTAMP where emailid =$1";

    var query=" select userid, firstname, lastname, emailid from equisplitschema.mstusers where emailid =$1  ";

      try{
      
        await pool.query(updateLogin, [emailid] );
        const results=await pool.query(query, [emailid] );
        return results.rows;
      }
      catch (error){
        throw new Error(error);
      }


}  





data.fetchData=async (page,limit,keyword,userid)=>{

  const pool= await dbPool.pool;

  const offset = (page - 1) * limit;
  
    var query=" select * from equisplitschema.mstusers where (firstname ilike $1 or lastname ilike $1 "+
    " or emailid ilike $1) and userid <> $2  order by userid LIMIT $3 OFFSET $4 ";

      try{
      
      
        const results=await pool.query(query, [keyword,userid,limit, offset] );
        
        return results.rows;
      }
      catch (error){
        throw new Error(error);
      }


}  




data.sendRequest=async (userid, friendid)=>{

  const pool= await dbPool.pool;


    var query=" insert into equisplitschema.mstfriendsrequest (userid, friendid, requestedon) values ($1,$2,CURRENT_TIMESTAMP)";

      try{
      
      
        await pool.query(query, [userid, friendid] );
        
      }
      catch (error){
        console.log(error)
        throw new Error(error);
      }


}  




data.getPendingRequest=async (userid)=>{

  const pool= await dbPool.pool;


    var query=" select a.userid userid, a.firstname firstname, a.lastname lastname, a.emailid emailid, b.requestedon requestedon "+
    " from equisplitschema.mstusers a, equisplitschema.mstfriendsrequest  b "+
    " where a.userid= b.userid and b.friendid=$1";

      try{
      
      
        const results=await pool.query(query, [userid] );
        return results.rows;
        
      }
      catch (error){
        console.log(error)
        throw new Error(error);
      }


}  



data.getFirendsList=async (userid)=>{

  const pool= await dbPool.pool;


    var query=" select a.userid userid, a.firstname firstname, a.lastname lastname, a.emailid emailid "+
    " from equisplitschema.mstusers a, equisplitschema.mstfriends  b "+
    " where a.userid= b.friendsid and b.userid=$1";

      try{
      
      
        const results=await pool.query(query, [userid] );
        return results.rows;
        
      }
      catch (error){
        console.log(error)
        throw new Error(error);
      }


}  


data.acceptFriend=async (userid, friendid)=>{

  const pool= await dbPool.pool;

    var delquery=" delete from equisplitschema.mstfriendsrequest where userid=$1 and friendid=$2"
    var query=" insert into equisplitschema.mstfriends (userid, friendsid, friendshipdate) values ($1,$2,CURRENT_TIMESTAMP)";

      try{
        
        // User A send request to user B. So in table userid is A and friendid is B. Now when B accept the request
        // then the friendid is A and userid B but in database reverse is saved. So interchanging the params
        await pool.query(delquery, [ friendid, userid] );
        


        // If A is friend of B then B is also friend of A
        await pool.query(query, [userid, friendid] );
        await pool.query(query, [ friendid,userid] );
        
      }
      catch (error){
        console.log(error)
        throw new Error(error);
      }


}  



data.rejectFriend=async (userid, friendid)=>{

  const pool= await dbPool.pool;

    var delquery=" delete from equisplitschema.mstfriendsrequest where userid=$1 and friendid=$2"
    

      try{
        
        // User A send request to user B. So in table userid is A and friendid is B. Now when B reject the request
        // then the friendid is A and userid B but in database reverse is saved. So interchanging the params
        await pool.query(delquery, [ friendid, userid] );
        


   
        
      }
      catch (error){
        console.log(error)
        throw new Error(error);
      }


}  




data.removeFriend=async (userid, friendid)=>{

  const pool= await dbPool.pool;

    var delquery=" delete from equisplitschema.mstfriends where userid=$1 and friendsid=$2"
    

      try{
        
        
        await pool.query(delquery, [ friendid, userid] );
        await pool.query(delquery, [  userid,friendid] );
        


   
        
      }
      catch (error){
        console.log(error)
        throw new Error(error);
      }


}  

module.exports = data;