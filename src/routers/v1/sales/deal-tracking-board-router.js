var Manager = require("dl-module").managers.sales.DealTrackingBoardManager;
var JwtRouterFactory = require("../../jwt-router-factory");
const apiVersion = '1.0.0';

function getRouter() {
    var router = JwtRouterFactory(Manager, {
        version: apiVersion,
        defaultOrder: {
            "_createdDate": 1
        }
    });
    return router;
}
module.exports = getRouter;
