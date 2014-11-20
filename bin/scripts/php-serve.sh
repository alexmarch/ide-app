#!/bin/bash
INDEX_FILE_PATH=$1/$2
DOCUMENT_ROOT=$1/
php -S localhost:8000 -t $DOCUMENT_ROOT 2>/dev/null
