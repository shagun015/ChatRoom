const jwt=require('jsonwebtoken');
const aceessTokenSecret=process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret=process.env.JWT_REFRESH_TOKEN_SECRET;
class TokenService {
  generateToken(payload){
    const aceessToken = jwt.sign(payload,aceessTokenSecret,{
      expiresIn:'1h'
    });
    const refreshToken = jwt.sign(payload,refreshTokenSecret,{
      expiresIn:'1y'
    });
    return {aceessToken, refreshToken};
  }
}

module.exports = new TokenService();