import { Command } from '@oclif/command';
import Table = require('cli-table');
import chalk from 'chalk';
import { LocalDb } from '../database/LocalDb';

export abstract class BaseCommand extends Command {

  // @ts-ignore
  protected db: LocalDb;

  async init() {
    // Path must be changed (${this.config.configDir}): its temporary and only for test
    this.db = new LocalDb(`db.json`);
  }

  protected showJSONFormat(data: object): string {
    return (Object.keys(data).length === 0) ?
      `Ops! Empty result` :
      JSON.stringify(data, null, 2);
  }

  // TABELLA + COMMENTI ENRICO
  /*importazione del server con il quale si capisce che client usare (se User, Project o Sistemi)*/
  /* inizializzo rest request, classe astratta che inizializza le richieste rest */

  /*
  mostrare risposta in formato tabellare
  o metodi protetti che servono a tutti
  */

  // Fare un metodo tabellare per vedere come i Todo dell'esempio
  // QUESTO METODO E' UN PROTOTIPO IN FASE DI SVILUPPO DATO CHE FUNZIONA CON USER
  // prendo in input il JSON

  protected lista(data: object): void {
    /*faccio un for in base al numero di campi totali del JSON per indicare l'head della tabella
     * 6 campi totali per lo User    (Email, Nome, Cognome, Enabled, Data creazione, Data ultima modifica)
     *
     * 3 campi totali per il Project (Progetto, Servizio di terzi, URL).
     * Si ripete per ora il progetto per ogni servizio inserito
     *
     * 3 campi totali per il Sistema di contatto (Email, sistema di contatto, identificativo).
     * Si ripete per ogni servizio inserito
     */
    const dataKeys: string[] = Object.keys(data);
    const numberOfJSONElement = dataKeys.length;
    const header: string[] = [];
    for (let headValue = 0; headValue < numberOfJSONElement; ++headValue) {
      header.push(chalk.blueBright(dataKeys[headValue]));
    }

    const table = new Table({ head: header });

    const dataJson: JSON = data as JSON;
    const dataString = JSON.stringify(dataJson);
    const dataToJson = JSON.parse(dataString);

    table.push([dataToJson.email, dataToJson.firstname, dataToJson.lastname, dataToJson.enabled]);
    this.log(table.toString());
  }
}
