@echo off
REM Runs the type check and the unit tests. Needs Node.js (https://nodejs.org).
REM The first run downloads TypeScript, so it needs an internet connection.
REM
REM   check.bat          type check + tests
REM   check.bat tests    tests only
REM   check.bat types    type check only

cd /d "%~dp0"
node tools\check.mjs %*
