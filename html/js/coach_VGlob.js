import {vgk}  from '../k1/libK1_Utils.js'

export var vgApp = {
	paramsXHR : {
		fase : 'alfa',
		url : 'http://' + window.location.host+'/coach/',
		base : '/datos',
		otro : '',
		iam : '',
		eco : null
	},
	sqlite : {
		base   : '/shell/sqlite',
		pathDB : 'apps/Coach/sqlite',
		userDB : 'usersCoach.sqlite',
		sessDB : 'sessCoach.sqlite',
		repoDB : 'repoCoach.sqlite',
		notaDB : 'notasCoach.sqlite',
		stmtDB : '',
	},
	cypher : {
		base   : '/shell/cypher',
		pathDB : 'apps/Coach/sqlite',
	},
	encript : {
		base   : '/shell/encript',
	}
}

export function goPag(pag,_id){
	if (vgk.params) var idSess = vgk.params.idSess;
	switch (pag){
		case 'PROG':
			window.open('temario.html?idSess='+idSess);
			break;
		case 'AGENDA':
			window.open('agenda.html?idSess='+idSess);
			break;
		case 'NOTAS':
			window.open('notas.html?idSess='+idSess);
			break;
		case 'GRAFO':
			window.open('grafoTICs.html?idSess='+idSess);
			break;
	}
}

