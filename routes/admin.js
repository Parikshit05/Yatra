const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const adminController = require("../controllers/admin");
const { isLoggedIn } = require("../middleware");

router.get("/", isLoggedIn, wrapAsync(adminController.showAdminDashboard));

router.get("/:id/add-room", isLoggedIn, wrapAsync(adminController.addRoomForm));

router.post("/:id/add-room", isLoggedIn, wrapAsync(adminController.addRoom));

router.get("/:id", isLoggedIn, wrapAsync(adminController.showListing));

module.exports = router;