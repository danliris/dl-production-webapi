var Router = require('restify-router').Router;
var db = require("../../../db");
var ProductionOrder = require("dl-module").managers.sales.ProductionOrderManager;
var resultFormatter = require("../../../result-formatter");
var passport = require('../../../passports/jwt-passport');
const apiVersion = '1.0.0';


function getRouter() {
    var router = new Router();
    router.get("/:salesContractNo", passport, (request, response, next) => {
        db.get().then((db) => {
            var manager = new ProductionOrder(db, request.user);
            var salesContractNo = request.params.salesContractNo;

            var query = request.queryInfo;

            var filter = {
                _deleted: false,
                salesContractNo: salesContractNo 
            };

            query.filter = filter;

            manager.getSingleByQueryOrDefault(query.filter, query.select)
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
    return router;
}

module.exports = getRouter;