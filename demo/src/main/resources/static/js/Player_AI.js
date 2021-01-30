class Player_AI {
  constructor(id, color, statiAI, turnoAI) {
    this.id = id;
    this.color = color;
    this.statiAI = statiAI;
    this.turnoAI = turnoAI;
  }

getColor()
{
  return this.color;
}

getStatiAI()
{
  return this.statiAI;
}

setColor(color)
{
  this.color = color;
}

setStatiAI(statiAI)
{
  this.statiAI = statiAI;
}

setId(id)
{
  this.id = id;
}

getId()
{
  return this.id;
}

setTurnoAI(turno)
{
  this.turnoAI = turno;
}

getTurnoAI()
{
  return this.turnoAI;
}



//Turno Random AI
turnoRandomAI ()
{

  this.turnoAI = true;
  //writeLog("Turno avversario..."+turnoAI);
  while (this.turnoAI)
  {
    var faseRandom = this.setFaseRandomAI();
    if(faseRandom == "faseAttacco")
    {
      this.faseAttaccoRandom();
    }
    if(faseRandom == "faseSpostamento")
    {
      this.faseSpostamentoRandom();
    }
    if(faseRandom == "concludiTurno")
    {
      this.turnoAI = false;
    }
  }
writeLog("<br>Turno AI" + this.id + " concluso...");
}

setFaseRandomAI ()
{
	  let randomFase = Math.floor(Math.random() * 3) + 1;
	  if(randomFase == 1)
	  {
		return "faseAttacco";
	  }
	  if(randomFase == 2)
	  {
		return "faseSpostamento";
	  }
	  if(randomFase == 3)
	  {
		return "concludiTurno";
	  }
}

faseSpostamentoRandom ()
{
  var f = 0;
  var statiAILength = this.statiAI.length-1;
  while (f!=3) {

    let i = Math.floor(Math.random() * statiAILength) + 0;
    //writeLog(i);
    territorio1 = this.statiAI[i].substring(1);
    // writeLog(territorio1);
    let k = Math.floor(Math.random() * statiAILength) + 0;
    // writeLog(k);
    territorio2 = this.statiAI[k].substring(1);
    // writeLog(territorio2);


    if(checkConfini(territorio1, territorio2))
    {
      var z = 0;

      while(z!=3) {
        let attualiRandom = parseInt($('text#' + territorio1).text());
        if(attualiRandom == 1){
          z = 3;
        }
        else
        {
        z++;
        spostaArmata();
        }
      }
    }
    f++;

    territorio1 = null;
    territorio2 = null;
  }
  this.turnoAI = false;
  writeLog("L'AI " + this.id + "  ha effetuato uno spostamento tattico<br>");
}

faseAttaccoRandom ()
{
  var f = true;
  var statiAILength = this.statiAI.length-1;
  var statiLength = stati.length-1;
  console.log(statiLength);
  var statiGiocatoreLength = statiGiocatore.length-1;

  while (f) {

    let i = Math.floor(Math.random() * statiAILength) + 0;
    territorio1 = this.statiAI[i].substring(1);
    let k = Math.floor(Math.random() * statiLength) + 0;
    territorio2 = stati[k].substring(1);

    if(checkConfini(territorio1, territorio2))
    {
      if(statiGiocatore.includes('#'+ territorio2)){
          $('#selectDefModal').modal('show');
          f = false;
        }else {
            f = false;
            var armateAttualiAtk = parseInt($('text#' + territorio1).text());
            var armateAttualiDef = parseInt($('text#' + territorio2).text());
            var controllo = controlloAttaccoRandom(armateAttualiAtk);
            if (controllo != 0) armateAttacco(controlloAttaccoRandom(armateAttualiAtk), controlloDifesaRandom(armateAttualiDef));
            }
        }
      }
  if(controllo != 0)
  writeLog("L'AI" + this.id + " ha effetuato un attacco!<br>");
}

attaccoAIvsAI(){
  let armate = 0;
  if(!$('text#' + territorio1).text() == 1){
    if($('text#' + territorio1).text() >= 3){
      armate = 3;
      }else armate = $('text#' + territorio1).text();
    }
  return armate;
};

difesaAIvsAI(){
  let armate = 0;
  if($('text#' + territorio2).text() >= 3){
    armate = 3;
  }else armate = $('text#' + territorio1).text();
  return armate;
};

faseConquistaRandom(){
  var territorioConquistato = "#"+territorio2;
  //modifica array statiAI e statiGiocatore, modifica css
  for (var i in statiGiocatore)
  {
    if(statiGiocatore[i]==territorioConquistato)
    {
      statiGiocatore.splice(i,1);
      //writeLog(statiGiocatore);
      this.statiAI.push(territorioConquistato);
      //writeLog(statiAI);
      $(territorioConquistato).addClass("state");
    }
  }

  for(var id in players_AI){
  var statiAI = players_AI[id].getStatiAI();
    for(stato in statiAI){
      if(statiAI[stato].includes(territorioConquistato)){
        statiAI.splice(stato, 1);
        this.statiAI.push(territorioConquistato);
        $(territorioConquistato).addClass("stateAI"+ id);
        id = numAI;
      }
    }
  }

  for (var z = 0; z < 3; z++) {
    let attualiRandom = parseInt($('text#' + territorio1).text());
    if(attualiRandom == 1){
      z = 2;
    }
    else
    {
    spostaArmata();
    }
  }

  var resoconto = "<br>L'avversario ha conquistasto un tuo territorio e ci ha messo alcune sue armate<br>";

  return resoconto;

};

assegnazioneRandomInizioTurno()
{
  var armateRinforzi = getRinforzi(this.statiAI, []);
  writeLog("<br>Armate rinforzi AI"+this.id+": " + armateRinforzi);
  shuffle(this.statiAI);
  for(var i in this.statiAI){
    let nA = Math.floor(Math.random() * armateRinforzi) + 1;
    let attuali = parseInt($('text' + this.statiAI[i]).text());
    if(this.statiAI.length-1 == i){
    $('text'+ this.statiAI[i]).text(parseInt(armateRinforzi + attuali));
    armateRinforzi = 0;
    }
    $('text'+ this.statiAI[i]).text(parseInt(nA + attuali));
    armateRinforzi = armateRinforzi - nA;
  }
  writeLog("L' AI"+this.id+" ha piazzato i suoi rinforzi!");
}

}

$("#confermaDifesa").click(function(e){

  var armateAI =	parseInt($('text#'+ territorio1).text());
  var armateAtk = 0;
  if(armateAI >= 4)
  {
    armateAtk = 3;
  }
  else if (armateAI = 3){
    armateAtk = 2;
  }
  else if (armateAI = 2) {
    armateAtk = 1;
  }

	$('#selectDefModal').modal('toggle');
	var armateDef = $("#selectDifesa").val();
	var resoconto = armateAttacco(armateAtk, armateDef);
	writeLog(resoconto);
});
