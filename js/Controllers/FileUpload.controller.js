sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend(ELEARNING_MANAGEMENT_CONTROLLER_FILE_UPLOAD, {
        submitFiles: async function() {
            const bIsUserInputValid = await this.tryParsingUserInput();
            if(!bIsUserInputValid) {
                return;
            }
            this.createAppDataObjectModel();
            this.toggleMainPageNav(true);
            this.navigateToDashboard();
        },

        createAppDataObjectModel: function() {
            const oFileUploadObjectModel = this.getModelObjProperty();
            const aGrades = oFileUploadObjectModel.getGrades();
            const aMoodleLogs = oFileUploadObjectModel.getLogs();
            const oAppDataObjectModel = new AppDataObjectModel(aGrades, aMoodleLogs);
            this.setAppDataObjectModel(oAppDataObjectModel);
        },

        setAppDataObjectModel: function(oAppDataObjectModel) {
            const ob = {
                appData: oAppDataObjectModel
            };
            this.getView().setModel(new sap.ui.model.json.JSONModel(ob));
        },

        tryParsingUserInput: async function() {
            const oMoodleLogsFileUploader = this.globalById('moodleLogsFileUploader');
            const oGradesFileUploader = this.globalById('gradesFileUploader');
            const oMoodleLogsFileUploaderInput = oMoodleLogsFileUploader.oFileUpload;
            const oGradesFileUploaderInput = oGradesFileUploader.oFileUpload;

            if(!this.checkForEmptyFileInputs(oMoodleLogsFileUploaderInput, oGradesFileUploaderInput)) {
                return false;
            }

            const oMoodleLogsFile = oMoodleLogsFileUploaderInput.files[0];
            const oGradesFile = oGradesFileUploaderInput.files[0];

            const oGradesWorkbook = await this.tryParseExcelFile(oGradesFile);
            const oMoodleLogsWorkbook = await this.tryParseExcelFile(oMoodleLogsFile);

            if(!this.checkIfFileParsingSucceeded(oMoodleLogsWorkbook, oGradesWorkbook)) {
                return false;
            }

            if(this.checkForFilesWithMultipleSheets(oMoodleLogsWorkbook, oGradesWorkbook)) {
                return false;
            }

            const aGrades = this.convertWorkbookToArray(oGradesWorkbook);
            const aMoodleLogs = this.convertWorkbookToArray(oMoodleLogsWorkbook);

            if(!this.validateGradesDataStructure(aGrades)) {
                return false;
            }

            if(!this.validateMoodleLogsDataStructure(aMoodleLogs)) {
                return false;
            }

            const oFileUploadObjectModel = new FileUploadObjectModel(aGrades, aMoodleLogs);
            this.setModelOnView(oFileUploadObjectModel);
            // add the valid objects to the model and set it on the view in case all checks were successful

            return true;
        },

        validateMoodleLogsDataStructure: function(aMoodleLogs) {
            const oFileUploadObjectModel = new FileUploadObjectModel();

            if(aMoodleLogs == null) {
                oFileUploadObjectModel.setMoodleLogsInputValidationFailed(true);
                oFileUploadObjectModel.setMessage("Moodle logs file cannot be empty.");
                this.passModel(oFileUploadObjectModel);
                return false;
            }

            for(const oRow of aMoodleLogs) { 
                const oMoodleLogsKeys = Object.keys(oRow);

                for(const sKey of MOODLE_LOGS_REQUIRED_KEYS) {
                    if(sKey == ROW_NUM_KEY) {
                        continue; // ignore the __rowNum__ key
                    }
                    if(oMoodleLogsKeys.indexOf(sKey) == -1) {
                        const iActualRowNum = Number(oRow.__rowNum__) + 1; // row counting starts from the first row after the row that contains the column headers
                        oFileUploadObjectModel.setMoodleLogsInputValidationFailed(true);
                        oFileUploadObjectModel.setMessage("Missing required value for '" + sKey + "' on row " + iActualRowNum + ' in the Moodle logs file.');
                        this.passModel(oFileUploadObjectModel);
                        return false;
                    }
                }
            }

            return true;
        }, 

        validateGradesDataStructure: function(aGrades) {
            const oFileUploadObjectModel = new FileUploadObjectModel();

            if(aGrades == null) {
                oFileUploadObjectModel.setGradesInputValidationFailed(true);
                oFileUploadObjectModel.setMessage("Grades file cannot be empty.");
                this.passModel(oFileUploadObjectModel);
                return false;
            }

            for(const oRow of aGrades) { 
                const oGradesKeys = Object.keys(oRow);
                const iActualRowNum = Number(oRow.__rowNum__) + 1; // row counting starts from the first row after the row that contains the column headers

                for(const sKey of GRADES_REQUIRED_KEYS) {
                    if(sKey == ROW_NUM_KEY) {
                        continue; // ignore the __rowNum__ key
                    }

                    if(oGradesKeys.indexOf(sKey) == -1) {
                        oFileUploadObjectModel.setGradesInputValidationFailed(true);
                        oFileUploadObjectModel.setMessage("Missing required value for '" + sKey + "' on row " + iActualRowNum + ' in the grades file.');
                        this.passModel(oFileUploadObjectModel);
                        return false;
                    }

                    const iStudentGrade = oRow[GRADES_RESULT_KEY];
                    if(!(iStudentGrade >= 2 && iStudentGrade <= 6)) {
                        oFileUploadObjectModel.setGradesInputValidationFailed(true);
                        oFileUploadObjectModel.setMessage("Result should be a number between 2 and 6 on row " + iActualRowNum + ' in the grades file.');
                        this.passModel(oFileUploadObjectModel);
                        return false;
                    }
                }
            }

            return true;
        },

        convertWorkbookToArray(oWorkbook) {
            const sfirstSheetName = oWorkbook.SheetNames[0];
            const aConvertedSheet = XLSX.utils.sheet_to_row_object_array(oWorkbook.Sheets[sfirstSheetName]);

            if(aConvertedSheet.length > 0) {
                return aConvertedSheet;
            }

            return null;
        },

        checkIfFileParsingSucceeded: function(oMoodleLogsWorkbook, oGradesWorkbook) {
            const oFileUploadObjectModel = new FileUploadObjectModel();

            if(oMoodleLogsWorkbook == null) {
                oFileUploadObjectModel.setMoodleLogsInputValidationFailed(true);
                oFileUploadObjectModel.setMessage("Could not parse the Moodle logs file - check its validity.");
                this.passModel(oFileUploadObjectModel);
                return false;
            }

            if(oGradesWorkbook == null) {
                oFileUploadObjectModel.setGradesInputValidationFailed(true);
                oFileUploadObjectModel.setMessage("Could not parse the student grades file - check its validity.");
                this.passModel(oFileUploadObjectModel);
                return false;
            }

            return true;
        },

        checkForEmptyFileInputs: function(oMoodleLogsFileUploaderInput, oGradesFileUploaderInput) {
            const oFileUploadObjectModel = new FileUploadObjectModel();

            if(!oMoodleLogsFileUploaderInput.files.length) {
                oFileUploadObjectModel.setMoodleLogsInputValidationFailed(true);
            }

            if(!oGradesFileUploaderInput.files.length) {
                oFileUploadObjectModel.setGradesInputValidationFailed(true);
            }

            if(oFileUploadObjectModel.getMoodleLogsInputValidationFailed() || oFileUploadObjectModel.getGradesInputValidationFailed()) {
                oFileUploadObjectModel.setMessage("You need to select a file for each input.");
                this.passModel(oFileUploadObjectModel);
                return false;
            }

            return true;
        },

        checkForFilesWithMultipleSheets: function(oMoodleLogsWorkbook, oGradesWorkbook) {
            const oFileUploadObjectModel = new FileUploadObjectModel();

            const oMoodleLogsSheetsCount = oMoodleLogsWorkbook.SheetNames.length;
            const oGradesFileSheetsCount = oGradesWorkbook.SheetNames.length;

            if(oMoodleLogsSheetsCount > 1) {
                oFileUploadObjectModel.setMoodleLogsInputValidationFailed(true);
            }

            if(oGradesFileSheetsCount > 1) {
                oFileUploadObjectModel.setGradesInputValidationFailed(true);
            }

            if(oMoodleLogsSheetsCount > 1 || oGradesFileSheetsCount > 1) {
                oFileUploadObjectModel.setMessage("Files should contain only one sheet.");
                this.passModel(oFileUploadObjectModel);
                return true;
            }

            return false;
        },

        tryParseExcelFile: function(oFile) {
            const thisController = this;
            const oFileWillBeReadPromise = new Promise((fResolve, fReject) => {
                thisController.parseExcelFile(oFile, fResolve, fReject);
            });
            return oFileWillBeReadPromise;
        },

        parseExcelFile: function(oFile, fResolve, fReject) {
            const thisController = this;
            const oReader = new FileReader();
            try {
                oReader.readAsBinaryString(oFile);
                oReader.onload = function(oEvent) {
                    thisController.parseWorkbookFromFileReaderEvent(oEvent, fResolve);
                }
            } catch(e) {
                fResolve(null);
            }
        },

        parseWorkbookFromFileReaderEvent: function(oEvent, fResolve) {
            try {
                const oFileData = oEvent.target.result;
                fResolve(XLSX.read(oFileData, { type : 'binary' }));
            } catch(e) {
                fResolve(null);
            }
        },
    });
});