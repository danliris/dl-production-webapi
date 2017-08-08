 var basicTest = require("../../basic-test-factory");
 basicTest({
     uri: "/sales/deal-tracking-boards",
     model: require("dl-models").sales.DealTrackingBoard,
     validate: require("dl-models").validator.sales.dealTrackingBoard,
     util: require("dl-module").test.data.sales.dealTrackingBoard,
     keyword: null
 });