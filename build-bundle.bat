@echo off

rem ###################################################
rem #
rem #   The buildtools repository is at:
rem #   https://github.com/foo123/scripts/buildtools
rem #
rem ###################################################

rem to use the python build tool do:
rem python ..\scripts\buildtools\build.py --deps ".\dependencies-bundle"

rem to use the php build tool do:
rem php -f ..\scripts\buildtools\build.php -- --deps=".\dependencies-bundle"

rem to use the node build tool do:
node ..\scripts\buildtools\build.js --deps ".\dependencies-bundle"
