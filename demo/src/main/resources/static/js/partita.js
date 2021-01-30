// Dichiarazione variabili
var territorio1 = null;
var territorio2 = null;
var numAI = numGiocatori- 1;
var pesca = false;

//Variabile giocatore
var statiGiocatore= [];
var players_AI = [];
var cardGiocatore = [];

//Armate iniziali del giocatore
var armateIniziali = calcoloArmate();

//Fasi di gioco
var faseAssegnazione = true;
var turnoGiocatore = true;
var checkAttacco = true;
var faseAttacco = false;
var sottofaseConquista = false;
var faseSpostamento = false;
var sottofaseSpostamento = false;
var numTurno = 1;
//Scelta Confini
if(numGiocatori == 2)
{
      var data = eval(australia_confini);
}else
{
      var data = eval(standard_confini);
}

//Creazione players AI
var playerAI = null;

//Inizializzazione dei players_AI
for (var i = 0; i < numAI; i++)
{
  playerAI = new Player_AI(i, null, [], false);
  players_AI.push(playerAI);
}

// Funzione per il log della partita
function writeLog(str){
    $("#log").append(str+"<br>");
}

//Funzione per la info box della partita
function writeInfo(str){
    $("#gameInfo").append("<p style='font-size: 15px;'>"+str+"<br></p>");
}


// Script fase iniziale della partita
console.log("Inizio della partita:");
console.log("Assegnazione degli stati in corso..");
inizializzazioneStatiTotali();
shuffle(stati);


var divisione_stati = stati.length/numGiocatori;
var div_stati = parseInt(divisione_stati);

// Assegnazione territori in base ai players
for(var i = 0; i < numGiocatori; i++){
  while(div_stati > 0)
    {
      stato = stati.pop();

      if(i == numAI){
        $(stato).addClass("statePlayer");
        statiGiocatore.push(stato);
        div_stati--;
      }else{
        $(stato).addClass("stateAI" + i);
        players_AI[i].getStatiAI().push(stato);
        div_stati--;
      }
      //div_stati--;

    }
      //console.log(statiGiocatore);
      //console.log(players_AI[i].getStatiAI());
    div_stati = parseInt(divisione_stati);
}

//Assegnazione eventuali territori rimanenti al giocatore
while(stati.length > 0)
{
  stato = stati.pop();
  $(stato).addClass("statePlayer");
  statiGiocatore.push(stato);
}

inizializzazioneStatiTotali();


function writeGameInfo(){
//Inizializzazione armate
$('#gameInfo').append('<br><img src="../images/giocatore1-avatar.svg" width="40px" height="40px"/><p style="color:#99c2ff"><b>Stati giocatore:<b></p>')
for(var i in statiGiocatore){
	//console.log("Stati del giocatore: " + statiGiocatore[i]);
	//Scrittura in info box
  //console.log(statiGiocatore[i]);
	writeInfo(statiGiocatore[i].substring(1));
	//Inizializzazione delle armate
	//$('text'+ statiGiocatore[i]).text("1");
}

for (var obj in players_AI){
$('#gameInfo').append('<br><img src="../images/ai-avatar.svg" width="40px" height="40px"/><p style="color:#ff6666"><b>Stati AI'+obj+': <b></p>')
var statiAI = players_AI[obj].getStatiAI();
for(var i in statiAI){
	//console.log("Stati AI"+obj+": " + statiAI[i]);
	//Scrittura in info box
  //console.log(statiAI[i]);
	writeInfo(statiAI[i].substring(1));
	//$('text'+ statiAI[i]).text("1");
}
}
}


// Assegnazione armate
function aggiungiArmateInizio(nA, id){
	if(armateIniziali != 0 && faseAssegnazione){
	nA++;
	console.log("Seleziona il territorio in cui mettere l'armata: ");
	$('text#' + id).text(nA);
	armateIniziali--;
	$("#infoMini").text("Armate rimanenti: " + armateIniziali);
	if(armateIniziali == 0)
	$("#infoMini").text("");
	}
}

