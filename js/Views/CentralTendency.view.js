sap.ui.jsview(ELEARNING_MANAGEMENT_VIEW_CENTRAL_TENDENCY, {
   
    getControllerName: function() {
       return ELEARNING_MANAGEMENT_CONTROLLER_CENTRAL_TENDENCY;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(ELEARNING_MANAGEMENT_PAGE_CENTRAL_TENDENCY, { title: ELEARNING_MANAGEMENT_PAGE_CENTRAL_TENDENCY_TITLE, showNavButton: true });
        oPage.attachNavButtonPress(() => { oController.navToPrevious(); });
        this.createCentralTendencyTable(oPage);
        this.createErrorDialog(oPage);
        return oPage;
    },

    createErrorDialog: function(oPage) {
        const oController = this.getController();
        const oErrorDialog = new sap.m.Dialog('centralTendencyErrorDialog', { title: "An Error has Occurred", titleAlignment: sap.m.TitleAlignment.Center, type: sap.m.DialogType.Message });
        const oErrorMessageStrip = new sap.m.MessageStrip('centralTendencyErrorDialogMessageStrip', { type: sap.ui.core.MessageType.Error, showIcon: true });
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

    createCentralTendencyTable: function(oPage) {
        const oTable = new sap.m.Table('centralTendencyTable');
        oTable.addStyleClass("sapUiResponsiveMargin")
              .setWidth("auto");

        this.createCentralTendencyTableHeader(oTable);
        this.createCentralTendencyTableColumns(oTable);

        oTable.setVisible(false);
        oPage.addContent(oTable);
    },

    createCentralTendencyTableHeader: function(oTable) {
        const oHeaderToolbar = new sap.m.Toolbar();
        const oHeadingLabel = new sap.m.Label('centralTendencyTableHeading');
        oHeaderToolbar.addContent(oHeadingLabel);
        oTable.setHeaderToolbar(oHeaderToolbar);
    },

    createCentralTendencyTableColumns: function(oTable) {
        const oMeanColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle, hAlign: sap.ui.core.TextAlign.Center });
        oMeanColumn.setWidth("33%")
                   .setHeader(new sap.m.Text({ text: "Mean" }));
        const oModeColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle, hAlign: sap.ui.core.TextAlign.Center });
        oModeColumn.setWidth("33%")
                   .setHeader(new sap.m.Text({ text: "Mode" }));
        const oMedianColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle, hAlign: sap.ui.core.TextAlign.Center });
        oMedianColumn.setWidth("34%")
                     .setHeader(new sap.m.Text({ text: "Median" }));
        oTable.addColumn(oMeanColumn);
        oTable.addColumn(oModeColumn);
        oTable.addColumn(oMedianColumn);
    },

    loadPage: function() {
        const oController = this.getController();
        const oModel = this.getModel();
        const bPageLoadedInitiallySuccessfully = oController.pageLoaded();
        if(bPageLoadedInitiallySuccessfully) {
            // only if there are no validation errors or if the page has not been loaded previously the data can be parsed
            oController.calculateCentralTendency();
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
        const oCentralTendency = oModelObj.getCentralTendency();

        if(sMessage) {
            this.showErrorMessage();
        }

        if(oCentralTendency && typeof oCentralTendency.mean !== 'undefined') {
            this.createCentralTendencyVisualization();
        }
    },

    createCentralTendencyVisualization: function() {
        const oController = this.getController();
        const oModelObj = this.getModel().getProperty("/obj");
        const oCentralTendency = oModelObj.getCentralTendency();
        const aUids = oCentralTendency.userIds;
        let dMean = oCentralTendency.mean;
        const aModes = oCentralTendency.modes;
        let dMedian = oCentralTendency.median;

        if(dMean % 1 !== 0) {
            dMean = dMean.toFixed(2);
        }

        let sModesText = 'N/A';
        if(aModes.length) {
            sModesText = aModes.join(', ');
        }

        if(dMedian % 1 !== 0) {
            dMedian = dMedian.toFixed(2);
        }

        const oTable = oController.globalById('centralTendencyTable');
        this.setTableHeaderText(aUids.length);
        
        const oRow = new sap.m.ColumnListItem({ vAlign: sap.ui.core.VerticalAlign.Middle });
        oRow.addCell(new sap.m.Text({ text: dMean }))
            .addCell(new sap.m.Text({ text: sModesText }))
            .addCell(new sap.m.Text({ text: dMedian }));
        oTable.addItem(oRow);
        oTable.setVisible(true);
    },

    setTableHeaderText: function(count) {
        const oController = this.getController();
        oController.globalById("centralTendencyTableHeading").setText("Mean, mode and median of the count of uploaded & submitted files by each user (" + count + " user(s) total)");
    },

    showErrorMessage: function() {
        const oController = this.getController();
        const oErrorDialogMessageStrip = oController.globalById('centralTendencyErrorDialogMessageStrip');
        const oErrorDialog = oController.globalById('centralTendencyErrorDialog');

        const oModelObj = this.getModel().getProperty("/obj");
        const sMessage = oModelObj.getMessage();
        oErrorDialogMessageStrip.setText(sMessage);

        oErrorDialog.open();
    }
 });
  