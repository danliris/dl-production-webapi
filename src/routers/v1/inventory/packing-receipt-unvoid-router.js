var Router = require('restify-router').Router;
var Manager = require("dl-module").managers.inventory.finishingPrinting.FPPackingReceiptManager;
var JwtRouterFactory = require("../../jwt-router-factory");
var resultFormatter = require("../../../result-formatter");
var db = require("../../../db");
var passport = require('../../../passports/jwt-passport');
const apiVersion = '1.0.0';


function getRouter() {
    var router = new Router();
    router.get("/", passport, (request, response, next) => {
        db.get().then(db => {
            var manager = new Manager(db, request.user);

            var query = request.queryInfo;

            var filter = {
                "_deleted": false,
                "isVoid": false
            };

            var order = {
                "_updatedDate": -1
            }

            query.filter = filter;
            query.order = order;

            manager.read(query)
                .then(docs => {
                    var result = resultFormatter.ok(apiVersion, 200, docs.data);
                    delete docs.data;
                    result.info = docs;
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
