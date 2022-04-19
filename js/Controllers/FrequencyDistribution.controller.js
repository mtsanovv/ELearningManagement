sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend(ELEARNING_MANAGEMENT_CONTROLLER_FREQUENCY_DISTRIBUTION, {
        pageLoaded: function() {
            const oModel = this.getView().getModel();
            if(oModel && oModel.getProperty('/obj')) {
                // model has already been set - no need to do all the number crunching again as the data never changes
                return false;
            }
            return this.checkIfDataIsSufficientForLogsAnalysis();
        },

        saveModel: function(sErrorMessage, oFrequencyDistribution) {
            const oFrequencyDistributionObjectModel = new FrequencyDistributionObjectModel(oFrequencyDistribution);
            if(sErrorMessage) {
                oFrequencyDistributionObjectModel.setMessage(sErrorMessage);
            }
            this.passModel(oFrequencyDistributionObjectModel);
        },

        calculateFrequencyDistribution: function() {
            const oFrequencyDistributionObjectModel = this.getModelObjProperty();
            const oFrequencyDistribution = oFrequencyDistributionObjectModel.getFrequencyDistribution();
            const aUserIds = oFrequencyDistribution.userIds;
            const oUidsDistribution = {};
            for(const id of aUserIds) {
                if(!oUidsDistribution[id]) {
                    oUidsDistribution[id] = 1;
                    continue;
                }
                oUidsDistribution[id]++;
            }
            aUserIds.sort((uidA, uidB) => { 
                const comparisonResult =  oUidsDistribution[uidA] - oUidsDistribution[uidB];
                if(comparisonResult == 0) {
                    return uidA - uidB;
                }
                return comparisonResult;
            });
            
            const aNonDuplicateUserIds = aUserIds.filter(function(uid, index) {
                return aUserIds.indexOf(uid) == index;
            });
            oFrequencyDistribution.userIds = aNonDuplicateUserIds;
            oFrequencyDistribution.userIdsDistribution = oUidsDistribution;
            this.passModel(oFrequencyDistributionObjectModel);
        },
    });
});