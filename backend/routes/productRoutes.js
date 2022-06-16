const express=require("express");
const { getAllProduct,createProduct, updateProduct, deleteProduct,getProductDetail, createProductReview, getProductReview, deleteRrview} = require("../controllers/productController");
const { isAutheticatedUser,authorizeRoles } = require("../middleware/Auth");

const router=express.Router();

router.route('/products').get(getAllProduct)
router.route('/products/new').post(isAutheticatedUser,authorizeRoles("admin"),createProduct)
router.route('/products/:id').put(isAutheticatedUser,authorizeRoles("admin"),updateProduct).delete(isAutheticatedUser,authorizeRoles("admin"),deleteProduct).get(getProductDetail)
router.route('/review').put(isAutheticatedUser,createProductReview)
router.route('/reviews').get(getProductReview).delete(isAutheticatedUser,deleteRrview)




module.exports=router;