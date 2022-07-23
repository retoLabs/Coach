
import utils  from '/k1/libK1_Utils.js'
import ajax   from '/k1/libK1_Ajax.js'
//import idioma from '/k1/libK1_Idioma.js'
import vapps  from '/k1/libK1_vApps.js'
import topol  from '/k1/libK1_Topol.js'
import tempo  from '/k1/libK1_Tiempo.js'

import coach   from  '/js/coach_Clases.js'

import {rDia} from '/k1/libK1_Tiempo.js'
import {vgApp,goPag}  from '/js/coach_VGlob.js'

window.rDia = rDia;
window.vgApp = vgApp;
window.goPag = goPag;

function initAppsAlmanak(){
/*
	console.log(tempo.epacta(2010));
	console.log(tempo.faseLunar(2,8,2010));
	console.log(tempo.epacta(2011));
	console.log(tempo.faseLunar(2,8,2011));
	console.log(tempo.epacta(2012));
	console.log(tempo.faseLunar(2,8,2012));
*/
	if(utils.r$('divJar')){
		utils.vgk.appJar = new Vue({
			el: '#divJar',
			data : {
				tags : [],
				jar : null,
				mes : 0,
				heads : ['L','M','X','J','V','S','D'],
				items : [],
				idAct : 0,
			},
		methods :{
			actualiza : function(dias,m){this.items[m] = dias;},
			showMes : function(m){showMes(m);},
			avant : function(){
				this.jar++;
				utils.vgk.appMes.jar = this.jar;
				utils.vgk.appSem.jar = this.jar;
				utils.vgk.almanak = new coach.Almanak('x',[],this.jar);
				showJar();
				},
			atras : function(){
				this.jar--;
				utils.vgk.appMes.jar = this.jar;
				utils.vgk.appSem.jar = this.jar;
				utils.vgk.almanak = new coach.Almanak('x',[],this.jar);
				showJar();
				},
			setDia : function(id0){
				setDia(id0); 
			}
		}
	})
}
	if(utils.r$('divMes')){
		utils.vgk.appMes = new Vue({
			el: '#divMes',
			data : {
				tag : '',
				jar : null,
				mes : 0,
				heads : [],
				items : [],
				idAct : 0,
			},
		methods :{
			actualiza : function(dias){this.items = dias;},
			actualizaTag: function(tag){this.tag = tag;},
			verSemana: function(sem){showSemana(sem);},
			showJar: function(sem){showJar();},
			avant : function(){
				if (this.mes < 11)  showMes(++this.mes);
				else return;
				},
			atras : function(){
				if (this.mes)  showMes(--this.mes);
				else return;
				},
			avantTodo : function(){
				this.mes = 11;
				showMes(this.mes);
				},
			atrasTodo : function(){
				this.mes = 0;
				showMes(this.mes);
				},
			setDia : function(id0){
				setDia(id0); 
			},
		}
		})
	}	

	if(utils.r$('divSem')){
		utils.vgk.appSem = new Vue({
			el: '#divSem',
			data : {
				tag : '',
				sem : 0,
				heads : [],
				item : {},
				idAct : 0,
			},
		methods :{
			actualiza : function(fila){this.item = fila;},
			actualizaTag: function(tag){this.tag = tag;},
			showMes: function(celda){showMes(celda.iMes);},
			showJar: function(celda){showJar();},
			avant : function(){
				if (this.sem < 53)  showSemana(++this.sem);
				else return;
				},
			atras : function(){
				if (this.sem > 1)  showSemana(--this.sem);
				else return;
				},
		}
		})
	}	

}


//------------------------------------------------------------------- Kronos
function	addTarea(){
	console.log('addTarea');
	utils.vgk.appModal.item.obj.tasks++;
	grabaDia();
}

function generaFilasMes(dias){
	var filas= [];
	var gap = utils.vgk.almanak.getGapJar();
	var d1 = dias[0];
	var dJ = d1.obj.dJ;
	var dS = d1.obj.dS;
	var semN = Math.floor((dJ+gap)/7)+1;
	if (!((dJ+gap) % 7)) semN--; // si es múltiplo de 7

	var fila = {};
	fila['W'] = semN;

	for (var i=0;i<dias.length;i++){
		var dia = dias[i];

		var hoy = new Date();
		var strHoy = hoy.getDate()+'/'+(parseInt(hoy.getMonth())+1)+'/'+ hoy.getFullYear();
		var esHoy = (dia.obj.dd == strHoy);
		var celda = {
			id0: dia.id0,
			tag:dia.tag,
			hoy:esHoy,
			dF:dia.obj.dF,
			retol:dia.obj.retol,
			tasks:(dia.obj.tasks > 0)
		}
		switch(dia.obj.dS){
			case 0: fila['L'] = celda; break;
			case 1: fila['M'] = celda; break;
			case 2: fila['X'] = celda; break;
			case 3: fila['J'] = celda; break;
			case 4: fila['V'] = celda; break;
			case 5: fila['S'] = celda; break;
			case 6: 
				fila['D'] = celda; 
				filas.push(fila);
				var fila = {};
				fila['W']=++semN;
				break;
		}

	}
		

	if (fila.L) filas.push(fila);
	return filas;
}

