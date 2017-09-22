 var basicTest = require("../../basic-test-factory");
 basicTest({
     uri: "/inventory/packing-receipts",
     model: require("dl-models").inventory.finishingPrinting.FPPackingReceipt,
     validate: require("dl-models").validator.inventory.finishingPrinting.packingReceipt,
     util: require("dl-module").test.data.inventory.finishingPrinting.packingReceipt,
     keyword: "code"
 });

 
 