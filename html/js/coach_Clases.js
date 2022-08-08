// coach_Clases.js
//=================================================================== SUELO
/*
Building the regex from the rules (in an order of convenience):

	+ both upper and lower case => use case insensitive flag //i
	+ letters, numbers, underscore and period => [\w.]*
	+ 3-25 characters => ^[\w.]{3,25}$
	+ cannot begin or end with period or underscore => (?!^[\W_]|[W_]$)
		(notice uppercase \W meaning not \w)
	+ cannot contain 2 punctuation in a row => (?![\W_]{2})
	+ checking the negative lookahead in every position => (?:(?!...)[\w.]){3,25}
		(using non-capturing group (?:) instead of () because we don't need to save the group)
	+ at least 2 letters => (?:.*[a-z]){2} assuming i flag

	wrap into lookahead (not consuming any characters) so we can check multiple conditions => (?=(?:...))

The final regex literal:

/^(?=(?:.*[a-z]){2})(?:(?!^[\W_]|[\W_]{2}|[\W_]$)[\w.]){3,25}$/i
Para permitir espacios y no punto: [\w ]
*/

import utils  from '/k1/libK1_Utils.js'
import topol  from '/k1/libK1_Topol.js'
import tempo  from '/k1/libK1_Tiempo.js'
import clases from '/k1/libK1_Clases.js'

//=================================================================== ALMANAQUE
//------------------------------------------------------------------- Almanaque coach
class Almanak extends tempo.rKronos {
	constructor (tag,nodos,jar,tagsMM){
		super(tag,nodos,jar,tagsMM);
		this.meta.iam = 'Almanak';
	}

	objDB2Clase(objDB){
		super.objDB2Clase(objDB);
		this.meta.iam = 'Almanak';
	}

	getTagMM (mes){
		return this.tagsMM[mes];
	}

	mergeKairos(crons){
		var raspa = this.getRaspa();
		crons.map(function(cron){
			var dma = cron.obj.dd.split('/');
			var d = parseInt(dma[0]);
			var m = parseInt(dma[1]);
			var a = parseInt(dma[2]);

			if (a == this.jar){
				var mes = raspa[m-1];
				var idDia = mes.hijos[d-1];
				var dia = this.getNodoById(idDia);
				if (dia.obj.dS == 6 ){
					console.log('Merge Cronos Fiesta Domingo: '+dia.obj.dd);
					d++;
				}  // si es domingo, lo pasa al dia siguiente
				if (d < mes.hijos.length){  // si NO se pasa de mes, obtener el dia
					var idDia = mes.hijos[d-1];
					dia = this.getNodoById(idDia);
					}
				else {								// si se pasa de mes, recalcular mes y obtener dia 0
					m++;
					mes = raspa[m-1];
					idDia = mes.hijos[0];
					dia = this.getNodoById(idDia);
				}
				dia.obj.retol = cron.obj.retol;
				dia.obj.dF = cron.obj.dF;
				dia.obj.tasks = cron.obj.tasks;
			}
		}.bind(this))
	}


	getDiaByLapso(lapso){
		var date = lapso.toDateI();
		var ixMes = date.getMonth(); // 0-11
		var nodoMes = this.getRaspa()[ixMes];
		var ixDia = date.getDate(); // 1-31
		var idDia = nodoMes.hijos[ixDia-1];
		var nodoDia= this.getNodoById(idDia);

		return nodoDia;
	}

}

class Temario extends topol.rArbol {
	constructor (tag,nodos){
		super(tag,nodos);
		this.meta.iam = 'Temario';
	}

	calculaAuto(nodo){

	}

	getTemas(){
		var temas = [];
		this.nodos.map(function(nodo){
			if (nodo.rol == 'TEMA') temas.push(nodo);
		}.bind(this))
		return temas;
	}
	sumaRecursiva(nodo){
		if (nodo.hijos.length){
			var hijos = this.getHijosNodo(nodo);
			for (var i=0;i<hijos.length;i++){
				this.sumaRecursiva(hijos[i]);
				nodo.obj.horas += hijos[i].obj.horas;
			}
		}
	}

	resetNodos(){
		this.nodos.map(function(nodo){
			if (nodo.rol != 'TEMA') nodo.obj.horas = 0;
		}.bind(this))
	}

	calcula(tipo){
		var temas = this.getTemas();
		var total = 500;
		switch(tipo){
			case 'AUTO':
				temas.map(function(tema){
					tema.obj.horas = Math.round(total/temas.length);
				})
				break;
		}
		var raiz = this.getRaiz();
		this.resetNodos();
		this.sumaRecursiva(raiz);
	}
}

export class ItemTemario extends topol.rNodo {
	constructor (tag){
		super(tag);
		this.iam = 'ItemTemario';
		this.obj = {
			horas : 0
		}
	}

	objDB2Clase(objDB){
		super.objDB2Clase(objDB);
		this.iam = 'ItemTemario';
		this.obj = objDB.obj;
	}
}

export class TaskClase extends topol.rNodo {
	constructor (tag){
		super(tag);
		this.iam = 'TaskClase';
		this.obj = {
			horas : 0,
			dia: '',
			ini : '',
			fin : ''
		}
	}

	objDB2Clase(objDB){
		super.objDB2Clase(objDB);
		this.iam = 'TaskClase';
		this.obj = objDB.obj;
	}
}

export default {
	Almanak, Temario, ItemTemario
}