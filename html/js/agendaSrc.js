
import utils from '/k1/libK1_Utils.js'
import sess  from '/k1/libK1_Sesion.js'
import ajax  from '/k1/libK1_Ajax.js'
import topol from '/k1/libK1_Topol.js'

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

function montaArbolUL(ul,nodo,editON,horas){
	var li = utils.rEl$('li'); 
	if (nodo.hijos.length){
		var btn = utils.rEl$('input');
		btn.type = 'button';
		btn.value = (nodo.stat == 'EXPAN')? '+' : '-';
		btn.onclick = function (){
			utils.vgk.topol.commuta(nodo);
			showTemario();
		}
		li.appendChild(btn);
	}

	var txt = utils.rEl$('span');
	txt.innerHTML = nodo.tag;
	li.appendChild(txt);

//	li.innerHTML = nodo.tag;  NO. Machaca el boton !!!

	if (horas) {
		var horas = utils.rEl$('span');
		horas.id = nodo.id0;
		horas.style.float = 'right';
		horas.contentEditable = true;
		horas.innerHTML = nodo.obj.horas;
		horas.onblur = function(ev){
			nodo.obj.horas = parseInt(ev.target.innerHTML);
			var raiz = utils.vgk.topol.getRaiz();
			utils.vgk.topol.resetNodos();
			utils.vgk.topol.sumaRecursiva(raiz);
			showTemario();
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
		var hijos = utils.vgk.topol.getHijosNodo(nodo);
		hijos.map(function(nodox){
			montaArbolUL(ulx,nodox,editON,horas);
		})

	}


}



function showTemario(){
	if (!utils.vgk.topol) return;
	var divShow = utils.r$('temario');
	divShow.innerHTML = null;
	var tag = utils.vgk.topol.meta.tag;
	var h3 = utils.rEl$('h3'); h3.innerHTML = tag;
	divShow.appendChild(h3);
	var ul = utils.rEl$('ul');
//	ul.style.listStyle = 'none';
	var raiz = utils.vgk.topol.getRaiz();
	montaArbolUL(ul,raiz,false,true);
	divShow.appendChild(ul);
}
//------------------------------------------------------------------- Calculos

function calculos(tipo){
	switch(tipo){
		case 'AUTO':
			utils.vgk.topol.calcula('AUTO');
			showTemario();
			break;
	}
}
//------------------------------------------------------------------- Ajax

function ecoCargaTemario(objDB){
	utils.vgk.topolId = objDB._id;
	var t = new coach.Temario('',[]);
	t.objDB2Clase(objDB);
	utils.vgk.topol = t;
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
	var form = utils.r$('lista');
	form.innerHTML = null;

	var select = document.createElement('select');
	select.onclick = function(){cargaTemario(select);};

	objs.map(function(obj,ix){
		var opt = document.createElement('option');
		opt.value = obj._id;
		opt.text = obj.meta.tag;
		select.appendChild(opt);
	})
	form.appendChild(select);
}

function listaTemarios(){
	ajax.listaTopols('Temario',ecoListaTemarios);
}

export default {listaTemarios, calculos}