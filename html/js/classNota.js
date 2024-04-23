import topol from '../k1/libK1_Topol.js'
import utils from '../k1/libK1_Utils.js'


class Nota {
	constructor(categ,tema){
		this.iam = 'rNota';
		this.idf = null;		// id fila en tabla notas (SQLite)
		this._id = null;		// _id de la topologia (mongoDB)
		this.id0 = null;		// id0 del nodo en la topología
		this.org = null;		// org del user 
		this.ktg = categ;		// categoría de la nota
		this.tma = tema;		// tema de la nota
		this.dma = null;		//fecha (d/m/a)
		this.tag = null;			// tag de la nota
		this.txt = null;			// texto inicial
	}

	fila2Clase(fila){
		this.idf = fila.idf; // Ojo!! csv2filas pasa a minúsculas !!!!
		this._id = fila._id;
		this.id0 = fila.id0;
		this.org = fila.org;
		this.ktg = fila.ktg;
		this.tma = fila.tma;
		this.dma = fila.dia;
		this.tag = fila.tag;
		this.txt = fila.txt;
		this.convert('HTML');
	}

	convert(modo){
		var txt = null;
		switch(modo){
			case 'BBDD':
				var txt = this.txt.split('\n').join('·~');
				break;
			case 'EDIT':
				var txt = this.txt.split('<br>').join('\n');
				txt = txt.split('<a href="').join('·[');
				txt = txt.split('" target="_blank">').join('·:·');
				txt = txt.split('</a>').join(']·');
				break;
			case 'HTML':
				var txt = this.txt.split('·~').join('<br>');
				txt = txt.split('·!').join('|');
				txt = txt.split('·[').join('<a href="');
				txt = txt.split('·:·').join('" target="_blank">');
				txt = txt.split(']·').join('</a>');
				break;
			case 'FILA':
				var txt = this.txt.split('<br>').join('·~');
				txt = txt.split('<a href="').join('·[');
				txt = txt.split('" target="_blank">').join('·:·');
				txt = txt.split('</a>').join(']·');

		}
		this.txt = txt;
	}

	getInsertSQL(){
		var org = null;
		this.convert('FILA');
		if (utils.vgk.user) org = utils.vgk.user.org;
		else org = 'NOORG';
		
		console.log(this.ktg,org);
		var stmt = null;
		stmt = "insert into notas ";
		stmt += "(org,ktg,tma,tag,txt) values (";
		stmt += "'"+org+"','"+this.ktg+"','"+this.tma+"','"+this.tag+"','"+this.txt+"');";
		return stmt;
	}
	getUpdateSQL(){
		this.convert('FILA');
		var stmt = null;
		stmt = "update notas set ";
		stmt += "org='"+this.org+"',";
		stmt += "ktg='"+this.ktg+"',";
		stmt += "tma='"+this.tma+"',";
		stmt += "tag='"+this.tag+"',";
		stmt += "txt='"+this.txt+"' ";
		stmt += "where idf="+this.idf+";";
		return stmt;
	}
	getDeleteSQL(){
		var stmt = null;
		stmt = "delete from notas where idf="+this.idf+";";
		return stmt;
	}

	vale(conds){
	//	conds.valid.tag.ok =  utils.inputOK('TAG',this.tag);
		return conds;
	}

}
export default {Nota}