const ELEARNING_MANAGEMENT_APP = 'ELearningManagement.App';
const ELEARNING_MANAGEMENT_COMPONENT = 'ELearningManagement';

const ELEARNING_MANAGEMENT_PAGE_MAIN = 'ELearningManagement.Pages.Main';
const ELEARNING_MANAGEMENT_PAGE_FILE_UPLOAD = 'ELearningManagement.Pages.FileUpload';
const ELEARNING_MANAGEMENT_PAGE_DASHBOARD = 'ELearningManagement.Pages.Dashboard';
const ELEARNING_MANAGEMENT_PAGE_FREQUENCY_DISTRIBUTION = 'ELearningManagement.Pages.FrequencyDistribution';
const ELEARNING_MANAGEMENT_PAGE_CENTRAL_TENDENCY = 'ELearningManagement.Pages.CentralTendency';
const ELEARNING_MANAGEMENT_PAGE_STATISTICAL_DISPERSION = 'ELearningManagement.Pages.StatisticalDispersion';
const ELEARNING_MANAGEMENT_PAGE_CORRELATION_ANALYSIS = 'ELearningManagement.Pages.CorrelationAnalysis';

const ELEARNING_MANAGEMENT_PAGE_FILE_UPLOAD_TITLE = 'File upload';
const ELEARNING_MANAGEMENT_PAGE_DASHBOARD_TITLE = 'Dashboard';
const ELEARNING_MANAGEMENT_PAGE_FREQUENCY_DISTRIBUTION_TITLE = 'Frequency distribution';
const ELEARNING_MANAGEMENT_PAGE_CENTRAL_TENDENCY_TITLE = 'Central tendency';
const ELEARNING_MANAGEMENT_PAGE_STATISTICAL_DISPERSION_TITLE = 'Statistical dispersion';
const ELEARNING_MANAGEMENT_PAGE_CORRELATION_ANALYSIS_TITLE = 'Correlation analysis';

const ELEARNING_MANAGEMENT_VIEW_MAIN = 'ELearningManagement.Views.Main';
const ELEARNING_MANAGEMENT_VIEW_FILE_UPLOAD = 'ELearningManagement.Views.FileUpload';
const ELEARNING_MANAGEMENT_VIEW_DASHBOARD = 'ELearningManagement.Views.Dashboard';
const ELEARNING_MANAGEMENT_VIEW_FREQUENCY_DISTRIBUTION = 'ELearningManagement.Views.FrequencyDistribution';
const ELEARNING_MANAGEMENT_VIEW_CENTRAL_TENDENCY = 'ELearningManagement.Views.CentralTendency';
const ELEARNING_MANAGEMENT_VIEW_STATISTICAL_DISPERSION = 'ELearningManagement.Views.StatisticalDispersion';
const ELEARNING_MANAGEMENT_VIEW_CORRELATION_ANALYSIS = 'ELearningManagement.Views.CorrelationAnalysis';

const ELEARNING_MANAGEMENT_BASE_CONTROLLER = 'ELearningManagement.Controllers.Base';
const ELEARNING_MANAGEMENT_CONTROLLER_MAIN = 'ELearningManagement.Controllers.Main';
const ELEARNING_MANAGEMENT_CONTROLLER_FILE_UPLOAD = 'ELearningManagement.Controllers.FileUpload';
const ELEARNING_MANAGEMENT_CONTROLLER_DASHBOARD = 'ELearningManagement.Controllers.Dashboard';
const ELEARNING_MANAGEMENT_CONTROLLER_FREQUENCY_DISTRIBUTION = 'ELearningManagement.Controllers.FrequencyDistribution';
const ELEARNING_MANAGEMENT_CONTROLLER_CENTRAL_TENDENCY = 'ELearningManagement.Controllers.CentralTendency';
const ELEARNING_MANAGEMENT_CONTROLLER_STATISTICAL_DISPERSION = 'ELearningManagement.Controllers.StatisticalDispersion';
const ELEARNING_MANAGEMENT_CONTROLLER_CORRELATION_ANALYSIS = 'ELearningManagement.Controllers.CorrelationAnalysis';

const FILE_UPLOAD_NO_FILE_SELECTED = 'No file selected';

const SIDE_NAV_TOGGLE_BUTTON = "sideNavigationToggleButton";
const NAV_HOME = 'home';
const NAV_FILE_UPLOAD = 'fileUpload';
const NAV_DASHBOARD = 'dashboard';
const NAV_FREQUENCY_DISTRIBUTION = 'frequencyDistribution';
const NAV_CENTRAL_TENDENCY = 'centralTendency';
const NAV_STATISTICAL_DISPERSION = 'statisticalDispersion';
const NAV_CORRELATION_ANALYSIS = 'correlationAnalysis';

