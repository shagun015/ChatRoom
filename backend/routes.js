const router = require('express').Router();
const authControllers = require('./Controllers/auth-controller');
const activateControllers = require('./Controllers/activate-controller');
const bodyParser = require('body-parser');
const authMiddleware = require('./middlewares/auth-middleware');
const roomsController = require('./Controllers/rooms-controller');
router.use(bodyParser.json());

router.post('/api/send-otp',authControllers.sendOtp);

router.post('/api/verify-otp',authControllers.verifyOtp);

router.post('/api/activate',authMiddleware ,activateControllers.activate);

router.get('/api/refresh',authControllers.refresh);

router.post('/api/logout',authMiddleware, authControllers.logout);

router.post('/api/rooms',authMiddleware,roomsController.create);

router.get('/api/rooms',authMiddleware,roomsController.index);

module.exports=router;