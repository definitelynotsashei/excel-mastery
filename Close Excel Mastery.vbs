Set service = GetObject("winmgmts:\\.\root\cimv2")
Set processes = service.ExecQuery("SELECT * FROM Win32_Process WHERE Name='node.exe'")

For Each process In processes
  If InStr(LCase(process.CommandLine), LCase("scripts\desktop-preview.mjs")) > 0 Then
    process.Terminate()
  End If
Next
