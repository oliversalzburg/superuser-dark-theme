@ECHO OFF
ECHO Building Stylish version...
ECHO @-moz-document domain("superuser.com")  { > firefox-stylish.css
TYPE chrome-stylebot.css >> firefox-stylish.css
ECHO } >> firefox-stylish.css
ECHO Done