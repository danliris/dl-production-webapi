 var basicTest = require("../../basic-test-factory");
 basicTest({
     uri: "/sales/deal-tracking-stages",
     model: require("dl-models").sales.DealTrackingStage,
     validate: require("dl-models").validator.sales.dealTrackingStage,
     util: require("dl-module").test.data.sales.dealTrackingStage,
     keyword: null
 });