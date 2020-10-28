const express = require("express")
const app = express();
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UserControllers")

router.get('/', HomeController.index);
router.post('/user', UserController.create)
router.get('/user', UserController.list)
router.get('/user/:id', UserController.findUser)
router.put('/user', UserController.update)
router.delete('/user/:id', UserController.delete)


module.exports = router;