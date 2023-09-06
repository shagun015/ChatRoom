const OtpService = require('../services/otp-service');
const hashService = require('../services/hash-service');
const UserService = require('../services/user-service');
const TokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dtos');

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

    const isValid = OtpService.verifyOtp(hashOtp,data);
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
    const {aceessToken, refreshToken}=TokenService.generateToken({_id:user._id,activated:false});
    res.cookie('refresh',refreshToken,{
      maxAge: 1000*60*60*24*30,
      httpOnly: true
    })

    const userDto = new UserDto(user)
    res.json({aceessToken,user:userDto});
  }
}

module.exports = new AuthController();