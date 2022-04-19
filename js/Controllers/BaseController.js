sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend(ELEARNING_MANAGEMENT_BASE_CONTROLLER, {
        toggleMainPageNav: function(toggle) {
            const sideNavigationToggleButton = this.globalById(SIDE_NAV_TOGGLE_BUTTON);
            sideNavigationToggleButton.setEnabled(toggle);
            for(const item of this.getMainPage().getSideContent().getItem().getItems()) {
                item.setEnabled(toggle);
            }
        },

        globalById: function(id) {
            return sap.ui.getCore().byId(id);
        },

        getRouter: function() {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },
    
        getApp: function() {
            return sap.ui.getCore().byId(ELEARNING_MANAGEMENT_APP);
        },

        getMainPage: function() {
            return this.globalById(ELEARNING_MANAGEMENT_PAGE_MAIN);
        },

        getFirstChildViewController: function() {
            return this.globalById(ELEARNING_MANAGEMENT_VIEW_FILE_UPLOAD).getController();
        },

        getCurrentRouteName: function() {
            const router = this.getFirstChildViewController().getRouter();
            const currentHash = router.getHashChanger().getHash();
            const routeInfo = router.getRouteInfoByHash(currentHash);
            return routeInfo && routeInfo.name != NAV_HOME ? routeInfo.name : NAV_DASHBOARD; 
        },

        getCurrentRouteArguments: function() {
            const router = this.getFirstChildViewController().getRouter();
            const currentHash = router.getHashChanger().getHash();
            return router.getRouteInfoByHash(currentHash).arguments;
        },

        navToPrevious: function(removeLastRoute = true) {
            const mainModel = this.getFirstChildViewController().getOwnerComponent().getModel();
            const routeHistory = mainModel.getProperty("/routeHistory");
            if(removeLastRoute) {
                routeHistory.splice(routeHistory.length - 1, 1); // remove the current route from the route history
            }
            const prevRoute = routeHistory.pop();
            let route = NAV_DASHBOARD;
            let args;

            if(prevRoute) {
                route = prevRoute.route;
                args = prevRoute.arguments;
                
                if(route == this.getCurrentRouteName()) {
                    route = NAV_DASHBOARD;
                }
            }

            this.navTo(route, args);
        },

        navTo: function(route, args) {
            this.getFirstChildViewController().getRouter().navTo(route, args);
        },

        passModel: function(obj) {
            this.setModelOnView(obj);
            this.getView().applyModel();
        },

        setModelOnView: function(obj) {
            const ob = {
                obj: obj
            };
            this.getView().setModel(new sap.ui.model.json.JSONModel(ob));
        },
      
        getModelObjProperty: function() {
            return this.getView().getModel().getProperty("/obj");
        },

        getAppDataObjectModel: function() {
            return this.getFirstChildViewController().getView().getModel().getProperty("/appData");
        },

        navigateToDashboard: function() {
            this.navTo(NAV_DASHBOARD);
        },

        requiredFieldChanged: function(oEvent) {
            const oSource = oEvent.getSource();
            if(oSource.getValueState() == sap.ui.core.ValueState.Error) {
                oSource.setValueState(sap.ui.core.ValueState.None);
            }
        },

        checkIfDataIsSufficientForLogsAnalysis: function() {
            let sErrorMessage = '';
            const aFileSubmissionsUploadsDescriptions = this.findAllFileSubmissionAndUploadsEntriesDescriptions();
            if(!aFileSubmissionsUploadsDescriptions.length) {
                sErrorMessage = 'No file submissions or uploaded course works & projects could be found in the Moodle logs file.';
                this.saveModel(sErrorMessage);
                return false;
            }

            const aFileSubmissionsUploadsUids = this.findAllUidsFromDescriptions(aFileSubmissionsUploadsDescriptions);
            if(!aFileSubmissionsUploadsUids.length) {
                sErrorMessage = 'No file submissions or uploaded course works & projects are associated with user IDs. Check the descriptions in the Moodle logs.';
                this.saveModel(sErrorMessage);
                return false;
            }

            const oFrequencyDistribution = {
                userIds: aFileSubmissionsUploadsUids
            };
            this.saveModel('', oFrequencyDistribution);

            return true;
        },

        findAllFileSubmissionAndUploadsEntriesDescriptions: function() {
            const oAppDataObjectModel  = this.getAppDataObjectModel();
            const aMoodleLogs = oAppDataObjectModel.getLogs();
            const aFileSubmissionsUploadsDescriptions = [];

            for(const oRow of aMoodleLogs) {
                const sEventContext = oRow[EVENT_CONTEXT_KEY];
                const sComponent = oRow[COMPONENT_KEY];
                if(sEventContext == FILE_SUBMISSIONS_EVENT_CONTEXT && sComponent == FILE_SUBMISSIONS_COMPONENT) {
                    aFileSubmissionsUploadsDescriptions.push(oRow.Description);
                }
            }

            return aFileSubmissionsUploadsDescriptions;
        },

        findAllUidsFromDescriptions: function(aDescriptions) {
            const aUids = [];
            for(const sDescription of aDescriptions) {
                const sDescriptionWithoutSingleQuotes = sDescription.replace(/'/g, '');
                const aSplittedDescription = sDescriptionWithoutSingleQuotes.split(USER_ID_DESCRIPTION_DELIMITER);
                if(aSplittedDescription.length != 2) {
                    // this means that the description is malformed, normally this split would just cause the first part of the string to be removed
                    // this description is invalid
                    continue;
                }
                const sRemainingDescription = aSplittedDescription[1];
                const aSplittedByWhitespaceRemainingDescription = sRemainingDescription.split(' ');
                const sExpectedUserId = aSplittedByWhitespaceRemainingDescription[0];
                const bIsExpectedUserIdActuallyId = /^\d+$/.test(sExpectedUserId);
                if(bIsExpectedUserIdActuallyId) {
                    aUids.push(sExpectedUserId);
                }
            }
            return aUids;
        },

        calculateMean: function(aSortedNumbersSet) {
            let iSumOfNumbers = 0;
            for(const iNumber of aSortedNumbersSet) {
                iSumOfNumbers += iNumber;
            }
            return iSumOfNumbers / aSortedNumbersSet.length;
        },

        escapeRegex: function(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        }
    });
});