function	generaFilaSem(dias){
	var fila = {};
	for (var i=0;i<dias.length;i++){
		var dia = dias[i];
		var iMes = parseInt(dia.obj.dd.split('/')[1]) - 1;
		var jar = parseInt(dia.obj.dd.split('/')[2]);
		var tagMes = utils.vgk.almanak.getTagMM(iMes);

		var hoy = new Date();
		var strHoy = hoy.getDate()+'/'+(parseInt(hoy.getMonth())+1)+'/'+ hoy.getFullYear();
		var esHoy = (dia.obj.dd == strHoy);
		var celda = {
			id0: dia.id0,
			dia:dia.tag,
			hoy:esHoy,
			dF:dia.obj.dF,
			fL:'img/lunas/Luna'+dia.obj.fL+'.png',
			hL: Math.floor(dia.obj.hL * 5/60)+'h '+(dia.obj.hL*5) % 60+'m',
			retol:dia.obj.retol,
			tasks:(dia.obj.tasks > 0),
			mes : tagMes,
			jar : jar,
			iMes: iMes
		}

		switch(dia.obj.dS){

			case 0: fila['L'] = celda; break;
			case 1: fila['M'] = celda; break;
			case 2: fila['X'] = celda; break;
			case 3: fila['J'] = celda; break;
			case 4: fila['V'] = celda; break;
			case 5: fila['S'] = celda; break;
			case 6: fila['D'] = celda; break;
		}
	}

	return fila;

}
function getRetolsML(cod){
	var tagsML = [];	
	if (cod == 'MM') 	
		var tagsML = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
	else if (cod == 'WW')
		var tagsML = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
	return tagsML;
}

function showJar(){
	utils.r$('divJar').style.display = 'block';
	utils.r$('divMes').style.display = 'none';
	utils.r$('divSem').style.display = 'none';
	utils.vgk.appMes.items = [];
	utils.vgk.appJar.items = [[],[],[],[],[],[],[],[],[],[],[],[]];
	var arrMeses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
	var tagsML = getRetolsML('MM');
	console.log(utils.o2s(tagsML));

	if (tagsML.length == 0) tagsML = arrMeses;
	utils.vgk.appJar.tags = tagsML;
	
	for (var i=0;i<12;i++){
		var dias = utils.vgk.almanak.getDiasMes(i);
		var filas = generaFilasMes(dias);
		utils.vgk.appJar.actualiza(filas,i);
	}
}

function showMes(mes){
//	console.log(tempo.pascua(2019));
	utils.r$('divJar').style.display = 'none';
	utils.r$('divMes').style.display = 'block';
	utils.r$('divSem').style.display = 'none';
	utils.vgk.appJar.items = [];

	var arrDias = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
	var tagsWW =  getRetolsML('WW');
	console.log(utils.o2s(tagsWW));
	if (tagsWW.length == 0) tagsWW = arrDias;
	utils.vgk.appMes.heads = tagsWW;
	utils.vgk.appMes.mes = parseInt(mes);

	var tagMM = utils.vgk.almanak.getTagMM(utils.vgk.appMes.mes);
	utils.vgk.appMes.actualizaTag(tagMM);

	var dias = utils.vgk.almanak.getDiasMes(mes);
	var filas = generaFilasMes(dias);
	utils.vgk.appMes.actualiza(filas);
}

function showSemana(sem){
	utils.r$('divJar').style.display = 'none';
	utils.r$('divMes').style.display = 'none';
	utils.r$('divSem').style.display = 'block';
	var arrDias = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
	var tagsML =  getRetolsML('WW');
	var dma = getRetolsML('DMA');
	console.log(utils.o2s(tagsML));
	if (tagsML.length == 0) tagsML = arrDias;
	var dias = utils.vgk.almanak.getDiasSem(sem);
	var fila = generaFilaSem(dias);
	if (fila){
		utils.vgk.appSem.heads = tagsML;
		utils.vgk.appSem.sem = sem;
		utils.vgk.appSem.tag = utils.vgk.appMes.jar + ' ('+dma[1]+' '+sem+')';
		utils.vgk.appSem.actualiza(fila);
	}

}

