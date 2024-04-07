class NotaBloc {
	constructor(bloc){
		this.id = 0;
		this.bloc = bloc;
		this.tag = '';
		this.txt = '';
	}
}


function ecoGrabaNotaBloc(xhr){
	console.log('ecoGrabaNotaBloc: '+xhr.responseText);
	getNotasBloc(vg0.appEditNotaBloc.nota.bloc);
	vg0.appEditNotaBloc.visible = false;
	return false;
}
function grabaNotaBloc(){
	var nota = vg0.appEditNotaBloc.nota;
	var txt = nota.txt.split('\n').join('·~');

	var id = 1234567;
	var bd = 'reto.sqlite';
	if (vg0.appEditNotaBloc.editON){
		var stmt = "update blocs set tag='"+nota.tag+"',txt='"+txt+"' where id="+nota.id+";";
	}
	else {
		var stmt = "insert into blocs (bloc,tag,txt) values ('"+nota.bloc+"','"+nota.tag+"','"+txt+"');";
	}
	var ruta = '/';
	ajaxQuerySQLite (id,bd,stmt,ruta,ecoGrabaNotaBloc);
}

function ecoBorraNotaBloc(xhr){
	console.log('ecoBorraNotaBloc: '+xhr.responseText);
	getNotasBloc();
	vg0.appEditNotaBloc.visible = false;
	return false;
}

function borraNotaBloc(){
	var nota = vg0.appEditNotaBloc.nota;
	var id = 1234567;
	var bd = 'reto.sqlite';
	var stmt = "delete from blocs where id="+nota.id+";";
	var ruta = '/';
	ajaxQuerySQLite (id,bd,stmt,ruta,ecoBorraNotaBloc);
}

function editNotaBloc(id){
	var n = vg0.notas.length;
	for (var i=0;i<n;i++){
		var nota = vg0.notas[i];
		if (nota.id == id){
			var txt = nota.txt.split('<br>').join('\n');
			txt = txt.split('<a href="').join('·[');
			txt = txt.split('" target="_blank">').join('·:·');
			txt = txt.split('</a>').join(']·');
			vg0.appEditNotaBloc.nota = {id:nota.id,bloc:nota.bloc,tag:nota.tag,txt:txt}; // desacoplo de la nota en edicion
			vg0.appEditNotaBloc.letras = txt.length;
			vg0.appEditNotaBloc.visible = true;
			vg0.appEditNotaBloc.editON = true;
			break;
		}

	}
}

function nuevaNotaBloc(){
//	vg0.appEdit.nota.id = getId(6,1);
	vg0.appEdit.nota.texto = '';
	vg0.appEdit.letras = '0';
	vg0.appEdit.visible = true;
	vg0.appEdit.editON = false;
}

function descifraNotaBloc(){
	var nota = vg0.appEdit.nota;
	var frase = vg0.appEdit.frase;
	var b64 = Base64.decode(nota.texto);
	var descifrado = encripta(b64,frase);
	var txt = descifrado.split('·~').join('\n');

	nota.texto = txt;
}
//------------------------------------------------------------------- Get NotasBloc
function ecoQueryBloc(xhr){
	var filas = [];
	var lineas = xhr.responseText.split('\n');
	var caps = lineas.splice(0,1)[0];
	lineas.map(function(lin){
		if (lin.length && !lin.match('error')){
			var fila = csv2hash(caps,lin);
			if (fila) filas.push(fila)
		}
	})
	vg0.notas = filas;
	var notas = [];
	filas.map(function(fila){
		fila.txt = fila.txt.split('·~').join('<br>');
		fila.txt = fila.txt.split('·[').join('<a href="');
		fila.txt = fila.txt.split('·:·').join('" target="_blank">');
		fila.txt = fila.txt.split(']·').join('</a>');
		notas.push(fila);
	})
	vg0.appNotasBloc.notas = notas;
}

function getNotasBloc(bloc){
	vg0.nomBloc = bloc;
	var id = 1234567;
	var bd = 'reto.sqlite';
	var stmt = "select * from blocs where bloc='"+bloc+"' order by id desc;";
	var ruta = '/';
	ajaxQuerySQLite (id,bd,stmt,ruta,ecoQueryBloc);

}

function buscaNotasBloc(patron){
	if (patron.length == 0)	{getNotasBloc();return false;}
	var id = 1234567;
	var bd = 'reto.sqlite';
	var stmt = "select * from blocs where upper(txt) like '%"+patron.toUpperCase()+"%' limit 50;";
	var ruta = '/';
	ajaxQuerySQLite (id,bd,stmt,ruta,ecoQueryBloc);

}

//------------------------------------------------------------------- Blocs
function ecoGetBlocs(xhr){
	var filas = [];
	var lineas = xhr.responseText.split('\n');
	var caps = lineas.splice(0,1)[0];
	lineas.map(function(lin){
		if (lin.length && !lin.match('error')){
			var fila = csv2hash(caps,lin);
			if (fila) filas.push(fila)
		}
	})
	var blocs = [];
	filas.map(function(fila){
		blocs.push(fila);
	})
	vg0.appBlocs.blocs = blocs;
}


function getBlocs(){
	var id = 1234567;
	var bd = 'reto.sqlite';
	var stmt = 'select distinct bloc from blocs order by bloc;';
	var ruta = '/';
	ajaxQuerySQLite (id,bd,stmt,ruta,ecoGetBlocs);
}

function ecoNuevoBloc(xhr){
	console.log(xhr.responseText);
	getBlocs();
}

function nuevoBloc(){
	var tag = prompt ('Nombre?');
	if (tag) {
		var id = 1234567;
		var bd = 'reto.sqlite';
		var stmt = "insert into blocs (bloc,tag,txt) values ('"+tag+"','Sin titulo','Nota inicial (editar)');";
		var ruta = '/';
		ajaxQuerySQLite (id,bd,stmt,ruta,ecoNuevoBloc);

	}
}