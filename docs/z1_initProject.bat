
TortoiseProc /command:checkout /path:%cd%\node_modules /url:http://192.168.0.19:8080/svn/qd_project/node_modules

if not exist "z0_cmd.bat" (copy node_modules\un-react\z0_cmd.bat z0_cmd.bat)

if not exist "z2_coding.bat" (copy node_modules\un-react\_oniFB_coding.bat z2_coding.bat)

if not exist "z4_publish.bat" (copy node_modules\un-react\_oniFB_publish.bat z4_publish.bat)

if not exist "_cloudMap.js" (copy node_modules\un-react\_cloudMap_OniFB.js _cloudMap.js)

if not exist "un_config.js" (copy node_modules\un-react\un_config_OniFB.js un_config.js)

pause