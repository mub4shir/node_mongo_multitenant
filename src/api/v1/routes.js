const express = require("express");

// connection resolver for tenant
const connectionResolver = require("../../middlewares/connectionResolver");

// Mounting routes
const v1Routes = express.Router();

const { protect, authorize } = require("../../middlewares/auth");

v1Routes.use(protect);
v1Routes.use(authorize("admin"));
v1Routes.use("/tenant", connectionResolver.resolveTenant);
v1Routes.use("/admin", connectionResolver.setAdminDb);

// admin
const adminApi = require("./admin");
v1Routes.post("/admin/tenant", adminApi.create);
v1Routes.get("/admin/tenant", adminApi.fetchAll);

// user
const userApi = require("./user");
v1Routes.post("/tenant/user", userApi.signUp);
v1Routes.get("/tenant/user", userApi.fetchAll);
v1Routes
  .route("/tenant/user/:id")
  .get(userApi.fetchOne)
  .put(userApi.updateOne)
  .delete(userApi.deleteOne);

// auth
const authApi = require("./auth");
v1Routes.post("/tenant/user/register", authApi.registerUser);
v1Routes.post("/tenant/user/login", authApi.userLogin);

module.exports = v1Routes;
