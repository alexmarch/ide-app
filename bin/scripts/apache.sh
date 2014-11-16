#!/bin/sh
httpd -d /var/httpd/ -c "Listen 0.0.0.0:8000" -c "DocumentRoot $1"