function assegnaArmateAI(){

  for(var obj in players_AI){

  armateIniziali = calcoloArmate();

  var statiAI = players_AI[obj].getStatiAI();

	shuffle(statiAI);
	for(var i in statiAI){
		let nA = Math.floor(Math.random() * armateIniziali) + 1;
		let attuali = parseInt($('text' + statiAI[i]).text());
		if(statiAI.length-1 == i){
		$('text'+ statiAI[i]).text(parseInt(armateIniziali + attuali));
		armateIniziali = 0;
		}
		$('text'+ statiAI[i]).text(parseInt(nA + attuali));
		armateIniziali = armateIniziali - nA;
	}
}
  turnoGiocatore = true;
}

	$('.fase').click(function(e){
    if(turnoGiocatore){
      		if(this.id == "faseAttacco")
      		{
      		faseSpostamento = false;
      		faseAttacco = true;
      		writeLog("<u>FASE DI ATTACCO:</u>");
            }
      		else{
			if(this.id == "faseSpostamento"){
      		faseAttacco = false;
      		faseSpostamento = true;
      		writeLog("<u>FASE DI SPOSTAMENTO:</u>");
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

//Fase assegnazione
	if(faseAssegnazione) {
		refreshInfoBox();
		disableButton();
		$("#faseAttuale").text("Fase Attuale: " + "Assegnazione armate");
		let armateAttuali = $('text#' + this.id).text();
		 if(statiGiocatore.includes('#' + this.id)){
			aggiungiArmateInizio(armateAttuali, this.id);
			if(armateIniziali == 0){
				turnoGiocatore = false;
				 armateIniziali = 10;
				if(!turnoGiocatore){
					if(numTurno == 1) assegnaArmateAI();
					faseAssegnazione = false;
					armateIniziali = 0;
					turnoGiocatore = true;
					$('path').removeClass('on');
					openMenu();
					writeLog("Ora seleziona attacco per iniziare a conquistare!");
					enableButton();
				}
			}
		 }
	}

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
           writeLog("Seleziona la quantita di truppe con cui vuoi attaccare");
           $('#selectAtkModal').modal('show');
		       $("#faseAttuale").text("Fase Attuale: " + "Attacco");
           let armateAttuali = parseInt($('text#' + territorio1).text());
           let armateDif = parseInt($('text#' + territorio2).text());
           let armate = $("#selectAttacco").val();
           controlloAttacco(armate, armateAttuali, armateDif);
          }
		    else
		    {
		         //writeLog("Non confina");
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
		        writeLog("Sposta le armate nel territorio");
            sottofaseSpostamento = true;
            $("#faseAttuale").text("Fase Attuale: " + "Spostamento armate");
            displayConfermaSpos();
            disableButton();
		       }
		       else
		       {
		         //writeLog("Non confina");
		  	   }
			}else
			{
				 writeLog("Seleziona un tuo territorio");
			}
		}
}
}else if (turnoGiocatore == false)
{
  //writeLog("E' il turno del tuo avversario");
}

});

$('#confermaConquista').click(function(e){
  sottofaseConquista = false;
  territorio1 = null;
  territorio2 = null;
  $('path').removeClass('on');
  closeButton('confermaAtt');
  enableButton();
});

$('#confermaSpostamento').click(function(e){

    faseSpostamento = false;
    territorio1 = null;
    territorio2 = null;
    $('path').removeClass('on');
  	concludiTurno();
	  $("input:radio[name=options]").attr("disabled",false);
});


$('#annullaMossa').click(function(e){

	territorio1 = null;
	territorio2 = null;
	$('path').removeClass('on');

});

$("#confermaAttacco").click(function(e){

  var armateAI = parseInt($('text#'+ territorio2).text());
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
  if(resoconto != undefined) writeLog(resoconto);
});

