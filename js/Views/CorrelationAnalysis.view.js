sap.ui.jsview(ELEARNING_MANAGEMENT_VIEW_CORRELATION_ANALYSIS, {
   
    getControllerName: function() {
       return ELEARNING_MANAGEMENT_CONTROLLER_CORRELATION_ANALYSIS;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(ELEARNING_MANAGEMENT_PAGE_CORRELATION_ANALYSIS, { title: ELEARNING_MANAGEMENT_PAGE_CORRELATION_ANALYSIS_TITLE, showNavButton: true });
        oPage.attachNavButtonPress(() => { oController.navToPrevious(); });
        this.createCorrelationAnalysisTable(oPage);
        this.createCorrelationAnalysisResultSection(oPage);
        this.createErrorDialog(oPage);
        return oPage;
    },

    createErrorDialog: function(oPage) {
        const oController = this.getController();
        const oErrorDialog = new sap.m.Dialog('correlationAnalysisErrorDialog', { title: "An Error has Occurred", titleAlignment: sap.m.TitleAlignment.Center, type: sap.m.DialogType.Message });
        const oErrorMessageStrip = new sap.m.MessageStrip('correlationAnalysisErrorDialogMessageStrip', { type: sap.ui.core.MessageType.Error, showIcon: true });
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

    createCorrelationAnalysisResultSection: function(oPage) {
        const oBlockLayout = new sap.ui.layout.BlockLayout('correlationAnalysisResultBlockLayout', { background: sap.ui.layout.BlockBackgroundType.Dashboard });
        const oBlockLayoutRow = new sap.ui.layout.BlockLayoutRow();
        const oBlockLayoutCell = new sap.ui.layout.BlockLayoutCell();

        this.fillResultBlockLayout(oBlockLayoutCell);

        oBlockLayoutRow.addContent(oBlockLayoutCell);
        oBlockLayout.addContent(oBlockLayoutRow);
        oBlockLayout.setVisible(false);
        oPage.addContent(oBlockLayout);
    },

    fillResultBlockLayout: function(oBlockLayoutCell) {
        const thisView = this;
        const oFlexBoxCorrelationAnalysisResult = new sap.m.FlexBox({ justifyContent: sap.m.FlexJustifyContent.Center, wrap: sap.m.FlexWrap.Wrap, alignItems: sap.m.FlexAlignItems.Center, direction: sap.m.FlexDirection.Row });
        const oRiskText = new sap.m.Title({ wrapping: true, textAlign: sap.ui.core.TextAlign.Center, text: "Considering ", titleStyle: sap.ui.core.TitleLevel.H5 });
        const oCorrelationExistsText = new sap.m.Title({ wrapping: true, textAlign: sap.ui.core.TextAlign.Center, text: "margin for error, a correlation between the grade of each student and the number of the files they have uploaded", titleStyle: sap.ui.core.TitleLevel.H5 });
        oCorrelationExistsText.addStyleClass('sapUiTinyMarginEnd');
        const oCorrelationSignificanceText = new sap.m.Title('correlationSignificanceText', { wrapping: true, textAlign: sap.ui.core.TextAlign.Center, text: "its significance cannot be determined.", titleStyle: sap.ui.core.TitleLevel.H5 });

        const oCorrelationAnalysisSignificanceLevelDropdown = new sap.m.Select();
        oCorrelationAnalysisSignificanceLevelDropdown.addStyleClass('sapUiTinyMarginBeginEnd')
                                                     .attachChange((oEvent) => { thisView.showCorrelationAnalysisResultForLevel(oEvent.getParameters().selectedItem.getKey()); })
        this.addSignificanceLevelsToDropdown(oCorrelationAnalysisSignificanceLevelDropdown);

        oFlexBoxCorrelationAnalysisResult.addItem(oRiskText);
        oFlexBoxCorrelationAnalysisResult.addItem(oCorrelationAnalysisSignificanceLevelDropdown);
        oFlexBoxCorrelationAnalysisResult.addItem(oCorrelationExistsText);
        oFlexBoxCorrelationAnalysisResult.addItem(oCorrelationSignificanceText);
        oBlockLayoutCell.addContent(oFlexBoxCorrelationAnalysisResult);
    },

    addSignificanceLevelsToDropdown: function(oDropdown) {
        for(const dLevel of CORRELATION_ANALYSIS_SIGNIFICANCE_LEVELS) {
            const sSignificancePercent = dLevel * 100;
            const oItem = new sap.ui.core.Item({ key: dLevel, text: sSignificancePercent + '%'});
            oDropdown.addItem(oItem);
        }
        oDropdown.setSelectedKey(DEFAULT_CORRELATION_ANALYSIS_SIGNIFICANCE_LEVEL);
    },

    createCorrelationAnalysisTable: function(oPage) {
        const oTable = new sap.m.Table('correlationAnalysisTable');
        oTable.addStyleClass("sapUiResponsiveMargin")
              .setWidth("auto");

        this.createCorrelationAnalysisTableHeader(oPage, oTable);
        this.createCorrelationAnalysisTableColumns(oTable);

        oTable.setVisible(false);
        oPage.addContent(oTable);
    },

    createCorrelationAnalysisTableHeader: function(oPage, oTable) {
        const oController = this.getController();
        const oHeaderToolbar = new sap.m.Toolbar();
        const oToolbarSpacer = new sap.m.ToolbarSpacer();
        const oHeadingLabel = new sap.m.Label('correlationAnalysisTableHeading');
        const oViewResultButton = new sap.m.Button({ type: sap.m.ButtonType.Emphasized, text: 'View analysis result' });
        oViewResultButton.attachPress(() => { oPage.scrollToElement(oController.globalById('correlationSignificanceText')); })
                         .setBusyIndicatorDelay(0)
                         .addStyleClass('sapUiTinyMarginBottom');
        oHeaderToolbar.addContent(oHeadingLabel);
        oHeaderToolbar.addContent(oToolbarSpacer);
        oHeaderToolbar.addContent(oViewResultButton);
        oTable.setHeaderToolbar(oHeaderToolbar);
    },

    createCorrelationAnalysisTableColumns: function(oTable) {
        const oUidColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle });
        oUidColumn.setWidth("33%")
                  .setHeader(new sap.m.Text({ text: "UID" }));
        const oGradeColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle, hAlign: sap.ui.core.TextAlign.Center });
        oGradeColumn.setWidth("33%")
                    .setHeader(new sap.m.Text({ text: "Grade" }));
        const oFilelUploadsColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle, hAlign: sap.ui.core.TextAlign.Center });
        oFilelUploadsColumn.setWidth("34%")
                            .setHeader(new sap.m.Text({ text: "File uploads" }));
        oTable.addColumn(oUidColumn);
        oTable.addColumn(oGradeColumn);
        oTable.addColumn(oFilelUploadsColumn);
    },

    loadPage: function() {
        const oController = this.getController();
        const oModel = this.getModel();
        const bPageLoadedInitiallySuccessfully = oController.pageLoaded();
        if(bPageLoadedInitiallySuccessfully) {
            // only if there are no validation errors or if the page has not been loaded previously the data can be parsed
            oController.calculateCorrelationAnalysis();
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
        const oCorrelationAnalysis = oModelObj.getCorrelationAnalysis();

        if(sMessage) {
            this.showErrorMessage();
        }

        if(oCorrelationAnalysis && typeof oCorrelationAnalysis.userIdsGradesUploads !== 'undefined') {
            this.createCorrelationAnalysisVisualization();
        }
    },

    createCorrelationAnalysisVisualization: function() {
        this.fillCorrelationAnalysisTable();
        this.showCorrelationAnalysisResultForLevel(DEFAULT_CORRELATION_ANALYSIS_SIGNIFICANCE_LEVEL);
    },

    showCorrelationAnalysisResultForLevel: function(dLevel) {
        const oController = this.getController();
        const oModelObj = this.getModel().getProperty("/obj");
        const oCorrelationAnalysis = oModelObj.getCorrelationAnalysis();
        const oCorrelationSignificanceText = oController.globalById('correlationSignificanceText');
        const oCorrelationAnalysisResultBlockLayout = oController.globalById('correlationAnalysisResultBlockLayout');
        if(!oCorrelationAnalysisResultBlockLayout.getVisible()) {
            oCorrelationAnalysisResultBlockLayout.setVisible(true);
        }

        const bIsCorrelationSignificantForDefaultLevel = oCorrelationAnalysis.correlationSignificance[dLevel];

        if(!bIsCorrelationSignificantForDefaultLevel) {
            oCorrelationSignificanceText.setText('would be statistically insignificant.');
            return;
        }

        oCorrelationSignificanceText.setText(this.getCorrelationStrengthAndPolarityText(oCorrelationAnalysis.pearsonCoefficient));
    },

    getCorrelationStrengthAndPolarityText: function(dPearsonCoefficient) {
        if(dPearsonCoefficient == 0) {
            return 'would be nonexistent.'
        }

        const sCorrelationStrengthAndPolarity = 'would be statistically significant'
        if(dPearsonCoefficient < 0.3) {
            return sCorrelationStrengthAndPolarity + ' and ' + this.getCorrelationPolarityText(dPearsonCoefficient) + ', but weak.';
        }

        if(dPearsonCoefficient < 0.5) {
            return sCorrelationStrengthAndPolarity + ', ' + this.getCorrelationPolarityText(dPearsonCoefficient) + ' and moderate.';
        }

        if(dPearsonCoefficient < 0.7) {
            return sCorrelationStrengthAndPolarity + ', ' + this.getCorrelationPolarityText(dPearsonCoefficient) + ' and considerable.';
        }

        if(dPearsonCoefficient < 0.9) {
            return sCorrelationStrengthAndPolarity + ', ' + this.getCorrelationPolarityText(dPearsonCoefficient) + ' and strong.';
        }

        if(dPearsonCoefficient < 1) {
            return sCorrelationStrengthAndPolarity + ', ' + this.getCorrelationPolarityText(dPearsonCoefficient) + ' and very strong.';
        }

        return sCorrelationStrengthAndPolarity + ', ' + this.getCorrelationPolarityText(dPearsonCoefficient) + ' and perfect.';
    },

    getCorrelationPolarityText: function(dPearsonCoefficient) {
        if(dPearsonCoefficient > 0) {
            return 'positive';
        }
        return 'negative';
    },

    fillCorrelationAnalysisTable: function() {
        const oController = this.getController();
        const oModelObj = this.getModel().getProperty("/obj");
        const oCorrelationAnalysis = oModelObj.getCorrelationAnalysis();
        const aUids = oCorrelationAnalysis.userIds;
        const oUidsGradesUploads = oCorrelationAnalysis.userIdsGradesUploads;
        let iTotalUploads = 0;
        for(const uid in oUidsGradesUploads) {
            iTotalUploads += oUidsGradesUploads[uid].filesUploaded;
        }

        const oTable = oController.globalById('correlationAnalysisTable');
        this.setTableHeaderText(aUids.length, iTotalUploads);
    
        for(const uid of aUids) {
            const oRow = new sap.m.ColumnListItem({ vAlign: sap.ui.core.VerticalAlign.Middle });
            oRow.addCell(new sap.m.Text({ text: uid }))
                .addCell(new sap.m.Text({ text: oUidsGradesUploads[uid].grade }))
                .addCell(new sap.m.Text({ text: oUidsGradesUploads[uid].filesUploaded }));
            oTable.addItem(oRow);
        }
        oTable.setVisible(true);
    },

    setTableHeaderText: function(iUsersCount, iFileUploadsCount) {
        const oController = this.getController();
        oController.globalById("correlationAnalysisTableHeading").setText("Grades & number of files uploaded for each user (" + iUsersCount + " user(s), " + iFileUploadsCount + " file upload(s) total)");
    },

    showErrorMessage: function() {
        const oController = this.getController();
        const oErrorDialogMessageStrip = oController.globalById('correlationAnalysisErrorDialogMessageStrip');
        const oErrorDialog = oController.globalById('correlationAnalysisErrorDialog');

        const oModelObj = this.getModel().getProperty("/obj");
        const sMessage = oModelObj.getMessage();
        oErrorDialogMessageStrip.setText(sMessage);

        oErrorDialog.open();
    }
 });
  