
import utils from '/k1/libK1_Utils.js'
import sess  from '/k1/libK1_Sesion.js'
import ajax  from '/k1/libK1_Ajax.js'
import topol from '/k1/libK1_Topol.js'
import tempo  from '/k1/libK1_Tiempo.js'

import {vgApp,goPag} from '/js/coach_VGlob.js'
import coach   from  '/js/coach_Clases.js'


function initAppsTemario(){

	if(utils.r$('temario')){
		utils.vgk.temario = new Vue({
			el: '#temario',
			data: {
				items: [],
				idAct : 0
			},
			methods : {
				actualiza : function(items){
					this.items = items;
				}
			}
		}) 

	}
}

function agendarTemario(){
	alert('agendarTemario');
}

//=================================================================== Temarios

function calculos(tipo){
	switch(tipo){
		case 'AUTO':
			utils.vgk.temario.calcula('AUTO');
			showTemario();
			break;
	}
}

function montaArbolTemario(ul,nodo,editON,horas){
	var li = utils.rEl$('li'); 
	if (nodo.hijos.length){
		var btn = utils.rEl$('input');
		btn.type = 'button';
		btn.value = (nodo.stat == 'EXPAN')? '+' : '-';
		btn.onclick = function (){
			utils.vgk.temario.commuta(nodo);
			showTemario();
		}
		li.appendChild(btn);
	}

	var txt = utils.rEl$('span');
	txt.innerHTML = nodo.tag;
	txt.contentEditable = true;
	txt.onblur = function(ev){
		var nou = ev.target.innerHTML;
		nodo.tag = nou;
		showTemario();
		}

	li.appendChild(txt);

//	li.innerHTML = nodo.tag;  NO!. Machaca el boton !!!

	if (horas) {
		var horas = utils.rEl$('span');
		horas.id = nodo.id0;
		horas.style.float = 'right';
		horas.innerHTML = nodo.obj.horas;
		if (nodo.rol== 'TEMA'){
			horas.contentEditable = true;
			horas.onblur = function(ev){
				var nou = parseInt(ev.target.innerHTML);
				if (!isNaN(nou) && nou > 0 && nou < 100){
					nodo.obj.horas = nou;
					var raiz = utils.vgk.temario.getRaiz();
					utils.vgk.temario.resetNodos();
					utils.vgk.temario.sumaRecursiva(raiz);
				};
				showTemario();
			}
		}
		li.appendChild(horas);
	}

	if (editON){
		li.onclick = function(ev){
			ev.stopImmediatePropagation();
			utils.r$('tag').value = nodo.tag;
			utils.r$('id0').value = nodo.id0;
		}
	}
	ul.appendChild(li);


	if (nodo.hijos.length && nodo.stat == 'EXPAN'){
		var ulx = null;
		if (nodo.rol == 'UD') ulx = utils.rEl$('ol');
		else ulx = utils.rEl$('ul');
		li.appendChild(ulx);
		var hijos = utils.vgk.temario.getHijosNodo(nodo);
		hijos.map(function(nodox){
			montaArbolTemario(ulx,nodox,editON,horas);
		})

	}


}



function showTemario(){
	if (!utils.vgk.temario) return;
	var divShow = utils.r$('temario');
	divShow.innerHTML = null;
	var tag = utils.vgk.temario.meta.tag;
	var h3 = utils.rEl$('h3'); h3.innerHTML = tag;
	divShow.appendChild(h3);
	var ul = utils.rEl$('ul');
//	ul.style.listStyle = 'none';
	var raiz = utils.vgk.temario.getRaiz();
	montaArbolTemario(ul,raiz,false,true);
	divShow.appendChild(ul);
}

function ecoUpdateTemario(xhr){
	console.log('Update:', xhr.responseText);
}

function updateTemario(){
	ajax.updateTopol(utils.vgk.temario,utils.vgk.temarioId,ecoUpdateTemario)
}