function conquistaTerritorio(id)
{

  var statiAI = players_AI[id].getStatiAI();
  if(numGiocatori == 6){
    displayPesca();
    pesca = true;
  }
	var territorioConquistato = "#"+ territorio2;
	//writeLog(territorioConquistato);

	//modifica array statiAI e statiGiocatore, modifica css
	for (var i in statiAI)
	{
		if(statiAI[i]==territorioConquistato)
		{
			statiAI.splice(i,1);
      players_AI[id].setStatiAI(statiAI);
			//writeLog(statiAI);
			statiGiocatore.push(territorioConquistato);
			writeLog(territorioConquistato);
      $(territorioConquistato).removeClass("stateAI"+ id);
      $(territorioConquistato).addClass("statePlayer");
		}
	}
	let armateAttualiPLayer = $('text#' + territorio1).text();
	$('text#'+ territorio1).text(parseInt(armateAttualiPLayer - 1));
	$('text#'+ territorio2).text(1);
  $("path").removeClass("on");
	displayConfermaAtt();
	var resoconto = "<br>Hai conquistato il territorio attaccato ora piazza delle armate (una tua armata è già stata piazzata di default) per terminare premi su Conferma conquista<br>";

	checkObiettivo();
	return resoconto;
}


function armateAttacco(armateAtk, armateDef)
{
  if(checkAttacco){
  writeLog("Territorio attaccante: " + territorio1);
  writeLog("Territorio difensore: " + territorio2);
	var dadiAtk = randomDadi(armateAtk);
	dadiAtk.sort(function(a, b){return b-a});
	writeLog("Dadi dell'attaccante: " + dadiAtk);

	var dadiDef = randomDadi(armateDef);
	dadiDef.sort(function(a, b){return b-a});
	writeLog("Dadi del difensore: " + dadiDef);

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

	var resoconto = "Armate perse dall'attaccante: "+armatePerseAtk+"<br>Armate perse dal difensore: "+ armatePerseDef+"<br>";

	//Modifica svg
	let armateAttualiAtk = $('text#' + territorio1).text();
	let armateAttualiDef = $('text#' + territorio2).text();

	$('text#'+ territorio1).text(parseInt(armateAttualiAtk - armatePerseAtk));
	$('text#'+ territorio2).text(parseInt(armateAttualiDef - armatePerseDef));


	if(armateAttualiDef - armatePerseDef <= 0)
	{
    if(statiGiocatore.includes('#' + territorio1)){

    var id = 0;
      //Controllo su quale AI abbbiamo conquistato un territorio
    for(var i = 0; i < numAI; i++)
    {
      if(players_AI[i].getStatiAI().includes('#' + territorio2))
      {
        id = i;
        resoconto +=  conquistaTerritorio(id);
        sottofaseConquista = true;
      }
    }

		return resoconto;
            }else{
              for(var obj in players_AI){
                if(players_AI[obj].statiAI.includes('#' + territorio1)){
                  sottofaseConquista = false;
                  resoconto +=  players_AI[obj].faseConquistaRandom();
                  return resoconto;
                }
              }
            }
	}

	territorio1 = null;
	territorio2 = null;
	$('path').removeClass('on');

	return resoconto;
}
}
function controlloAttacco(armate, armateAttuali, armateDif){
	if(armateAttuali > armate && armateAttuali > 2 && armateAttuali > armateDif){
    if(armateAttuali == 2) armateAttuali = 1;
    if(armateAttuali == 3) armateAttuali = 2;
	checkAttacco = true;
	}else
	if(armateAttuali < armate && armateAttuali > 1 && armateAttuali <= armateDif){
    if(armateAttuali == 2) armateAttuali = 1;
    if(armateAttuali == 3) armateAttuali = 2;
    checkAttacco = true;
	}else{
		faseAttacco = false;
		sottofaseConquista = false;
		checkAttacco = false;
		writeLog("Armate selezionate non valide!");
		//$('path').removeClass('on');
	}
}

function controlloAttaccoRandom(att){
        if(att > 3) return 3;
	      if(att == 2) return 1;
        if(att == 3) return 2;
        //writeLog("Armate atk non valide!");
	       return 0;
}

