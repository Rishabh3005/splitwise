const dbPool = require('../db_connection/dbpool');

var data ={};




data.fetchData=async (page,limit,keyword,userid)=>{

  
  const pool= await dbPool.pool;
  const searchKeyword=`%${keyword}%`;
 
  const offset = (page - 1) * limit;
  
    var query=" select a.userid userid, a.firstname firstname, a.lastname, a.emailid emailid  , "+
    " (case when b.friendsid=$2 then 0 when c.friendid=$2 then 1 else 2 end)  flag "+
    " from equisplitschema.mstusers a  "+
    " left join equisplitschema.mstfriends b on a.userid= b.userid  "+ 
    " left join equisplitschema.mstfriendsrequest c on b.userid=c.userid "+
    " where  (a.firstname ilike $1 or a.lastname ilike $1 or a.emailid ilike $1) "+
    " and a.userid <> $2 and (b.friendsid = $2 or b.friendsid is null) "+ 
    " order by userid LIMIT $3 OFFSET $4 ";

      try{
      
      
        const results=await pool.query(query, [searchKeyword,userid,limit, offset] );
        
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