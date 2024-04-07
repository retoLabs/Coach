class Nota {
	constructor(){
		this.id = 0;
		this.texto = '';
	}
}

function ecoGraba(xhr){
	console.log('ecoGraba: '+xhr.responseText);
	getNotas();
	vg0.appEdit.visible = false;
	return false;
}
function grabaNota(){
	var txt = '';
	var nota = vg0.appEdit.nota;

	txt = nota.texto.split('\n').join('·~');
	txt = txt.split('|').join('·!');
	if (vg0.appEdit.cifra){
		var frase = vg0.appEdit.frase;
		txt = Base64.encode(encripta(txt,frase));
	}
	var id = 1234567;
	var bd = 'reto.sqlite';
	if (vg0.appEdit.editON){
		var stmt = "update notas set texto='"+txt+"' where id="+nota.id+";";
	}
	else {
		var stmt = "insert into notas (texto) values ('"+txt+"');";
	}
	var ruta = '/';
	ajaxQuerySQLite (id,bd,stmt,ruta,ecoGraba);
}

function ecoBorra(xhr){
	console.log('ecoBorra: '+xhr.responseText);
	getNotas();
	vg0.appEdit.visible = false;
	return false;
}

function borraNota(){
	var nota = vg0.appEdit.nota;
	var id = 1234567;
	var bd = 'reto.sqlite';
	var stmt = "delete from notas where id="+nota.id+";";
	var ruta = '/';
	ajaxQuerySQLite (id,bd,stmt,ruta,ecoBorra);
}

function editNota(id){
	var n = vg0.notas.length;
	for (var i=0;i<n;i++){
		var nota = vg0.notas[i];
		if (nota.id == id){
			var txt = nota.texto.split('<br>').join('\n');
			txt = txt.split('<a href="').join('·[');
			txt = txt.split('" target="_blank">').join('·:·');
			txt = txt.split('</a>').join(']·');
			vg0.appEdit.nota = {id:nota.id,texto:txt}; // desacoplo de la nota en edicion
			vg0.appEdit.letras = txt.length;
			vg0.appEdit.visible = true;
			vg0.appEdit.editON = true;
			break;
		}

	}
}

function nuevaNota(){
//	vg0.appEdit.nota.id = getId(6,1);
	if (vg0.appModo.modo=='NOTAS'){	
		vg0.appEdit.nota = new Nota();
		vg0.appEdit.letras = '0';
		vg0.appEdit.visible = true;
		vg0.appEdit.editON = false;
	}
	else if (vg0.appModo.modo=='BLOCS'){
		vg0.appEditNotaBloc.nota = new NotaBloc(vg0.nomBloc);
		vg0.appEditNotaBloc.letras = '0';
		vg0.appEditNotaBloc.visible = true;
		vg0.appEditNotaBloc.editON = false;
	}
	else if (vg0.appModo.modo=='TASKS'){
		vg0.appEditNotaTask.task = new NotaTask(vg0.nomTask);
		vg0.appEditNotaTask.letras = '0';
		vg0.appEditNotaTask.visible = true;
		vg0.appEditNotaTask.editON = false;
	}
}

function descifraNota(){
	var nota = vg0.appEdit.nota;
	var frase = vg0.appEdit.frase;
	var b64 = Base64.decode(nota.texto);
	var descifrado = encripta(b64,frase);
	var txt = descifrado.split('·~').join('\n');

	nota.texto = txt;
}
//------------------------------------------------------------------- Get Notas
function ecoQuery(xhr){
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
		fila.texto = fila.texto.split('·~').join('<br>');
		fila.texto = fila.texto.split('·!').join('|');
		fila.texto = fila.texto.split('·[').join('<a href="');
		fila.texto = fila.texto.split('·:·').join('" target="_blank">');
		fila.texto = fila.texto.split(']·').join('</a>');
		notas.push(fila);
	})
	vg0.appNotas.notas = notas;
}

function getNotas(){

	var id = 1234567;
	var bd = 'reto.sqlite';
	var stmt = 'select * from notas order by id desc limit 10 offset '+(vg0.appNotas.pagina*10)+';';
	var ruta = '/';
	ajaxQuerySQLite (id,bd,stmt,ruta,ecoQuery);

}

function buscaNotas(patron){
	if (patron.length == 0)	{getNotas();return false;}
	var id = 1234567;
	var bd = 'reto.sqlite';
	var stmt = "select * from notas where upper(texto) like '%"+patron.toUpperCase()+"%' limit 50;";
	var ruta = '/';
	ajaxQuerySQLite (id,bd,stmt,ruta,ecoQuery);

}

