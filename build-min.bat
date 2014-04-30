@echo off

rem ###################################################
rem #
rem #   The buildtools repository is at:
rem #   https://github.com/foo123/scripts/buildtools
rem #
rem ###################################################

rem to use the python build tool do:
rem call python %BUILDTOOLS%\build.py --deps ".\dependencies-min"
rem call python %BUILDTOOLS%\build.py --deps ".\dependencies-plugins-min"

rem to use the php build tool do:
rem call php -f %BUILDTOOLS%\build.php -- --deps=".\dependencies-min"
rem call php -f %BUILDTOOLS%\build.php -- --deps=".\dependencies-plugins-min"

rem to use the node build tool do:
call node %BUILDTOOLS%\build.js --deps ".\dependencies-min"
call node %BUILDTOOLS%\build.js --deps ".\dependencies-plugins-min"
