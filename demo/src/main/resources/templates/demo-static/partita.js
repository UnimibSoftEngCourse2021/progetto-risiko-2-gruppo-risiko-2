
// Dichiarazione variabili
var territorio1 = null;
var territorio2 = null;
const numStati = 7;
const numGiocatori = 2;
var Giocatore;
var AI;
var statiGiocatore= [];
var statiAI = [];
var players = new Array(numGiocatori);
var armateIniziali = 10;
var faseAssegnazione = true;
var turnoGiocatore = true;

var faseAttacco = false;
var sottofaseConquista = false;
var faseSpostamento = false;
var sottofaseSpostamento = false;





// Funzione per il log della partita
function writeLog(str){
    $("#log").append(str+"<br>");
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
		$(stati[stato]).css("fill", "blue");
		statiGiocatore.push(stati[stato]);
		}else
	statiAI.push(stati[stato]);
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
	writeLog("Armate rimanenti "+ armateIniziali);
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
  turnoGiocatore = true;
}




	$('.fase').click(function(e){
    if(turnoGiocatore == true){
      		if(this.id == "faseAttacco")
      		{
            if(faseAttacco){
                faseAttacco = false;
                writeLog("Fase Attacco : off");
            }else{
      			     faseSpostamento = false;
      			     faseAttacco = true;
      		       writeLog("Fase Attacco : on");
           }
      		}
      		else if(this.id == "faseSpostamento")
      		{
            if(faseSpostamento){
                faseSpostamento = false;
                writeLog("Fase Spostamento : off");
            }else{
      			faseAttacco = false;
      			faseSpostamento = true;
      		 	writeLog("Fase Spostamento: on");
      		  }
          }
        }else
        {
          writeLog("Aspetta il tuo turno");
        }
      	});
  //Script per la partita effettiva

	//Selezione del territorio con animazione
$('path').click(function(e){
  if(turnoGiocatore == true){
	//$(this).removeClass("state");
	//$('path').removeClass("on");
	//$("p").text("Hai selezionato "+ this.id+ " e il suo id è "+$(this).data("id"));



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
					armateIniziali = 0;}
			}
		 }
	}
/////

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
		        writeLog("Confina, ora seleziona la quantita di truppe con cui vuoi attaccare!");
						$('#selectAtkModal').modal('show');
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
		        writeLog("Confina, sposta l'armate nel territorio");
						sottofaseSpostamento = true;
		      }
		      else
		      {
		         writeLog("Non confina");
		  		}
			}else
			{
				 writeLog("Seleziona un tuo territorio");
			}
		}
}
}else if (turnoGiocatore == false)
{
  writeLog("E' il turno del tuo avversario");
}
});




$('#concludiTurno').click(function(e){

    writeLog("Turno giocatore : "+turnoGiocatore);
    turnoAI = true;
    turnoRandomAI();
});


$('#confermaConquista').click(function(e){

  sottofaseConquista = false;
  territorio1 = null;
  territorio2 = null;
  $('path').removeClass('on');
});

$('#confermaSpostamento').click(function(e){

    faseSpostamento = false;
    territorio1 = null;
    territorio2 = null;
    $('path').removeClass('on');
    turnoGiocatore = false;
    writeLog("Turno giocatore : "+turnoGiocatore);
    turnoAI = true;
    turnoRandomAI();
});


$('#annullaMossa').click(function(e){

	territorio1 = null;
	territorio2 = null;
	$('path').removeClass('on');

});

$("#confermaAttacco").click(function(e){

  var armateAI =	parseInt($('text#'+ territorio2).text());
  var armateDef = 0;
  if(armateAI >= 3)
  {
    armateDef = 3;
  }
  else if (armateAI = 2){
    armateDef = 2;
  }
  else if (armateAI = 1) {
    armateDef = 1;
  }


	$('#selectAtkModal').modal('toggle');
	var armateAtk = $("#selectAttacco").val();
	var resoconto = armateAttacco(armateAtk,armateDef);
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
		}
	}
	let armateAttualiPLayer = $('text#' + territorio1).text();
	$('text#'+ territorio1).text(parseInt(armateAttualiPLayer - 1));
	$('text#'+ territorio2).text(1);

	var resoconto = "Hai conquistato il territorio che attaccato ora piazza delle armate (una tua armata e gia stata piazzata di default)";

  checkObbietivo();

	return resoconto;
}


function armateAttacco(armateAtk, armateDef)
{

	var dadiAtk = randomDadi(armateAtk);
	dadiAtk.sort(function(a, b){return b-a});
	writeLog(dadiAtk);

	var dadiDef = randomDadi(armateDef);
	dadiDef.sort(function(a, b){return b-a});
	writeLog(dadiDef);

	var armatePerseAtk = 0;
	var armatePerseDef = 0;
	var i = 0;

  if(armateAtk >= armateDef){
	for (i=0; i < armateDef; i++)
	{
		if(dadiAtk[i] > dadiDef[i])
		{
			armatePerseDef +=  1;
		} else
		{
			armatePerseAtk += 1;
		}
	}
  }else if(armateAtk < armateDef){
	for (i=0; i < armateAtk; i++)
	{
		if(dadiAtk[i] > dadiDef[i])
		{
			armatePerseDef +=  1;
		} else
		{
			armatePerseAtk += 1;
		}
	}
  }
	var resoconto = "Armate atk perse: "+armatePerseAtk+"<br>Armate def perse: "+armatePerseDef+"<br>";

	//Modifica svg
	let armateAttualiAtk = $('text#' + territorio1).text();
	let armateAttualiDef = $('text#' + territorio2).text();

	$('text#'+ territorio1).text(parseInt(armateAttualiAtk - armatePerseAtk));
	$('text#'+ territorio2).text(parseInt(armateAttualiDef - armatePerseDef));


	if(armateAttualiDef - armatePerseDef <= 0)
	{
    if(statiGiocatore.includes('#' + territorio1)){
		resoconto +=  conquistaTerritorio(territorio1, territorio2);
		sottofaseConquista = true;
		return resoconto;
    }else if(statiAI.includes('#' + territorio1)){
    sottofaseConquista = false;
    resoconto +=  faseConquistaRandom();
    return resoconto;
    }
	}

	territorio1 = null;
	territorio2 = null;
	$('path').removeClass('on');

	return resoconto;

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
	writeLog("Quantita dadi "+array_dadi.length);
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

function checkObbietivo()
{
    if(statiAI.length <= 0)
    {
      $("#vittoriaModal").modal("show");
    }
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
