import { Command } from '@oclif/command'
import { RestRequests } from '../rest-client';
import Table = require('cli-table')
import chalk from 'chalk'

export abstract class BaseCommand extends Command {
    
          /*importazione del server con il quale si capisce che client usare (se User, Project o Sistemi)*/ 
          /* inizializzo rest request, classe astratta che inizializza le richieste rest */

   /*
   mostrare risposta in formato tabellare
   o metodi protetti che servono a tutti
   */

   //Fare un metodo tabellare per vedere come i Todo dell'esempio                  QUESTO METODO E' UN PROTOTIPO IN FASE DI SVILUPPO DATO CHE FUNZIONA CON USER
   //prendo in input il JSON
   protected lista (data: object): void {
        /*faccio un for in base al numero di campi totali del JSON per indicare l'head della tabella
           * 6 campi totali per lo User    (Email, Nome, Cognome, Enabled, Data creazione, Data ultima modifica)
           * 3 campi totali per il Project (Progetto, Servizio di terzi, URL). Si ripete per ora il progetto per ogni servizio inserito
           * 3 campi totali per il Sistema di contatto (Email, sistema di contatto, identificativo). Si ripete per ogni servizio inserito
           */
           const dataKeys : string[] = Object.keys(data)
           const numberOfJSONElement = dataKeys.length
           const h: string[] = []
           for(let headValue = 0; headValue < numberOfJSONElement ; ++headValue){
                   h.push(chalk.blueBright(dataKeys[headValue]))
           }

        const table = new Table({head: h });

         const dataJson = <JSON> data;
         const dataString = JSON.stringify(dataJson)
         const dataToJson = JSON.parse(dataString)

         table.push([dataToJson.email, dataToJson.firstname, dataToJson.lastname, dataToJson.enabled])
         console.log(table.toString())
}
}