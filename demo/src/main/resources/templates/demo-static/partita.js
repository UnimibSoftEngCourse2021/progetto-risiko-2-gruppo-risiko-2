 
var allStates = $("svg > *");
// Dichiarazione variabili
var attaccante = null;
var difensore = null;
const numStati = 7;
const numGiocatori = 2;
var Giocatore; 
var AI;
var statiGiocatore= new Array();
var statiAI = new Array();
var players = new Array(numGiocatori);
var armateIniziali = 10;
var faseAssegnazione = true;
var turnoGiocatore = true;


// Mappa inizializzazione confini
// Confini per la mappa 1
var json_obj =
{
  stato1:{stato1:0,stato2:1,stato3:0,stato4:1,stato5:0,stato6:0,stato7:0},
  stato2:{stato1:1,stato2:0,stato3:1,stato4:1,stato5:0,stato6:0,stato7:0},
  stato3:{stato1:0,stato2:0,stato3:1,stato4:0,stato5:1,stato6:1,stato7:0},
  stato4:{stato1:0,stato2:1,stato3:1,stato4:1,stato5:1,stato6:1,stato7:1},
  stato5:{stato1:0,stato2:0,stato3:0,stato4:1,stato5:1,stato6:0,stato7:1},
  stato6:{stato1:0,stato2:0,stato3:0,stato4:0,stato5:1,stato6:1,stato7:0},
  stato7:{stato1:0,stato2:0,stato3:0,stato4:0,stato5:0,stato6:0,stato7:0}
};
// Conversione dei confini
var data = eval(json_obj);// this will convert your json string to a javascript object

for (var key in data) {
    for(var i in data[key]){
    if (data.hasOwnProperty(key)) { // this will check if key is owned by data object and not by any of it's ancestors
       // console.log(key+': '+data[key][i]); // this will show each key with it's value
      }
    }
}


// Script fase iniziale della partita
var	stati_map1 = ["#stato1","#stato2","#stato3","#stato4","#stato5","#stato6","#stato7"];
var	stati = stati_map1;

console.log("Inizio della partita:");
console.log("Assegnazione degli stati in corso..");
shuffle(stati); 


for (var stato in stati)
{
	if (stato%2==0){
		$(stati[stato]).css("fill", "blue");
		statiGiocatore[stato] = stati[stato];
		}else
	statiAI[stato] = stati[stato];
}
//Inizializzazione armate
for(var i in statiGiocatore){
	console.log("Stati del giocatore: " + statiGiocatore[i]);
	$('text'+ statiGiocatore[i]).text("1");
}
for(var i in statiAI){
	console.log("Stati del computer: " + statiAI[i]);
	$('text'+ statiAI[i]).text("1");
}

// Fase iniziale, assegnazione random dei territori

for(var i in statiGiocatore){
	var n = 1;
	$('text'+ statiAI[i]).text("1");	
}

// Assegnazione armate
function aggiungiArmateInizio(nA, id){	
	if(armateIniziali != 0 && faseAssegnazione){
	nA++;
	console.log("Seleziona il territorio in cui mettere l'armata: ");
	$('text#' + id).text(nA);
	armateIniziali--;
	}
}

function assegnaArmateAI(){
	shuffle(statiAI);
	for(var i in statiAI){
		let nA = Math.floor(Math.random() * armateIniziali) + 1;  
		console.log("Valore random"+nA);
		let attuali = parseInt($('text' + statiAI[i]).text());
		if(statiAI.length-1 == i){
		console.log("siamo alla posizione" + i);
		$('text'+ statiAI[i]).text(parseInt(armateIniziali + attuali));	
		armateIniziali = 0;
		}			
		$('text'+ statiAI[i]).text(parseInt(nA + attuali));
		armateIniziali = armateIniziali - nA;		
	}
}

//Script per la partita effettiva

	//Selezione del territorio con animazione
	
	$('path').click(function(e){
	//$(this).removeClass("state");
	//$('path').removeClass("on");
	$(this).addClass("on");
	console.log("Hai selezionato "+ this.id);
	//$("p").text("Hai selezionato "+ this.id+ " e il suo id è "+$(this).data("id"));
	
	
	if(faseAssegnazione) {
		let armateAttuali = $('text#' + this.id).text();
		 if(statiGiocatore.includes('#' + this.id)){
			aggiungiArmateInizio(armateAttuali, this.id);
			if(armateIniziali == 0){
				turnoGiocatore = false;
				 armateIniziali = 10;
				if(!turnoGiocatore){
					assegnaArmateAI();
					faseAssegnazione = false;
					armateIniziali = 0;}
			}
		 }
	}
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  /* FASE CONFINE ATTACO
  if(attaccante == null)
	 attaccante = this.id;
	else
		difensore = this.id;
    //$("p").append( "Confina:  "+ json_confini.attaccante.difensore);

  $("p").append(attaccante + " e " + difensore);

  $("#tanks_stato1").text("12");
  //console.log($("#tanks_stato1").get(text));
  //checkConfini(attaccante, difensore);

  $("h2").text("Attaccante: " + attaccante + " e Difensore: " + difensore);

  //json_to_array()
  //console.log(res);

  if (difensore != null)
  {
      if(checkConfini(attaccante,difensore))
      {
        console.log("Confina");
        $("h3").text("I due territori confinano!");
      }
      else
      {
        console.log("Non confina");
        $("h3").text("I due territori non confinano!");
  }
} */

});



function checkConfini(attaccante, difensore)
{
  if (data[attaccante][difensore] == 1)
  {
    return true;
  }
  return false;
}

function json_to_array()
{
  var obj = JSON.parse(json_obj);
  var res = [];

            for(var i in obj)
                res.push(obj[i]);
}

// Script aggiuntivi:
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}



