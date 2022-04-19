sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend(ELEARNING_MANAGEMENT_CONTROLLER_DASHBOARD, {
        pageLoaded: function() {
            if(this.getView().getModel()) {
                // model has already been set, data cannot change after the file upload page and so we don't have to do anything
                return;
            }
            this.calculateMiscStats();
        },

        calculateMiscStats: function() {
            const oAppDataObjectModel = this.getAppDataObjectModel();
            const aGrades = oAppDataObjectModel.getGrades();
            const aMoodleLogs = oAppDataObjectModel.getLogs();
            const dAverageGrade = this.calculateAverageGrade(aGrades);
            const iNumberOfGrades = aGrades.length;
            const iNumberOfLogs = aMoodleLogs.length;
            const sMostFrequentEvent = this.findMostFrequentEvent(aMoodleLogs);
            let sWarningMessage = '';
            if(aGrades.length == 1 || aMoodleLogs.length == 1) {
                sWarningMessage = 'The Moodle logs file and/or the grades file contain(s) only one entry, which might be insufficient for some purposes.';
            }
            this.saveModel(sWarningMessage, dAverageGrade, iNumberOfGrades, iNumberOfLogs, sMostFrequentEvent);
        },

        calculateAverageGrade: function(aGrades) {
            let gradesSum = 0;
            for(const oRow of aGrades) {
                gradesSum += oRow.Result;
            }
            return gradesSum / aGrades.length;
        },

        findMostFrequentEvent: function(aMoodleLogs) {
            const oEventDistribution = {};
            for(const oRow of aMoodleLogs) {
                const sEventName = oRow[LOGS_EVENT_NAME_KEY];
                if(!oEventDistribution[sEventName]) {
                    oEventDistribution[sEventName] = 1;
                    continue;
                }
                oEventDistribution[sEventName]++;
            }
            let eventNames = Object.keys(oEventDistribution);
            // sort the keys according to their values: from the biggest to smallest
            eventNames.sort((eventA, eventB) => { return oEventDistribution[eventB] - oEventDistribution[eventA]; });
            return eventNames[0];
        },

        saveModel: function(sWarningMessage, dAverageGrade, iNumberOfGrades, iNumberOfLogs, sMostFrequentEvent) {
            const oMiscStats = {
                averageGrade: dAverageGrade,
                numberOfGrades: iNumberOfGrades,
                numberOfLogs: iNumberOfLogs,
                mostFrequentEvent: sMostFrequentEvent
            };
            const oDashboardObjectModel = new DashboardObjectModel(oMiscStats);
            if(sWarningMessage) {
                oDashboardObjectModel.setMessage(sWarningMessage);
            }
            this.passModel(oDashboardObjectModel);
        }
    });
});