#!/bin/bash
for an_arg in "$@" ; do
   echo "${an_arg}"
done
cd $(dirname ${BASH_SOURCE[0]})
./setting.sh "$@"
python ./main.py

