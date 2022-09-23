import utils  from '/k1/libK1_Utils.js'
import ajax   from '/k1/libK1_Ajax.js'
import topol  from '/k1/libK1_Topol.js'
import trazo  from '/k1/libK1_Trazo.js'
import vapps  from '/k1/libK1_vApps.js'
import {Cosa,n4jArco}  from '/js/neo4j_Clases.js'



function initAppCypher(){
	utils.vgk.appQueryTable = new Vue ({
		el: '#queryTable',
		data : {
			database: 'usersCoach.sqlite',
			heads : [],
			filas :[],
			cells :[],
			stmt :null
		},
		methods : {
			setFilas : function (filas){
				this.filas = filas;
			},
			setHeads : function (heads){
				this.heads = heads;
			},
			execStmt : function(){
				console.log(this.database+' : '+this.stmt);
				execQuery(this.stmt);
			},
			showGrafo : function (){showGrafo();}
		}
	})
}


function grabaNodo(){
	console.log('grabaNodo');
	var nodo = utils.vgk.appModal.item;
	var stmt = 'MATCH (n:'+nodo.iam + '{id0:'+nodo.id0+'}) set n.nom="'+nodo.tag+'" return n;';
	console.log(stmt);
	
	utils.vgk.appQueryTable.stmt = stmt;
	utils.vgk.appQueryTable.execStmt();
	utils.r$('divBase').style.display = 'block';
	showElGrafo();
}

function grabaArco(){
	console.log('grabaArco');
	var arco = utils.vgk.appModal.item;
/*
	var stmt = 'MATCH (n:'+nodo.iam + '{id0:'+nodo.id0+'}) set n.nom="'+nodo.tag+'" return n;';
	console.log(stmt);
	
	utils.vgk.appQueryTable.stmt = stmt;
	utils.vgk.appQueryTable.execStmt();
*/
}

function borraNodo(){
	console.log('borraNodo');
	var nodo = utils.vgk.appModal.item;
	var stmt = 'MATCH (n:'+nodo.iam + '{id0:'+nodo.id0+'}) OPTIONAL MATCH (n)-[r]-() delete r,n;';
	console.log(stmt);
	
	utils.vgk.appQueryTable.stmt = stmt;
	utils.vgk.appQueryTable.execStmt();
}

function borraArco(){
	console.log('borraArco');
	var arco = utils.vgk.appModal.item;
	var stmt = 'MATCH (n1)-[r]->(n2) '
	stmt += 'where n1.id0='+ arco.getId0Real()+' and n2.id0 = ' + arco.id1;
	stmt += ' delete r;';
	console.log(stmt);
	
	utils.vgk.appQueryTable.stmt = stmt;
	utils.vgk.appQueryTable.execStmt();
}

function editNodo(id){
	console.log('editNodo', id);
	var nodo = utils.vgk.grafo.getNodoById(id);
	vapps.editaItem('COSA',nodo,grabaNodo,borraNodo);
	utils.r$('divBase').style.display = 'none';
}

function editArco(arco){
	console.log('editArco', arco);
	vapps.editaItem('ARCO',arco,grabaArco,borraArco);
	utils.r$('divBase').style.display = 'none';
}

function n4j2nodo(neo4j,id){
	var patt1 = /(:\w+) ({.*})/;
	var items = neo4j.match(patt1);
	var lbls = items[1];
	var prop = items[2];

	var patt2 = /(\w+):/g;
	var flds = prop.match(patt2);

	flds.map(function(fld){
		var key = '"'+fld.match(/\w+/)+'":';
		var re = new RegExp(key,"g");
		prop = prop.split(fld).join(key);
	})
console.log(prop);
	var obj = JSON.parse(prop);
	var nodo = new Cosa(obj.nom);
	nodo.dim.w = 50;
	nodo.dim.h = 50;
	nodo.iam = 'Cosa'; //lbls.split(':').join();
	nodo.id0 = obj.id0;

	return nodo;
}

function n4j2arco(neo4j,nodoI,nodoF){
	var patt1 = /(:\w+)/;
	var items = neo4j.match(patt1);
	var lbls = items[1];
	var arco = new topol.rArco(lbls,nodoI.id0,nodoF.id0,0);

	return arco;
}

function showElGrafo(){
	utils.vgk.trazo.clearDivsNodo();
	utils.vgk.trazo.showNodosGrafo(utils.vgk.grafo.nodos);
	
/*	var dims = utils.vgk.grafo.getDimsArcos();
	utils.vgk.trazo.canvas.reset();
	utils.vgk.trazo.canvas.pintaArcos(dims);
*/
}

function creaCanvas(){
	utils.vgk.trazo = new trazo.rTrazo('divBase');
	utils.vgk.trazo.fnDrop = onDrop;
	utils.vgk.trazo.fnKeyBase = onKeyBase;
	utils.vgk.trazo.fnKeyDivI = onKeyDivI;
	utils.vgk.trazo.fnKeyDivF = onKeyDivF;
	utils.vgk.trazo.grid = 10;
	utils.vgk.trazo.activaCanvas();
	showElGrafo();
}


