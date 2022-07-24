
import utils  from '/k1/libK1_Utils.js'
import sess   from '/k1/libK1_Sesion.js'
import vapps  from '/k1/libK1_vApps.js'
//import idioma from '/k1/libK1_Idioma.js'

import src    from '/js/calendarioSrc.js'
//import agro   from  '/js/agro_Clases.js'

import {vgApp,goPag} from '/js/coach_VGlob.js'
import {rKeos,rLang,rNodoClase,rTxtML,rTagML,rUsuario} from '/k1/libK1_Clases.js'


window.vgApp = vgApp;
window.goPag = goPag;
window.rKeos = rKeos;
window.rLang = rLang;
window.rNodoClase = rNodoClase;
window.rTxtML = rTxtML;
window.rTagML = rTagML;
window.rUsuario = rUsuario;
window.cierraSesion = sess.cierraSesion;
window.cambiaKeoUser = sess.cambiaKeoUser;
window.cambiaPwdUser = sess.cambiaPwdUser;

window.showListaKairos = src.showListaKairos;
window.cargaKairos = src.cargaKairos;
window.nuevoKairos = src.nuevoKairos;
window.addTarea = src.addTarea;

//window.inputOK = agro.inputOK;
//------------------------------------------------------------------- Init
function sesionCalendarioOK(sesion){
	src.creaCalendario();
	src.ajaxGetKairos();
}

function initCalendario(){
	vapps.initAppsGlobal();
	src.initAppsAlmanak();

	sess.validaSesion('usrMenu',sesionCalendarioOK);// libK1_Sesion.js
}

window.onload = initCalendario;

/* 

El Orto en un punto de latitud l ocurre a las                           

d = 24/360 arcos(tg a tg l) horas  

y el Ocaso se da a las    n = 24-d horas.


Alta en el servicio AEMET OpenData. Su API Key es: 
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpbmZvQG1hcmlnb2xkLmVzIiwianRpIjoiZDdkOWE3YmYtNjNiYi00NzUyLWJjODctYTliYWZlOGJhNTNjIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE1NzIxMTM2NDEsInVzZXJJZCI6ImQ3ZDlhN2JmLTYzYmItNDc1Mi1iYzg3LWE5YmFmZThiYTUzYyIsInJvbGUiOiIifQ.1m7JvDh4PdNFog0Iv5fZY5H44SMUTQigMUjP0P404Q4

var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "https://opendata.aemet.es/opendata/api/valores/climatologicos/inventarioestaciones/todasestaciones/?api_key=jyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqbW9udGVyb2dAYWVtZXQuZXMiLCJqdGkiOiI3NDRiYmVhMy02NDEyLTQxYWMtYmYzOC01MjhlZWJlM2FhMWEiLCJleHAiOjE0NzUwNTg3ODcsImlzcyI6IkFFTUVUIiwiaWF0IjoxNDc0NjI2Nzg3LCJ1c2VySWQiOiI3NDRiYmVhMy02NDEyLTQxYWMtYmYzOC01MjhlZWJlM2FhMWEiLCJyb2xlIjoiIn0.xh3LstTlsP9h5cxz3TLmYF4uJwhOKzA0B6-vH8lPGGw");
xhr.setRequestHeader("cache-control", "no-cache");
xhr.send(data);


Unidad astronómica de tiempo: día, definido como 86.400 segundos. 
365,25 días constituye un año juliano.
En astronomía se utiliza el símbolo «D» para referirse a esta unidad.

Unidad 				Distancia
Kilómetro 			1,0
segundo luz 		299 792,458 km
distancia lunar	384.400 km
radio solar 		110 radios terrestres (696 000 km)
minuto luz 			17 987 547,480 km
Gigámetro 			1.000.000.000 (Mil millones) de metros
unidad astronómica (U.A.)
 o radio de la órbita terrestre 	149.597.870,700 m
Spat (obsoleta, de Spatium) 	1.000 millones km
año luz 	9.460.800.000.000 km 
pársec 	distancia a la que una unidad astronómica subtiende un ángulo de un segundo de arco 	30,8567 x 1012 	Distancias a estrellas cercanas
siriómetro 	1 millón de U.A. 
Vega 					240 billones de km 	2,40 x 1014 	
kiloparsec 			1.000 parsecs
megaparsec 			1 millón de pársecs (30,84 trillones de km)
gigaparsec 			1 trillón de pársecs (30,84 quintillones de km) 
Giga megapársec 	1 millón de gigapársecs (30,84 sextillones de km) 	30,84 x 1036 	

Leyes de Kepler
Primera ley: Los planetas se mueven alrededor del Sol siguiendo órbitas elípticas, uno de cuyos focos es el Sol.
Segunda ley: Los planetas barren áreas iguales en tiempos iguales.
Tercera ley: El cuadrado del periodo orbital de un planeta es proporcional al cubo de su distancia media al Sol .


*/