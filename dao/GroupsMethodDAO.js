const dbPool = require('../db_connection/dbpool');

var data ={};


data.addGroups =async (userid,groupname,membersList)=>{

    const pool= await dbPool.pool;
    

    const queryMainGroup="insert into  equisplitschema.mstgroups(groupname, ownerid, creationdate, isactive) "+
    "values($1,$2,CURRENT_TIMESTAMP,true) RETURNING groupid";

    const queryGroupMembers= " insert into equisplitschema.mstgroupsmember(groupid, memberid, addedby, addeddate)"+
    " values($1,$2,$3,CURRENT_TIMESTAMP)";

    try{
        const { rows }=await pool.query(queryMainGroup, [groupname,userid] );

        const groupid = rows[0].groupid;

        await pool.query(queryGroupMembers, [groupid,userid, userid] );


        membersList.forEach(async (element) => {

           
            await pool.query(queryGroupMembers, [groupid,element, userid] );
            
        });



    }
    catch (error){
        console.log(error)
        throw new Error(error);
      }



}


data.getGroups =async (userid)=>{

    const pool= await dbPool.pool;
    

    const query="select a.groupid groupid, b.groupname groupname from equisplitschema.mstgroupsmember a "+
    " left join equisplitschema.mstgroups b on a.groupid=b.groupid "+
    " where a.memberid=$1 "+
    " order by groupname";

    

    try{
      

        const results=await pool.query(query, [userid] );


        return results.rows;
            
        }
        catch (error){
        console.log(error)
        throw new Error(error);
      }



}




data.getOneGroupDetails = async (groupid)=>{

    const pool= await dbPool.pool;
    

    const query="select a.groupid groupid, a.groupname groupname, b.memberid memberid, c.firstname firstname,"+
    " c.lastname lastname, c.emailid emailid"+
    " from equisplitschema.mstgroups a, equisplitschema.mstgroupsmember b, "+
    " equisplitschema.mstusers c "+
    " where a.groupid=$1 and a.groupid =b.groupid and b.memberid=c.userid ";

    

    try{
      

        const results=await pool.query(query, [groupid] );


        return results.rows;
            
        }
        catch (error){
        console.log(error)
        throw new Error(error);
      }
}

module.exports = data;