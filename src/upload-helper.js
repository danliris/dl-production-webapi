var fs = require('fs');
module.exports = {
    uploadFile: function (file, storageClient, container) {
        return new Promise((resolve, reject) => {
            storageClient.createContainer({
                name: container
            }, function (err, container) {
                if (err) {
                    console.error(err);
                }
                else {
                    var myFile = fs.createReadStream(file.path);
                    var upload = storageClient.upload({
                        container: container.name,
                        remote: file.name
                    });
                    upload.on('error', function (err) {
                        reject(err);
                    });
                    upload.on('success', function (result) {
                        var url = `https://objectstorage-ui.ng.bluemix.net/v2/service_instances/${storageClient.config.projectid}/region/${storageClient.region}/container/${container.name}/${file.name}`
                        resolve(url);
                    });
                    myFile.pipe(upload);
                }
            });
        });
    }
}