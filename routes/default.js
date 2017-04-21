//SET ROUTER DISINI
var windingQualitySamplingRouter = require('../src/routers/v1/spinning/winding/winding-quality-sampling-router');
var windingMachingByUnitRouter = require('../src/routers/v1/spinning/winding/machine-by-unit-router');
var windingQualitySamplingReportRouter = require('../src/routers/v1/spinning/winding/reports/winding-quality-sampling-report-router');


//WINDING PRODUCTION OUTPUT
var windingProductionOutputByUserRouter = require('../src/routers/v1/spinning/winding/winding-production-output/winding-production-output-by-user-router');
var lotMachineByProductMachineRouter = require('../src/routers/v1/spinning/winding/winding-production-output/lot-machine-by-product-machine-router');
var dailySpinningProductionReportRouter = require('../src/routers/v1/spinning/winding/reports/daily-spinning-production-report-router');


//PRODUCTION ORDER
var productionOrderRouter = require('../src/routers/v1/sales/production-order-router');
var productionOrderReportRouter = require('../src/routers/v1/sales/reports/production-order-report-router');
var materialRouter = require('../src/routers/v1/sales/material-router');

//DAILY OPERATION
var DailyOperationRouter = require('../src/routers/v1/finishing-printing/daily-operation-router');
var DailyOperationReportRouter = require('../src/routers/v1/finishing-printing/reports/daily-operation-report-router');

//MONITORING EVENT
var monitoringEventRouter = require('../src/routers/v1/finishing-printing/monitoring-event-router');
var monitoringEventReportRouter = require('../src/routers/v1/finishing-printing/reports/monitoring-event-report-router');

//MONITORING SPECIFICATION MACHINE
var monitoringSpecificationMachineRouter= require('../src/routers/v1/finishing-printing/monitoring-specification-machine-router');
var monitoringSpecificationMachineReportByEventRouter = require('../src/routers/v1/finishing-printing/reports/monitoring-specification-machine-by-event-router');
var monitoringSpecificationMachineReportRouter= require('../src/routers/v1/finishing-printing/reports/monitoring-specification-machine-report-router');

// KANBAN
var kanbanRouter = require('../src/routers/v1/finishing-printing/kanban-router');
var monitoringKanbanRouter= require('../src/routers/v1/finishing-printing/monitoring-kanban-router');

// QUALITY-CONTROL/FABRIC
var fabricQualityControlRouter= require('../src/routers/v1/finishing-printing/fabric-quality-control-router');
var packingRouter= require('../src/routers/v1/finishing-printing/packing-router');

// INSPECTION-LOT-COLOR
var inspectionLotColorRouter= require('../src/routers/v1/finishing-printing/inspection-lot-color-router');
var inspectionLotColorReportRouter = require('../src/routers/v1/finishing-printing/reports/inspection-lot-color-report-router');

//SALES CONTRACT
var finishingPrintingSalesContractRouter = require('../src/routers/v1/sales/finishing-printing-sales-contract-router');
var spinningSalesContractRouter = require('../src/routers/v1/sales/spinning-sales-contract-router');
var weavingSalesContractRouter = require('../src/routers/v1/sales/weaving-sales-contract-router');

var weavingSalesContractReportRouter = require('../src/routers/v1/sales/reports/weaving-sales-contract-report-router');

var finishingPrintingSalesContractReportRouter = require('../src/routers/v1/sales/reports/finishing-printing-sales-contract-report-router');
var finishingPrintingSalesContractByNumberRouter = require('../src/routers/v1/sales/finishing-printing-sales-contract-by-number-router');
var spinningSalesContractReportRouter = require('../src/routers/v1/sales/reports/spinning-sales-contract-report-router');

// INVENTORY
var packingReceiptRouter = require('../src/routers/v1/inventory/packing-receipt-router');



module.exports = function(server) {
    windingQualitySamplingRouter().applyRoutes(server,                        "/spinning/winding/winding-quality-samplings");
    windingMachingByUnitRouter().applyRoutes(server,                          "/spinning/winding/machine-by-units");
    windingQualitySamplingReportRouter().applyRoutes(server,                  "/spinning/winding/reports/winding-quality-samplings");
    
    windingProductionOutputByUserRouter().applyRoutes(server,                 "/spinning/winding/production-outputs/by-user");
    lotMachineByProductMachineRouter().applyRoutes(server,                    "/spinning/winding/search-lots");
    dailySpinningProductionReportRouter().applyRoutes(server,                 "/spinning/winding/reports/daily-production");
    productionOrderRouter().applyRoutes(server,                               "/sales/production-orders");
    productionOrderReportRouter().applyRoutes(server,                         "/sales/reports/production-order-report");
    materialRouter().applyRoutes(server,                                      "/sales/materials");
    finishingPrintingSalesContractRouter().applyRoutes(server,                "/sales/finishing-printing-sales-contracts");
    spinningSalesContractRouter().applyRoutes(server,                         "/sales/spinning-sales-contracts");
    spinningSalesContractReportRouter().applyRoutes(server,                   "/sales/reports/spinning-sales-contract-reports");
    weavingSalesContractRouter().applyRoutes(server,                          "/sales/weaving-sales-contracts");
    weavingSalesContractReportRouter().applyRoutes(server,                    "/sales/reports/weaving-sales-contract-report");
    DailyOperationRouter().applyRoutes(server,                                "/finishing-printing/daily-operations");
    DailyOperationReportRouter().applyRoutes(server,                          "/finishing-printing/reports/daily-operation-report");
    monitoringEventRouter().applyRoutes(server,                               "/finishing-printing/monitoring-events");
    monitoringEventReportRouter().applyRoutes(server,                         "/finishing-printing/reports/monitoring-events");
    monitoringSpecificationMachineRouter().applyRoutes(server,                "/finishing-printing/monitoring-specification-machine");
    monitoringSpecificationMachineReportByEventRouter().applyRoutes(server,   "/finishing-printing/reports/monitoring-specification-machine/by-event");
    monitoringSpecificationMachineReportRouter().applyRoutes(server,          "/finishing-printing/reports/monitoring-specification-machine")
    monitoringKanbanRouter().applyRoutes(server,                              "/finishing-printing/monitoring-kanbans");
    kanbanRouter().applyRoutes(server,                                        "/finishing-printing/kanbans");
    inspectionLotColorRouter().applyRoutes(server,                            "/finishing-printing/inspection-lot-colors");
    inspectionLotColorReportRouter().applyRoutes(server,                      "/finishing-printing/reports/inspection-lot-color");
    
    fabricQualityControlRouter().applyRoutes(server,                          "/finishing-printing/quality-control/fabrics");
    packingRouter().applyRoutes(server,                                       "/finishing-printing/quality-control/packings");
    finishingPrintingSalesContractReportRouter().applyRoutes(server,          "/finishing-printing/reports/finishing-printing-sales-contract-reports");
    finishingPrintingSalesContractByNumberRouter().applyRoutes(server,        "/sales/finishing-printing-sales-contract-by-number");
    packingReceiptRouter().applyRoutes(server,                                "/inventory/packing-receipts");
    
};