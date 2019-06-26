#!/bin/bash

cd mockgram-api
pm2 start npm --name mockgram_api -- start
cd ..
cd mockgram-image
pm2 start npm --name mockgram_image -- start
cd ..
cd mockgram-socket 
pm2 start npm --name mockgram_socket -- start
cd ..
cd mockgram-ml
pm2 start app.py --name mockgram_ml --interpreter=python3
cd ..
cd mockgram-web
pm2 start npm --name mockgram_web -- start
exit 0