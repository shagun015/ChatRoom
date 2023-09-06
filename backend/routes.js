const router = require('express').Router();
const authControllers = require('./Controllers/auth-controller');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

router.post('/api/send-otp',authControllers.sendOtp);

router.post('/api/verify-otp',authControllers.verifyOtp);

module.exports=router;