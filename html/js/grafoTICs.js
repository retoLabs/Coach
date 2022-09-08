/*
Una vez validado en Login el usr/pwd, si el rol de usuario es SYSTEM, 
mediante la función modSwitch (index2.js) redirige a system.html

Se valida la sesión, y se presentan las opciones de administración a nivel de Sistema
*/
import utils  from '/k1/libK1_Utils.js'
import vapps  from '/k1/libK1_vApps.js'
import sess   from '/k1/libK1_Sesion.js'

import {vgApp,goPag} from '/js/coach_VGlob.js'

import src from '/js/grafoTICsSrc.js'

window.vgApp = vgApp;





function sesionCypherOK(){


	var stmt = 'match (ini) where not (ini)-[:ARCO]-() return '
	stmt+= 'ID(ini) as id0, ini,null as arc, 0 as id1, null as fin ';
	stmt+= 'union match (ini)-[arc]->(fin) return '
	stmt += 'ID(ini) as id0,ini,arc,ID(fin) as id1,fin;';

//	var stmt ='match (ini)-[arc]->(fin) return ';
//	stmt += 'ID(ini) as id0,ini,arc,ID(fin) as id1,fin;';
//	stmt += 'labels(ini) as lbl_i,properties(ini) as ini,arc,labels(fin) as lbl_f,properties(fin) as fin;';

	utils.vgk.appQueryTable.stmt = stmt;
	utils.vgk.appQueryTable.execStmt();
}


function initCypher(){
	vapps.initAppsGlobal();  // libK1_vApps.js
	src.initAppCypher();
	sess.validaSesion('usrMenu', sesionCypherOK); // kernel/libK1_sesion.js

}

window.onload = initCypher; 
