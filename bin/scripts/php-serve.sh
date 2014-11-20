#!/bin/bash
INDEX_FILE_PATH=$1/$2
php -S localhost:8000 -t $1 2>/dev/null
