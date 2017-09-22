 var basicTest = require("../../basic-test-factory");
 basicTest({
     uri: "/sales/deal-tracking-deals",
     model: require("dl-models").sales.DealTrackingDeal,
     validate: require("dl-models").validator.sales.dealTrackingDeal,
     util: require("dl-module").test.data.sales.dealTrackingDeal,
     keyword: null
 });