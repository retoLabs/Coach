
/*
create table notas (
idf integer primary key autoincrement,
_id text,
id0 text,
org text,
ktg text,
tma text,
dms text,
tag text,
txt text);

*/

import sess   from '../k1/libK1_Sesion.js'
import vapps  from '../k1/libK1_vApps.js'

import src from '/js/notasSrc.js'
import {nuevoTema} from '/js/notasSrc.js'

import {vgApp,goPag} from '/js/coach_VGlob.js'
import {rKeos,rLang,rNodoClase,rTxtML,rTagML,rUsuario} from '/k1/libK1_Clases.js'


window.vgApp = vgApp;
window.goPag = goPag;
window.rKeos = rKeos;
window.rLang = rLang;
window.rNodoClase = rNodoClase;
window.rTxtML = rTxtML;
window.rTagML = rTagML;
window.rUsuario = rUsuario;

window.nuevoTema = nuevoTema;

function sesionNotasOK(){
	src.getTemas('LINUX',null);
}
function initNotas(){
	vapps.initAppsGlobal();
	src.initApps();
	sess.validaSesion('usrMenu',sesionNotasOK);
}

window.onload = initNotas;