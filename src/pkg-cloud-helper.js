var pkgcloud = require('pkgcloud');

var config = {
    provider: 'openstack',
    useServiceCatalog: true,
    useInternal: false,
    keystoneAuthVersion: 'v3',
    authUrl: 'https://identity.open.softlayer.com',
    tenantId: '6cb9bd23266f49748e3876759b63c7c0',
    domainId: '04abf1873e0d4ecdac5917d2356c5707',
    username: 'admin_bc720e58db0f94a1a7e6e860fc0345fd840c90fa',
    password: 'r8-P6{I7*kkCAept',
    region: 'dallas',
    projectid: 'c89cd10f_b9c9_4a86_b4bc_b493258d80e3'
};

module.exports = {
    getStorageClient() {
        return new Promise((resolve, reject) => {
            var storageClient = pkgcloud.storage.createClient(config);
            storageClient.auth(function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(storageClient);
                }
            });
        });
    },

    download(container, file, callback) {
        var client = pkgcloud.storage.createClient(config);
        client.auth(function (error) {
            if (error) {
                console.error("Authorization error for storage client (pkgcloud): ", error);
            }
            else {
                var request = client.download({
                    container: container,
                    remote: file
                });

                callback(request);
            }
        });
    },
    delete(container, file, callback) {
        var client = pkgcloud.storage.createClient(config);
        client.auth(function (error) {
            if (error) {
                console.error("Authorization error for storage client (pkgcloud): ", error);
            }
            else {
                var request = client.removeFile(container, file, function(err) {
                    callback(err);
                });
            }
        });
    }
}