@echo off
chcp 65001 >nul
REM info-how scheduled publish (runs daily via schtasks)
cd /d C:\Users\hadam\Desktop\info-how
node "C:\Users\hadam\Desktop\info-how\_scripts\auto\publish_due.cjs"
