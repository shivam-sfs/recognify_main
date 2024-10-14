@echo off
REM Navigate to the project directory
cd /d D:\xampp\htdocs\recongnify\recognify_main\recognify_backed

REM Start the application using PM2
pm2 start app.js --name RecognifyService

REM Save the PM2 process list to avoid needing to manually start it after reboot
pm2 save