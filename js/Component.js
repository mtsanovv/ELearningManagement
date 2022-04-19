sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent) {
	"use strict";
	return UIComponent.extend(ELEARNING_MANAGEMENT_COMPONENT, {
		metadata: ROUTING_METADATA_CONFIG,
		init: function () {
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
		}
	});
});