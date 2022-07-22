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
export class Almanak extends tempo.rKronos {
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


export default {
	Almanak
}