const express=require("express")
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController")
const router=express.Router();
const{isAutheticatedUser,authorizeRoles}= require('../middleware/Auth') 


router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/logout').get(logout)
router.route('/me').get(isAutheticatedUser,getUserDetails)
router.route('/password/update').put(isAutheticatedUser,updatePassword)
router.route('/me/updateProfile').put(isAutheticatedUser,updateProfile)
router.route('/admin/users').get(isAutheticatedUser,authorizeRoles("admin"),getAllUser)
router.route('/admin/users/:id').get(isAutheticatedUser,authorizeRoles("admin"),getSingleUser).put(isAutheticatedUser,authorizeRoles("admin"),updateUserRole).delete(isAutheticatedUser,authorizeRoles("admin"),deleteUser)
module.exports=router; 