function ecoCargaTemario(objDB){
	utils.vgk.temarioId = objDB._id;
	var t = new coach.Temario('',[]);
	t.objDB2Clase(objDB);
	utils.vgk.temario = t;
	showTemario();
}

function cargaTemario(elem){
	ajax.getTopol(elem.value,ecoCargaTemario);
}


function ecoListaTemarios(objs){
	if (objs.length == 0) {
		alert('No hay temarios definidos')
		return false;
	}
	var listT = utils.r$('listaTemarios');
	listT.innerHTML = null;
	var form = utils.rEl$('form');

	var select = document.createElement('select');

	objs.map(function(obj,ix){
		var opt = document.createElement('option');
		opt.value = obj._id;
		opt.text = obj.meta.tag;
		opt.onclick = function(){cargaTemario(select);};
		select.appendChild(opt);
	})
	form.appendChild(select);
	listT.appendChild(form);

	listaKairos();
}

function listaTemarios(){
	ajax.listaTopols('Temario',ecoListaTemarios);
}


//=================================================================== Kairos

function montaArbolKairos(ul,nodo,editON){
	var li = utils.rEl$('li'); 
	if (nodo.hijos.length){
		var btn = utils.rEl$('input');
		btn.type = 'button';
		btn.value = (nodo.stat == 'EXPAN')? '+' : '-';
		btn.onclick = function (){
			utils.vgk.kairos.commuta(nodo);
			showKairos();
		}
		li.appendChild(btn);
	}

	var txt = utils.rEl$('span');
	if (nodo.obj) txt.innerHTML = nodo.obj.dd;
	else txt.innerHTML = nodo.tag;
	li.appendChild(txt);

//	li.innerHTML = nodo.tag;  NO!. Machaca el boton !!!

	if (editON){
		li.onclick = function(ev){
			ev.stopImmediatePropagation();
			utils.r$('tag').value = nodo.tag;
			utils.r$('id0').value = nodo.id0;
		}
	}
	ul.appendChild(li);


	if (nodo.hijos.length && nodo.stat == 'EXPAN'){
		var ulx = null;
		ulx = utils.rEl$('ul');
		li.appendChild(ulx);
		var hijos = utils.vgk.kairos.getHijosNodo(nodo);
		hijos.map(function(nodox){
			montaArbolKairos(ulx,nodox,editON);
		})

	}


}

function showKairos(){
	if (!utils.vgk.kairos) return;
	var divShow = utils.r$('temario');
	divShow.innerHTML = null;
	var tag = utils.vgk.kairos.meta.tag;
	var h3 = utils.rEl$('h3'); h3.innerHTML = tag;
	divShow.appendChild(h3);
	var ul = utils.rEl$('ul');
//	ul.style.listStyle = 'none';
	var raiz = utils.vgk.kairos.getRaiz();
	montaArbolKairos(ul,raiz,false,true);
	divShow.appendChild(ul);
}

function ecoCargaKairos(objDB){
	utils.vgk.kairosId = objDB._id;
	var t = new tempo.rKairos('',[]);
	t.objDB2Clase(objDB);
	utils.vgk.kairos = t;
	showKairos();
}

function cargaKairos(elem){
	ajax.getTopol(elem.value,ecoCargaKairos);
}


function ecoListaKairos(objs){
	if (objs.length == 0) {
		alert('No hay kairos definidos')
		return false;
	}
	var listK = utils.r$('listaKairos');
	listK.innerHTML = null;
	var form = utils.rEl$('form');

	var select = document.createElement('select');

	objs.map(function(obj,ix){
		var opt = document.createElement('option');
		opt.value = obj._id;
		opt.text = obj.meta.tag;
		opt.onclick = function(){cargaKairos(select);};
		select.appendChild(opt);
	})
	form.appendChild(select);
	listK.appendChild(form);
}

function listaKairos(){
	ajax.listaTopols('rKairos',ecoListaKairos);
}

//=================================================================== Exports
export default {
	listaTemarios,
	listaKairos,
	calculos, 
	updateTemario,
	agendarTemario
	}