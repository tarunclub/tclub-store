const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  changePassword,
  updateUserDetails,
  adminAllUsers,
  managerAllUsers,
  adminGetUser,
  adminUpdateUserDetails,
  adminDeleteUserDetails,
} = require("../controllers/user");
const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/userdashboard").get(isLoggedIn, getUserDetails);
router.route("/password/update").put(isLoggedIn, changePassword);
router.route("/user/update").put(isLoggedIn, updateUserDetails);

router
  .route("/admin/users")
  .get(isLoggedIn, customRole("admin"), adminAllUsers);

router
  .route("/admin/user/:id")
  .get(isLoggedIn, customRole("admin"), adminGetUser)
  .put(isLoggedIn, customRole("admin"), adminUpdateUserDetails)
  .delete(isLoggedIn, customRole("admin"), adminDeleteUserDetails);

router
  .route("/manager/users")
  .get(isLoggedIn, customRole("manager"), managerAllUsers);

module.exports = router;
