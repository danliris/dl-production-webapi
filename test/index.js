function test(name, path) {
    describe(name, function() {
        require(path);
    });
}


before("initialize server", function(done) {
    var server = require("../server");
    server()
        .then((server) => {
            const apiVersion = '1.0.0';

            var Router = require('restify-router').Router;
            var router = new Router();
            var resultFormatter = require("../src/result-formatter");
            var passport = require('../src/passports/local-passport');

            router.post('/', passport, (request, response, next) => {
                var account = request.user;

                var jwt = require("jsonwebtoken");
                var token = jwt.sign({
                    username: account.username,
                    profile: account.profile,
                    roles: account.roles
                }, process.env.AUTH_SECRET);

                var result = resultFormatter.ok(apiVersion, 200, token);
                response.send(200, result);
            });

            router.applyRoutes(server, "/authenticate");
            server.listen(process.env.PORT, process.env.IP);
            console.log(`server created at ${process.env.IP}:${process.env.PORT}`);

            done();
        });
});


describe('@dl-production-webapi', function() {
    this.timeout(2 * 60000); 
    //Production
    test("/v1/finishing-printing/monitoring-events", "./routes/production/finishing-printing/monitoring-event");
    test("/v1/finishing-printing/monitoring-specification-machine", "./routes/production/finishing-printing/monitoring-specification-machine");
    test("/v1/finishing-printing/kanbans", "./routes/production/finishing-printing/kanban");
    test("/v1/finishing-printing/daily-operations", "./routes/production/finishing-printing/daily-operation");
    test("/v1/finishing-printing/quality-control/fabrics", "./routes/production/finishing-printing/fabric-quality-control");
    test("/v1/finishing-printing/quality-control/packings", "./routes/production/finishing-printing/packing"); 
    test("/v1/inventory/packing-receipts", "./routes/inventory/packing-receipt"); 
    test("/v1/finishing-printing/quality-control/inspection-lot-colors", "./routes/production/finishing-printing/inspection-lot-color"); 
    test("/v1/sales/deal-tracking-boards", "./routes/sales/deal-tracking-board");
    test("/v1/sales/deal-tracking-stages", "./routes/sales/deal-tracking-stage");
    test("/v1/sales/deal-tracking-deals", "./routes/sales/deal-tracking-deal");
    test("/v1/sales/deal-tracking-activities", "./routes/sales/deal-tracking-activity");
});
