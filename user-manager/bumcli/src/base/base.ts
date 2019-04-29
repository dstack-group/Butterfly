import { Command } from '@oclif/command'
import { RestRequests } from '../rest-client';
import { Table } from 'cli-table'

export abstract class BaseCommand extends Command {
    
               /*importazione del server con il quale si capisce che client usare (se User, Project o Sistemi)*/ 
               /* inizializzo rest request, classe astratta che inizializza le richieste rest */

        /*
        mostrare risposta in formato tabellare
        o metodi protetti che servono a tutti
        */
 
        /* Fare un metodo tabellare per vedere come i Todo dell'esempio*/
        //prendo in input il JSON
        protected list (data: object): void {

                /*faccio un for in base al numero di campi totali del JSON per indicare l'head della tabella
                * 6 campi totali per lo User    (Email, Nome, Cognome, Enabled, Data creazione, Data ultima modifica)
                * 3 campi totali per il Project (Progetto, Servizio di terzi, URL). Si ripete per ora il progetto per ogni servizio inserito
                * 3 campi totali per il Sistema di contatto (Email, sistema di contatto, identificativo). Si ripete per ogni servizio inserito
                */
                
                //totale degli elementi chiave del JSON
                //const numberOfJSONElement = Object.keys(data).length  

                const dataKeys : String[] = Object.keys(data)
                const numberOfJSONElement = dataKeys.length
                const h: any[];
                for(let headValue = 0; headValue < numberOfJSONElement ; ++headValue){
                        h.push(chalk.blueBright(dataKeys[headValue]))
                }

                
                for(0 < size){
                        
                }
                const table = new Table({
                head: h/*[
                       
                  chalk.blueBright('index'),
                  chalk.blueBright('todo'),
                  chalk.blueBright('status')
                ]*/
              };
              /*const todos = todoAPI.list()
              for (let i = 0; i < todos.length; ++i){
                const todo = todos[i]
                const status = todo.done ? chalk.green('Fatto') : chalk.red('Da fare')
                table.push([i,todo.todo,status])
              }
              this.log(table.toString())*/

}