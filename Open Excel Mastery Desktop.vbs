Set shell = CreateObject("WScript.Shell")
projectPath = "C:\Users\johnj\Desktop\Excel Mastery"
command = "cmd.exe /c cd /d """ & projectPath & """ && npm.cmd run build && node_modules\.bin\electron.cmd scripts\desktop-main.cjs"
shell.Run command, 0, False
