const apiVersion = '1.0.0';
var Manager = require("dl-module").managers.sales.ProductionOrderManager;
var resultFormatter = require("../../../result-formatter");
var db = require("../../../db");
var JwtRouterFactory = require("../../jwt-router-factory");

var passport = require("../../../passports/jwt-passport");

var handlePdfRequest = function (request, response, next) {
    var user = request.user;
    var id = request.params.id;
    var manager;
    db.get()
        .then((db) => {
            manager = new Manager(db, user);
            return manager.getSingleByIdOrDefault(id);
        })
        .then((productionOrder) => {
            manager.pdf(productionOrder._id)
                .then((productionOrderDocBinary) => {
                    response.writeHead(200, {
                        "Content-Type": "application/pdf",
                        "Content-Disposition": `attachment; filename=${productionOrder.orderNo}.pdf`,
                        "Content-Length": productionOrderDocBinary.length
                    });
                    response.end(productionOrderDocBinary);
                })
                .catch((e) => {
                    var error = resultFormatter.fail(apiVersion, 400, e);
                    response.send(400, error);
                })
        })
}

function getRouter() {
    var router = JwtRouterFactory(Manager, {
        version: apiVersion,
        defaultOrder: {
            "_updatedDate": -1
        }
    });

    var getManager = (user) => {
        return db.get()
            .then((db) => {
                return Promise.resolve(new Manager(db, user));
            });
    };

    var route = router.routes["get"].find((route) => route.options.path === "/:id");
    var originalHandler = route.handlers[route.handlers.length - 1];
    route.handlers[route.handlers.length - 1] = function (request, response, next) {
        var isPDFRequest = (request.headers.accept || "").toString().indexOf("application/pdf") >= 0;
        if (isPDFRequest) {
            next()
        }
        else {
            originalHandler(request, response, next);
        }
    };
    route.handlers.push(handlePdfRequest);

    //Update is completed
    router.put("/update/is-completed", passport, (request, response, next) => {
        var user = request.user;
        var data = request.body;

        getManager(user)
            .then((manager) => {
                return manager.updateIsCompleted(data)
                    .then((id) => {
                        var result;
                        if (!id[0]) {
                            result = resultFormatter.fail(apiVersion, 404, new Error("data not found"));
                            return Promise.resolve(result);
                        }
                        else {
                            result = resultFormatter.ok(apiVersion, 204);
                            return Promise.resolve(result);
                        }
                    });
            })
            .then((result) => {
                response.send(result.statusCode, result);
            })
            .catch((e) => {
                var statusCode = 500;
                if (e.name === "ValidationError")
                    statusCode = 400;
                var error = resultFormatter.fail(apiVersion, statusCode, e);
                response.send(statusCode, error);
            });
    });

    //Update is requested
    router.put("/update/is-requested", passport, (request, response, next) => {
        var user = request.user;
        var data = request.body;

        getManager(user)
            .then((manager) => {
                return manager.updateIsRequested(data)
                    .then((id) => {
                        var result;
                        if (!id) {
                            result = resultFormatter.fail(apiVersion, 404, new Error("data not found"));
                            return Promise.resolve(result);
                        }
                        else {
                            result = resultFormatter.ok(apiVersion, 204);
                            return Promise.resolve(result);
                        }
                    });
            })
            .then((result) => {
                response.send(result.statusCode, result);
            })
            .catch((e) => {
                var statusCode = 500;
                if (e.name === "ValidationError")
                    statusCode = 400;
                var error = resultFormatter.fail(apiVersion, statusCode, e);
                response.send(statusCode, error);
            });
    });

    //Update distributed quantity
    router.put("/update/distributed-quantity", passport, (request, response, next) => {
        var user = request.user;
        var data = request.body.data;

        getManager(user)
            .then((manager) => {
                return manager.updateDistributedQuantity(data)
                    .then((arr) => {
                        var result;
                        if (!arr[0]) {
                            result = resultFormatter.fail(apiVersion, 404, new Error("data not found"));
                            return Promise.resolve(result);
                        }
                        else {
                            result = resultFormatter.ok(apiVersion, 204);
                            return Promise.resolve(result);
                        }
                    });
            })
            .then((result) => {
                response.send(result.statusCode, result);
            })
            .catch((e) => {
                var statusCode = 500;
                if (e.name === "ValidationError")
                    statusCode = 400;
                var error = resultFormatter.fail(apiVersion, statusCode, e);
                response.send(statusCode, error);
            });
    });
    return router;
}

module.exports = getRouter;