const ROUTING_METADATA_CONFIG = {
    rootView: {
        viewName: ELEARNING_MANAGEMENT_VIEW_MAIN,
        type: "JS",
        async: true,
        id: ELEARNING_MANAGEMENT_VIEW_MAIN
    },
    routing: {
        routes: {
            [NAV_HOME]: {
                pattern: ""
            },
            [NAV_FILE_UPLOAD]: {
                pattern: NAV_FILE_UPLOAD
            },
            [NAV_DASHBOARD]: {
                pattern: NAV_DASHBOARD
            },
            [NAV_FREQUENCY_DISTRIBUTION]: {
                pattern: NAV_FREQUENCY_DISTRIBUTION
            },
            [NAV_CENTRAL_TENDENCY]: {
                pattern: NAV_CENTRAL_TENDENCY
            },
            [NAV_STATISTICAL_DISPERSION]: {
                pattern: NAV_STATISTICAL_DISPERSION
            },
            [NAV_CORRELATION_ANALYSIS]: {
                pattern: NAV_CORRELATION_ANALYSIS
            },
        }
    }
};

const NAV_CONTENT = [
    {
        id: NAV_DASHBOARD,
        route: ROUTING_METADATA_CONFIG.routing.routes[NAV_DASHBOARD].pattern,
        icon: "sap-icon://Chart-Tree-Map",
        text: ELEARNING_MANAGEMENT_PAGE_DASHBOARD_TITLE
    },
    {
        id: NAV_FREQUENCY_DISTRIBUTION,
        route: ROUTING_METADATA_CONFIG.routing.routes[NAV_FREQUENCY_DISTRIBUTION].pattern,
        icon: "sap-icon://bar-chart",
        text: ELEARNING_MANAGEMENT_PAGE_FREQUENCY_DISTRIBUTION_TITLE
    },
    {
        id: NAV_CENTRAL_TENDENCY,
        route: ROUTING_METADATA_CONFIG.routing.routes[NAV_CENTRAL_TENDENCY].pattern,
        icon: "sap-icon://business-objects-experience",
        text: ELEARNING_MANAGEMENT_PAGE_CENTRAL_TENDENCY_TITLE
    },
    {
        id: NAV_STATISTICAL_DISPERSION,
        route: ROUTING_METADATA_CONFIG.routing.routes[NAV_STATISTICAL_DISPERSION].pattern,
        icon: "sap-icon://crossed-line-chart",
        text: ELEARNING_MANAGEMENT_PAGE_STATISTICAL_DISPERSION_TITLE
    },
    {
        id: NAV_CORRELATION_ANALYSIS,
        route: ROUTING_METADATA_CONFIG.routing.routes[NAV_CORRELATION_ANALYSIS].pattern,
        icon: "sap-icon://scatter-chart",
        text: ELEARNING_MANAGEMENT_PAGE_CORRELATION_ANALYSIS_TITLE
    },
];

const THEMES = [
    {
        name: "SAP Fiori 3",
        id: "sap_fiori_3"
    },
    {
        name: "SAP Fiori 3 Dark",
        id: "sap_fiori_3_dark"
    },
    {
        name: "SAP Fiori 3 High Contrast Black",
        id: "sap_fiori_3_hcb"
    },
    {
        name: "SAP Fiori 3 High Contrast White",
        id: "sap_fiori_3_hcw"
    },
    {
        name: "SAP Belize",
        id: "sap_belize"
    },
    {
        name: "SAP Belize Plus",
        id: "sap_belize_plus"
    },
    {
        name: "SAP Belize High Contrast Black",
        id: "sap_belize_hcb"
    },
    {
        name: "SAP Belize High Contrast White",
        id: "sap_belize_hcw"
    }
];

const DEFAULT_THEME = THEMES[0].id;
const SAVED_THEME_STORAGE_PREFIX = 'eLearningManagementThemeChoiceStorage';

const ROW_NUM_KEY = '__rowNum__';
const GRADES_RESULT_KEY = 'Result';
const LOGS_EVENT_NAME_KEY = 'Event name';
const EVENT_CONTEXT_KEY = 'Event context';
const COMPONENT_KEY = 'Component';

const MOODLE_LOGS_REQUIRED_KEYS = [ ROW_NUM_KEY, 'Time', EVENT_CONTEXT_KEY, COMPONENT_KEY, LOGS_EVENT_NAME_KEY, 'Description' ];
const GRADES_REQUIRED_KEYS = [ ROW_NUM_KEY, 'ID', GRADES_RESULT_KEY ];

const FILE_SUBMISSIONS_COMPONENT = 'File submissions';
const FILE_SUBMISSIONS_EVENT_CONTEXT = 'Assignment: Качване на курсови задачи и проекти';
const FILE_UPLOADS_EVENT_NAME = 'A file has been uploaded.';

const USER_ID_DESCRIPTION_DELIMITER = 'The user with id ';

const DEFAULT_CORRELATION_ANALYSIS_SIGNIFICANCE_LEVEL = 0.05;
const CORRELATION_ANALYSIS_SIGNIFICANCE_LEVELS = [0.1, DEFAULT_CORRELATION_ANALYSIS_SIGNIFICANCE_LEVEL, 0.01];