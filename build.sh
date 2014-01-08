#!/usr/bin/env sh

###################################################
#
#   The buildtools repository is at:
#   https://github.com/foo123/scripts/buildtools
#
###################################################

# to use the python build tool do:
#python ..\scripts\buildtools\build.py --deps ".\dependencies"
#python ..\scripts\buildtools\build.py --deps ".\dependencies-plugins"

# to use the php build tool do:
#php -f ..\scripts\buildtools\build.php -- --deps=".\dependencies"
#php -f ..\scripts\buildtools\build.php -- --deps=".\dependencies-plugins"

# to use the node build tool do:
node ..\scripts\buildtools\build.js --deps ".\dependencies"
node ..\scripts\buildtools\build.js --deps ".\dependencies-plugins"
