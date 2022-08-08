/*
Cuando un formador ha de impartir un temario, en unas fechas determinadas, 
es conveniente una planificación de las clases, para garantizar que se han explicado todos los temas.
Por ello, hemos de partir de un kairos (fechas lectivas) y del temario en cuestión.
El temario, dividido en módulos, unidades formativas, unidades didácticas y temas, 
tendrá asignado un número de horas lectivas. 
Así que con la ayuda del kairos, que marca los dias lectivos, y el temario, se pueden agendar las clases.
Esto es, una serie de tareas, con un horario, y un contenido pedagógico concreto a desarrollar.
*/

import utils  from '/k1/libK1_Utils.js'
import sess   from '/k1/libK1_Sesion.js'
import vapps  from '/k1/libK1_vApps.js'
import {rDia} from '/k1/libK1_Tiempo.js'

import src    from '/js/agendaSrc.js'
import {ItemTemario}   from  '/js/coach_Clases.js'

import {vgApp,goPag} from '/js/coach_VGlob.js'
import {rUsuario} from '/k1/libK1_Clases.js'


window.vgApp = vgApp;
window.goPag = goPag;
window.ItemTemario = ItemTemario;


window.rDia = rDia;

window.showListaKairos = src.showListaKairos;
window.cargaKairos = src.cargaKairos;
window.nuevoKairos = src.nuevoKairos;
window.addTarea = src.addTarea;
window.calculos = src.calculos;
window.updateTemario = src.updateTemario;
window.agendarTemario = src.agendarTemario;
//------------------------------------------------------------------- Init
function sesionAgendaOK(sesion){
	utils.vgk.user = {'org':'DEMO01','keo':''};
	src.listaTemarios();
//	src.listaKairos();
}

function initAgenda(){
//	vapps.initAppsGlobal();

	sess.validaSesion('usrMenu',sesionAgendaOK);// libK1_Sesion.js
}

window.onload = initAgenda;

