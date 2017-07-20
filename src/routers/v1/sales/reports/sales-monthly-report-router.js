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
            query.accept =request.headers.accept;
  
            manager.getSalesMonthlyReport(query)
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
                            item["No"] = index;
                            item["Sales"] = order._id.sales;
                            item["Januari"] = order.jan.toFixed(2);
                            item["Februari"] = order.feb.toFixed(2);
                            item["Maret"] = order.mar.toFixed(2);
                            item["April"] = order.apr.toFixed(2);
                            item["Mei"] = order.mei.toFixed(2);
                            item["Juni"] = order.jun.toFixed(2);
                            item["Juli"] = order.jul.toFixed(2);
                            item["Agustus"] = order.agu.toFixed(2);
                            item["September"] = order.sep.toFixed(2);
                            item["Oktober"] = order.okt.toFixed(2);
                            item["November"] = order.nov.toFixed(2);
                            item["Desember"] = order.des.toFixed(2);
                            item["Total"] = order.totalOrder.toFixed(2);
                            data.push(item);
                        }
                        var options = {
                            "No": "number",
                            "Sales": "string",
                            "Januari": "string",
                            "Februari": "string",
                            "Maret": "string",
                            "April": "string",
                            "Mei": "string",
                            "Juni": "string",
                            "Juli": "string",
                            "Agustus": "string",
                            "September": "string",
                            "Oktober": "string",
                            "November": "string",
                            "Desember": "string",
                            "Total": "string",
                        };
                        response.xls(`Sales Monthly Report.xlsx`, data, options);
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


/* SUKSES

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
            query.accept =request.headers.accept;
            if(!query.page){
                query.page=1;
            }if(!query.size){
                query.size=20;
            }
            manager.getSalesMonthlyReport(query)
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
                            item["Nomor Sales Contract"] = order.salesContractNo;
                            item["Tanggal Surat Order Produksi"] = moment(new Date(order._createdDate)).format(dateFormat);
                            item["Nomor Surat Order Produksi"] = order.orderNo;
                            item["Jenis Order"] = order.orderType;
                            item["Jenis Proses"] = order.processType;
                            item["Buyer"] = order.buyer;
                            item["Tipe Buyer"] = order.buyerType;
                            item["Jumlah Order"] = order.orderQuantity;
                            item["Satuan"] = order.uom;
                            item["Acuan Warna / Desain"] = order.colorTemplate;
                            item["Warna Yang Diminta"] = order.colorRequest;
                            item["Jenis Warna"] = order.colorType;
                            item["Jumlah"] = order.quantity;
                            item["Satuan Detail"] = order.uomDetail;
                            item["Tanggal Delivery"] = moment(new Date(order.deliveryDate)).format(dateFormat);
                            item["Staff Penjualan"] = `${firstname} ${lastname}`;
                            item["Status"] = order.status;
                            item["Detail"] = order.detail;
                            data.push(item);
                        }
                        var options = {
                            "No": "number",
                            "Nomor Sales Contract": "string",
                            "Tanggal Surat Order Produksi": "string",
                            "Nomor Surat Order Produksi": "string",
                            "Jenis Order": "string",
                            "Jenis Proses": "string",
                            "Buyer": "string",
                            "Tipe Buyer": "string",
                            "Jumlah Order": "number",
                            "Satuan": "string",
                            "Acuan Warna / Desain": "string",
                            "Warna Yang Diminta": "string",
                            "Jenis Warna": "string",
                            "Jumlah": "number",
                            "Satuan Detail": "string",
                            "Tanggal Delivery": "string",
                            "Staff Penjualan": "string",
                            "Status": "string",
                            "Detail": "string"
                        };
                        response.xls(`Sales Monthly Report.xlsx`, data, options);
                    // }
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
*/