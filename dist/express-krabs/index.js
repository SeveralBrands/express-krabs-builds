"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var url_1 = require("url");
var path = require("path");
var config_1 = require("../utils/config");
var findTenant_1 = require("../utils/tenants/findTenant");
var resolve_1 = require("../utils/routes/resolve");
var env_1 = require("../utils/env");
var normalize_locale_path_1 = require("../utils/i18n/normalize-locale-path");
var get_accept_preferred_locale_1 = require("../utils/i18n/get-accept-preferred-locale");
if (!env_1.currentEnv) {
    console.warn(env_1.environmentWarningMessage);
}
function krabs(req, res, handle, app, config) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function () {
        var _f, tenants, enableVhostHeader, _g, hostname, vhostHeader, host, parsedUrl, _h, pathname, query, tenant, APIPath, APIhandler, newPath, preferredLocale, detectedLocale, redirectUrl, route;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    // @ts-ignore
                    req.locale = null;
                    // @ts-ignore
                    req.locales = null;
                    // @ts-ignore
                    req.defaultLocale = null;
                    if (!(config !== null && config !== void 0)) return [3 /*break*/, 1];
                    _g = config;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, config_1.getTenantConfig()];
                case 2:
                    _g = (_j.sent());
                    _j.label = 3;
                case 3:
                    _f = _g, tenants = _f.tenants, enableVhostHeader = _f.enableVhostHeader;
                    hostname = req.hostname;
                    vhostHeader = enableVhostHeader && req.headers['x-vhost'];
                    host = vhostHeader || hostname;
                    parsedUrl = url_1.parse(req.url, true);
                    _h = parsedUrl.pathname, pathname = _h === void 0 ? '/' : _h, query = parsedUrl.query;
                    tenant = findTenant_1["default"](tenants, host);
                    if (!tenant) {
                        res.status(500);
                        res.end();
                        return [2 /*return*/];
                    }
                    if (pathname === null || pathname === void 0 ? void 0 : pathname.startsWith('/_next')) {
                        handle(req, res);
                        return [2 /*return*/];
                    }
                    if (pathname === null || pathname === void 0 ? void 0 : pathname.startsWith('/api/')) {
                        try {
                            APIPath = pathname.replace(/^\/api\//, '');
                            APIhandler = require(path.join(process.cwd(), "pages/" + tenant.name + "/api/" + APIPath))["default"];
                            APIhandler(req, res);
                        }
                        catch (_) {
                            handle(req, res);
                        }
                        return [2 /*return*/];
                    }
                    if (((_a = tenant === null || tenant === void 0 ? void 0 : tenant.i18n) === null || _a === void 0 ? void 0 : _a.locales.length) &&
                        ((_b = tenant === null || tenant === void 0 ? void 0 : tenant.i18n) === null || _b === void 0 ? void 0 : _b.defaultLocale) &&
                        ((_c = tenant === null || tenant === void 0 ? void 0 : tenant.i18n) === null || _c === void 0 ? void 0 : _c.locales.includes((_d = tenant === null || tenant === void 0 ? void 0 : tenant.i18n) === null || _d === void 0 ? void 0 : _d.defaultLocale))) {
                        newPath = normalize_locale_path_1.normalizeLocalePath(pathname, tenant.i18n.locales);
                        preferredLocale = req.headers['accept-language']
                            ? get_accept_preferred_locale_1.getAcceptPreferredLocale(tenant.i18n, req.headers)
                            : null;
                        detectedLocale = (newPath === null || newPath === void 0 ? void 0 : newPath.detectedLocale) || preferredLocale || tenant.i18n.defaultLocale;
                        //comment
                        if (detectedLocale.toLowerCase() !== (newPath === null || newPath === void 0 ? void 0 : newPath.detectedLocale) &&
                            detectedLocale.toLowerCase() !== tenant.i18n.defaultLocale) {
                            redirectUrl = "/" + detectedLocale + pathname + ((_e = parsedUrl.search) !== null && _e !== void 0 ? _e : '');
                            return [2 /*return*/, res.redirect(redirectUrl)];
                        }
                        if (detectedLocale) {
                            // @ts-ignore
                            req.locale = detectedLocale;
                            // @ts-ignore
                            req.locales = tenant.i18n.locales;
                            // @ts-ignore
                            req.defaultLocale = tenant.i18n.defaultLocale;
                        }
                        pathname = newPath.pathname;
                    }
                    route = resolve_1["default"](tenant.name, String(pathname));
                    if (route) {
                        // @ts-ignore
                        req.tenant = tenant;
                        app.render(req, res, route, query);
                        return [2 /*return*/];
                    }
                    handle(req, res);
                    return [2 /*return*/];
            }
        });
    });
}
exports["default"] = krabs;
