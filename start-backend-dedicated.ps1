#!/usr/bin/env pwsh
# Start backend in dedicated process

Set-Location "$PSScriptRoot\backend"
Write-Host "Starting HerbalTrace Backend from: $PWD" -ForegroundColor Green
npm start
