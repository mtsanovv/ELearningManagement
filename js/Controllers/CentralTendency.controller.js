sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend(ELEARNING_MANAGEMENT_CONTROLLER_CENTRAL_TENDENCY, {
        pageLoaded: function() {
            const oModel = this.getView().getModel();
            if(oModel && oModel.getProperty('/obj')) {
                // model has already been set - no need to do all the number crunching again as the data never changes
                return false;
            }
            return this.checkIfDataIsSufficientForLogsAnalysis();
        },

        saveModel: function(sErrorMessage, oCentralTendency) {
            const oCentralTendencyObjectModel = new CentralTendencyObjectModel(oCentralTendency);
            if(sErrorMessage) {
                oCentralTendencyObjectModel.setMessage(sErrorMessage);
            }
            this.passModel(oCentralTendencyObjectModel);
        },

        calculateCentralTendency: function() {
            const oCentralTendencyObjectModel = this.getModelObjProperty();
            const oCentralTendency = oCentralTendencyObjectModel.getCentralTendency();
            const aUserIds = oCentralTendency.userIds;
            const oUidsDistribution = {};
            for(const id of aUserIds) {
                if(!oUidsDistribution[id]) {
                    oUidsDistribution[id] = 1;
                    continue;
                }
                oUidsDistribution[id]++;
            }
            aUserIds.sort((uidA, uidB) => { 
                return oUidsDistribution[uidA] - oUidsDistribution[uidB];
            });
            
            const aNonDuplicateUserIds = aUserIds.filter(function(uid, index) {
                return aUserIds.indexOf(uid) == index;
            });
            oCentralTendency.userIds = aNonDuplicateUserIds;

            const aUploadsAndSubmissionsPerUser = [];
            for(const uid of aNonDuplicateUserIds) {
                aUploadsAndSubmissionsPerUser.push(oUidsDistribution[uid]);
            }
            oCentralTendency.mean = this.calculateMean(aUploadsAndSubmissionsPerUser);
            oCentralTendency.median = this.calculateMedian(aUploadsAndSubmissionsPerUser);
            oCentralTendency.modes = this.findModes(aUploadsAndSubmissionsPerUser);
            this.passModel(oCentralTendencyObjectModel);
        },

        findModes: function(aSortedNumbersSet) {
            const aModes = [];
            const oNumberOccurrences = {};
            for(const iNumber of aSortedNumbersSet) {
                if(!oNumberOccurrences[iNumber]) {
                    oNumberOccurrences[iNumber] = 1;
                    continue;
                }
                oNumberOccurrences[iNumber]++;
            }
            aSortedNumbersSet.sort((numA, numB) => { return oNumberOccurrences[numB] - oNumberOccurrences[numA]; });
            for(let i = 0; i < aSortedNumbersSet.length; i++) {
                const iCurrentNumber = aSortedNumbersSet[i];
                const iOccurrencesOfCurrentNumber = oNumberOccurrences[iCurrentNumber];
                if(i == 0 && iOccurrencesOfCurrentNumber == 1) {
                    break;
                }
                if(i > 0 && iOccurrencesOfCurrentNumber < oNumberOccurrences[aSortedNumbersSet[i - 1]]) {
                    break;
                }
                if(i > 0 && iCurrentNumber == aSortedNumbersSet[i - 1]) {
                    continue;
                }
                aModes.push(iCurrentNumber);
            }
            return aModes;
        },

        calculateMedian: function(aSortedNumbersSet) {
            if(aSortedNumbersSet.length % 2 == 1) {
                const iIndexOfMedianElement = (aSortedNumbersSet.length + 1) / 2 - 1;
                return aSortedNumbersSet[iIndexOfMedianElement];
            }
            const iIndexOfFirstMiddleElement = aSortedNumbersSet.length / 2 - 1;
            const iIndexOfSecondMiddleElement = iIndexOfFirstMiddleElement + 1;
            return (aSortedNumbersSet[iIndexOfFirstMiddleElement] + aSortedNumbersSet[iIndexOfSecondMiddleElement]) / 2;
        },
    });
});