sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend(ELEARNING_MANAGEMENT_CONTROLLER_CORRELATION_ANALYSIS, {
        pageLoaded: function() {
            const oModel = this.getView().getModel();
            if(oModel && oModel.getProperty('/obj')) {
                // model has already been set - no need to do all the number crunching again as the data never changes
                return false;
            }
            return this.checkIfDataIsSufficientForCorrelationAnalysis();
        },

        checkIfDataIsSufficientForCorrelationAnalysis: function() {
            let sErrorMessage = '';
            const aFileUploadsDescriptions = this.findAllFileUploadsEntriesDescriptions();
            if(!aFileUploadsDescriptions.length) {
                sErrorMessage = 'No file uploads could be found in the Moodle logs file.';
                this.saveModel(sErrorMessage);
                return false;
            }

            const aFileUploadsUids = this.findAllUidsFromDescriptions(aFileUploadsDescriptions);
            if(!aFileUploadsUids.length) {
                sErrorMessage = 'No file uploads are associated with a user ID. Check the descriptions in the Moodle logs.';
                this.saveModel(sErrorMessage);
                return false;
            }

            if(this.checkIfUidsWithDuplicatesExistInGrades()) {
                sErrorMessage = 'One or more user IDs are associated with more than one grade. Make sure that each user ID has only one grade associated with it.';
                this.saveModel(sErrorMessage);
                return false;
            }

            const aNonDuplicateUidsFromGrades = this.findAllNonDuplicateUidsFromGrades();
            const aNonDuplicateUidsWithGradeAndUploads = this.findAllUidsThatHaveGradeAndFileUploads(aNonDuplicateUidsFromGrades, aFileUploadsUids);
            if(aNonDuplicateUidsWithGradeAndUploads.length < 3) {
                sErrorMessage = 'At least 3 user IDs need to be associated with file uploads and grades to perform correlation analysis.';
                this.saveModel(sErrorMessage);
                return false;
            }

            const oCorrelationAnalysis = {
                userIds: aNonDuplicateUidsWithGradeAndUploads
            };
            this.saveModel('', oCorrelationAnalysis);

            return true;
        },

        checkIfUidsWithDuplicatesExistInGrades: function() {
            const oAppDataObjectModel  = this.getAppDataObjectModel();
            const aGrades = oAppDataObjectModel.getGrades();
            const aAllUidsWithoutDuplicates = [];
            for(const oUidGradePair of aGrades) {
                const iUid = oUidGradePair.ID;
                const iIndexOfUidInNoDuplicatesArray = aAllUidsWithoutDuplicates.indexOf(iUid);
                if(iIndexOfUidInNoDuplicatesArray > -1) {
                    return true;
                }
                aAllUidsWithoutDuplicates.push(iUid);
            }
            return false;
        },

        findAllNonDuplicateUidsFromGrades: function() {
            const oAppDataObjectModel  = this.getAppDataObjectModel();
            const aGrades = oAppDataObjectModel.getGrades();
            const aAllUidsWithGrades = [];
            for(const oUidGradePair of aGrades) {
                aAllUidsWithGrades.push(oUidGradePair.ID);
            }

            const aNonDuplicateUids = aAllUidsWithGrades.filter(function(uid, index) {
                return aAllUidsWithGrades.indexOf(uid) == index;
            });

            return aNonDuplicateUids;
        },
        
        findAllUidsThatHaveGradeAndFileUploads: function(aNonDuplicateUidsFromGrades, aFileUploadsUids) {
            const aUidsWithGradeAndFileUploads = [];
            for(const iUid of aNonDuplicateUidsFromGrades) {
                if(aFileUploadsUids.indexOf(String(iUid)) != -1) {
                    aUidsWithGradeAndFileUploads.push(iUid);
                }
            }
            return aUidsWithGradeAndFileUploads;
        },

        findAllFileUploadsEntriesDescriptions: function() {
            const oAppDataObjectModel  = this.getAppDataObjectModel();
            const aMoodleLogs = oAppDataObjectModel.getLogs();
            const aFilsUploadsDescriptions = [];

            for(const oRow of aMoodleLogs) {
                const sEventName = oRow[LOGS_EVENT_NAME_KEY];
                if(sEventName == FILE_UPLOADS_EVENT_NAME) {
                    aFilsUploadsDescriptions.push(oRow.Description);
                }
            }

            return aFilsUploadsDescriptions;
        },

        saveModel: function(sErrorMessage, oCorrelationAnalysis) {
            const oCorrelationAnalysisObjectModel = new CorrelationAnalysisObjectModel(oCorrelationAnalysis);
            if(sErrorMessage) {
                oCorrelationAnalysisObjectModel.setMessage(sErrorMessage);
            }
            this.passModel(oCorrelationAnalysisObjectModel);
        },

        calculateCorrelationAnalysis: function() {
            const oCorrelationAnalysisObjectModel = this.getModelObjProperty();
            const oCorrelationAnalysis = oCorrelationAnalysisObjectModel.getCorrelationAnalysis();
            const aFileUploadsDescriptions = this.findAllFileUploadsEntriesDescriptions();
            const aFileUploadsUids = this.findAllUidsFromDescriptions(aFileUploadsDescriptions);
            const aUidsWithGradeAndUploads = oCorrelationAnalysis.userIds;
            const oDataForEachUserId = {};

            for(const id of aFileUploadsUids) {
                if(aUidsWithGradeAndUploads.indexOf(Number(id)) == -1) {
                    continue;
                }
                if(oDataForEachUserId[id] && oDataForEachUserId[id].filesUploaded) {
                    oDataForEachUserId[id].filesUploaded++;
                    continue;
                }
                oDataForEachUserId[id] = {};
                oDataForEachUserId[id].filesUploaded = 1;
            }
            this.addGradeForEachUserId(oDataForEachUserId);

            const dPearsonCoefficient = this.calculatePearsonCoefficient(oDataForEachUserId);
            const iDegreesOfFreedom = oCorrelationAnalysis.userIds.length - 2;
            const oCorrelationSignificance = this.findCorrelationSignificance(iDegreesOfFreedom, dPearsonCoefficient);

            oCorrelationAnalysis.userIdsGradesUploads = oDataForEachUserId;
            oCorrelationAnalysis.pearsonCoefficient = dPearsonCoefficient;
            oCorrelationAnalysis.correlationSignificance = oCorrelationSignificance;

            this.passModel(oCorrelationAnalysisObjectModel);
        },

        calculatePearsonCoefficient: function(oDataForEachUserId) {
            const numberOfIds = Object.keys(oDataForEachUserId).length;
            let iGradesSum = 0;
            let iUploadsSum = 0;
            let iGradesTimesUploadsSum = 0;
            let iGradesSquaredSum = 0;
            let iUploadsSquaredSum = 0;

            for(const id in oDataForEachUserId) {
                const iGrade = oDataForEachUserId[id].grade;
                const iFilesUploaded = oDataForEachUserId[id].filesUploaded;
                iGradesSum += iGrade;
                iUploadsSum += iFilesUploaded;
                iGradesSquaredSum += Math.pow(iGrade, 2);
                iUploadsSquaredSum += Math.pow(iFilesUploaded, 2);
                iGradesTimesUploadsSum += iGrade * iFilesUploaded;
            }

            const numerator = numberOfIds * iGradesTimesUploadsSum - iGradesSum * iUploadsSum;
            const radicand = (numberOfIds * iGradesSquaredSum - Math.pow(iGradesSum, 2)) * (numberOfIds * iUploadsSquaredSum - Math.pow(iUploadsSum, 2));
            const denominator = Math.sqrt(radicand);
            
            if(denominator == 0) {
                return 0;
            }

            return numerator / denominator;
        },

        findCorrelationSignificance: function(iDegreesOfFreedom, dPearsonCoefficient) {
            const oCorrelationSignificance = {};
            for(const dSignificanceLevel of CORRELATION_ANALYSIS_SIGNIFICANCE_LEVELS) {
                const dCriticalT = Math.pow(jStat.studentt.inv(dSignificanceLevel / 2, iDegreesOfFreedom), 2);
                const dCriticalR = Math.sqrt(dCriticalT / (dCriticalT + iDegreesOfFreedom));
                const bIsCorrelationSignificant = Math.abs(dPearsonCoefficient) >= dCriticalR;
                if(bIsCorrelationSignificant) {
                    oCorrelationSignificance[dSignificanceLevel] = true;
                    continue;
                }
                oCorrelationSignificance[dSignificanceLevel] = false;
            }
            return oCorrelationSignificance;
        },

        addGradeForEachUserId: function(oDataForEachUserId) {
            const oCorrelationAnalysisObjectModel = this.getModelObjProperty();
            const oCorrelationAnalysis = oCorrelationAnalysisObjectModel.getCorrelationAnalysis();
            const aUserIdsForAnalysis = oCorrelationAnalysis.userIds;
            const oAppDataObjectModel  = this.getAppDataObjectModel();
            const aGrades = oAppDataObjectModel.getGrades();
            for(const oUidGradePair of aGrades) {
                if(aUserIdsForAnalysis.indexOf(oUidGradePair.ID) == -1) {
                    continue;
                }
                oDataForEachUserId[oUidGradePair.ID].grade = oUidGradePair.Result;
            }
        },
    });
});