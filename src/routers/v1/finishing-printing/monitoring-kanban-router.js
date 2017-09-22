var Router = require('restify-router').Router;
var db = require("../../../db");
var KanbanManager = require("dl-module").managers.production.finishingPrinting.KanbanManager;
var resultFormatter = require("../../../result-formatter");
var passport = require('../../../passports/jwt-passport');
const apiVersion = '1.0.0';

function getRouter() {
    var router = new Router();
    router.get("/", passport, function(request, response, next) {
        db.get().then(db => {
                var manager = new KanbanManager(db, request.user);

                var query = request.queryInfo;
                manager.getDataReport(query)
                    .then(docs => {
                        var dateFormat = "DD MMM YYYY";
                        var locale = 'id';
                        var moment = require('moment');
                        moment.locale(locale);
                        if ((request.headers.accept || '').toString().indexOf("application/xls") < 0){
                            for(var a in docs){
                                docs[a]._createdDate = moment(new Date(docs[a]._createdDate)).format(dateFormat);
                                docs[a].deliveryDate = moment(new Date(docs[a].deliveryDate)).format(dateFormat);
                            }
                            var result = resultFormatter.ok(apiVersion, 200, docs);
                            response.send(200, result);
                        }else{
                            var index = 0;
                            var data = [];
                            for(var kanban of docs){
                                index++;
                                var item = {};
                                item["No"] = index;
                                item["Tanggal Kanban"] =  moment(new Date(kanban._createdDate)).format(dateFormat);
                                item["Nomor Order"] = kanban.orderNo;
                                item["Jenis Order"] = kanban.orderType;
                                item["Jenis Proses"] = kanban.processType;
                                item["Warna"] = kanban.color;
                                item["Standar Handfeel"] = kanban.handfeelStandard;
                                item["Lebar Finish"] = kanban.finishWidth;
                                item["Material"] = kanban.material;
                                item["Konstruksi"] = kanban.construction;
                                item["Nomor Benang"] = kanban.yarnMaterial;
                                item["Grade"] = kanban.grade;
                                item["Nomor Kereta"] = kanban.cartNumber;
                                item["Panjang"] = kanban.length;
                                item["PCS"] = kanban.pcs;
                                item["Satuan"] = kanban.uom;
                                item["Step Index"] = `${kanban.currentStepIndex} / ${kanban.steps.length}`;
                                item["Step"] = kanban.currentStepIndex === 0 ? " - " : kanban.steps[kanban.currentStepIndex - 1].process;
                                item["Status"] = kanban.isComplete ? "Complete" : kanban.currentStepIndex === kanban.steps.length ? "Pending" : "Incomplete";
                                data.push(item);
                            }
                            var options = {
                                "No" : "number",
                                "Tanggal Kanban" : "string",
                                "Nomor Order" : "string",
                                "Jenis Order" : "string",
                                "Jenis Proses" : "string",
                                "Warna" : "string",
                                "Standar Handfeel" : "string",
                                "Lebar Finish" : "string",
                                "Material" : "string",
                                "Konstruksi" : "string",
                                "Nomor Benang" : "string",
                                "Grade" : "string",
                                "Nomor Kereta" : "string",
                                "Panjang" : "number",
                                "Satuan" : "string",
                                "Step Index" : "string",
                                "Step" : "string",
                                "Status" : "string"
                            };
                            response.xls(`MONITORING KANBAN.xlsx`, data, options);
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