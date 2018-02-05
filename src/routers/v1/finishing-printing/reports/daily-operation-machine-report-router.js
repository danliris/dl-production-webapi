var Router = require('restify-router').Router;
var db = require("../../../../db");
var DailyOperationManager = require("dl-module").managers.production.finishingPrinting.DailyOperationManager;
var resultFormatter = require("../../../../result-formatter");

var passport = require('../../../../passports/jwt-passport');
const apiVersion = '1.0.0';

function getRouter() {

    var defaultOrder = {
        "_id.date": 1
    };

    var getManager = (user) => {
        return db.get()
            .then((db) => {
                return Promise.resolve(new DailyOperationManager(db, user));
            });
    };

    var router = new Router();

    router.get("/", passport, function (request, response, next) {
        var user = request.user;
        var query = request.query;

        query.order = Object.assign({}, query.order, typeof defaultOrder === "function" ? defaultOrder(request, response, next) : defaultOrder, query.order);


        var dailyOperationManager = {};
        getManager(user)
            .then((manager) => {
                dailyOperationManager = manager;
                return dailyOperationManager.getDailyMachine(query, request.timezoneOffset);
            })
            .then(docs => {
                var result = resultFormatter.ok(apiVersion, 200, docs);
                // delete docs.data;
                result.info = docs.info;
                result.summary = docs.summary;
                // response.send(200, result);
                return Promise.resolve(result);
            })
            .then((result) => {
                if ((request.headers.accept || '').toString().indexOf("application/xls") < 0) {
                    response.send(result.statusCode, result);
                }
                else {
                    dailyOperationManager.getXlsDailyMachine(result, query, request.timezoneOffset)
                        .then(xls => {
                            response.xls(xls.name, xls.data, xls.options)
                        });
                }
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
