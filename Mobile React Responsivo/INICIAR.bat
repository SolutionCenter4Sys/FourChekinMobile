@echo off
:: Lançador seguro — a janela NUNCA fecha automaticamente
:: Use este arquivo para rodar a aplicação
cmd /k "cd /d "%~dp0" && call run-mobile-react.bat"
