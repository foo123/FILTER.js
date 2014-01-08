@echo off

rem ###################################################
rem #
rem #   The buildtools repository is at:
rem #   https://github.com/foo123/scripts/buildtools
rem #
rem ###################################################

rem to use the python build tool do:
rem call python ..\scripts\buildtools\build.py --deps ".\dependencies"
rem call python ..\scripts\buildtools\build.py --deps ".\dependencies-plugins"

rem to use the php build tool do:
rem call php -f ..\scripts\buildtools\build.php -- --deps=".\dependencies"
rem call php -f ..\scripts\buildtools\build.php -- --deps=".\dependencies-plugins"

rem to use the node build tool do:
call node ..\scripts\buildtools\build.js --deps ".\dependencies"
call node ..\scripts\buildtools\build.js --deps ".\dependencies-plugins"
