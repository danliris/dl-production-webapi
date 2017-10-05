var Manager = require("dl-module").managers.production.finishingPrinting.KanbanManager;
var JwtRouterFactory = require("../../jwt-router-factory");
var resultFormatter = require("../../../result-formatter");
var db = require("../../../db");
var passport = require("../../../passports/jwt-passport");
const apiVersion = '1.0.0';

var handlePdfRequest = function (request, response, next) {
    var user = request.user;
    var id = request.params.id;
    var manager;
    db.get()
        .then(db => {
            manager = new Manager(db, user);
            return manager.getSingleByIdOrDefault(id);
        })
        .then((kanban) => {
            var filename = kanban.productionOrder.orderNo + " - " + kanban.cart.cartNumber;
            manager.pdf(kanban)
                .then(kanbanDocBinary => {
                    response.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `attachment; filename=${filename}.pdf`,
                        'Content-Length': kanbanDocBinary.length
                    });
                    response.end(kanbanDocBinary);
                })
                .catch(e => {
                    var error = resultFormatter.fail(apiVersion, 400, e);
                    response.send(400, error);
                });
        });
};

function getRouter() {
    var router = JwtRouterFactory(Manager, {
        version: apiVersion,
        defaultOrder: {
            "_updatedDate": -1
        }
    });

    var route = router.routes["get"].find(route => route.options.path === "/:id");
    var originalHandler = route.handlers[route.handlers.length - 1];
    route.handlers[route.handlers.length - 1] = function (request, response, next) {
        var isPDFRequest = (request.headers.accept || '').toString().indexOf("application/pdf") >= 0;
        if (isPDFRequest) {
            next();
        }
        else {
            originalHandler(request, response, next);
        }
    };
    route.handlers.push(handlePdfRequest);

    router.get("/read/visualization", passport, function (request, response, next) {
        var user = request.user;
        var query = request.query;

        query.filter = query.filter;
        query.select = query.select;
        query.order = query.order;

        db.get()
            .then(db => {
                manager = new Manager(db, user);
                return manager.readVisualization(query);
            })
            .then(docs => {
                var result = resultFormatter.ok(apiVersion, 200, docs.data);
                delete docs.data;
                result.info = docs;
                return Promise.resolve(result);
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

    router.put("/complete/:id", passport, (request, response, next) => {
        var user = request.user;
        var id = request.params.id;

        db.get()
            .then(db => {
                return Promise.resolve(new Manager(db, user));
            })
            .then((manager) => {
                return manager.getSingleByIdOrDefault(id)
                    .then((doc) => {
                        var result;
                        if (!doc) {
                            result = resultFormatter.fail(apiVersion, 404, new Error("data not found"));
                            return Promise.resolve(result);
                        }
                        else {
                            return manager.updateIsComplete(id)
                                .then((docId) => {
                                    result = resultFormatter.ok(apiVersion, 204);
                                    return Promise.resolve(result);
                                });
                        }
                    });
            })
            .then((result) => {
                response.send(result.statusCode, result);
            })
            .catch((e) => {
                var statusCode = 500;
                var error = resultFormatter.fail(apiVersion, statusCode, e);
                response.send(statusCode, error);
            });
    });

    return router;
}

module.exports = getRouter;
