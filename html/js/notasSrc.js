
/*
En reto.sqlite

create table notas
(id integer primary key autoincrement,
categ text,
tema text,
tag text,
etc text,
texto text
);
*/

import utils  from '/k1/libK1_Utils.js'
import ajax   from '/k1/libK1_Ajax.js'
import vapps  from '/k1/libK1_vApps.js'
import clases  from '/k1/libK1_Clases.js'

function encripta(texto,frase){
	var nT = texto.length;
	var nF = frase.length;
	var result = '';
	 
	for (var i=0;i<nT;i++){
		var orChars = texto.charCodeAt(i) ^ frase.charCodeAt(i % nF);
		result += String.fromCharCode(orChars);
	}
	return result;
}

//------------------------------------------------------------------- Init
function initApps(){

	utils.vgk.appNotas = new Vue({
		el: '#appNotas',
		data: { 
			tagTema : '',
			visible : true,
			temas : [],
			notas : [],
			pagina : 0,
			pegarON: false
			},
		methods : {
			edit : function(id){editNota(id)},
			sube : function(){
				if (this.pagina == 0) return;
				this.pagina--; 
				getNotas(utils.vgk.appModo.modo,this.tagTema);
			},
			baja : function(){
				this.pagina++; 
				getNotas(utils.vgk.appModo.modo,this.tagTema)},
			goTema : function(tema){
				this.pagina = 0; 
				getNotas(utils.vgk.appModo.modo,tema);
			},
			nuevaNota : function (){nuevaNota(utils.vgk.appModo.modo);},
			pegar : function(){
				grabaNota();
			}
		}

	})


	utils.vgk.appBusca = new Vue({
		el: '#divBusca',
		data: { 
			patron : ''
			},
		methods : {
			buscar : function(id){
				buscaNotas(this.patron);
			}
		}

	})

	if (utils.r$('appModo')){
		utils.vgk.appModo = new Vue({
			el: '#appModo',
			data: { 
				modo: 'NOTAS'
			},
			methods : {
				toggleModo : function(modo){
					utils.vgk.appNotas.pagina = 0;
					this.modo = modo;
					if (modo == 'NOTAS'){
						utils.vgk.appNotas.visible = true;
						utils.r$('brand').innerHTML = 'Notas';
						getTemas('NOTAS');  // se pone aquí para que Ajax no se equivoque :-)
					}
					else if (modo == 'AGEND'){
						utils.vgk.appNotas.visible = true;
						utils.r$('brand').innerHTML = 'Agenda';
						getTemas('AGEND');  // se pone aquí para que Ajax no se equivoque :-)

					}
					else if (modo == 'BITAC'){
						utils.vgk.appNotas.visible = true;
						utils.r$('brand').innerHTML = 'Bitácora';
						getTemas('BITAC');  // se pone aquí para que Ajax no se equivoque :-)
					}
					else if (modo == 'TOPOL'){
						utils.vgk.appNotas.visible = true;
						utils.r$('brand').innerHTML = 'Topología';
						getTemas('TOPOL');  // se pone aquí para que Ajax no se equivoque :-)
					}
				}
			}
		})
	}



}

//------------------------------------------------------------------- Get Notas
function ecoQueryNotas(xhr){
	var filas = utils.csv2filas(xhr.responseText);
	utils.vgk.notas = filas;
	var notas = [];
	filas.map(function(fila){
		var nota = new clases.rNota();
		nota.fila2Clase(fila);

		console.log(utils.o2s(nota));
		notas.push(nota);
	})
	utils.vgk.appNotas.notas = notas;
	if (filas.length) utils.vgk.appNotas.tagTema =filas[0].tma;
}

function getNotas(categ, tema){
	console.log(categ,tema);
	var stmt = "select * from notas where ktg='"+categ+"'";
	stmt+=" and tma = '"+tema+"'";
	stmt += ";";
	var stmtB64 = Base64.encode(stmt);
	var body = {
		id   : utils.vgk.sesion_id,
		path : vgApp.sqlite.pathDB,
		db   : vgApp.sqlite.notaDB,
		stmt : stmtB64
	}
	var params = vgApp.paramsXHR;
	params.base = vgApp.sqlite.base;
	params.eco = ecoQueryNotas;

	ajax.ajaxCmdShell(params,body);

}

//------------------------------------------------------------------- Get Temas
function ecoGetTemas(xhr){
	var filas = utils.csv2filas(xhr.responseText)
	var temas = [];
	filas.map(function(fila){
		temas.push(fila);
	})
	console.log(utils.o2s(temas));
	utils.vgk.appNotas.temas = temas;
	getNotas(utils.vgk.appModo.modo,temas[0].tma);
	utils.vgk.appNotas.notas = [];
}


