sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend(ELEARNING_MANAGEMENT_CONTROLLER_STATISTICAL_DISPERSION, {
        pageLoaded: function() {
            const oModel = this.getView().getModel();
            if(oModel && oModel.getProperty('/obj')) {
                // model has already been set - no need to do all the number crunching again as the data never changes
                return false;
            }
            return this.checkIfDataIsSufficientForLogsAnalysis();
        },

        saveModel: function(sErrorMessage, oStatisticalDispersion) {
            const oStatisticalDispersionObjectModel = new StatisticalDispersionObjectModel(oStatisticalDispersion);
            if(sErrorMessage) {
                oStatisticalDispersionObjectModel.setMessage(sErrorMessage);
            }
            this.passModel(oStatisticalDispersionObjectModel);
        },

        calculateStatisticalDispersion: function() {
            const oStatisticalDispersionObjectModel = this.getModelObjProperty();
            const oStatisticalDispersion = oStatisticalDispersionObjectModel.getStatisticalDispersion();
            const aUserIds = oStatisticalDispersion.userIds;
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
            oStatisticalDispersion.userIds = aNonDuplicateUserIds;

            const aUploadsAndSubmissionsPerUser = [];
            for(const uid of aNonDuplicateUserIds) {
                aUploadsAndSubmissionsPerUser.push(oUidsDistribution[uid]);
            }

            const dMean = this.calculateMean(aUploadsAndSubmissionsPerUser);
            oStatisticalDispersion.range = aUploadsAndSubmissionsPerUser.slice(-1)[0] - aUploadsAndSubmissionsPerUser[0];
            oStatisticalDispersion.variance = this.calculateVariance(dMean, aUploadsAndSubmissionsPerUser);
            oStatisticalDispersion.standardDeviation = Math.sqrt(oStatisticalDispersion.variance);

            this.passModel(oStatisticalDispersionObjectModel);
        },

        calculateVariance: function(dMean, aUploadsAndSubmissionsPerUser) {
            let dSumOfSquaredDifferences = 0;
            for(const iNumber of aUploadsAndSubmissionsPerUser) {
                const dDifferenceOfNumberAndMean = iNumber - dMean;
                dSumOfSquaredDifferences += Math.pow(dDifferenceOfNumberAndMean, 2);
            }
            return dSumOfSquaredDifferences / aUploadsAndSubmissionsPerUser.length;
        },
    });
});