function creaCalendario(){
	var hoy = new Date();
	var jar = hoy.getFullYear();
	var mes = hoy.getMonth();
	console.log(mes+'/'+jar);
	var tagsML = getRetolsML('MM');
	utils.vgk.almanak = new coach.Almanak('x',[],jar,tagsML);
	utils.vgk.appJar.jar = jar;
	utils.vgk.appMes.jar = jar;
	showMes(mes); 
}
//------------------------------------------------------------------- Kairos
/* Cronos se genera cada vez. Los id0s cambian, por tanto
Kairos se graba en la BDD.Al editar, el item apunta al nodo en Kronos
Los cambios que hacemos se reflejan inmediatamente en Kronos.
Pero hay que grabarlos en Kairos.
Al borrar un dia de Kairos, hay que 'resetear' Kronos, y actualizar Kairos.

Fiestas Nacionales
	1 de enero, Año Nuevo
	19 de abril, Viernes Santo (FUNC pascua)
	1 de mayo, Fiesta del Trabajo
	15 de agosto, Asunción de la Virgen (FUNC pascua)
	12 de octubre, Día de la Hispanidad
	1 de noviembre, Día de Todos los Santos
	6 de diciembre, Día de la Constitución
	25 de diciembre, Navidad

	Los festivos que caigan en domingo, se pasan al lunes siguiente
*/


function borraDia(){
	var dia = utils.vgk.appModal.item;
	utils.vgk.kairos.removeDia(dia);
	utils.vgk.almanak.resetNodoCron(dia);
	updateKairos();
	utils.vgk.appModal.show = false;
	showMes(utils.vgk.appMes.mes);
}
function grabaDia(){
	var dia = utils.vgk.appModal.item;
	utils.vgk.kairos.upsertDia(dia);
	updateKairos();
	utils.vgk.appModal.show = false;
	showMes(utils.vgk.appMes.mes);
}

function setDia(id0){
	var dia = utils.vgk.almanak.getNodoById(id0);
	if (!utils.vgk.kairos_id){ console.log('No hay Kairos');return;}
	vapps.editaItem('DIA',dia,grabaDia,borraDia);
}
//------------------------------------------------------------------- Crear Lista de Kairos
function ecoGet1Kairos(xhr){
	var loTopol = JSON.parse(xhr.responseText);
	console.log(utils.o2s(loTopol.meta));
	utils.vgk.kairos_id = loTopol._id;
	utils.vgk.kairos = new tempo.rKairos("",[]);
	utils.vgk.kairos.objDB2Clase(loTopol);
	var crons = utils.vgk.kairos.getRaspa();
	utils.vgk.almanak.mergeKairos(crons);
	showMes(utils.vgk.appMes.mes);
}

function get1Kairos(_id){
	utils.vgk.kairos_id = _id;
	var params = vgApp.paramsXHR;
	params.base = '/datos/';
	params.eco = ecoGet1Kairos;
	params.topolId = _id;

	ajax.ajaxGet1Topol(params);
	utils.vgk.appModal.showLOV = false;
	return false;
}

function cargaKairos(){
	get1Kairos(utils.vgk.appModal.idAct);
}

function ecoNuevoKairos(xhr){
	var loTopol = JSON.parse(xhr.responseText);
	utils.vgk.kairos_id = loTopol._id;
	utils.vgk.listaKairos.push({id:loTopol._id,meta:loTopol.meta});
	utils.vgk.appModal.showLOV = false;
	var crons = utils.vgk.kairos.getRaspa();

	utils.vgk.almanak.mergeKairos(crons);

	showMes(utils.vgk.appMes.mes);
	utils.vgk.appModal.showLOV = false;
}
function ecoUpdateKairos(xhr){
	console.log('Actualizado Kairos ');
}
function updateKairos(){
	var params = vgApp.paramsXHR;
	params.base = '/datos/';
	params.eco = ecoUpdateKairos; 
	params.txt = utils.o2s(utils.vgk.kairos.clase2ObjDB());
	params.topolId = utils.vgk.kairos_id;
	ajax.ajaxPutTopol(params);
}


