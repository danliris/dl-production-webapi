const azure = require('azure-storage');
const blobService = azure.createBlobService();
const fs = require('fs');

module.exports = {
    upload: function (container, folder, file) {
        return new Promise((resolve, reject) => {
            let blob = folder ? folder + '/' + file.name : file.name;

            const readStream = fs.createReadStream(file.path);
            readStream.pipe(blobService.createWriteStreamToBlockBlob(container, blob, function (error, result, response) {
                if (!error) {
                    resolve(result);
                }
                else {
                    reject(error);
                }
            }));
        });
    },
    download: function (container, folder, fileName, res) {
        let blob = folder ? folder + '/' + fileName : fileName;
        
        blobService.getBlobProperties(
            container,
            blob,
            function (err, properties, status) {
                if (err) {
                    res.send(502, "Error fetching file: %s", err.message);
                } else if (!status.isSuccessful) {
                    res.send(404, "The file %s does not exist", fileName);
                } else {
                    res.header('Content-Type', properties.contentType);
                    blobService.createReadStream(container, blob).pipe(res);
                }
            });
    },
    delete: function (container, folder, fileName, callback) {
        let blob = folder ? folder + '/' + fileName : fileName;
        blobService.deleteBlob(container, blob, function (error, response) {
            callback(error);
        });
    }
};
