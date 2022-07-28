
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

function montaArbolUL(ul,nodo,editON){
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

	if (editON){
		li.onclick = function(ev){
			ev.stopImmediatePropagation();
			utils.r$('tag').value = nodo.tag;
			utils.r$('id0').value = nodo.id0;
		}
	}
	ul.appendChild(li);


	if (nodo.hijos.length && nodo.stat == 'EXPAN'){
		var ulx = utils.rEl$('ul');
		ulx.style.listStyle = 'none';
		li.appendChild(ulx);
		var hijos = utils.vgk.topol.getHijosNodo(nodo);
		hijos.map(function(nodox){
			montaArbolUL(ulx,nodox,editON);
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
	ul.style.listStyle = 'none';
	var raiz = utils.vgk.topol.getRaiz();
	montaArbolUL(ul,raiz);
	divShow.appendChild(ul);
}


function ecoCargaTemarioBD(xhr){
	var filas = utils.csv2filas(xhr.responseText);
	console.log(filas[0]);
	var treeTemas = utils.vgk.topol;
	var raiz = treeTemas.getRaiz();
	var nodoMD = null;
	var nodoUF = null;
	var nodoUD = null; 
	filas.map(function(fila){
		var nodo = new coach.ItemTemario(fila.titulo);
		if (fila.uf == "0" & fila.ud == "0" && fila.tema == "0"){
			nodo.rol = 'MOD';
			treeTemas.addNodoHijo(raiz,nodo);
			nodoMD = nodo;
		}
		else if (fila.uf > "0" & fila.ud == "0" && fila.tema == "0"){
			nodo.rol = 'UF';
			treeTemas.addNodoHijo(nodoMD,nodo);
			nodoUF = nodo;
		}
		else if (fila.uf > "0" & fila.ud > "0" && fila.tema == "0"){
			nodo.rol = 'UD';
			treeTemas.addNodoHijo(nodoUF,nodo);
			nodoUD = nodo;
		}
		else if (fila.uf > "0" & fila.ud > "0" && fila.tema > "0"){
			nodo.rol = 'templates';
			treeTemas.addNodoHijo(nodoUD,nodo);
		}

	})

//		console.log(utils.o2s(treeTemas));
	showTemario();

	ajax.grabaTopol(utils.vgk.topol);
}


function cargaTemarioBD(){
	var stmt = "select * from temario order by 1,2,3,4;";

	var stmtB64 = Base64.encode(stmt);
	var body = {
		id : 1234567, //vgApp.encript.sessId,
		path : vgApp.sqlite.pathDB,
		db   : vgApp.sqlite.repoDB,
		stmt : stmtB64
	}
	var params = vgApp.paramsXHR;
	params.base = vgApp.sqlite.base;

	params.eco = ecoCargaTemarioBD; 

	ajax.ajaxCmdShell(params,body);

}

function nuevaTopol(){
	var t ={};
	var tag = prompt('Tag?');
	if (!tag) return null;
	var raiz = new topol.rNodo(tag);
	t = new coach.Temario(tag,[raiz]);
	if (t == {}) return null;
	utils.vgk.topol = t;

	cargaTemarioBD();
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
		nuevaTopol();
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

export default {listaTemarios}