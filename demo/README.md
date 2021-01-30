## Premesse del progetto e rilascio versioni: ##
DRisk è un progetto universitario che ha come obiettivo la creazione di una webapp per giocare ad una versione alternativa del Risiko! Online.<br>
In DRisk sarà possibile registrarsi ad un sito con i propri dati, giocare ad una partita esistente o crearne una con la possibilità<br>
di scegliere da 2 a 6 giocatori e fino ad un massimo di 6 continenti.<br>
Per la consegna d'esame abbiamo deciso di rilasciare due demo di prova, contenenti gli scripts di gioco. <br>
In particolare la demo1 permette di giocare contro una IA nel continente australiano.<br>
La demo2 permette di giocare nella mappa classica del Risiko! con la possibilità di scegliere fino a 5 IA nemiche.<br>
Oltre alle demo è stata sviluppata la struttura base del sito web con utenze e DB, accessibile da un server locale.<br>
## Istruzioni avvio demo: ##
E' possibile procedere in due modi:
 - locale, occorre scaricare la cartella <b>demolocal</b> dal branch master di questa repository
   scompattare la cartella zip e aprire (con un qualsiasi browser che supporti HTML5) il file index.html.
   Sarà comunque possibile navigare nella struttura del sito senza avere le varie opzioni di login e registrazione.
- server locale, occorre scaricare la cartella completa, scompattarla e aggiungere su Eclipse un progetto Maven,
   in alternativa si può fare direttamente gitclone da Eclipse. 
   Successivamente occorrerà far partire una build di Maven con parametro "clean install" e infine avviare "Maven SpringBoot Run".
   N.B: occorre avere la porta 8080 libera.
