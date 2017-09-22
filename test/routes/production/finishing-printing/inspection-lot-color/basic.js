 var basicTest = require("../../../basic-test-factory");
 basicTest({
     uri: "/finishing-printing/inspection-lot-colors",
     model: require("dl-models").production.finishingPrinting.qualityControl.InspectionLotColor,
     validate: require("dl-models").validator.production.finishingPrinting.qualityControl.inspectionLotColor,
     util: require("dl-module").test.data.production.inspectionLotColor,
     keyword: "code"
 });