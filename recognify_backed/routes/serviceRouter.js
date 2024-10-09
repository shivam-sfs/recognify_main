const express = require("express");
const { middleware } = require("../helper/middleware/authentication");
const serviceRouter = express.Router();

serviceRouter.get("/", middleware, list);
serviceRouter.get("/:id", middleware, get);
serviceRouter.post("/update:id", middleware, create);
serviceRouter.put("/update:id", middleware, update);
serviceRouter.delete("/delete:id", middleware, deleteItem);
serviceRouter.patch("/restore:id", middleware, restore);

module.exports = serviceRouter;
