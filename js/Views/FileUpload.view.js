sap.ui.jsview(ELEARNING_MANAGEMENT_VIEW_FILE_UPLOAD, {
   
    getControllerName: function() {
       return ELEARNING_MANAGEMENT_CONTROLLER_FILE_UPLOAD;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(ELEARNING_MANAGEMENT_PAGE_FILE_UPLOAD, { title: ELEARNING_MANAGEMENT_PAGE_FILE_UPLOAD_TITLE });
        this.createForm(oPage);
        this.createErrorDialog(oPage);
        return oPage;
    },

    createForm: function(oPage) {
        const oBlockLayout = new sap.ui.layout.BlockLayout({ background: sap.ui.layout.BlockBackgroundType.Dashboard });
        const oBlockLayoutRow = new sap.ui.layout.BlockLayoutRow();
        const oBlockLayoutCell = new sap.ui.layout.BlockLayoutCell();
        this.fillFormBlockLayout(oBlockLayoutCell);
        oBlockLayoutRow.addContent(oBlockLayoutCell);
        oBlockLayout.addContent(oBlockLayoutRow);
        oPage.addContent(oBlockLayout);
    },

    fillFormBlockLayout: function(oBlockLayoutCell) {
        const oWrappingFlexBox = new sap.m.FlexBox({ alignItems: sap.m.FlexAlignItems.Center, direction: sap.m.FlexDirection.Column });
        this.createUploadStudentGrades(oWrappingFlexBox);
        this.createUploadMoodleLogs(oWrappingFlexBox);
        this.createSubmitButton(oWrappingFlexBox);
        oBlockLayoutCell.addContent(oWrappingFlexBox);
    },

    createUploadMoodleLogs: function(oWrappingFlexBox) {
        const oController = this.getController();
        const oFlexBoxMoodleLogsUpload = new sap.m.FlexBox({ justifyContent: sap.m.FlexJustifyContent.Center, wrap: sap.m.FlexWrap.Wrap, alignItems: sap.m.FlexAlignItems.Center, direction: sap.m.FlexDirection.Row });
        const oMoodleLogsUploadLabel = new sap.m.Label({ text: 'Choose Moodle logs file:', required: true });
        const oMoodleLogsFileUploader = new sap.ui.unified.FileUploader('moodleLogsFileUploader', { placeholder: FILE_UPLOAD_NO_FILE_SELECTED, fileType: ['xls', 'xlsx'], sameFilenameAllowed: true });
        oMoodleLogsUploadLabel.addStyleClass('sapUiMediumMarginEnd');
        oMoodleLogsFileUploader.attachChange((oEvent) => { oController.requiredFieldChanged(oEvent); });
        oFlexBoxMoodleLogsUpload.addItem(oMoodleLogsUploadLabel);
        oFlexBoxMoodleLogsUpload.addItem(oMoodleLogsFileUploader);
        oWrappingFlexBox.addItem(oFlexBoxMoodleLogsUpload);
    },

    createUploadStudentGrades: function(oWrappingFlexBox) {
        const oController = this.getController();
        const oFlexBoxGradesUpload = new sap.m.FlexBox({ justifyContent: sap.m.FlexJustifyContent.Center, wrap: sap.m.FlexWrap.Wrap, alignItems: sap.m.FlexAlignItems.Center, direction: sap.m.FlexDirection.Row });
        const oGradesUploadLabel = new sap.m.Label({ text: 'Choose student grades file:', required: true });
        const oGradesFileUploader = new sap.ui.unified.FileUploader('gradesFileUploader', { placeholder: FILE_UPLOAD_NO_FILE_SELECTED, fileType: ['xls', 'xlsx'], sameFilenameAllowed: true });
        oGradesUploadLabel.addStyleClass('sapUiSmallMarginEnd');
        oGradesFileUploader.attachChange((oEvent) => { oController.requiredFieldChanged(oEvent); });
        oFlexBoxGradesUpload.addItem(oGradesUploadLabel);
        oFlexBoxGradesUpload.addItem(oGradesFileUploader);
        oWrappingFlexBox.addItem(oFlexBoxGradesUpload);
    },

    createSubmitButton: function(oWrappingFlexBox) {
        const oController = this.getController();
        const oSubmitButton = new sap.m.Button('fileUploadSubmitButton', { type: sap.m.ButtonType.Emphasized, text: 'Submit', width: '100px' });
        oSubmitButton.attachPress(() => { oController.submitFiles(); })
                     .setBusyIndicatorDelay(0)
                     .addStyleClass('sapUiMediumMarginTop');
        oWrappingFlexBox.addItem(oSubmitButton);
    },

    createErrorDialog: function(oPage) {
        const oErrorDialog = new sap.m.Dialog('fileUploadErrorDialog', { title: "An Error has Occurred", titleAlignment: sap.m.TitleAlignment.Center, type: sap.m.DialogType.Message });
        const oErrorMessageStrip = new sap.m.MessageStrip('fileUploadErrorDialogMessageStrip', { type: sap.ui.core.MessageType.Error, showIcon: true });
        oErrorMessageStrip.addStyleClass("sapUiResponsiveMargin");
        const oErrorMessageDialogDismissButton = new sap.m.Button({ text: 'Dismiss' , type: sap.m.ButtonType.Emphasized });
        oErrorMessageDialogDismissButton.attachPress(() => { oErrorDialog.close(); });
        oErrorDialog.addContent(oErrorMessageStrip);
        oErrorDialog.addButton(oErrorMessageDialogDismissButton);
        oPage.addContent(oErrorDialog);
    },

    applyModel: function() {
        const oModelObj = this.getModel().getProperty("/obj");
        const sMessage = oModelObj.getMessage();
        const bAtLeastOneInputValidationFailed = oModelObj.getMoodleLogsInputValidationFailed() || oModelObj.getGradesInputValidationFailed();

        if(sMessage) {
            this.showSubmitErrorMessage();
        }

        if(bAtLeastOneInputValidationFailed) {
            this.showValidationStatus();
        }
    },

    showSubmitErrorMessage: function() {
        const oController = this.getController();
        const oErrorDialogMessageStrip = oController.globalById('fileUploadErrorDialogMessageStrip');
        const oErrorDialog = oController.globalById('fileUploadErrorDialog');

        const oModelObj = this.getModel().getProperty("/obj");
        const sMessage = oModelObj.getMessage();
        oErrorDialogMessageStrip.setText(sMessage);

        oErrorDialog.open();
    },

    showValidationStatus: function() {
        const oController = this.getController();
        const oModelObj = this.getModel().getProperty("/obj");
        const oMoodleLogsFileUploader = oController.globalById('moodleLogsFileUploader');
        const oGradesFileUploader = oController.globalById('gradesFileUploader');
        if(oModelObj.getMoodleLogsInputValidationFailed()) {
            oMoodleLogsFileUploader.setValueState(sap.ui.core.ValueState.Error);
        }

        if(oModelObj.getGradesInputValidationFailed()) {
            oGradesFileUploader.setValueState(sap.ui.core.ValueState.Error);
        }
    },
 });
  