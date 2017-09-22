var Manager = require("dl-module").managers.sales.DealTrackingActivityManager;
var JwtRouterFactory = require("../../jwt-router-factory");
var resultFormatter = require("../../../result-formatter");
var passport = require("../../../passports/jwt-passport");
var PkgCloudHelper = require('../../../pkg-cloud-helper');
var db = require("../../../db");
const apiVersion = '1.0.0';

function getRouter() {
    var router = JwtRouterFactory(Manager, {
        version: apiVersion,
        defaultOrder: {
            "_createdDate": 1
        }
    });

    router.post('/upload/file', passport, (request, response, next) => {
        var user = request.user;
        var data = request.body;

        db.get()
            .then(db => {
                var manager = new Manager(db, user);
                var uploadHelper = require('../../../upload-helper');

                PkgCloudHelper.getStorageClient()
                    .then((storageClient) => {
                        var uploadFileProcess = [];
                        var activityFiles = [];
                        var files = request.files;
                        var property = Object.getOwnPropertyNames(request.files);

                        var date = new Date();
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        var day = date.getDate();
                        var hour = date.getHours();
                        var minutes = date.getMinutes();
                        var seconds = date.getSeconds();
                        var dateTime = " " + year + month + day + hour + minutes + seconds;

                        for (var i = 0; i < property.length; i++) {
                            var originFileName = files[property[i]].name;
                            var index = originFileName.lastIndexOf('.');
                            var filename = originFileName.substring(0, index);
                            var extension = originFileName.substring(index + 1);

                            var fileNameStorage = filename + dateTime + "." + extension;

                            activityFiles.push({
                                fileName: files[property[i]].name,
                                fileNameStorage: fileNameStorage
                            });

                            files[property[i]].name = fileNameStorage;

                            uploadFileProcess.push(uploadHelper.uploadFile(files[property[i]], storageClient, "dl-deal-tracking"));
                        }

                        return Promise.all(uploadFileProcess)
                            .then((results) => {
                                if (data.update) {
                                    return manager.getSingleById(data._id)
                                        .then((result) => {
                                            result.field.notes = data.notes;
                                            
                                            for (var file of activityFiles) {
                                                result.field.attachments.push(file);
                                            }

                                            return manager.update(result);
                                        });
                                }
                                else {
                                    var activityData = {
                                        dealId: data.dealId,
                                        type: data.type,
                                        field: {
                                            notes: data.notes,
                                            attachments: activityFiles
                                        }
                                    };

                                    return manager.create(activityData);
                                }
                            })
                    })
                    .then((docId) => {
                        response.header("Location", `${request.url}/${docId.toString()}`);
                        var result = resultFormatter.ok(apiVersion, 201);
                        return Promise.resolve(result);
                    })
                    .then((result) => {
                        response.send(result.statusCode, result);
                    })
                    .catch((e) => {
                        var statusCode = 500;
                        if (e.name === "ValidationError")
                            statusCode = 400;
                        var error = resultFormatter.fail(apiVersion, statusCode, e);
                        response.send(statusCode, error);
                    });
            });
    });

    router.get('/attachment/:fileName', (request, response, next, res) => {
        var fileName = request.params.fileName;
        response.setHeader('Content-disposition', "attachment; filename=" + fileName);

        PkgCloudHelper.download("dl-deal-tracking", fileName, function (download) {
            download.pipe(response);
        });
    });

    router.put("/activity/updateAttachment", passport, (request, response, next) => {
        var user = request.user;
        var data = request.body;

        db.get()
            .then(db => {
                var manager = new Manager(db, user);
                return manager.updateActivityAttachment(data);
            })
            .then((result) => {
                PkgCloudHelper.delete("dl-deal-tracking", data.fileName, function (err) {
                    if (!err) {
                        result = resultFormatter.ok(apiVersion, 204);
                        response.send(result.statusCode, result);
                    }
                    else {
                        result = resultFormatter.fail(apiVersion, 404, new Error("data not found"));
                        response.send(result.statusCode, result);
                    }
                });
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
