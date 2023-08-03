@echo off

REM ###################################################
REM #
REM #   The buildtools repository is at:
REM #   https://github.com/foo123/Beeld
REM #
REM ###################################################

REM to use the python build tool do:
REM python %BUILDTOOLS%\Beeld.py --config ".\beeld.config" --tasks minify

REM to use the php build tool do:
REM php -f %BUILDTOOLS%\Beeld.php --  --config=".\beeld.config" --tasks=minify

REM to use the node build tool do:
node %BUILDTOOLS%\Beeld.js  --config ".\beeld.config" --tasks minify
