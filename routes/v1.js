//SET ROUTER DISINI
var v1WindingQualitySamplingRouter = require('../src/routers/v1/spinning/winding/winding-quality-sampling-router');
var v1WindingMachingByUnitRouter = require('../src/routers/v1/spinning/winding/machine-by-unit-router');
var v1WindingQualitySamplingReportRouter = require('../src/routers/v1/spinning/winding/reports/winding-quality-sampling-report-router');


//WINDING PRODUCTION OUTPUT
var v1WindingProductionOutputByUserRouter = require('../src/routers/v1/spinning/winding/winding-production-output/winding-production-output-by-user-router');
var v1LotMachineByProductMachineRouter = require('../src/routers/v1/spinning/winding/winding-production-output/lot-machine-by-product-machine-router');
var v1DailySpinningProductionReportRouter = require('../src/routers/v1/spinning/winding/reports/daily-spinning-production-report-router');


//PRODUCTION ORDER
var v1ProductionOrderRouter = require('../src/routers/v1/sales/production-order-router');
var v1ProductionOrderReportRouter = require('../src/routers/v1/sales/reports/production-order-report-router');
var v1ProductionOrderDetailReportRouter = require('../src/routers/v1/sales/reports/production-order-detail-report-router');
var v1MaterialRouter = require('../src/routers/v1/sales/material-router');

//DAILY OPERATION
var v1DailyOperationRouter = require('../src/routers/v1/finishing-printing/daily-operation-router');
var v1DailyOperationReportRouter = require('../src/routers/v1/finishing-printing/reports/daily-operation-report-router');

var v1DailyOperationBadOuputReportRouter = require('../src/routers/v1/finishing-printing/reports/bad-output-report-router');

//MONITORING EVENT
var v1MonitoringEventRouter = require('../src/routers/v1/finishing-printing/monitoring-event-router');
var v1MonitoringEventReportRouter = require('../src/routers/v1/finishing-printing/reports/monitoring-event-report-router');

//MONITORING SPECIFICATION MACHINE
var v1MonitoringSpecificationMachineRouter = require('../src/routers/v1/finishing-printing/monitoring-specification-machine-router');
var v1MonitoringSpecificationMachineReportByEventRouter = require('../src/routers/v1/finishing-printing/reports/monitoring-specification-machine-by-event-router');
var v1MonitoringSpecificationMachineReportRouter = require('../src/routers/v1/finishing-printing/reports/monitoring-specification-machine-report-router');

// KANBAN
var v1KanbanRouter = require('../src/routers/v1/finishing-printing/kanban-router');
var v1MonitoringKanbanRouter= require('../src/routers/v1/finishing-printing/monitoring-kanban-router');

// QUALITY-CONTROL/FABRIC
var fabricQualityControlRouter= require('../src/routers/v1/finishing-printing/fabric-quality-control-router');
var fabricQualityControlUnUsedRouter= require('../src/routers/v1/finishing-printing/fabric-quality-control-unused-router');
var v1fabricQualityControlReportRouter= require('../src/routers/v1/finishing-printing/reports/fabric-quality-control-report-router');
var packingRouter= require('../src/routers/v1/finishing-printing/packing-router');

var packingReportRouter=require('../src/routers/v1/finishing-printing/reports/packing-report-router');
var packingUnacceptedRouter= require('../src/routers/v1/finishing-printing/packing-unaccepted-router');

//MASTER
var v1BuyerRouter = require("../src/routers/v1/master/buyer-router");
var v1MaterialConstructionRouter = require("../src/routers/v1/master/material-construction-router");

// INSPECTION-LOT-COLOR
var v1InspectionLotColorRouter= require('../src/routers/v1/finishing-printing/inspection-lot-color-router');
var v1InspectionLotColorReportRouter = require('../src/routers/v1/finishing-printing/reports/inspection-lot-color-report-router');

// SALES
var v1SalesMonthlyReportRouter = require('../src/routers/v1/sales/reports/sales-monthly-report-router');

//SALES CONTRACT
var v1finishingPrintingSalesContractRouter = require('../src/routers/v1/sales/finishing-printing-sales-contract-router');
var v1spinningSalesContractRouter = require('../src/routers/v1/sales/spinning-sales-contract-router');
var v1weavingSalesContractRouter = require('../src/routers/v1/sales/weaving-sales-contract-router');

var v1weavingSalesContractReportRouter = require('../src/routers/v1/sales/reports/weaving-sales-contract-report-router');

var v1finishingPrintingSalesContractReportRouter = require('../src/routers/v1/sales/reports/finishing-printing-sales-contract-report-router');
var v1spinningSalesContractReportRouter = require('../src/routers/v1/sales/reports/spinning-sales-contract-report-router');
var v1finishingPrintingSalesContractByNumberRouter = require('../src/routers/v1/sales/finishing-printing-sales-contract-by-number-router');

// SALES DEAL STATUS
var v1dealTrackingBoardRouter = require('../src/routers/v1/sales/deal-tracking-board-router');
var v1dealTrackingStageRouter = require('../src/routers/v1/sales/deal-tracking-stage-router');
var v1dealTrackingDealRouter = require('../src/routers/v1/sales/deal-tracking-deal-router');
var v1dealTrackingActivityRouter = require('../src/routers/v1/sales/deal-tracking-activity-router');

// INVENTORY
var packingReceiptRouter = require('../src/routers/v1/inventory/packing-receipt-router');
var packingReceiptReportRouter = require('../src/routers/v1/inventory/reports/packing-receipt-report-router');

