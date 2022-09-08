import utils  from '/k1/libK1_Utils.js'
import topol  from '/k1/libK1_Topol.js'
import clases from '/k1/libK1_Clases.js'


//------------------------------------------------------------------- Cosa
export class Cosa extends topol.rDrag {
	constructor(tag){
		super(tag);
		this.iam = 'Cosa';
	}

	objDB2Clase(objDB){
		super.objDB2Clase(objDB);
		this.iam = objDB.iam;
	}
	
	vale(conds){
		conds.valid.tag.ok =  utils.inputOK('TAG',this.tag);
		return conds;
	}
	getNodoML(){
		var nodoML = new rNodoClase('Cosa');
		nodoML.obj.clase = 'Cosa';
		nodoML.obj.retol = {ES:'Cosa',CAT:'Cosa'};
		nodoML.obj.valid = {
			ES : {
				tag:'Err:Obligatorio. Deben ser letras a-z',
			},
			CAT : {
				tag:'Err:Obligatori. Deuen ser lletras a-z',
			}
		}
		return nodoML;

	}
}

//------------------------------------------------------------------- Task Links (arcos)
export class n4jArco extends topol.rArco {
	constructor(tag,nodo0,nodo1,n){
		super(tag,nodo0,nodo1,n);
		this.iam = "n4jArco";
	}

	vale(conds){
		conds.valid.tag.ok =  utils.inputOK('TAG',this.tag);
		conds.valid.gap.ok = utils.inputOK('INT',this.obj.gap);
		return conds;
	}

	getNodoML(){
		var nodoML = new rNodoClase('n4jArco');
		nodoML.obj.clase = 'n4jArco'
		nodoML.obj.retol =  {ES : 'Arco Tareas',CAT :'Arc Tascas'};
		nodoML.obj.valid = {
			ES : {
				tag:'Err:Obligatorio. Deben ser letras a-z',
				gap:'Err: Debe ser un número entero',
			},
			CAT : {
				tag:'Err:Obligatori. Deuen ser lletras a-z',
				gap:'Err:Ha de ser un número sencer',
			}
		};
		return nodoML;
	}

}

function addClasesNeo4j(){
	var clase = new Cosa('x');
	var nodoML = clase.getNodoML();
	utils.vgk.clasesML.addTextosEdit(nodoML);

	var clase = new n4jArco('x');
	var nodoML = clase.getNodoML();
	utils.vgk.clasesML.addTextosEdit(nodoML);
}