function showGrafo(){
	var nodos = [];
	var index = []; // para evitar nodos repetidos

//	var grafo = new agro.GrafoTasks("",[]);
	utils.vgk.appQueryTable.filas.map(function(fila){
		var nodoI = n4j2nodo(fila.ini.trim(),fila.id0);
		console.log("nodo I",utils.o2s(nodoI));
		var idx = nodoI.id0;
		if (index.indexOf(idx) < 0){
			index.push(idx);
			nodos.push(nodoI);
		}

		if (fila.arc.trim() != 'NULL'){
			var nodoF = n4j2nodo(fila.fin.trim(),fila.id1);
			console.log("nodo F",utils.o2s(nodoF));
			var idx = nodoF.id0;
			if (index.indexOf(idx) < 0){
				index.push(idx);
				nodos.push(nodoF);
			}
			var arco = n4j2arco(fila.arc.trim(),nodoI,nodoF);
			console.log("arco",utils.o2s(arco));
			console.log(arco.idI, '-->', arco.idF);
			nodos.push(arco);
			console.log("-----------------");
		}
	});

//	console.log(utils.o2s(nodos));
	var grafo = new topol.rGrafo('Grafo 1',nodos);
//	console.log(utils.o2s(grafo.clase2ObjDB()));
	utils.vgk.grafo = grafo;


	creaCanvas();
}

function showFilas(xhr){
	var lins = xhr.responseText.split('\n');
	var caps = lins[0].split('|');
	var filas = utils.csv2filas(xhr.responseText);
	utils.vgk.appQueryTable.setHeads(caps);
	utils.vgk.appQueryTable.setFilas(filas);
}

function execQuery(stmt){
	var stmtB64 = Base64.encode(stmt);
	var body = {
		id : utils.vgk.sesion_id,
		usr : 'neo4j',
		pwd : 'grafo1',
		stmt : stmtB64,
		path : vgApp.cypher.pathDB,
	}
	var params = vgApp.paramsXHR;
	params.base = vgApp.cypher.base;
	params.eco = showFilas; 

	ajax.ajaxCmdShell(params,body);
	return false;
}
export default {initAppCypher,execQuery}


//===================================================================

function addNodoGrafoNeo4j(nodo){
	var cypher = '(n:'+nodo.iam + ' {id0:'+nodo.id0+',nom:"'+nodo.tag+'"})';
	console.log(cypher);
	var stmt ='create '+ cypher +' return n;';

	utils.vgk.appQueryTable.stmt = stmt;
	utils.vgk.appQueryTable.execStmt();

}


function addArcoNeo4j(nodoI,nodoF,arco){
	var cypher = 'MATCH \
		(i:'+nodoI.iam+'), \
		(f:'+nodoF.iam+') \
		WHERE i.id0 = '+nodoI.id0+' AND f.id0 = '+nodoF.id0+' \
		CREATE (i)-[r:'+arco.iam+']->(f) \
		RETURN r;'

	utils.vgk.appQueryTable.stmt = cypher;
	utils.vgk.appQueryTable.execStmt();

}

//------------------------------------------------------------------- Teclas
function onKeyBase(cod,pntX,pntY){
	if (cod == 'CTRL'){
		var tag = prompt('Tag?','Nuevo');
		if (!tag) return false;

		var nodo = new Cosa(tag);
		console.log(utils.vgk.tecla);
		nodo.dim = {x:pntX,y:pntY,w:120,h:60};
		console.log('Antes: '+ utils.o2s(utils.vgk.grafo.index))
		utils.vgk.grafo.addNodo(nodo);
		console.log('Luego: '+ utils.o2s(utils.vgk.grafo.index))
		utils.vgk.trazo.addDivNodo(nodo);
		utils.vgk.tecla = null;
		addNodoGrafoNeo4j(nodo);
	}
}

function onKeyDivI(cod,id){
	if (cod == 'CTRL'){
		console.log(cod+':'+id);
		utils.vgk.arcoId0 = id;
	}
}

function ctrlKeyON(id){
	if (utils.vgk.arcoId0 == id){
		console.log('Arco sobre mismo Nodo');
		return false;
	}
	else {
		var nodoI = utils.vgk.grafo.getNodoById(utils.vgk.arcoId0);
		var nodoF = utils.vgk.grafo.getNodoById(id);
		console.log('nodoI: ' + utils.o2s(nodoI))
		console.log('nodoF: ' + utils.o2s(nodoF))
		var link = new n4jArco('x',nodoI,nodoF,0);
		link.iam = 'ARCO';
		var yaEsta = utils.vgk.grafo.existArco(link);
		console.log('ya esta?',yaEsta);
		if (yaEsta){
			editArco(link);}
		else {
			utils.vgk.grafo.addArcoSelf(link)};
			addArcoNeo4j(nodoI,nodoF,link);
		}
	showElGrafo();
}


function shiftKeyON(id){
	editNodo(id);
}

function onKeyDivF(cod,id){
	console.log('onKeyDivF: '+cod);
	if (cod == 'CTRL')	ctrlKeyON(id);
	else if (cod == 'SHIFT') shiftKeyON(id);
}

function onDrop(div){
	console.log('Drop: '+ div.id)
// Actualiza posición del nodo en el grafo
	var divX = parseInt(div.style.left.replace('px',''));
	var divY = parseInt(div.style.top.replace('px',''));
	
	var nodo = utils.vgk.grafo.getNodoById(parseInt(div.id));
	nodo.dim.x = divX;
	nodo.dim.y = divY;

	var dims = utils.vgk.grafo.getDimsArcos();
	utils.vgk.trazo.canvas.reset();
	utils.vgk.trazo.canvas.pintaArcos(dims);

	var task = utils.vgk.grafo.getNodoById(div.id);

}