module.exports = function(server) {
    v1WindingQualitySamplingRouter().applyRoutes(server,                        "/v1/spinning/winding/winding-quality-samplings");
    v1WindingMachingByUnitRouter().applyRoutes(server,                          "/v1/spinning/winding/machine-by-units");
    v1WindingQualitySamplingReportRouter().applyRoutes(server,                  "/v1/spinning/winding/reports/winding-quality-samplings");
    
    v1WindingProductionOutputByUserRouter().applyRoutes(server,                 "/v1/spinning/winding/production-outputs/by-user");
    v1LotMachineByProductMachineRouter().applyRoutes(server,                    "/v1/spinning/winding/search-lots");
    v1DailySpinningProductionReportRouter().applyRoutes(server,                 "/v1/spinning/winding/reports/daily-production");
    
    v1ProductionOrderRouter().applyRoutes(server,                               "/v1/sales/production-orders");
    v1ProductionOrderDetailReportRouter().applyRoutes(server,                   "/v1/sales/reports/production-order-report/details");
    v1ProductionOrderReportRouter().applyRoutes(server,                         "/v1/sales/reports/production-order-report");
    v1MaterialRouter().applyRoutes(server,                                      "/v1/sales/materials");
    v1finishingPrintingSalesContractRouter().applyRoutes(server,                "/v1/sales/finishing-printing-sales-contracts");
    v1spinningSalesContractRouter().applyRoutes(server,                         "/v1/sales/spinning-sales-contracts");
    v1spinningSalesContractReportRouter().applyRoutes(server,                   "/v1/sales/reports/spinning-sales-contract-reports");
    v1weavingSalesContractRouter().applyRoutes(server,                          "/v1/sales/weaving-sales-contracts");
    v1weavingSalesContractReportRouter().applyRoutes(server,                    "/v1/sales/reports/weaving-sales-contract-report");
    v1DailyOperationRouter().applyRoutes(server,                                "/v1/finishing-printing/daily-operations");
    v1DailyOperationReportRouter().applyRoutes(server,                          "/v1/finishing-printing/reports/daily-operation-report");
    v1MonitoringEventRouter().applyRoutes(server,                               "/v1/finishing-printing/monitoring-events");
  
    v1SalesMonthlyReportRouter().applyRoutes(server,                            "/v1/sales/reports/sales-monthly-report");
    
    v1DailyOperationBadOuputReportRouter().applyRoutes(server,                  "/v1/finishing-printing/reports/bad-output-report");

    v1MonitoringEventReportRouter().applyRoutes(server,                         "/v1/finishing-printing/reports/monitoring-events");
    v1MonitoringSpecificationMachineRouter().applyRoutes(server,                "/v1/finishing-printing/monitoring-specification-machine");
    v1MonitoringSpecificationMachineReportByEventRouter().applyRoutes(server,   "/v1/finishing-printing/reports/monitoring-specification-machine/by-event");
    v1MonitoringSpecificationMachineReportRouter().applyRoutes(server,          "/v1/finishing-printing/reports/monitoring-specification-machine");
    v1MonitoringKanbanRouter().applyRoutes(server,                              "/v1/finishing-printing/monitoring-kanbans");
    v1KanbanRouter().applyRoutes(server,                                        "/v1/finishing-printing/kanbans");
    fabricQualityControlRouter().applyRoutes(server,                            "/v1/finishing-printing/quality-control/fabrics");
    fabricQualityControlUnUsedRouter().applyRoutes(server,                      "/v1/finishing-printing/quality-control-unused");
    packingRouter().applyRoutes(server,                                         "/v1/finishing-printing/quality-control/packings");

    packingUnacceptedRouter().applyRoutes(server,                               "/v1/finishing-printing/quality-control/packings-unaccepted");
  
    packingReportRouter().applyRoutes(server,                                   "/v1/finishing-printing/reports/packings")

    v1finishingPrintingSalesContractReportRouter().applyRoutes(server,          "/v1/finishing-printing/reports/finishing-printing-sales-contract-reports");
    v1finishingPrintingSalesContractByNumberRouter().applyRoutes(server,        "/v1/sales/finishing-printing-sales-contract-by-number");
    
    packingReceiptRouter().applyRoutes(server,                                  "/v1/inventory/packing-receipts"); 
    packingReceiptReportRouter().applyRoutes(server,                            "/v1/inventory/reports/packing-receipts"); 
    v1InspectionLotColorRouter().applyRoutes(server,                            "/v1/finishing-printing/inspection-lot-colors");
    v1InspectionLotColorReportRouter().applyRoutes(server,                      "/v1/finishing-printing/reports/inspection-lot-color"); 
    v1fabricQualityControlReportRouter().applyRoutes(server,                    "/v1/finishing-printing/reports/fabric-quality-control-report"); 
   
    v1BuyerRouter().applyRoutes(server,                    "/v1/master/buyer"); 
    v1MaterialConstructionRouter().applyRoutes(server,                    "/v1/master/material-construction"); 
  
    v1dealTrackingBoardRouter().applyRoutes(server,                             "/v1/sales/deal-tracking-boards");
    v1dealTrackingStageRouter().applyRoutes(server,                             "/v1/sales/deal-tracking-stages");
    v1dealTrackingDealRouter().applyRoutes(server,                              "/v1/sales/deal-tracking-deals");
    v1dealTrackingActivityRouter().applyRoutes(server,                          "/v1/sales/deal-tracking-activities"); 
};