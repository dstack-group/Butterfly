import { Command, flags } from '@oclif/command';
import Table = require('cli-table');
import chalk from 'chalk';
import { LocalDb } from '../database/LocalDb';

export abstract class BaseCommand extends Command {

  // @ts-ignore
  protected db: LocalDb;

  static flags = {
    help: flags.help({char: 'h'}),
    json: flags.boolean({char: 'j', description: 'display results in json format'}),
  }

  async init() {
    // Path must be changed (${this.config.configDir}): its temporary and only for test
    this.db = new LocalDb(`db.json`);
  }

  protected print(data: object | object, jsonEnabled: boolean): void {
    (jsonEnabled) ?
      this.log(this.showJSONFormat(data)) :
      this.log('table');
  }

  private showJSONFormat(data: object): string {
    return (Object.keys(data).length === 0) ?
      `Ops! Empty result` :
      JSON.stringify(data, null, 2);
  }

  // The function show the result inside an ASCII table, giving to the user a better view of the result
  protected lista(arrData: object[]): void {
    
    /*extracting the first element to find witch keys need to insert
     * into the table's header
     */
    const data : object = arrData[0]
    const dataKeys : string[] = Object.keys(data)
    const numberOfJSONElement = dataKeys.length 
    const arrDataJson = <JSON[]> arrData
    const h: string[] = []
   
    for(let headValue = 0; headValue < numberOfJSONElement; ++headValue){
    h.push(chalk.blueBright(dataKeys[headValue]))
    }

    //filling the header of the table information of the JSON
    const table= new Table({head:h})

    //Users specific info table
    if(dataKeys[0] == "email"){
      for (let i = 0; i < arrDataJson.length; i++) {
        const dataJson = <JSON> arrDataJson[i];
        const dataString = JSON.stringify(dataJson)
        const dataToJson = JSON.parse(dataString)
        if(Object.keys(dataToJson)[0] == dataKeys[0]){                                                        //da rivedere (Ha senso?)
          table.push([dataToJson.email, dataToJson.firstname, dataToJson.lastname, dataToJson.enabled])
        } else{
          console.error("The JSON file is corrupted and can't show the table")
          return;
        }
     }
   } 

    //Projects specific info table
    else if (dataKeys[0] == "projectId"){
      for (let i = 0; i < arrDataJson.length; ++i){
        const dataJson = <JSON> arrDataJson[i];
        const dataString = JSON.stringify(dataJson)
        const dataToJson = JSON.parse(dataString)

        //Copy of the inner JSON
        const projectURLs = dataToJson.projectURL     
    
        //Check if the project have or not any URL inserted
        if(!Object.keys(projectURLs)){
            table.push([dataToJson.projectId, dataToJson.projectName, "Non sono presenti URL"])
        } else {
          projectURLs.REDMINE &&  table.push([dataToJson.projectId, dataToJson.projectName, projectURLs.REDMINE]) 
          projectURLs.GITLAB &&  table.push([dataToJson.projectId, dataToJson.projectName, projectURLs.GITLAB])
          projectURLs.SONARQUBE &&  table.push([dataToJson.projectId, dataToJson.projectName, projectURLs.SONARQUBE]) 
        }
      }
    }
    //table output
    console.log(table.toString())
  }
}
