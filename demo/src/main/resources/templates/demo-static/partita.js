
// Dichiarazione variabili
var territorio1 = null;
var territorio2 = null;
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
var checkAttacco = true;
var faseAttacco = false;
var sottofaseConquista = false;
var faseSpostamento = false;
var sottofaseSpostamento = false;



// Funzione per il log della partita
function writeLog(str){
    $("#log").append(str+"<br>");
}

//Funzione per la info box della partita
function writeInfo(str){
    $("#gameInfo").append(str+"<br>");
}

// Mappa inizializzazione confini
// Confini per la mappa 1
var json_obj =
{
  stato1:{stato1:0,stato2:1,stato3:1,stato4:0,stato5:0,stato6:0,stato7:0},
  stato2:{stato1:1,stato2:0,stato3:1,stato4:1,stato5:0,stato6:0,stato7:0},
  stato3:{stato1:1,stato2:1,stato3:0,stato4:1,stato5:1,stato6:1,stato7:0},
  stato4:{stato1:0,stato2:1,stato3:1,stato4:0,stato5:1,stato6:0,stato7:0},
  stato5:{stato1:0,stato2:0,stato3:1,stato4:1,stato5:0,stato6:1,stato7:0},
  stato6:{stato1:0,stato2:0,stato3:1,stato4:0,stato5:1,stato6:0,stato7:1},
  stato7:{stato1:0,stato2:0,stato3:0,stato4:0,stato5:0,stato6:1,stato7:0}
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
		$(stati[stato]).addClass("statePlayer");
        statiGiocatore.push(stati[stato]);
        }else
    statiAI.push(stati[stato]);
}

//Inizializzazione armate
$('#gameInfo').append('<br><img src="assets/img/giocatore1-avatar.svg" width="40px" height="40px"/><p style="color:blue"><b>Stati giocatore:<b></p>')
for(var i in statiGiocatore){
	console.log("Stati del giocatore: " + statiGiocatore[i]);
	//Scrittura in info box
	writeInfo($('text' + statiGiocatore[i] + '-nome').text());
	//Inizializzazione delel armate
	$('text'+ statiGiocatore[i]).text("1");
}
$('#gameInfo').append('<br><img src="assets/img/ai-avatar.svg" width="40px" height="40px"/><p style="color:#8B0000"><b>Stati AI:<b></p>')
for(var i in statiAI){
	console.log("Stati del computer: " + statiAI[i]);
	//Scrittura in info box
	writeInfo($('text' + statiAI[i] + '-nome').text());
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
	writeLog("Armate rimanenti: "+ armateIniziali);
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


	$('.fase').click(function(e){

		if(this.id == "faseAttacco")
		{
			faseSpostamento = false;
			faseAttacco = true;
			 writeLog("<u>FASE DI ATTACCO:</u>");
		}
		else if(this.id == "faseSpostamento")
		{
			faseAttacco = false;
			faseSpostamento = true;
		 	writeLog("<u>FASE DI SPOSTAMENTO:</u>");;
		}

	});


//Script per la partita effettiva

//Selezione del territorio con animazione
$('path').click(function(e){

//Fase assegnazione
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
					armateIniziali = 0;
					openMenu();
					writeLog("Ora seleziona attacco per iniziare a conquistare!");}
			}
		 }
	}
	
//Fase di attacco
if(faseAttacco){
		if(territorio1 == null)
		{
			if(statiGiocatore.includes('#' + this.id)){
			territorio1 = this.id;
			$(this).addClass("on");
			}else
			{
				 writeLog("Seleziona un tuo territorio!");
			}
		}
		else if(territorio2 == null)
		{
			if(!statiGiocatore.includes('#' + this.id))
			{
				territorio2 = this.id;
				$(this).addClass("on");
				if(checkConfini(territorio1, territorio2))
		       {
		        writeLog("Confina, ora seleziona la quantita di truppe con cui vuoi attaccare");
				$('#selectModal').modal('show');
				let armateAttuali = parseInt($('text#' + territorio1).text());
				let armate = $("#selectAttacco").val();
				controlloAttacco(armate, armateAttuali);
		       }
		      else
		       {
		         writeLog("Non confina");
		  		}
			}else
				{
				 writeLog("Seleziona un territorio nemico!");
				}
		}
}

if(sottofaseConquista || sottofaseSpostamento)
{
	let armateAttuali = parseInt($('text#' + territorio1).text());
	if(armateAttuali == 1)
	{
		if(sottofaseSpostamento){
		sottofaseSpostamento = false;
		}
		sottofaseConquista = false;
		writeLog("Il territorio deve rimanere con almeno un armata");
		territorio1 = null;
		territorio2 = null;
		$('path').removeClass('on');
	}
	else{
		spostaArmata();
	}

}

