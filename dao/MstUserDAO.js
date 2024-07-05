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
  
module.exports = data;