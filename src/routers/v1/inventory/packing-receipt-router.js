var Manager = require("dl-module").managers.inventory.finishingPrinting.FPPackingReceiptManager;
var JwtRouterFactory = require("../../jwt-router-factory");
var resultFormatter = require("../../../result-formatter");
var db = require("../../../db");
const apiVersion = '1.0.0';


function getRouter() {
    var router = JwtRouterFactory(Manager, {
        version: apiVersion,
        defaultOrder: {
            "_updatedDate": -1
        }
    });
    return router;
}

module.exports = getRouter;
