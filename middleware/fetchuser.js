import jwt from 'jsonwebtoken';
import becrypt from 'bcryptjs';

const JWT_SECRET = "parjwalcode$forinotebook";

const fetchuser = (req,res,next)=>{
  // get the user from the jwt token and add id to req object
  const token = req.header('auth-token');
  if(!token){
    return res.status(401).send({error:"Please authenticate using a valid token"});
  }

  try {
    const data = jwt.verify(token,JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(401).send({error:"Please authenticate using a valid token"});
  }
  
}
export default fetchuser;