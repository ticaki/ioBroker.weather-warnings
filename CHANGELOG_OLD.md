### 0.5.4 (2023-11-10)
* (ticaki) Fixed: Fixed randomly occurring errors in the first approx. 15 seconds.
* (ticaki) Added: max number of warnings (default 5)
* (ticaki) Fixed: not crash with the wrong uwz configuration.
* (ticaki) Fixed: small error in quiet times.

### 0.5.3 (2023-11-09)
* (ticaki) Fixed: command states (text / automode)
* (ticaki) Added: .alerts. List of warning types.
* (ticaki) Changed: .alerts. view current event with highest level or next event

### 0.5.2 (2023-11-06)
* (ticaki) Multiple Say-It instances.
* (ticaki) Some icons added.
* (ticaki) -no warning- Warning level for uwz corrected.

### 0.5.1 (2023-11-05)
* (ticaki) Fixed: Foreign languages did not work for UWZ.
* (ticaki) Fixed: clearHistory command didnt work on gloabl level.
* (ticaki) Fixed: uwz colours assigned to the correct level.

### 0.5.0 (2023-11-04)
* (ticaki) breaking changes: New UWZ configuration. reconfigure
* (ticaki) breaking changes: Rename and move manual push command states.
* (ticaki) Quiet times changed, reconfigure. 
* (ticaki) better DWD configuration.
* (ticaki) alot improvements.

### 0.4.8 (2023-10-30)
* (ticaki) Wrong level assignment for zamg fixed
* (ticaki) better set defaults

### 0.4.7 (2023-10-29)
* (ticaki) improved admin ui
* (ticaki) improved formatedKeys for vis

### 0.4.6 (2023-10-28)
* (ticaki) fix startup crash

### 0.4.5 (2023-10-28)
* (ticaki) Quiet times with profile & control states
* (ticaki) Fixed: Jumping of the data tree
* (ticaki) Bugfixing

### 0.4.4 (2023-10-25)
* (ticaki) Added Say-It
* (ticaki) User-definable icons (path)
* (ticaki) Email works, Added title for pushover and email

### 0.4.2 (2023-10-24)
* (ticaki) optimise german 22. & 28. for alexa.
* (ticaki) Quiet times for voice notifications.
* (ticaki) bugfix: now the English translation is loaded. Alexa uses the correct day of the week with DWD heading.

### 0.4.1 (2023-10-22)
* (ticaki) update german translation for alexa

### 0.4.0 (2023-10-22)
* (ticaki) Welcome to latest.
* (ticaki) zamg date convert for alexa

### 0.3.7 (2023-10-21)
* (ticaki) Alexa Sounds for warntypes
* (ticaki) more options for pushover, telegram, alexa, email html
* (ticaki) Usable urls for icons
* (ticaki) fixed error in type filter

### 0.3.6 (2023-10-20)
* (ticaki) added: icons

### 0.3.5 (2023-10-16)
* (ticaki) added: Data points for manually triggering notifications.

### 0.3.4 (2023-10-14)
* (ticaki) add translation to common.name

### 0.3.3 (2023-10-13)
* (ticaki) fixed: repeat message dwd
* (ticaki) small bugfixes

### 0.3.2 (2023-10-10)
* add alexa volumen

### 0.3.1 (2023-10-10)
* (ticaki) added alexa

### 0.3.0 (2023-10-03)
* (ticaki) added multiple warncell
* added option to remove channels
* fixed alot bugs

### 0.2.6-alpha.0 (2023-10-02)
* (ticaki) added email, json, history
* add more template key
* add mulitple dwd warncells
* fixed alot bugs

### 0.2.5-alpha.0 (2023-09-30)
* (ticaki) added telegram, whatsapp, pushover
* added remove all
* added json/array output for all current warnings.

### 0.2.4-alpha.0 (2023-09-29)
* (ticaki) add alerts

### 0.2.3-alpha.0 (2023-09-28)
* (ticaki) more translations
* filter warn type, generic warntypes
* more prebuild tests

### 0.2.2-alpha1.0 (2023-09-26)
* (ticaki) more CustomTokens,
* translations for warntypes, warnlevelcolor,
* total active warningcountshttps://github.com/ticaki/ioBroker.weather-warnings
* remove old warnings

### 0.2.1-alpha.0 (2023-09-25)
* (ticaki) initial release
## 0.7.3 (2025-01-16)
- (ticaki) fix typo

## 0.7.2 (2025-01-13)
* (ticaki) Replacing „ and “ in the json template before parsing with "
* (ticaki) Fixing activeWarning_json (adapter.0.provider.activeWarning_json)

## 0.7.1 (2025-01-10)
* (CrEaK) Fixing send to chatId in telegram

## 0.7.0 (2025-01-03)
* (ticaki) added gotify (notificationservice)

## 0.6.11 (2024-11-29)
* (ticaki) eslint 8 -> 9

## 0.6.10 (2024-11-11)
* (ticaki) fixed: warntype filter 
* (ticaki) fixed: if every provider except zamg is deactivated in the notifications - no message went out
* (ticaki) fixed: downgrade a dependency for compatibility with node 18

## 0.6.9 (2024-11-10)
* (ticaki) added missing text (settings - alexa - soundtable)
* (ticaki) fixed alerts start/end datapoints. (string -> number)
* (ticaki) dependencies up to date

## 0.6.7 (2024-02-19)
* (ticaki) Reduce history data to 80 entries around 4000 lines, because of jerks in the admin

## 0.6.6 (2024-01-14)
* (ticaki) fullday(ZAMG only): If time span is 24h +/- 5 minutes and the start hour is between 0-3, day of the week from start time, otherwise blank.

## 0.6.5 (2024-01-06)
* (ticaki) Added: ZAMG full day token
* (ticaki) fixed: Send emails asynchron
* (ticaki) fixed: dont ignore uwz activate setting
* (ticaki) update dp-objects on every start.

## 0.6.4 (2023-12-03)
* (ticaki) Optimise DWD warning cell selection. Place names are being given more and more details to make them unique.

## 0.6.3 (2023-11-30)
* (ticaki) add cleartimeout, add axios timeout

## 0.6.2 (2023-11-20)
* (ticaki) Reduce zamg spam

## 0.6.1 (2023-11-19)
* (ticaki) Optimise: DWD City names, adminconfiguration, translations

## 0.6.0 (2023-11-16)
* (ticaki) Added: global alerts.
* (ticaki) Changed: Token ...adverb - if no adverb, then day of the week.

## 0.5.6 (2023-11-15)
* (ticaki) Added: Select template for manual notification without warnings.
* (ticaki) Added: Configuration dialogue marks invalid template keys for most notification services.

## 0.5.5 (2023-11-14)
* (ticaki) Added: Missing space in emailMessage template.
* (ticaki) Fixed: wrong status for all removed.
* (ticaki) Admin: moving test options to tab general.