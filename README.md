![Logo](admin/weather-warnings.png)
# ioBroker.weather-warnings

[![NPM version](https://img.shields.io/npm/v/iobroker.weather-warnings.svg)](https://www.npmjs.com/package/iobroker.weather-warnings)
[![Downloads](https://img.shields.io/npm/dm/iobroker.weather-warnings.svg)](https://www.npmjs.com/package/iobroker.weather-warnings)
![Number of Installations](https://iobroker.live/badges/weather-warnings-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/weather-warnings-stable.svg)

[![Übersetzungsstatus](https://weblate.iobroker.net/widgets/adapters/-/weather-warnings/287x66-grey.png)](https://weblate.iobroker.net/projects/adapters/weather-warnings/)

[![NPM](https://nodei.co/npm/iobroker.weather-warnings.png?downloads=true)](https://nodei.co/npm/iobroker.weather-warnings/)

**Tests:** [![Test and Release](https://github.com/ticaki/ioBroker.weather-warnings/actions/workflows/test-and-release.yml/badge.svg?event=push)](https://github.com/ticaki/ioBroker.weather-warnings/actions/workflows/test-and-release.yml)

[![Paypal Donation](https://img.shields.io/badge/paypal-donate%20|%20spenden-blue.svg)](https://paypal.me/ticaki)

## weather-warnings adapter for ioBroker

[Deutsche Readme (meist aktueller)](https://github.com/ticaki/ioBroker.weather-warnings/blob/main/README_DE.md)

This adapter accesses weather warnings of different weather services and outputs them as text or voice messages. Additionally it creates States grouped by type, which can be used to react to current warnings.

Provider:
- DWD 
- ZAMG (Austria)
- UWZ

Push service
- Telegram
- Whatsapp
- Pushover
- Email
- Alexa
- Sayit

## Installation
Min. Nodejs: v22
After installation the configuration site will automatically open and will be needed to be **reloaded**. This will show the templates in the language that was set.

## Configuration
![Basicconfiguration](img/basic.png)

- **Activate DWD/UWZ/ZAMG:** activate the data retrieval of these service providers.
- **Activate telegram/pushover,...:** activate the output of messages to these installed adapters. 
- **Activate email:** Writes all current warnings in an E-Mail.
- **Activate history:** writes the history, which can hold up to 500 entries, into the State: .history. All data or selected data.
- **Activate json-array:** very special, puts the current warnings into an Array or - after activation - a user-specifc Json into an Array, which can be used by scripts.

- **Update interval:** the interval of data retrieval in minutes (minimum: 5)

- **Incoming warnings...:** After starting the adapter the warnings of the first data retrieval will be treated as known and will not trigger a notification.

- **Expert**: Activates additional optional settings 

- **Testing- Activate...:** Use testdata. Adapter is offline.

- **Testing- Raw data history:** For Debugging, only on request.



![Template](img/template.png)

Here you can create own messages or edit existing ones. All available „Tokens“ and their meanings are displayed below the table. The Unique identifier is used by push notification services in order to determine which template to use for which type of notification.

Save and close after adding or deleting templates.

Signs with special meaning:
- `${}` contains tokens that are substituted by generated information. The template identifier is usable here as well.
- Template identifier that start with `_` are not offered by services.
- `${[0,1,2,3,4]token}` A string with values, token has to be a number token. The index is the same as shown in the example. 0 is the first value in the list.
- `${(value=token)result1#result2}` or `${(value=token)result1}` is the same as a javascript command: `if (value == token) result1 else result2` possible comparisons: `= < > != `
- for a Jsons template the closing bracket `}` has to be written in this way `\}`
- see examples in the adapter
- alternatively also possible: `${[0,🟢,🟡,🟠,🔴]warnlevelnumber}`

**Restore Templates:** Resets the templates back to the current system language. Existing templates will be **lost**. Afterwards save & close. Should be used after changing system language.

![DWD](img/DWD.png)

**DWD:** Selection from a list of 10000 places, after entry click on another tab and then return, list is too big and has to be updated.

**UWZ:** Entry using the country identifier DE AT (others possible, has to be tested) and the postal code, for example DE12345

**ZAMG:** Only for Austria. Entry of coordinates within Austria.

**Place name:** user-specific place name, can be used in warnings (useful with multiple warning cells)

**Filter:** 
- Filter Raw data: Filters out everything within X hours into the future before every following handling.
- Type: discards everything with this type.
- Level: everything lower than this level will be discarded. 

![telegram](img/telegram.png)
**Adapter:** If this option was activated and there is an adapter field, a valid option has to be chosen. An error message in the log indicates missing settings. 

**Activate ...:** Send warnings by this provider with this service.

**Filter:** 
1) Ignore warnings with this Type
2) Ignore warnings with equal or lower level 


**Messages:** use the following templates for:
Column 1:
1) New warnings or existing warnings
2) A warning was removed and there are **other** active warnings.
3) Warnings were removed and there are **no other** active warnings.

Column 2:
1) Manually triggered notifications
2) Use for no warning 1.3

Templates for 3) cannot contain `${}` Tokens.

**Special features**

**email:** Header is put before the Mail, followed by 1,2 or 3 + line break and then Footer. The email is sent in html format, so you can add any htmp tag you like. (additional features are being worked on, not ready yet)

**alexa:** Additionally one or multiple devices has/have to be selected. The volume only changes for voice messages and should afterwards be reset to default. Message size per warning is limited to 250 characters. Sounds are possible, activate Expert to display the options.

**title, header, footer** only ${status} works here. Other tokens contain random values or no value.

## General Behaviour
- No duplicate messages should be sent for one and the same thing. DWD is very particular about this.
- If `none` is selected as the template, no notifications are sent for it.
- States in .alerts contain arrays for start, end, warning type, now active and headline, grouped by warning type. One warning per group is displayed filtered by the following criteria: 
  1) Warning is **now** active (the one with the highest level).
  
## Icons

DWD Icon: Copyright by Deutscher Wetterdienst
ZAMG Icon: Copyright by 

others:

Creator: [Adri Ansyah](https://www.youtube.com/channel/UChLOv1L-ftAFc2ZizdEAKgw?view_as=subscriber)

Changes: In the original they are blue, other colours are changes to the original. 

Licence: [CC BY 4.0 LEGAL CODE](https://creativecommons.org/licenses/by/4.0/legalcode)

Iconpage: https://icon-icons.com/de/symbol/Wetter-wind-cloud-Blitz-Regen/189105

## Changelog
<!--
	Placeholder for the next version (at the beginning of the line):
	### **WORK IN PROGRESS**
-->
### **WORK IN PROGRESS**
- (ticaki) **NEW**: the nine duplicated notification-service tabs (telegram, whatsapp, pushover, gotify, nspanel, alexa2, sayit, json, history, email) were replaced by a single admin custom component. The shared option set is now generated once instead of being copy/pasted per service, which removes ~2700 lines from `admin/jsonConfig.json`.
- (ticaki) **NEW**: notification-service settings are stored in the structured `notificationServices` config object. Existing installations are migrated automatically on first start (one restart).
- (ticaki) **FIXED**: the telegram Chat-ID typed in the admin is now actually used (the field wrote `telegram_ChatId` while the runtime read `telegram_ChatID`).

### 0.11.0 (2026-06-02)
- (copilot) **BREAKING**: Adapter requires node.js >= 22 now
- (ticaki) **NEW**: added DWD warning type 86 "extreme black ice" (extremes Glatteis) (#251)
- (ticaki) **NEW**: added global aggregate states `provider.hasActiveWarning` (boolean), `provider.maxLevel` (number) and `provider.maxLevelText` (text)
- (ticaki) **FIXED**: alexa2 notification no longer crashes when a warning type has no assigned sound
- (ticaki) **FIXED**: per-provider deactivation of datapoint categories (warning/alerts/formatedKeys) is applied again on restart
- (ticaki) **FIXED**: addressed ioBroker repository checker findings (node >= 22, `source-map-support` moved to runtime dependencies, admin jsonConfig schema issues, missing translations) (#300, #112)
- (ticaki) **FIXED**: DWD color name (`warnlevelcolorname`, e.g. spoken by Alexa) now matches the actual DWD warning color shown in email/vis instead of being derived from severity (#220)

### 0.10.1 (2026-04-20)
- (ticaki) **FIXED**: Network errors (e.g. internet down, DNS failure, HTTP errors) now show a clear, readable message instead of `[object Object]` or a useless stack trace

### 0.10.0 (2025-11-13)
- (ticaki) update deps
- (ticaki) fix a problem with "remove" key
- (ticaki) support added for nspanel-lovelace-ui (>= v0.8.0)

### 0.9.0 (2025-10-28)
- (ticaki) Data retrieval function changed from axios to fetch 
- (ticaki) Retrieval timeout changed from 15 seconds to 5 minutes (DWD server needs a 'little' more time)

### 0.8.0 (2025-10-02)
- (ticaki) Add configurable email recipients with correct processing of comma-separated addresses
- (ticaki) Update dependencies

[Older changelogs can be found there](CHANGELOG_OLD.md)## License
MIT License

Copyright (c) 2024-2026 ticaki <github@renopoint.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.