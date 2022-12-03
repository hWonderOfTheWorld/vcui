"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordProvider = exports.DiscordPlatformDetails = exports.DiscordProviderConfig = exports.DiscordPlatform = void 0;
var App_Bindings_1 = require("./App-Bindings");
Object.defineProperty(exports, "DiscordPlatform", { enumerable: true, get: function () { return App_Bindings_1.DiscordPlatform; } });
var Providers_config_1 = require("./Providers-config");
Object.defineProperty(exports, "DiscordProviderConfig", { enumerable: true, get: function () { return Providers_config_1.DiscordProviderConfig; } });
Object.defineProperty(exports, "DiscordPlatformDetails", { enumerable: true, get: function () { return Providers_config_1.DiscordPlatformDetails; } });
var discord_1 = require("./Providers/discord");
Object.defineProperty(exports, "DiscordProvider", { enumerable: true, get: function () { return discord_1.DiscordProvider; } });
//# sourceMappingURL=index.js.map