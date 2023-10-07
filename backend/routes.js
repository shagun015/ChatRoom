const router = require('express').Router();
const authControllers = require('./Controllers/auth-controller');
const activateControllers = require('./Controllers/activate.controller');
const bodyParser = require('body-parser');
const authMiddleware = require('./middlewares/auth-middleware');
router.use(bodyParser.json());

router.post('/api/send-otp',authControllers.sendOtp);

router.post('/api/verify-otp',authControllers.verifyOtp);

router.post('/api/activate',authMiddleware ,activateControllers.activate);

router.get('/api/refresh',authControllers.refresh);

router.post('/api/logout',authMiddleware, authControllers.logout);

module.exports=router;