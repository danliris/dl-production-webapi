var Manager = require("dl-module").managers.production.finishingPrinting.DailyOperationManager;
var JwtRouterFactory = require("../../jwt-router-factory");
const apiVersion = '1.0.0';

function getRouter() {
    var router = JwtRouterFactory(Manager, {
        version: apiVersion,
    });
    return router;
}
module.exports = getRouter;