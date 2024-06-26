
import utils  from '../k1/libK1_Utils.js'
import sess   from '../k1/libK1_Sesion.js'
import vapps  from '../k1/libK1_vApps.js'
import {rKeos,rLang,rNodoClase,rTxtML,rTagML,rUsuario} from '../k1/libK1_Clases.js'

import src    from '/coach/js/temarioSrc.js'
import {ItemTemario}   from  '/coach/js/coach_Clases.js'

import {vgApp,goPag} from '/coach/js/coach_VGlob.js'


window.vgApp = vgApp;
window.goPag = goPag;
window.ItemTemario = ItemTemario;


window.showListaKairos = src.showListaKairos;
window.cargaKairos = src.cargaKairos;
window.nuevoKairos = src.nuevoKairos;
window.addTarea = src.addTarea;

//------------------------------------------------------------------- Init
function sesionTemarioOK(sesion){
	utils.vgk.user = {'org':'DEMO01','keo':''};
	src.listaTemarios();
}

function initTemario(){
//	vapps.initAppsGlobal();

	sess.validaSesion('usrMenu',sesionTemarioOK);// libK1_Sesion.js
}

window.onload = initTemario;

