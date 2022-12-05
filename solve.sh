#!/bin/bash - 
#===============================================================================
#
#          FILE: solve.sh
# 
#         USAGE: ./solve.sh 
# 
#   DESCRIPTION: 
# 
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: YOUR NAME (), 
#  ORGANIZATION: 
#       CREATED: 05.12.2022 11:09
#      REVISION:  ---
#===============================================================================

set -o nounset                              # Treat unset variables as an error
/usr/bin/time -f '--\nElapsed: %e s\nMemory: %M kB' bun solve.js $1 $2
