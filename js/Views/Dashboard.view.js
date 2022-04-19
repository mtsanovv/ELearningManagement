sap.ui.jsview(ELEARNING_MANAGEMENT_VIEW_DASHBOARD, {
   
    getControllerName: function() {
       return ELEARNING_MANAGEMENT_CONTROLLER_DASHBOARD;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(ELEARNING_MANAGEMENT_PAGE_DASHBOARD, { title: ELEARNING_MANAGEMENT_PAGE_DASHBOARD_TITLE });
        this.createTiles(oPage);
        this.createWarningDialog(oPage);
        return oPage;
    },

    createTiles: function(oPage) {
        const oVerticalLayout = new sap.ui.layout.VerticalLayout();
        oVerticalLayout.addStyleClass("sapUiResponsiveMargin");
        this.createStatsTiles(oVerticalLayout);
        this.createDataAnalysisTiles(oVerticalLayout);
        oPage.addContent(oVerticalLayout);
    },

    createStatsTiles: function(oVerticalLayout) {
        this.createStatsTilesTitle(oVerticalLayout);

        const oHorizontalLayout = new sap.ui.layout.HorizontalLayout({ allowWrapping: true });
        this.createAverageGradeTile(oHorizontalLayout);
        this.createNumberOfGradesTile(oHorizontalLayout);
        this.createNumberOfLogsTile(oHorizontalLayout);
        this.createMostFrequentEventTile(oHorizontalLayout);
        oVerticalLayout.addContent(oHorizontalLayout);
    },

    createAverageGradeTile: function(oHorizontalLayout) {
        const oTile = new sap.m.GenericTile({ header: "Average grade" });
        oTile.addStyleClass("sapUiTinyMarginBegin")
             .addStyleClass("sapUiTinyMarginBottom");
        const oTileContent = new sap.m.TileContent();
        const oTileNumericContent = new sap.m.NumericContent('averageGradeTileContent', { icon: "sap-icon://order-status", truncateValueTo: 4, withMargin: false });
        oTileContent.setContent(oTileNumericContent);
        oTile.addTileContent(oTileContent);
        oHorizontalLayout.addContent(oTile);
    },

    createNumberOfGradesTile: function(oHorizontalLayout) {
        const oTile = new sap.m.GenericTile({ header: "Number of grades" });
        oTile.addStyleClass("sapUiTinyMarginBegin")
             .addStyleClass("sapUiTinyMarginBottom");
        const oTileContent = new sap.m.TileContent();
        const oTileNumericContent = new sap.m.NumericContent('numberOfGradesTileContent', { icon: "sap-icon://number-sign", truncateValueTo: 6, withMargin: false });
        oTileContent.setContent(oTileNumericContent);
        oTile.addTileContent(oTileContent);
        oHorizontalLayout.addContent(oTile);
    },

    createNumberOfLogsTile: function(oHorizontalLayout) {
        const oTile = new sap.m.GenericTile({ header: "Number of logs" });
        oTile.addStyleClass("sapUiTinyMarginBegin")
             .addStyleClass("sapUiTinyMarginBottom");
        const oTileContent = new sap.m.TileContent();
        const oTileNumericContent = new sap.m.NumericContent('numberOfLogsTileContent', { icon: "sap-icon://performance", truncateValueTo: 6, withMargin: false });
        oTileContent.setContent(oTileNumericContent);
        oTile.addTileContent(oTileContent);
        oHorizontalLayout.addContent(oTile);
    },

    createMostFrequentEventTile: function(oHorizontalLayout) {
        const oTile = new sap.m.GenericTile({ header: "Most frequent event" });
        oTile.addStyleClass("sapUiTinyMarginBegin")
             .addStyleClass("sapUiTinyMarginBottom");
        const oTileContent = new sap.m.TileContent();
        const oTileNewsContent = new sap.m.NewsContent('mostFrequentEventTileContent');
        oTileContent.setContent(oTileNewsContent);
        oTile.addTileContent(oTileContent);
        oHorizontalLayout.addContent(oTile);
    },

    createStatsTilesTitle: function(oVerticalLayout) {
        const oStatsTilesTitle = new sap.m.Title({ text: "Miscellaneous statistics", titleStyle: sap.ui.core.TitleLevel.H4 });
        oStatsTilesTitle.addStyleClass("sapUiTinyMarginBegin")
                        .addStyleClass("sapUiTinyMarginTopBottom");
        oVerticalLayout.addContent(oStatsTilesTitle);
    },

    createDataAnalysisTiles: function(oVerticalLayout) {
        this.createDataAnalysisTilesTitle(oVerticalLayout);

        const oHorizontalLayout = new sap.ui.layout.HorizontalLayout({ allowWrapping: true });
        this.createNavButtons(oHorizontalLayout);
        oVerticalLayout.addContent(oHorizontalLayout);
    },

    createNavButtons: function(oHorizontalLayout) {
        this.createFrequencyDistributionTile(oHorizontalLayout);
        this.createCentralTendencyTile(oHorizontalLayout);
        this.createStatisticalDispersionTile(oHorizontalLayout);
        this.createCorrelationAnalysisTile(oHorizontalLayout);
    },

    createDataAnalysisTilesTitle: function(oVerticalLayout) {
        const oDataAnalysisTilesTitle = new sap.m.Title({ text: "Data analysis", titleStyle: sap.ui.core.TitleLevel.H4 });
        oDataAnalysisTilesTitle.addStyleClass("sapUiTinyMarginBegin")
                        .addStyleClass("sapUiTinyMarginTopBottom");
        oVerticalLayout.addContent(oDataAnalysisTilesTitle);
    },

    createFrequencyDistributionTile: function(oHorizontalLayout) {
        const oController = this.getController();
        const oTile = new sap.m.GenericTile({ header: ELEARNING_MANAGEMENT_PAGE_FREQUENCY_DISTRIBUTION_TITLE });
        oTile.addStyleClass("sapUiTinyMarginBegin")
             .addStyleClass("sapUiTinyMarginBottom")
             .attachPress(() => { oController.navTo(NAV_FREQUENCY_DISTRIBUTION) });
        const oTileContent = new sap.m.TileContent();
        const oTileImageContent = new sap.m.ImageContent({ src: 'sap-icon://bar-chart' });
        oTileContent.setContent(oTileImageContent);
        oTile.addTileContent(oTileContent);
        oHorizontalLayout.addContent(oTile);
    },

    createCentralTendencyTile: function(oHorizontalLayout) {
        const oController = this.getController();
        const oTile = new sap.m.GenericTile({ header: ELEARNING_MANAGEMENT_PAGE_CENTRAL_TENDENCY_TITLE });
        oTile.addStyleClass("sapUiTinyMarginBegin")
             .addStyleClass("sapUiTinyMarginBottom")
             .attachPress(() => { oController.navTo(NAV_CENTRAL_TENDENCY) });
        const oTileContent = new sap.m.TileContent();
        const oTileImageContent = new sap.m.ImageContent({ src: 'sap-icon://business-objects-experience' });
        oTileContent.setContent(oTileImageContent);
        oTile.addTileContent(oTileContent);
        oHorizontalLayout.addContent(oTile);
    },

    createStatisticalDispersionTile: function(oHorizontalLayout) {
        const oController = this.getController();
        const oTile = new sap.m.GenericTile({ header: ELEARNING_MANAGEMENT_PAGE_STATISTICAL_DISPERSION_TITLE });
        oTile.addStyleClass("sapUiTinyMarginBegin")
             .addStyleClass("sapUiTinyMarginBottom")
             .attachPress(() => { oController.navTo(NAV_STATISTICAL_DISPERSION) });
        const oTileContent = new sap.m.TileContent();
        const oTileImageContent = new sap.m.ImageContent({ src: 'sap-icon://crossed-line-chart' });
        oTileContent.setContent(oTileImageContent);
        oTile.addTileContent(oTileContent);
        oHorizontalLayout.addContent(oTile);
    },

    createCorrelationAnalysisTile: function(oHorizontalLayout) {
        const oController = this.getController();
        const oTile = new sap.m.GenericTile({ header: ELEARNING_MANAGEMENT_PAGE_CORRELATION_ANALYSIS_TITLE });
        oTile.addStyleClass("sapUiTinyMarginBegin")
             .addStyleClass("sapUiTinyMarginBottom")
             .attachPress(() => { oController.navTo(NAV_CORRELATION_ANALYSIS) });
        const oTileContent = new sap.m.TileContent();
        const oTileImageContent = new sap.m.ImageContent({ src: 'sap-icon://scatter-chart' });
        oTileContent.setContent(oTileImageContent);
        oTile.addTileContent(oTileContent);
        oHorizontalLayout.addContent(oTile);
    },

    createWarningDialog: function(oPage) {
        const oWarningDialog = new sap.m.Dialog('dashboardWarningDialog', { title: "Warning", titleAlignment: sap.m.TitleAlignment.Center, type: sap.m.DialogType.Message });
        const oWarningMessageStrip = new sap.m.MessageStrip('dashboardWarningDialogMessageStrip', { type: sap.ui.core.MessageType.Warning, showIcon: true });
        oWarningMessageStrip.addStyleClass("sapUiResponsiveMargin");
        const oWarningMessageDialogDismissButton = new sap.m.Button({ text: 'OK' , type: sap.m.ButtonType.Emphasized });
        oWarningMessageDialogDismissButton.attachPress(() => { oWarningDialog.close(); });
        oWarningDialog.addContent(oWarningMessageStrip);
        oWarningDialog.addButton(oWarningMessageDialogDismissButton);
        oPage.addContent(oWarningDialog);
    },

    applyModel: function() {
        const oModelObj = this.getModel().getProperty("/obj");
        const sMessage = oModelObj.getMessage();
        const oMiscStats = oModelObj.getMiscStats();

        if(sMessage) {
            this.showWarningMessage();
        }

        if(oMiscStats) {
            this.visualizeMiscStats();
        }
    },

    showWarningMessage: function() {
        const oController = this.getController();
        const oWarningDialogMessageStrip = oController.globalById('dashboardWarningDialogMessageStrip');
        const oWarningDialog = oController.globalById('dashboardWarningDialog');

        const oModelObj = this.getModel().getProperty("/obj");
        const sMessage = oModelObj.getMessage();
        oWarningDialogMessageStrip.setText(sMessage);

        oWarningDialog.open();
    },

    visualizeMiscStats: function() {
        const oController = this.getController();
        const oAverageGradeTileContent = oController.globalById('averageGradeTileContent');
        const oNumberOfGradesTileContent = oController.globalById('numberOfGradesTileContent');
        const oNumberOfLogsTileContent = oController.globalById('numberOfLogsTileContent');
        const oMostFrequentEventTileContent = oController.globalById('mostFrequentEventTileContent');

        const oModelObj = this.getModel().getProperty("/obj");
        const oMiscStats = oModelObj.getMiscStats();

        oAverageGradeTileContent.setValue(oMiscStats.averageGrade);
        oNumberOfGradesTileContent.setValue(oMiscStats.numberOfGrades);
        oNumberOfLogsTileContent.setValue(oMiscStats.numberOfLogs);
        oMostFrequentEventTileContent.setContentText(oMiscStats.mostFrequentEvent);
    },

    loadPage: function() {
        const oController = this.getController();
        oController.pageLoaded();
    }
 });
  