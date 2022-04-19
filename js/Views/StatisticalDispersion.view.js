sap.ui.jsview(ELEARNING_MANAGEMENT_VIEW_STATISTICAL_DISPERSION, {
   
    getControllerName: function() {
       return ELEARNING_MANAGEMENT_CONTROLLER_STATISTICAL_DISPERSION;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(ELEARNING_MANAGEMENT_PAGE_STATISTICAL_DISPERSION, { title: ELEARNING_MANAGEMENT_PAGE_STATISTICAL_DISPERSION_TITLE, showNavButton: true });
        oPage.attachNavButtonPress(() => { oController.navToPrevious(); });
        this.createStatisticalDispersionTable(oPage);
        this.createErrorDialog(oPage);
        return oPage;
    },

    createErrorDialog: function(oPage) {
        const oController = this.getController();
        const oErrorDialog = new sap.m.Dialog('statisticalDispersionErrorDialog', { title: "An Error has Occurred", titleAlignment: sap.m.TitleAlignment.Center, type: sap.m.DialogType.Message });
        const oErrorMessageStrip = new sap.m.MessageStrip('statisticalDispersionErrorDialogMessageStrip', { type: sap.ui.core.MessageType.Error, showIcon: true });
        oErrorMessageStrip.addStyleClass("sapUiResponsiveMargin");
        const oErrorMessageDialogDismissButton = new sap.m.Button({ text: 'OK' , type: sap.m.ButtonType.Emphasized });
        oErrorMessageDialogDismissButton.attachPress(() => { 
            oErrorDialog.close();
            oController.navToPrevious(); 
        });
        oErrorDialog.addContent(oErrorMessageStrip);
        oErrorDialog.addButton(oErrorMessageDialogDismissButton);
        oPage.addContent(oErrorDialog);
    },

    createStatisticalDispersionTable: function(oPage) {
        const oTable = new sap.m.Table('statisticalDispersionTable');
        oTable.addStyleClass("sapUiResponsiveMargin")
              .setWidth("auto");

        this.createStatisticalDispersionTableHeader(oTable);
        this.createStatisticalDispersionTableColumns(oTable);

        oTable.setVisible(false);
        oPage.addContent(oTable);
    },

    createStatisticalDispersionTableHeader: function(oTable) {
        const oHeaderToolbar = new sap.m.Toolbar();
        const oHeadingLabel = new sap.m.Label('statisticalDispersionTableHeading');
        oHeaderToolbar.addContent(oHeadingLabel);
        oTable.setHeaderToolbar(oHeaderToolbar);
    },

    createStatisticalDispersionTableColumns: function(oTable) {
        const oRangeColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle, hAlign: sap.ui.core.TextAlign.Center });
        oRangeColumn.setWidth("33%")
                    .setHeader(new sap.m.Text({ text: "Range" }));
        const oVarianceColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle, hAlign: sap.ui.core.TextAlign.Center });
        oVarianceColumn.setWidth("33%")
                       .setHeader(new sap.m.Text({ text: "Variance" }));
        const oStandardDeviationColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle, hAlign: sap.ui.core.TextAlign.Center });
        oStandardDeviationColumn.setWidth("34%")
                                .setHeader(new sap.m.Text({ text: "Standard deviation" }));
        oTable.addColumn(oRangeColumn);
        oTable.addColumn(oVarianceColumn);
        oTable.addColumn(oStandardDeviationColumn);
    },

    loadPage: function() {
        const oController = this.getController();
        const oModel = this.getModel();
        const bPageLoadedInitiallySuccessfully = oController.pageLoaded();
        if(bPageLoadedInitiallySuccessfully) {
            // only if there are no validation errors or if the page has not been loaded previously the data can be parsed
            oController.calculateStatisticalDispersion();
            return;
        }

        if(oModel && oModel.getProperty("/obj")) {
            // an object model has been created, so we can check if error message has to be displayed
            const oModelObj = oModel.getProperty("/obj");
            const sMessage = oModelObj.getMessage();
            if(sMessage) {
                this.showErrorMessage();
            }
        }
    },

    applyModel: function() {
        const oModelObj = this.getModel().getProperty("/obj");
        const sMessage = oModelObj.getMessage();
        const oStatisticalDispersion = oModelObj.getStatisticalDispersion();

        if(sMessage) {
            this.showErrorMessage();
        }

        if(oStatisticalDispersion && typeof oStatisticalDispersion.range !== 'undefined') {
            this.createStatisticalDispersionVisualization();
        }
    },

    createStatisticalDispersionVisualization: function() {
        const oController = this.getController();
        const oModelObj = this.getModel().getProperty("/obj");
        const oStatisticalDispersion = oModelObj.getStatisticalDispersion();
        const aUids = oStatisticalDispersion.userIds;
        const iRange = oStatisticalDispersion.range;
        let dVariance = oStatisticalDispersion.variance;
        let dStandardDeviation = oStatisticalDispersion.standardDeviation;

        if(dVariance % 1 !== 0) {
            dVariance = dVariance.toFixed(2);
        }

        if(dStandardDeviation % 1 !== 0) {
            dStandardDeviation = dStandardDeviation.toFixed(2);
        }

        const oTable = oController.globalById('statisticalDispersionTable');
        this.setTableHeaderText(aUids.length);
        
        const oRow = new sap.m.ColumnListItem({ vAlign: sap.ui.core.VerticalAlign.Middle });
        oRow.addCell(new sap.m.Text({ text: iRange }))
            .addCell(new sap.m.Text({ text: dVariance }))
            .addCell(new sap.m.Text({ text: dStandardDeviation }));
        oTable.addItem(oRow);
        oTable.setVisible(true);
    },

    setTableHeaderText: function(count) {
        const oController = this.getController();
        oController.globalById("statisticalDispersionTableHeading").setText("Range, variance & standard deviation of the count of uploaded & submitted files by each user (" + count + " user(s) total)");
    },

    showErrorMessage: function() {
        const oController = this.getController();
        const oErrorDialogMessageStrip = oController.globalById('statisticalDispersionErrorDialogMessageStrip');
        const oErrorDialog = oController.globalById('statisticalDispersionErrorDialog');

        const oModelObj = this.getModel().getProperty("/obj");
        const sMessage = oModelObj.getMessage();
        oErrorDialogMessageStrip.setText(sMessage);

        oErrorDialog.open();
    }
 });
  