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
module.exports = data;