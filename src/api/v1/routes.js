const express = require("express");

// connection resolver for tenant
const connectionResolver = require("../../middlewares/connectionResolver");

// Mounting routes
const v1Routes = express.Router({ mergeParams: true });

const { protect, authorize } = require("../../middlewares/auth");

v1Routes.use("/tenant", connectionResolver.resolveTenant);
v1Routes.use("/admin", connectionResolver.setAdminDb);
// v1Routes.use(protect);
// v1Routes.use(authorize("admin"));
//protect, authorize("admin"),
// admins
const adminApi = require("./admin");
v1Routes.post("/admin/tenant", protect, adminApi.create);
v1Routes.get("/admin/tenant", protect, adminApi.fetchAll);

// user
const userApi = require("./user");
v1Routes.post("/tenant/user", protect, authorize("admin"), userApi.signUp);
v1Routes.get("/tenant/user", protect, authorize("admin"), userApi.fetchAll);
v1Routes
  .route("/tenant/user/:id")
  .get(protect, authorize("admin"), userApi.fetchOne)
  .put(protect, authorize("admin"), userApi.updateOne)
  .delete(protect, authorize("admin"), userApi.deleteOne);

// auth
const authApi = require("./auth");
v1Routes.post("/tenant/auth/register", authApi.registerUser);
v1Routes.post("/tenant/auth/login", authApi.userLogin);
v1Routes.get("/tenant/auth/logout", authApi.userLogout);
v1Routes.get("/tenant/auth/me", protect, authApi.getUser);
module.exports = v1Routes;
