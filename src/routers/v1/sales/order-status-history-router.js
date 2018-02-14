const Router = require('restify-router').Router;
const db = require("../../../db");
const OrderStatusHistory = require("dl-module").managers.sales.OrderStatusHistoryManager;
const resultFormatter = require("../../../result-formatter");
const passport = require('../../../passports/jwt-passport');
const apiVersion = '1.0.0';

function getRouter() {
    const router = new Router();

    router.get("/", passport, (request, response, next) => {
        db.get().then((db) => {
            const manager = new OrderStatusHistory(db, request.user);
            let salesContracts = request.queryInfo.salesContracts;

            manager.read(salesContracts)
                .then((docs) => {
                    var result = resultFormatter.ok(apiVersion, 200, docs);
                    result.info = docs;
                    response.send(200, result);
                })
                .catch(e => {
                    var result = resultFormatter.ok(apiVersion, 200, e);
                    result.info = e;
                    response.send(200, result);
                });
        })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            });
    });

    router.post("/", passport, (request, response, next) => {
        const user = request.user;
        const data = request.body;

        db.get()
            .then((db) => {
                const manager = new OrderStatusHistory(db, request.user);
                manager.create(data)
                    .then((docId) => {
                        response.header("Location", `${request.url}/${docId.toString()}`);
                        var result = resultFormatter.ok(apiVersion, 201);
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
    });

    return router;
}

module.exports = getRouter;