function nuevoKairos(){
	var nom = prompt('Nombre?');
	if (!nom) return;
	var jar = parseInt(utils.vgk.almanak.jar);
	var raiz = new topol.rNodo(nom);
	utils.vgk.kairos = new tempo.rKairos(nom,[raiz]);
	var an = new rDia(1,1,1,jar); //1 de enero, Año Nuevo
	an.obj.retol = 'Año Nuevo';
	an.obj.dF = 'NAC';
	utils.vgk.kairos.addNodoHijo(raiz,an); 

	var dp = tempo.pasqa(jar); // Date - domingo de Pascua
	var vs0 = new Date(dp.setDate(dp.getDate()-2)); // Date - Viernes Santo (DP -2)
	var d = vs0.getDate();
	var m = vs0.getMonth()+1;
	var vs = new rDia(d,d,m,jar); // Viernes Santo
	console.log(utils.o2s(vs));
	vs.obj.retol = 'V. Santo';
	vs.obj.dF = 'NAC';
	utils.vgk.kairos.addNodoHijo(raiz,vs);

	var ft = new rDia(1,1,5,jar);//1 de mayo, Fiesta del Trabajo
	ft.obj.retol = 'F. Trabajo';
	ft.obj.dF = 'NAC';
	utils.vgk.kairos.addNodoHijo(raiz,ft);
	//15 de agosto, Asunción de la Virgen (FUNC pascua)

	var dp = tempo.pasqa(jar); // Date - domingo de Pascua 
	var as0 = new Date(dp.setDate(dp.getDate()+39)); // Date Ascensión : DP+40 dias
	var d = as0.getDate();
	var m = as0.getMonth()+1;
	var as = new rDia(d,d,m,jar); // Ascensión del Señor (DP+40)
	console.log(utils.o2s(as));
	as.obj.retol = 'Asc. Señor';
	as.obj.dF = 'NAC';
	utils.vgk.kairos.addNodoHijo(raiz,as);

	var dh = new rDia(12,12,10,jar); //12 de octubre, Día de la Hispanidad
	dh.obj.retol = 'D. Hispanidad';
	dh.obj.dF = 'NAC';
	utils.vgk.kairos.addNodoHijo(raiz,dh);

	var ts = new rDia(1,1,11,jar); //1 de noviembre, Día de Todos los Santos
	ts.obj.retol = 'T. Santos';
	ts.obj.dF = 'NAC';
	utils.vgk.kairos.addNodoHijo(raiz,ts);

	var dc = new rDia(6,6,12,jar); //6 de diciembre, Día de la Constitución
	dc.obj.retol = 'D. Constitución';
	dc.obj.dF = 'NAC';
	utils.vgk.kairos.addNodoHijo(raiz,dc);

	var dn = new rDia(25,25,12,jar); //25 de diciembre, Navidad
	dn.obj.retol = 'Navidad';
	dn.obj.dF = 'NAC';
	utils.vgk.kairos.addNodoHijo(raiz,dn);

	var params = vgApp.paramsXHR;
	params.base = '/datos/';
	params.eco = ecoNuevoKairos; 
	params.txt = utils.o2s(utils.vgk.kairos.clase2ObjDB());
	ajax.ajaxPostTopol(params);
}


function ecoGetKairos(xhr){
	var objs = JSON.parse(xhr.responseText);
	utils.vgk.listaKairos = objs;
}

function ajaxGetKairos() {
	var params = vgApp.paramsXHR;
	params.base = '/metasByOrg/';
	params.eco = ecoGetKairos;
	params.iam = 'rKairos';
	params.org = utils.vgk.user.org;

	ajax.ajaxGetMetasByOrg(params);
 }

function ecoBorraKairos(xhr){
	console.log(xhr.responseText);
	utils.vgk.appModal.showLOV = false;
	ajaxGetKairos();
}

function borraKairos(){
	var ok = confirm('Seguro que quiere borrar ?');
	if (!ok) return;

	var _id = utils.vgk.appModal.idAct;
	var params = vgApp.paramsXHR;
	params.base = '/datos/';
	params.eco = ecoBorraKairos; 
	params.topolId = _id;
	ajax.ajaxDeleteTopol(params);
	return false;
}

function showListaKairos(){
	utils.vgk.appModal.items = utils.vgk.listaKairos;
	if (utils.vgk.listaKairos.length) utils.vgk.appModal.idAct = utils.vgk.listaKairos[0]._id;
	utils.vgk.appModal.conds = {retol : 'Lista Kairos'};
	utils.vgk.appModal.modo = 'modal-container';
	utils.vgk.appModal.edit_t = 'LISTA';
	utils.vgk.appModal.fnBorra = borraKairos;
	utils.vgk.appModal.showLOV = true;
}

export default {
	initAppsAlmanak,creaCalendario,
	ajaxGetKairos,showListaKairos,nuevoKairos,cargaKairos,get1Kairos,
	addTarea
}