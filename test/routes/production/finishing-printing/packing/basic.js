 var basicTest = require("../../../basic-test-factory");
 basicTest({
     uri: "/finishing-printing/quality-control/packings",
     model: require("dl-models").production.finishingPrinting.qualityControl.Packing,
     validate: require("dl-models").validator.production.finishingPrinting.qualityControl.packing,
     util: require("dl-module").test.data.production.packing,
     keyword: "code"
 });

 
 