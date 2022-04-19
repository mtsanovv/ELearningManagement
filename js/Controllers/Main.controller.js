sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend(ELEARNING_MANAGEMENT_CONTROLLER_MAIN, {
        onInit: function () {
            const thisController = this;
            this.applySavedTheme();
            // create all the views
            this.createViews().then(() => {
                // clean the request URL
                thisController.getRouter().navTo(NAV_HOME);
                // watch for route changes
                thisController.getRouter().attachRouteMatched(thisController.onRouteChange.bind(thisController));
                // switch to the file upload view when all views have been created
                thisController.getRouter().navTo(NAV_FILE_UPLOAD);
            });
        },

        pushCurrentRouteToRouteHistory: function() {
            const mainModel = this.getOwnerComponent().getModel();
            const newRoute = {
                route: this.getCurrentRouteName(),
                arguments: this.getCurrentRouteArguments()
            };
            if(mainModel) {
                const routeHistory = mainModel.getProperty('/routeHistory');
                routeHistory.push(newRoute);
            } else {
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel({
                        routeHistory: [newRoute]
                    })
                );
            }
        },

        createViews: async function() {
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: ELEARNING_MANAGEMENT_VIEW_FILE_UPLOAD, viewName: ELEARNING_MANAGEMENT_VIEW_FILE_UPLOAD})));
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: ELEARNING_MANAGEMENT_VIEW_DASHBOARD, viewName: ELEARNING_MANAGEMENT_VIEW_DASHBOARD})));
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: ELEARNING_MANAGEMENT_VIEW_FREQUENCY_DISTRIBUTION, viewName: ELEARNING_MANAGEMENT_VIEW_FREQUENCY_DISTRIBUTION})));
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: ELEARNING_MANAGEMENT_VIEW_CENTRAL_TENDENCY, viewName: ELEARNING_MANAGEMENT_VIEW_CENTRAL_TENDENCY})));
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: ELEARNING_MANAGEMENT_VIEW_STATISTICAL_DISPERSION, viewName: ELEARNING_MANAGEMENT_VIEW_STATISTICAL_DISPERSION})));
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: ELEARNING_MANAGEMENT_VIEW_CORRELATION_ANALYSIS, viewName: ELEARNING_MANAGEMENT_VIEW_CORRELATION_ANALYSIS})));
        },
    
        onRouteChange: function (oEvent) {
            const routeName = oEvent.getParameter("name");
            const args = oEvent.getParameter("arguments");
            switch(routeName) {
                case NAV_FILE_UPLOAD:
                    this.toggleMainPageNav(false);
                    this.getApp().to(ELEARNING_MANAGEMENT_VIEW_FILE_UPLOAD);
                    this.changeHTMLPageTitle(ELEARNING_MANAGEMENT_PAGE_FILE_UPLOAD_TITLE);
                    // no need to push route to route history as the file upload page can never be accessed after the files are submitted
                    break;
                case NAV_DASHBOARD:
                    if(!this.checkIfAppDataIsSet()) {
                        // prevent manual navigation to other pages unless AppDataObjectModel is set (the file upload & validation was successful)
                        break;
                    }
                    this.getApp().to(ELEARNING_MANAGEMENT_VIEW_DASHBOARD);
                    this.getApp().getCurrentPage().loadPage();
                    this.getView().changeSelectedNavKey(routeName);
                    this.changeHTMLPageTitle(ELEARNING_MANAGEMENT_PAGE_DASHBOARD_TITLE);
                    // no need to push route to route history as the dashboard doesn't have a back button
                    break;
                case NAV_FREQUENCY_DISTRIBUTION:
                    if(!this.checkIfAppDataIsSet()) {
                        // prevent manual navigation to other pages unless AppDataObjectModel is set (the file upload & validation was successful)
                        break;
                    }
                    this.getApp().to(ELEARNING_MANAGEMENT_VIEW_FREQUENCY_DISTRIBUTION);
                    this.getApp().getCurrentPage().loadPage();
                    this.getView().changeSelectedNavKey(routeName);
                    this.changeHTMLPageTitle(ELEARNING_MANAGEMENT_PAGE_FREQUENCY_DISTRIBUTION_TITLE);
                    this.pushCurrentRouteToRouteHistory();
                    break;
                case NAV_CENTRAL_TENDENCY:
                    if(!this.checkIfAppDataIsSet()) {
                        // prevent manual navigation to other pages unless AppDataObjectModel is set (the file upload & validation was successful)
                        break;
                    }
                    this.getApp().to(ELEARNING_MANAGEMENT_VIEW_CENTRAL_TENDENCY);
                    this.getApp().getCurrentPage().loadPage();
                    this.getView().changeSelectedNavKey(routeName);
                    this.changeHTMLPageTitle(ELEARNING_MANAGEMENT_PAGE_CENTRAL_TENDENCY_TITLE);
                    this.pushCurrentRouteToRouteHistory();
                    break;
                case NAV_STATISTICAL_DISPERSION:
                    if(!this.checkIfAppDataIsSet()) {
                        // prevent manual navigation to other pages unless AppDataObjectModel is set (the file upload & validation was successful)
                        break;
                    }
                    this.getApp().to(ELEARNING_MANAGEMENT_VIEW_STATISTICAL_DISPERSION);
                    this.getApp().getCurrentPage().loadPage();
                    this.getView().changeSelectedNavKey(routeName);
                    this.changeHTMLPageTitle(ELEARNING_MANAGEMENT_PAGE_STATISTICAL_DISPERSION_TITLE);
                    this.pushCurrentRouteToRouteHistory();
                    break;
                case NAV_CORRELATION_ANALYSIS:
                    if(!this.checkIfAppDataIsSet()) {
                        // prevent manual navigation to other pages unless AppDataObjectModel is set (the file upload & validation was successful)
                        break;
                    }
                    this.getApp().to(ELEARNING_MANAGEMENT_VIEW_CORRELATION_ANALYSIS);
                    this.getApp().getCurrentPage().loadPage();
                    this.getView().changeSelectedNavKey(routeName);
                    this.changeHTMLPageTitle(ELEARNING_MANAGEMENT_PAGE_CORRELATION_ANALYSIS_TITLE);
                    this.pushCurrentRouteToRouteHistory();
                    break;
            }
        },

        checkIfAppDataIsSet: function() {
            try {
                if(!this.getAppDataObjectModel()) {
                    return false;
                }
                return true;
            } catch(e) {
                return false;
            }
        },
    
        sideNavToggleClicked: function() {
            sap.ui.getCore().byId(ELEARNING_MANAGEMENT_PAGE_MAIN).toggleSideContentMode();
        },

        changeHTMLPageTitle: function(title) {
            document.title = "E-Learning Management | " + title;
        },
    
        changeThemeClicked: function() {
            const storage =  jQuery.sap.storage(jQuery.sap.storage.Type.local);
            const savedTheme = storage.get(SAVED_THEME_STORAGE_PREFIX); 
            const changeThemeDialog = sap.ui.getCore().byId('changeThemeDialog');
            const themeItems = sap.ui.getCore().byId('changeThemeList').getItems();
            let selectedThemeIndex = 0;
            for(let i = 0; i < THEMES.length; i++) {
                if(THEMES[i].id == savedTheme) {
                    selectedThemeIndex = i;
                    break;
                }
            }

            for(let i = 0; i < themeItems.length; i++) {
                if(i == selectedThemeIndex) {
                    themeItems[i].setIcon("sap-icon://sys-enter-2");
                    continue;
                }
                themeItems[i].setIcon(null);
            }

            changeThemeDialog.open();
        },

        themeChanged: function(themeId) {
            const storage =  jQuery.sap.storage(jQuery.sap.storage.Type.local);
            storage.put(SAVED_THEME_STORAGE_PREFIX, themeId);
            sap.ui.getCore().applyTheme(themeId);
        },

        applySavedTheme: function() {
            const storage =  jQuery.sap.storage(jQuery.sap.storage.Type.local);
            const savedTheme = storage.get(SAVED_THEME_STORAGE_PREFIX);
            if(!savedTheme) {
                this.themeChanged(DEFAULT_THEME);
                return;
            }
            sap.ui.getCore().applyTheme(savedTheme);
        }
    });
});