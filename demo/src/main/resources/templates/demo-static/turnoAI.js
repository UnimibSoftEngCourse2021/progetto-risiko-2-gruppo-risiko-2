//Turno Random AI


function turnoRandomAI ()
{
  writeLog("Turno avversario..."+turnoAI);
  while (turnoAI)
  {
    var faseRandom = setFaseRandomAI();
    if(faseRandom == "faseAttacco")
    {
      faseAttaccoRandom();
    }
    if(faseRandom == "faseSpostamento")
    {
      faseSpostamentoRandom();
    }
    if(faseRandom == "concludiTurno")
    {
      turnoAI = false;
    }
  }
  writeLog("Turno concluso...");
  sottofaseConquista = false;
  sottofaseSpostamento = false;
  turnoGiocatore = true;
  writeLog("E' il  tuo turno...");
}

function setFaseRandomAI ()
{
  let randomFase = Math.floor(Math.random() * 3) + 1
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

function faseSpostamentoRandom ()
{
  var f = 0;
  writeLog(statiAI);
  var statiAILength = statiAI.length-1;
  writeLog(statiAILength);
  while (f!=3) {

    let i = Math.floor(Math.random() * statiAILength) + 0;
    writeLog(i);
    territorio1 = statiAI[i].substring(1);
    writeLog(territorio1);
    let k = Math.floor(Math.random() * statiAILength) + 0;
    writeLog(k);
    territorio2 = statiAI[k].substring(1);
    writeLog(territorio2);


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
  turnoAI = false;
  writeLog("L'AI ha effetuato uno spostamento tattico");
}

function faseAttaccoRandom ()
{
  var f = true;
  writeLog(statiAI);
  var statiAILength = statiAI.length-1;
  writeLog(statiAILength);

  writeLog(statiGiocatore);
  var statiGiocatoreLength = statiGiocatore.length-1;
  writeLog(statiGiocatoreLength);

  while (f) {

    let i = Math.floor(Math.random() * statiAILength) + 0;
    writeLog(i);
    territorio1 = statiAI[i].substring(1);
    writeLog(territorio1);
    let k = Math.floor(Math.random() * statiGiocatoreLength) + 0;
    writeLog(k);
    territorio2 = statiGiocatore[k].substring(1);
    writeLog(territorio2);

    if(checkConfini(territorio1, territorio2))
    {
      f = false;
      $('#selectDefModal').modal('show');

    }



    }

  writeLog("L'AI ha effetuato un attacco!");
}

function faseConquistaRandom(){

  var territorioConquistato = "#"+territorio2;
  //writeLog(territorioConquistato);

  //modifica array statiAI e statiGiocatore, modifica css
  for (var i in statiGiocatore)
  {
    if(statiGiocatore[i]==territorioConquistato)
    {
      statiGiocatore.splice(i,1);
      writeLog(statiGiocatore);
      statiAI.push(territorioConquistato);
      writeLog(statiAI);
      $(territorioConquistato).css("fill", "red");
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

  var resoconto = "L'avversario ha conquistasto un tuo territorio e ci ha mosso alcune sue armate";


  return resoconto;

};

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
