"use strict";
exports.__esModule = true;
exports.getAcceptPreferredLocale = void 0;
var accept_header_1 = require("../accept-header");
function getAcceptPreferredLocale(i18n, headers) {
    var value = headers === null || headers === void 0 ? void 0 : headers['accept-language'];
    if (!!i18n.localeDetection && value && !Array.isArray(value)) {
        return accept_header_1.acceptLanguage(value, i18n.locales);
    }
}
exports.getAcceptPreferredLocale = getAcceptPreferredLocale;