if(faseSpostamento){
		if(territorio1 == null)
		{
			if(statiGiocatore.includes('#' + this.id)){
			territorio1 = this.id;
			$(this).addClass("on");
			}else
			{
				 writeLog("Seleziona un tuo territorio!");
			}
		}
		else if(territorio2 == null)
		{
			if(statiGiocatore.includes('#' + this.id))
			{
				territorio2 = this.id;
				$(this).addClass("on");
				if(checkConfini(territorio1, territorio2))
		        {
		        writeLog("Confina, sposta una o più armate nel territorio");
				writeLog("Premi Annulla Mossa quando hai terminato di spostare!");
				sottofaseSpostamento = true;
		       }
		       else
		        {
		         //writeLog("Non confina, seleziona un altro territorio");
		  		}
			}else
			{
			writeLog("Seleziona un tuo territorio");
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


$('#annullaMossa').click(function(e){

	territorio1 = null;
	territorio2 = null;
	$('path').removeClass('on');

});

$("#confermaAttacco").click(function(e){

	$('#selectModal').modal('toggle');
	var armate = $("#selectAttacco").val();
	var resoconto = armateAttacco(armate);
	if(resoconto != undefined)
	writeLog(resoconto);

});

function conquistaTerritorio()
{
	var territorioConquistato = "#"+territorio2;
	//writeLog(territorioConquistato);

	//modifica array statiAI e statiGiocatore, modifica css
	for (var i in statiAI)
	{
		if(statiAI[i]==territorioConquistato)
		{
			statiAI.splice(i,1);
			//writeLog(statiAI);
			statiGiocatore.push(territorioConquistato);
			//writeLog(statiGiocatore);
			$(territorioConquistato).css("fill", "blue");
			$(territorioConquistato).addClass("statePlayer");
		}
	}
	let armateAttualiPLayer = $('text#' + territorio1).text();
	$('text#'+ territorio1).text(parseInt(armateAttualiPLayer - 1));
	$('text#'+ territorio2).text(1);
	$('path').removeClass('on');

	var resoconto = "<br>Hai conquistato un territorio, ora piazza delle armate (una tua armata è gia stata piazzata di default)";
	return resoconto;
}


function armateAttacco(armate)
{
	if(checkAttacco){
	var dadiPlayer = randomDadi(armate);
	dadiPlayer.sort(function(a, b){return b-a});
	writeLog("Valori dadi player " + dadiPlayer);

	var dadiAI = randomDadi(armate);
	dadiAI.sort(function(a, b){return b-a});
	writeLog("Valori dadi AI " + dadiAI);

	var armatePersePlayer = 0;
	var armatePerseAI = 0;
	var i = 0;
	for (i=0; i < armate; i++)
	{
		if(dadiPlayer[i] > dadiAI[i])
		{
			armatePerseAI +=  1;
		} else
		{
			armatePersePlayer += 1;
		}
	}
	var resoconto = "Armate player perse: "+armatePersePlayer+"<br> Armate AI perse: "+armatePerseAI;

	//Modifica svg
	let armateAttualiPLayer = $('text#' + territorio1).text();
	let armateAttualiAI = $('text#' + territorio2).text();

	$('text#'+ territorio1).text(parseInt(armateAttualiPLayer - armatePersePlayer));
	$('text#'+ territorio2).text(parseInt(armateAttualiAI - armatePerseAI));


	if(armateAttualiAI - armatePerseAI <= 0)
	{
		resoconto +=  conquistaTerritorio(territorio1, territorio2);
		sottofaseConquista = true;
		return resoconto;
	}

	territorio1 = null;
	territorio2 = null;
	$('path').removeClass('on');
	return resoconto;
	}
}

function controlloAttacco(armate, armateAttuali){
	if(armateAttuali > armate){
	checkAttacco = true;
	}else
	if(armateAttuali < armate && armateAttuali > 2){
		armate = armateAttuali;
	}else{
		faseAttacco = false;
		sottofaseConquista = false;
		checkAttacco = false;
		writeLog("Armate selezionate non valide!");
		$('path').removeClass('on');
	}
}

function randomDadi (quantita_dadi)
{
	var array_dadi = [];
	var randomNumber = 0;
	for (var i=0;i < quantita_dadi; i++)
	{
		randomNumber = Math.floor(Math.random() * 6) + 1;
		array_dadi.push(randomNumber);

	}
	return array_dadi;
}


function spostaArmata ()
{
	let armateAttuali = parseInt($('text#' + territorio1).text());
	$('text#'+ territorio1).text(parseInt(armateAttuali - 1));
	let armateAttuali2 = parseInt($('text#' + territorio2).text());
	$('text#'+ territorio2).text(parseInt(armateAttuali2 + 1));
}


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

function openMenu(e){
		document.getElementById('mainNav').style.display = 'block';
}
