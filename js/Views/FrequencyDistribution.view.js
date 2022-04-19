sap.ui.jsview(ELEARNING_MANAGEMENT_VIEW_FREQUENCY_DISTRIBUTION, {
   
    getControllerName: function() {
       return ELEARNING_MANAGEMENT_CONTROLLER_FREQUENCY_DISTRIBUTION;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(ELEARNING_MANAGEMENT_PAGE_FREQUENCY_DISTRIBUTION, { title: ELEARNING_MANAGEMENT_PAGE_FREQUENCY_DISTRIBUTION_TITLE, showNavButton: true });
        oPage.attachNavButtonPress(() => { oController.navToPrevious(); });
        this.createFrequencyDistributionTable(oPage);
        this.createErrorDialog(oPage);
        return oPage;
    },

    createErrorDialog: function(oPage) {
        const oController = this.getController();
        const oErrorDialog = new sap.m.Dialog('frequencyDistributionErrorDialog', { title: "An Error has Occurred", titleAlignment: sap.m.TitleAlignment.Center, type: sap.m.DialogType.Message });
        const oErrorMessageStrip = new sap.m.MessageStrip('frequencyDistributionErrorDialogMessageStrip', { type: sap.ui.core.MessageType.Error, showIcon: true });
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

    createFrequencyDistributionTable: function(oPage) {
        const oTable = new sap.m.Table("frequencyDistributionTable");
        oTable.addStyleClass("sapUiResponsiveMargin")
              .setWidth("auto");

        this.createFrequencyDistributionTableHeader(oTable);
        this.createFrequencyDistributionTableColumns(oTable);

        oTable.setVisible(false);
        oPage.addContent(oTable);
    },

    createFrequencyDistributionTableHeader: function(oTable) {
        const oHeaderToolbar = new sap.m.Toolbar();
        const oHeadingLabel = new sap.m.Label('frequencyDistributionTableHeading');
        oHeaderToolbar.addContent(oHeadingLabel);
        oTable.setHeaderToolbar(oHeaderToolbar);
    },

    createFrequencyDistributionTableColumns: function(oTable) {
        const oUidColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle });
        oUidColumn.setWidth("33%")
                  .setHeader(new sap.m.Text({ text: "UID" }));
        const oAbsoluteFrequencyColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle, hAlign: sap.ui.core.TextAlign.Center });
        oAbsoluteFrequencyColumn.setWidth("33%")
                                .setHeader(new sap.m.Text({ text: "Absolute frequency" }));
        const oRelativeFrequencyColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle, hAlign: sap.ui.core.TextAlign.Center });
        oRelativeFrequencyColumn.setWidth("34%")
                                .setHeader(new sap.m.Text({ text: "Relative frequency" }));
        oTable.addColumn(oUidColumn);
        oTable.addColumn(oAbsoluteFrequencyColumn);
        oTable.addColumn(oRelativeFrequencyColumn);
    },

    loadPage: function() {
        const oController = this.getController();
        const oModel = this.getModel();
        const bPageLoadedInitiallySuccessfully = oController.pageLoaded();
        if(bPageLoadedInitiallySuccessfully) {
            // only if there are no validation errors or if the page has not been loaded previously the data can be parsed
            oController.calculateFrequencyDistribution();
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
        const oFrequencyDistribution = oModelObj.getFrequencyDistribution();

        if(sMessage) {
            this.showErrorMessage();
        }

        if(oFrequencyDistribution && typeof oFrequencyDistribution.userIdsDistribution !== 'undefined') {
            this.createFrequencyDistributionVisualization();
        }
    },

    createFrequencyDistributionVisualization: function() {
        const oController = this.getController();
        const oModelObj = this.getModel().getProperty("/obj");
        const oFrequencyDistribution = oModelObj.getFrequencyDistribution();
        const aUids = oFrequencyDistribution.userIds;
        const oUidsDistribution = oFrequencyDistribution.userIdsDistribution;
        let iTotalSubmissionsAndUploads = 0;
        for(const uid in oUidsDistribution) {
            iTotalSubmissionsAndUploads += oUidsDistribution[uid];
        }

        const oTable = oController.globalById('frequencyDistributionTable');
        this.setTableHeaderText(aUids.length, iTotalSubmissionsAndUploads);
    
        for(const uid of aUids) {
            const iAbsoluteFrequency = oUidsDistribution[uid];
            const dRelativeFrequency = (iAbsoluteFrequency / iTotalSubmissionsAndUploads * 100).toFixed(2);
            const oRow = new sap.m.ColumnListItem({ vAlign: sap.ui.core.VerticalAlign.Middle });
            oRow.addCell(new sap.m.Text({ text: uid }))
                .addCell(new sap.m.Text({ text: iAbsoluteFrequency }))
                .addCell(new sap.m.Text({ text: dRelativeFrequency + '%' }));
            oTable.addItem(oRow);
        }
        oTable.setVisible(true);
    },

    setTableHeaderText: function(iCount, iTotalSubmissionsAndUploads) {
        const oController = this.getController();
        oController.globalById("frequencyDistributionTableHeading").setText("Frequency distribution of submitted & uploaded files by each user (" + iCount + " user(s), " + iTotalSubmissionsAndUploads + " submission(s) & upload(s) total)");
    },

    showErrorMessage: function() {
        const oController = this.getController();
        const oErrorDialogMessageStrip = oController.globalById('frequencyDistributionErrorDialogMessageStrip');
        const oErrorDialog = oController.globalById('frequencyDistributionErrorDialog');

        const oModelObj = this.getModel().getProperty("/obj");
        const sMessage = oModelObj.getMessage();
        oErrorDialogMessageStrip.setText(sMessage);

        oErrorDialog.open();
    }
 });
  