const OtpService = require('../services/otp-service');
const hashService = require('../services/hash-service');
const UserService = require('../services/user-service');
const TokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dtos');
const tokenService = require('../services/token-service');
const userService = require('../services/user-service');

class AuthController{
  async sendOtp(req,res){
 

    const { phone } = req.body;
    if(!phone){
      return res.status(400).json({ error: 'Phone number is missing in the request body' });

    }
    //otp generation
    const otp = await OtpService.generateOtp();

    //hashed data
    const ttl=1000*60*2; //2min
    const expires=Date.now() +ttl;
    const data = `${phone}.${otp}.${expires}`;
    const hash = hashService.hashOtp(data);

    // send otp 
    try {
      //await OtpService.sendBySms(phone,otp);
      
      res.json({
        hash:`${hash}.${expires}`,
        phone,
        otp
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'message sending failed'
      });
    }
  }

  //verify otp
  async verifyOtp(req,res){
    const {otp,hash,phone} = req.body;
    if(!phone||!otp||!hash){
      res.status(400).json({message:'all field are required'});
    }
    const [hashOtp,expires] = hash.split('.');
    if(Date.now>+expires){
      res.status(400).json({message:'otp expired'});
    }
    const data=`${phone}.${otp}.${expires}`;

    const isValid = await OtpService.verifyOtp(hashOtp,data);
    
    if(!isValid){
      
      res.status(400).json({message:'invalid otp'});
    }


    //database user search


    let user;
    try{
      user=await UserService.findUser({phone});
      if(!user){
        user=await UserService.createUser({phone});
      }
    }
    catch(err){
      console.log(err);
      res.status(500).json({message: 'Db error'})
    }

    //tokens
    const {accessToken, refreshToken}=TokenService.generateToken({_id:user._id,activated:false});
    
    await TokenService.storeRefreshToken(refreshToken,user._id);

    console.log(accessToken);
    res.cookie('refreshToken',refreshToken,{
      maxAge: 1000*60*60*24*30,
      httpOnly: true
    })
    res.cookie('accessToken',accessToken,{
      maxAge: 1000*60*60*24*30,
      httpOnly: true
    })

    
    const userDto = new UserDto(user)
    res.json({user:userDto, auth:true});
  }

  async refresh(req,res){
    //get refresh token from cookies
    const {refreshToken: refreshTokenFromCookies} = req.cookies; //refreshTokenFromCookies alias of refreshToken

    //check if token is valid
    let userData;
    try {
      userData = await tokenService.verifyRefreshToken(refreshTokenFromCookies);
      //console.log(userData);
    } catch (err) {
      return res.status(401).json({message:'Invalid Token'});
    }

    // check if token is in db
    try {
      const token = await tokenService.findRefreshToken(
        userData._id,
        refreshTokenFromCookies);
      if(!token){
        return res.status(401).json({message:"Refresh token not found"});
      }
    } catch (err) {
      return res.status(500).json({message:'Internal error from refresh'});
    }

    //check if valid user 
    const user = await userService.findUser({_id: userData._id});

    
    if(!user){
      return res.status(404).json({message:'No user'});
    }

    //generate new tokens
    const {refreshToken,accessToken} = tokenService.generateToken({_id: userData._id});

    //update refresh token
    try{
      await tokenService.updateRefreshToken(user._id,refreshToken);
    }
    catch(err){
      return res.status(500).json({message:'Internal errorss'});
    }

    //put in cookies
    res.cookie('refreshToken',refreshToken,{
      maxAge: 1000*60*60*24*30,
      httpOnly: true
    })
    res.cookie('accessToken',accessToken,{
      maxAge: 1000*60*60*24*30,
      httpOnly: true
    })

    //response
    const userDto = new UserDto(user)
    console.log(userDto);
    res.json({user:userDto, auth:true});

  }

  async logout(req,res){
    const { refreshToken }= req.cookies;
    //delete refresh token from db

    await tokenService.removeToken(refreshToken)
    //delete token from cookie

    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');


    res.json({user: null,auth: false});
  }
}

module.exports = new AuthController();