var Router = require('restify-router').Router;
var db = require("../../../../db");
//var DailyOperationManager = require("dl-module").managers.production.finishingPrinting.DailyOperationManager;
var DailyOperationManager = require("dl-module").managers.production.finishingPrinting.PackingManager;
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
                return Promise.resolve(new DailyOperationManager(db, user));
            });
    };

    var router = new Router();

    router.get("/", passport, function (request, response, next) {
        var user = request.user;
        var query = request.query;
        query.order = Object.assign({}, defaultOrder, query.order);
        query.offset = request.timezoneOffset;
      
        var dailyOperationManager = {};
        getManager(user)
            .then((manager) => {
                dailyOperationManager = manager;
                return dailyOperationManager.getQcgudangReport(query);
            })
            .then(docs => {
                var result = resultFormatter.ok(apiVersion, 200, docs);
                return Promise.resolve(result);
            })
            .then((result) => {
                if ((request.headers.accept || '').toString().indexOf("application/xls") < 0) {
                    response.send(result.statusCode, result);    
                }
                else{
                            dailyOperationManager.getXlss(result, query)
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







// var Router = require('restify-router').Router;
// var db = require("../../../../db");
// var resultFormatter = require("../../../../result-formatter");
// const apiVersion = '1.0.0';
// var PurchaseOrderManager = require("dl-module").managers.production.finishingPrinting.PackingManager;
// var passport = require('../../../../passports/jwt-passport');

// function getRouter(){
//     var router = new Router();
//     router.get("/", passport, function(request, response, next) {
//         db.get().then(db => {
//             var manager = new PurchaseOrderManager(db, request.user);
//             var sdate = request.params.dateFrom;
//             var edate = request.params.dateTo;
//             var staff = request.params.staff;
//             var divisi = request.params.divisi;

//             var dateFormat = "DD/MM/YYYY";
//                     var dateFormat2 = "DD MMM YYYY";
//                     var locale = 'id-ID';
//                     var moment = require('moment');
//                     moment.locale(locale);
    
//             var offset = request.headers["x-timezone-offset"] ? Number(request.headers["x-timezone-offset"]) : 0;

 
                   
//             manager.getQcgudangReport(query)
//                 .then(docs => {

                    
//                     if ((request.headers.accept || '').toString().indexOf("application/xls") < 0) {
//                         var result = resultFormatter.ok(apiVersion, 200, docs);
//                         response.send(200, result);
//                     }
//                     else {

//                              var data = [];
//                              var jeneng = "";
//                             var index = 0;
//                                 for (var PO of docs) {
//                                 index++;
//                                 jeneng=PO.user;
//                                 var item = {
//                                         "No": index,
//                                         "Divisi": PO.divisi,
//                                         "Staff Pembelian": PO.user,
//                                         "No PR": PO._id.name,
//                                         "Nama Barang": PO.nmbarang,
//                                         "Supplier": PO.nmsupp,
//                                         "Tgl Terima PO Int": moment(new Date(PO.tglpoint)).add(offset, 'h').format(dateFormat),
//                                         "Tgl Terima PO Eks": moment(new Date(PO.tglpoeks)).add(offset, 'h').format(dateFormat),
//                                         "Selisih 1": PO.selisih2,
//                                         "Tgl Target Kedatangan": moment(new Date(PO.tgltarget)).add(offset, 'h').format(dateFormat),
//                                         "Tgl Kedatangan": moment(new Date(PO.tgldatang)).add(offset, 'h').format(dateFormat),
//                                         "Selisih 2": PO.selisih,
//                                         "Unit": PO.unit,                                    }
//                                 data.push(item);
//                             }
//                                 var options = {
//                             "No": "number",
//                             "Staff Pembelian": "string",
//                             "divisi": "string",
//                             "No PR": "string",
//                             "Nama Barang": "string",
//                             "Supplier": "string",
//                             "Tgl Terima PO Int": "string",
//                             "Tgl Terima PO Eks": "string",
//                             "Selisih 1": "string",
//                             "Tgl Target Kedatangan": "string",
//                             "Tgl Kedatangan": "string",
//                             "Selisih 2": "string",
//                             "unit": "string",
//                         };


                        
                        
//                             response.xls(`${jeneng}.xlsx`, data,options);
                          

                               
//                     }
//                 }).catch(e => {
//                     response.send(500, "gagal ambil data");
//                 });

//         }).catch(e => {
//             var error = resultFormatter.fail(apiVersion, 400, e);
//             response.send(400, error);
//         });
//     });
//     return router;
// }

// module.exports = getRouter;
