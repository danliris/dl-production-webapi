var Router = require('restify-router').Router;
var db = require("../../../../db");
var KanbanManager = require("dl-module").managers.production.finishingPrinting.KanbanManager;
var resultFormatter = require("../../../../result-formatter");

var passport = require('../../../../passports/jwt-passport');
const apiVersion = '1.0.0';

function getRouter() {

    var defaultOrder = {
        "_updatedDate": -1
    };

    var getManager = (user) => {
        return db.get()
            .then((db) => {
                return Promise.resolve(new KanbanManager(db, user));
            });
    };

    var router = new Router();

    router.get("/", passport, function (request, response, next) {
        var user = request.user;
        var query = request.query;
        var kanbanManager = {};

        getManager(user)
            .then((manager) => {
                kanbanManager = manager;
                return kanbanManager.getMachineQueueReport(query, request.timezoneOffset);
            })
            .then(docs => {
                var result = resultFormatter.ok(apiVersion, 200, docs);
                return Promise.resolve(result);
            })
            .then((result) => {
                if ((request.headers.accept || '').toString().indexOf("application/xls") < 0) {
                    response.send(result.statusCode, result);
                }
                else {
                    kanbanManager.getMachineQueueXls(result, query)
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