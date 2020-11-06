const express = require("express");
const app = express();
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UserControllers");

const AdminAuth = require("../middleware/AdminAuth")

router.get('/', HomeController.index);
router.post('/user', AdminAuth, UserController.create);
router.get('/user', UserController.list);
router.get('/user/:id', AdminAuth, UserController.findUser);
router.put('/user', AdminAuth, UserController.update);
router.delete('/user/:id', AdminAuth, UserController.delete);
router.post('/recoverpass', UserController.recoverPass);
router.post('/changepassword', UserController.changePass);
router.post('/login', UserController.login);


module.exports = router;