function getTemas(categ){
	console.log(categ);
	var stmt = "select distinct tma from notas where ktg='"+categ+"' order by tma;";
	console.log(stmt);
	var stmtB64 = Base64.encode(stmt);
	var body = {
		id   : utils.vgk.sesion_id,
		path : vgApp.sqlite.pathDB,
		db   : vgApp.sqlite.notaDB,
		stmt : stmtB64
	}
	var params = vgApp.paramsXHR;
	params.base = vgApp.sqlite.base;
	params.eco = ecoGetTemas;

	ajax.ajaxCmdShell(params,body);
}

function ecoNuevoTema(xhr){
	console.log(xhr.responseText);
	getTemas(utils.vgk.appModo.modo);
}

export function nuevoTema(){
	var tema = prompt ('Nombre Tema?');
	if (!tema) return;
	var nota = new clases.rNota(utils.vgk.appModo.modo,tema);
	nota.tag = 'Sin titulo';
	nota.txt = 'Nota inicial (editar)';
	var stmt = nota.getInsertSQL();

	console.log(stmt);
	var stmtB64 = Base64.encode(stmt);
	var body = {
		id   : utils.vgk.sesion_id,
		path : vgApp.sqlite.pathDB,
		db   : vgApp.sqlite.notaDB,
		stmt : stmtB64
	}
	var params = vgApp.paramsXHR;
	params.base = vgApp.sqlite.base;
	params.eco = ecoNuevoTema;

	ajax.ajaxCmdShell(params,body);

}

//=================================================================== Edit Notas

function ecoGraba(xhr){
	console.log('ecoGraba: '+xhr.responseText);
	var nota = utils.vgk.appModal.item;
	getNotas(nota.ktg,nota.tma);
	utils.vgk.appModal.show = false;
	return false;
}

function grabaNota(){
	var stmt = null;
	var nota = utils.vgk.appModal.item;
	nota.convert('BBDD');
	if (utils.vgk.appModal.editON) stmt = nota.getUpdateSQL();
	else stmt = nota.getInsertSQL();

	console.log(stmt);
	var stmtB64 = Base64.encode(stmt);
	var body = {
		id   : utils.vgk.sesion_id,
		path : vgApp.sqlite.pathDB,
		db   : vgApp.sqlite.notaDB,
		stmt : stmtB64
	}
	var params = vgApp.paramsXHR;
	params.base = vgApp.sqlite.base;
	params.eco = ecoGraba;

	ajax.ajaxCmdShell(params,body);
}


function ecoBorra(xhr){
	console.log('ecoBorra: '+xhr.responseText);
	var nota = utils.vgk.appModal.item;
	getNotas(nota.ktg,nota.tma);
	utils.vgk.appModal.show = false;
	return false;
}

function borraNota(){
	var nota = utils.vgk.appModal.item;
	var stmt = nota.getDeleteSQL();
	console.log(stmt);
	var stmtB64 = Base64.encode(stmt);
	var body = {
		id   : utils.vgk.sesion_id,
		path : vgApp.sqlite.pathDB,
		db   : vgApp.sqlite.notaDB,
		stmt : stmtB64
	}
	var params = vgApp.paramsXHR;
	params.base = vgApp.sqlite.base;
	params.eco = ecoBorra;

	ajax.ajaxCmdShell(params,body);
}

function editNota(ix){
	var nota = utils.vgk.appNotas.notas[ix];
	nota.convert('EDIT');
	console.log(utils.o2s(nota));
	vapps.editaItem('NOTA',nota,grabaNota,borraNota);
}

function nuevaNota(){
	var nota = new clases.rNota(utils.vgk.appModo.modo,utils.vgk.appNotas.tagTema);
	vapps.crearItem('NOTA',nota,grabaNota);
}

function descifraNota(){
	var nota = utils.vgk.appEdit.nota;
	var frase = utils.vgk.appEdit.frase;
	var b64 = Base64.decode(nota.texto);
	var descifrado = encripta(b64,frase);
	var texto = descifrado.split('·~').join('\n');

	nota.texto = texto;
}

function buscaNotas(patron){
	if (patron.length == 0)	{
		getNotas(utils.vgk.appModo.modo,utils.vgk.appNotas.tagTema);
		return false;
	}
	var stmt = "select * from notas where ktg='"+utils.vgk.appModo.modo+"' and  tma='"+utils.vgk.appNotas.tagTema+"' and upper(tag||txt) like '%"+patron.toUpperCase()+"%' limit 50;";
	var stmtB64 = Base64.encode(stmt);
	var body = {
		id   : utils.vgk.sesion_id,
		path : vgApp.sqlite.pathDB,
		db   : vgApp.sqlite.notaDB,
		stmt : stmtB64
	}
	var params = vgApp.paramsXHR;
	params.base = vgApp.sqlite.base;
	params.eco = ecoQueryNotas;

	ajax.ajaxCmdShell(params,body);
}

export default { initApps, getTemas,nuevoTema }