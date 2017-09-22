var Router = require('restify-router').Router;
var db = require("../../../../db");
var ProductionOrderManager = require("dl-module").managers.sales.ProductionOrderManager;
var resultFormatter = require("../../../../result-formatter");
var passport = require('../../../../passports/jwt-passport');
const apiVersion = '1.0.0';

function getRouter() {
    var router = new Router();
    router.get("/", passport, function (request, response, next) {
        db.get().then(db => {
            var manager = new ProductionOrderManager(db, request.user);

            var salesContractNo = request.params.salesContractNo || "";

            manager.getDetailReport(salesContractNo)
                .then(data => {
                    var dateFormat = "DD MMM YYYY";
                    var locale = 'id';
                    var moment = require('moment');
                    moment.locale(locale);
                    var result = resultFormatter.ok(apiVersion, 200, data);
                    response.send(200, result);
                })
                .catch(e => {
                    response.send(500, "gagal ambil data");
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