function controlloDifesaRandom(def){
        if(def >= 3) return 3;
	      if(def == 2) return 2;
        if(def == 1) return 1;
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
	//writeLog("Quantita dadi "+array_dadi.length);
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

function checkObiettivo()
{
    for(var obj in players_AI){
    if(players_AI[obj].statiAI.length <= 0)
    {
      $("#vittoriaModal").modal("show");
      disableButton();
    }
}
}

function concludiTurno(){
  	//Incremento del turno
  	$('#FaseFineTurno').modal('show');
    if(turnoGiocatore == true){
      turnoGiocatore = false;
      $('path').removeClass('on');
  	  closeMenus();
      numTurno++;
      setTimeout(function () {
      for(var obj in players_AI){
        console.log("valore ai id" + obj);
        if (numGiocatori > 2) players_AI[obj].assegnazioneRandomInizioTurno();
  			players_AI[obj].turnoRandomAI();
        refreshInfoBox();
      }

      writeLog("E' il  tuo turno...posiziona le nuove armate");
      $("#faseAttuale").text("Fase Attuale: E' il tuo turno, posiziona " + armateIniziali + " armate in un tuo territorio e scegli una mossa!");
    }, 3000);

    $("#numTurno").text("Turno: " + numTurno);

    sottofaseConquista = false;
    sottofaseSpostamento = false;
    $("input:radio[name=options]").attr("disabled",true);
    if(numGiocatori == 6) document.getElementById('pescaCard').style.display = 'none';
    document.getElementById('gameNav').style.display = 'block';

  	turnoGiocatore = true;
  	//$("#faseAttuale").text("Fase Attuale:");
  	// Assegnazione di inizio turno
  	armateIniziali = getRinforzi(statiGiocatore, cardGiocatore);
  	faseAssegnazione = true;
  }

}



function calcoloArmate()
{
      switch (numGiocatori) {
      case 2:
        armate = 10;
        break;
      case 3:
        armate = 35;
        break;
      case 4:
        armate = 30;
        break;
      case 5:
        armate = 25;
        break;
      case 6:
        armate = 20;
    }
    return armate;
}
// Gestione dei modals

	$("input[id$='faseAttacco']").click(function() {
		 $('#FaseAttacco').modal('show');
	});

	$("input[id$='faseSpostamento']").click(function() {
		 $('#FaseSpostamento').modal('show');
	});

	$("input[id$='concludiTurno']").click(function() {
		concludiTurno();
	});

// Script aggiuntivi:
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function openMenu(e){
	document.getElementById('gameNav').style.display = 'block';
}

function closeMenus(e){
	$('#FaseFineTurno').modal('show');
	document.getElementById('gameNav').style.display = 'none';
	document.getElementById('confermaAtt').style.display = 'none';
	document.getElementById('confermaSpos').style.display = 'none';
	enableButton();
}

function closeButton(str){
	document.getElementById(str).style.display = 'none';
}
function displayConfermaAtt(e){
	document.getElementById('confermaAtt').style.display = 'block';
}

function displayConfermaSpos(e){
	document.getElementById('confermaSpos').style.display = 'block';
}

function displayPesca(e){
	document.getElementById('pescaCard').style.display = 'block';
}

function enableButton(e){
	$("input:radio[name=options]").attr("disabled",false);
}

function disableButton(e){
	$("input:radio[name=options]").attr("disabled",true);
}


function refreshInfoBox(e){

$('#gameInfo').html("");
writeGameInfo();

}

//Pesca una carta
function pescaCard()
{
  let random = Math.floor(Math.random() * armateIniziali) + 2;
  cardGiocatore.push(card[random]);
}

$("#confermaPesca").click(function (e){

  if(pesca){
  pescaCard();
  pesca = false;
  writeLog(cardGiocatore);
  concludiTurno();
  }else
  {
    writeLog("Prima di pescare una carta devi aver conquistato almeno un territorio!");
  }

});
