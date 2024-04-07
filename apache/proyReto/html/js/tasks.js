class NotaTask {
	constructor(tipo){
		this.id = 0;
		this.tipo = tipo;
		this.tag = '';
		this.txt = '';
	}
}


function ecoGrabaNotaTask(xhr){
	console.log('ecoGrabaNotaTask: '+xhr.responseText);
	getNotasTask(vg0.appEditNotaTask.task.tipo);
	vg0.appEditNotaTask.visible = false;
	return false;
}
function grabaNotaTask(){
	var task = vg0.appEditNotaTask.task;
	var txt = task.txt.split('\n').join('·~');

	var id = 1234567;
	var bd = 'reto.sqlite';
	if (vg0.appEditNotaTask.editON){
		var stmt = "update tasks set tag='"+task.tag+"',txt='"+txt+"' where id="+task.id+";";
	}
	else {
		var stmt = "insert into tasks (tipo,tag,txt) values ('"+task.tipo+"','"+task.tag+"','"+txt+"');";
	}
	var ruta = '/';
	ajaxQuerySQLite (id,bd,stmt,ruta,ecoGrabaNotaTask);
}

function ecoBorraNotaTask(xhr){
	console.log('ecoBorraNotaTask: '+xhr.responseText);
	getNotasTask();
	vg0.appEditNotaTask.visible = false;
	return false;
}

function borraNotaTask(){
	var task = vg0.appEditNotaTask.task;
	var id = 1234567;
	var bd = 'reto.sqlite';
	var stmt = "delete from tasks where id="+task.id+";";
	var ruta = '/';
	ajaxQuerySQLite (id,bd,stmt,ruta,ecoBorraNotaTask);
}

function editNotaTask(id){
	var n = vg0.tasks.length;
	for (var i=0;i<n;i++){
		var task = vg0.tasks[i];
		if (task.id == id){
			var txt = task.txt.split('<br>').join('\n');
			txt = txt.split('<a href="').join('·[');
			txt = txt.split('" target="_blank">').join('·:·');
			txt = txt.split('</a>').join(']·');
			vg0.appEditNotaTask.task = {id:task.id,tipo:task.tipo,tag:task.tag,txt:txt}; // desacoplo de la task en edicion
			vg0.appEditNotaTask.letras = txt.length;
			vg0.appEditNotaTask.visible = true;
			vg0.appEditNotaTask.editON = true;
			break;
		}

	}
}

function nuevaNotaTasks(){
//	vg0.appEdit.task.id = getId(6,1);
	vg0.appEdit.task.texto = '';
	vg0.appEdit.letras = '0';
	vg0.appEdit.visible = true;
	vg0.appEdit.editON = false;
}

function descifraNotaTask(){
	var task = vg0.appEdit.task;
	var frase = vg0.appEdit.frase;
	var b64 = Base64.decode(task.texto);
	var descifrado = encripta(b64,frase);
	var txt = descifrado.split('·~').join('\n');

	task.texto = txt;
}
//------------------------------------------------------------------- Get NotasTask
function ecoQueryTasks(xhr){
	var filas = [];
	var lineas = xhr.responseText.split('\n');
	var caps = lineas.splice(0,1)[0];
	lineas.map(function(lin){
		if (lin.length && !lin.match('error')){
			var fila = csv2hash(caps,lin);
			if (fila) filas.push(fila)
		}
	})
	vg0.tasks = filas;
	var tasks = [];
	filas.map(function(fila){
		fila.txt = fila.txt.split('·~').join('<br>');
		fila.txt = fila.txt.split('·[').join('<a href="');
		fila.txt = fila.txt.split('·:·').join('" target="_blank">');
		fila.txt = fila.txt.split(']·').join('</a>');
		tasks.push(fila);
	})
	vg0.appNotasTask.tasks = tasks;
}

function getNotasTask(tipo){
	vg0.nomTask = tipo;
	var id = 1234567;
	var bd = 'reto.sqlite';
	var stmt = "select * from tasks where tipo='"+tipo+"' order by id desc;";
	var ruta = '/';
	ajaxQuerySQLite (id,bd,stmt,ruta,ecoQueryTasks);

}

function buscaNotasTask(patron){
	if (patron.length == 0)	{getNotasTask();return false;}
	var id = 1234567;
	var bd = 'reto.sqlite';
	var stmt = "select * from tasks where upper(ext) like '%"+patron.toUpperCase()+"%' limit 50;";
	var ruta = '/';
	ajaxQuerySQLite (id,bd,stmt,ruta,ecoQueryTasks);

}

//------------------------------------------------------------------- Tasks
function ecoGetTasks(xhr){
	var filas = [];
	var lineas = xhr.responseText.split('\n');
	var caps = lineas.splice(0,1)[0];
	lineas.map(function(lin){
		if (lin.length && !lin.match('error')){
			var fila = csv2hash(caps,lin);
			if (fila) filas.push(fila)
		}
	})
	var tipos = [];
	filas.map(function(fila){
		tipos.push(fila);
	})
	vg0.appTasks.tipos = tipos;
}


function getTasks(){
	var id = 1234567;
	var bd = 'reto.sqlite';
	var stmt = 'select distinct tipo from tasks order by tipo;';
	var ruta = '/';
	ajaxQuerySQLite (id,bd,stmt,ruta,ecoGetTasks);
}

function ecoNuevoTask(xhr){
	console.log(xhr.responseText);
	getTasks();
}

function nuevoTask(){
	var tag = prompt ('Nombre?');
	if (tag) {
		var id = 1234567;
		var bd = 'reto.sqlite';
		var stmt = "insert into tasks (tipo,tag,txt) values ('"+tag+"','Sin titulo','Nota inicial (editar)');";
		var ruta = '/';
		ajaxQuerySQLite (id,bd,stmt,ruta,ecoNuevoTask);

	}
}