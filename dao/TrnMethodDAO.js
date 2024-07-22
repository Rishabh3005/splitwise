const dbPool = require('../db_connection/dbpool');

var data ={};




data.loadTrn =async (userid,groupid)=>{

    const pool= await dbPool.pool;
    
    var finalResult=[];
    const queryPaid=" select   b.owedbyid owedbyid, (select d.firstname||' '||d.lastname from equisplitschema.mstusers d where d.userid= b.owedbyid ) owedbyname, "+
" (select d.emailid from equisplitschema.mstusers d where d.userid= b.owedbyid ) owedbyemailid, "+
  " a.trnamount/(select count(*) from equisplitschema.trnoweddetails c where c.trnid= a.trnid) amount"+
" from equisplitschema.trndetails a, equisplitschema.trnoweddetails b "+
" where a.trnid=b.trnid and a.groupid=$1 and a.paidbyid =$2  order by a.trnid";



    const queryOwed=" select  a.paidbyid paidbyid,(select d.firstname||' '||d.lastname from equisplitschema.mstusers d where d.userid=a.paidbyid) paidbyname, "+
" (select d.emailid from equisplitschema.mstusers d where d.userid=a.paidbyid) paidbyemailid, "+
" a.trnamount/(select count(*) from equisplitschema.trnoweddetails c where c.trnid= a.trnid) amount"+
" from equisplitschema.trndetails a, equisplitschema.trnoweddetails b "+
" where a.trnid=b.trnid and a.groupid=$1 and b.owedbyid =$2  order by a.trnid";


    try{
      

        var results=await pool.query(queryPaid, [groupid,userid] );
        finalResult.push(results.rows);

        results=await pool.query(queryOwed, [groupid,userid] );
        finalResult.push(results.rows);
          
        return finalResult;
        }
        catch (error){
        console.log(error)
        throw new Error(error);
      }



}





data.saveTrn= async (userid,amount,details, paidby, splitinto,groupid)=>{


  var query="INSERT INTO equisplitschema.trndetails(groupid,paidbyid,entryby,creationdate,trndetails,trnamount) "+
  "VALUES($1,$2,$3,CURRENT_TIMESTAMP,$4,$5) RETURNING trnid";
  
  var queryToAddOwned ="insert into equisplitschema.trnoweddetails(trnid, owedbyid) values($1,$2)"


  const pool= dbPool.pool;

  try{

    
    
    const { rows }= await pool.query(query, [groupid,paidby,userid,details,amount]);
    const trnid = rows[0].trnid;


    for(item of splitinto){
      await pool.query(queryToAddOwned, [trnid,item]);
    }
   
        
    



  }
  catch (error){
    console.log(error)
    throw new Error(error);
  } 



 
 

   

  
 
      
      




}  
  



module.exports = data;