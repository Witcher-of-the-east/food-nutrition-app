$env:ComSpec = "$env:SystemRoot\System32\cmd.exe"
Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$PSScriptRoot\backend'; python -m uvicorn main:app --host 0.0.0.0 --port 8000"
Start-Sleep -Seconds 8
Start-Process powershell -ArgumentList "-NoExit","-Command","ngrok http 8000 --url https://dominion-mower-datebook.ngrok-free.dev"