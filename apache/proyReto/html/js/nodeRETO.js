
class Proceso {
	constructor (tag,rol,proy,port){
		this.tag = tag;
		this.rol = rol;
		this.proy = proy;
		this.port = port;
		this.runBy = '--';
		this.pid = 0;
		this.up = false;
	}
}

//------------------------------------------------------------------- Get Notas
function getItemsProc(str){
//	var items = str.replace(/[\s]{3}/g,"|"); // ejemplo de reemplazo de 3 espacios por 1 pipe
	var items = str.replace(/ +/g,"|");  // ejemplo de reemplazo de n espacios por 1 pipe
	return items.split('|');
}

function ecoQueryProcs(xhr){
	var lineas = xhr.responseText.split('\n');
	var procs = vg0.appProcs.procs;

	lineas.map(function(lin){
		if (lin.length){
			var str = lin.split('\/').join(' ');
			var items = getItemsProc(str);
//			if (!items.length) return;
			console.log(o2s(items))
			procs.map(function(proc){
				if (items[items.length-1].match(proc.tag)){
					proc.runBy = items[0];
					proc.pid = items[1];
					proc.up = true;
				}
			})
		}
	})
}

//------------------------------------------------------------------- Stop / Start
function ecoStopNode(xhr){
	vg0.appProcs.reset();
	ajaxQueryProcs(1234567,ecoQueryProcs);
}

function stopProcNode(tag,pid){
	var ok = confirm('Parar '+tag+'? : ('+pid+')');
	if (ok)
		ajaxStopNode(1234567,pid,ecoStopNode); // comun.js
}

function ecoStartNode(xhr){
	vg0.appProcs.reset();
	ajaxQueryProcs(1234567,ecoQueryProcs);
}

function startProcNode(tag,proy){
	ajaxStartNode(1234567,proy,tag+'.js',ecoStartNode); // comun.js
}
//------------------------------------------------------------------- Init
function initVueApps(){
	vg0.appProcs = new Vue({
		el: '#divProcs',
		data: {procs : []},
		methods : {
			limpia : function(){this.procs = [];},
			stop : function(tag,pid){stopProcNode(tag,pid);},
			start : function(tag,proy){startProcNode(tag,proy);},
			reset : function(){
				this.procs.map(function(proc){
					proc.runBy = '--';
					proc.pid = 0;
					proc.up=false;
				});
			},
			actualiza: function(procs){this.procs= procs;},
		}
	}) 
}

function creaArrayProcs(){
	var procs = [];
	var roomsTest = new Proceso('appTestRooms','TEST','Rooms',3101); procs.push(roomsTest);
	var roomsDemo = new Proceso('appDemoRooms','DEMO','Rooms',3201); procs.push(roomsDemo);
	var roomsReal = new Proceso('appRealRooms','REAL','Rooms',3301); procs.push(roomsReal);
	var agroTest  = new Proceso('appTestAgro' ,'TEST','Agro' ,3102); procs.push(agroTest);

	vg0.appProcs.actualiza(procs);
}

function init(){
	initVueApps();
	creaArrayProcs();
	ajaxQueryProcs(1234567,ecoQueryProcs);
}
