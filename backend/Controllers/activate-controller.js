const { Buffer } = require('buffer');
const Jimp = require('jimp');
const path = require('path');
const userDto = require('../dtos/user-dtos');
const userService = require('../services/user-service');
class ActivateController{
  async activate(req,res) {
    const {name,avatar} = req.body;
    if(!name || !avatar){
      return res.status(400).json({message: 'all fields are required'});
      
    }

  
    const dataUrlPattern = /^data:image\/(png|jpg|jpeg);base64,/;

    const imageDataUrl = avatar.match(dataUrlPattern);
    
    const imageFormat = imageDataUrl[1];
    const base64Data = avatar.replace(dataUrlPattern, '');
    const buffer = Buffer.from(base64Data, 'base64');
  
    const imagePath = `${Date.now()}-${Math.round(
      Math.random()*1e9
    )}.png`
    
    try{
      const jimResp = await Jimp.read(buffer);
      jimResp
        .resize(150,Jimp.AUTO)
        .write(path.resolve(__dirname,`../storage/${imagePath}`));
    }
    catch(err) {
      console.error(err);
      return res.status(500).json({message: 'could not process the image'});
      
    }

    //update 
    const userId = req.user._id
    try {
      const user = await userService.findUser({_id: userId});

      if(!user){
        return res.status(404).json({ message: 'User not found'});
        
      }

      user.activated = true;
      user.name = name;
      user.avatar = `/storage/${imagePath}`;
      user.save();
      res.json({ user: new userDto(user),auth :true});
    } catch (err) {
      console.error(err);
      return res.status(500).json({message: 'something went wrong'});
      
    }
    
  }
}

module.exports = new ActivateController();