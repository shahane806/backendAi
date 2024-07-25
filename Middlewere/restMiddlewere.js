const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middlewere = async (req,res,next)=>{
    let decodeToken = jwt.decode(req?.headers?.authToken);
    const { email , password } = req?.headers;
    const decodeUsername = decodeToken?.username;
    let decodeHashedPassword = decodeToken?.password;
    if(email == decodeUsername && await bcryptjs.compare(password,decodeHashedPassword)){
        next();
    }else{
        res?.status(500).send("something went wrong...")
    }
    
}
module.exports = middlewere