"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrightIdProvider = exports.BrightidProviderConfig = exports.BrightidPlatformDetails = exports.BrightidPlatform = void 0;
var App_Bindings_1 = require("./App-Bindings");
Object.defineProperty(exports, "BrightidPlatform", { enumerable: true, get: function () { return App_Bindings_1.BrightidPlatform; } });
var Providers_config_1 = require("./Providers-config");
Object.defineProperty(exports, "BrightidPlatformDetails", { enumerable: true, get: function () { return Providers_config_1.BrightidPlatformDetails; } });
Object.defineProperty(exports, "BrightidProviderConfig", { enumerable: true, get: function () { return Providers_config_1.BrightidProviderConfig; } });
var brightid_1 = require("./Providers/brightid");
Object.defineProperty(exports, "BrightIdProvider", { enumerable: true, get: function () { return brightid_1.BrightIdProvider; } });
//# sourceMappingURL=index.js.map