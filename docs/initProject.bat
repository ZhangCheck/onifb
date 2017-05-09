TortoiseProc /command:checkout /path:%cd%\FB_FE_LIB /url:"http://192.168.0.19:8080/svn/qd_project/splitTemplates/avalon.oniui.fb"

TortoiseProc /command:checkout /path:%cd%\node_modules /url:http://192.168.0.19:8080/svn/qd_project/node_modules

if not exist "grunt_coding.bat" (copy FB_FE_LIB\projectCommon\grunt_coding.bat grunt_coding.bat)
if not exist "Gruntfile.js" (copy FB_FE_LIB\projectCommon\Gruntfile.js Gruntfile.js)

pause