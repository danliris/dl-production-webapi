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

            var query = request.queryInfo;
            query.accept = request.headers.accept;
            if (!query.page) {
                query.page = 1;
            } if (!query.size) {
                query.size = 20;
            }
            manager.getReport(query)
                .then(docs => {
                    var dateFormat = "DD MMM YYYY";
                    var locale = 'id';
                    var moment = require('moment');
                    moment.locale(locale);
                    if ((request.headers.accept || '').toString().indexOf("application/xls") < 0) {
                        for (var a in docs.data) {
                            docs.data[a]._createdDate = moment(new Date(docs.data[a]._createdDate)).format(dateFormat);
                            docs.data[a].deliveryDate = moment(new Date(docs.data[a].deliveryDate)).format(dateFormat);
                        }
                        // var result = resultFormatter.ok(apiVersion, 200, docs);

                        var result = resultFormatter.ok(apiVersion, 200, docs.data);
                        delete docs.data;
                        result.info = docs;
                        response.send(200, result);
                    } else {
                        var index = 0;
                        var data = [];
                        for (var order of docs.data) {
                            index++;
                            var item = {};
                            var firstname = "";
                            var lastname = "";
                            if (order.firstname) firstname = order.firstname;
                            if (order.lastname) lastname = order.lastname;
                            item["No"] = index;
                            item["Status"] = order.status;
                            item["Detail"] = order.detail;
                            item["Nomor SPP"] = order.orderNo;
                            item["Panjang SPP (M)"] = order.orderQuantity;
                            item["Jenis Order"] = order.orderType;
                            item["Jenis Proses"] = order.processType;
                            item["Konstruksi"] = order.construction;
                            item["Motif"] = order.designCode;
                            item["Hasil Matching"] = order.colorTemplate;
                            item["CW"] = order.colorRequest;
                            // item["Jumlah di Surat Perintah Produksi (meter)"] = order.quantity;
                            item["Buyer"] = order.buyer;
                            item["Tipe Buyer"] = order.buyerType;
                            item["Staff Penjualan"] = order.staffName;
                            item["Tanggal Terima Order"] = moment(new Date(order._createdDate)).format(dateFormat);
                            item["Tanggal Permintaan Pengiriman"] = moment(new Date(order.deliveryDate)).format(dateFormat);
                            data.push(item);
                        }
                        var options = {
                            "No": "number",
                            "Panjang SPP (M)": "number",
                            "Nomor SPP": "string",
                            "Jenis Order": "string",
                            "Jenis Proses": "string",
                            "Konstruksi": "string",
                            "Motif": "string",
                            // "Jumlah di Surat Perintah Produksi (meter)": "number",
                            "Buyer": "string",
                            "Tipe Buyer": "string",
                            "Staff Penjualan": "string",
                            "Tanggal Terima Order": "string",
                            "Tanggal Permintaan Pengiriman": "string",
                            "Status": "string",
                            "Detail": "string",
                            "Hasil Matching": "string",
                            "CW": "string"
                        };
                        response.xls(`MONITORING SURAT ORDER PRODUKSI.xlsx`, data, options);
                    }
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