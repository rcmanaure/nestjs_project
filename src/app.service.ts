import { HttpService, Injectable } from '@nestjs/common';
import {map} from 'rxjs/operators';
import * as fs from 'fs';

@Injectable()
export class AppService {
  constructor(private httpService:HttpService) {}
  getRandomCode(): any {
    return this.httpService
    .get('https://api.postcodes.io/random/postcodes')
    .pipe(
      map((response) => response.data),
      map((data)=>({
        status : data.status,
        result : data.result
      }))
    )
  }

  getCodes():any {
 
    const {google} = require('googleapis');   
    const drive = google.drive();    
    var fileId = '1M6fWgTPCcAq6hBM_C83tDQROPvHj697N';
    var dest = fs.createWriteStream('/tmp/code.csv');
    drive.files.get({
      fileId: fileId,
      alt: 'media'
    })
        .on('end', function () {
          console.log('Done');
        })
        .on('error', function (err) {
          console.log('Error during download', err);
        })
        .pipe(dest);
    
  }

  loadCsv():any {
    const fs = require("fs");
    const Pool = require("pg").Pool;
    const fastcsv = require("fast-csv");
    let stream = fs.createReadStream("/ruben/src/app/src/postcodesgeo.csv");
    let csvData = [];
    let csvStream = fastcsv
      .parse()
      .on("data", function(data) {
        csvData.push(data);
      })
      .on("end", function() {
        // remove the first line: header
        csvData.shift();
        // create a new connection to the database
        const pool = new Pool({
          host: "postgres",
          user: "user",
          database: "db",
          password: "password",
          port: 5432
        });
        const query =
          "INSERT INTO code_entity ( lat, lon) VALUES ($1, $2)";
        pool.connect((err, client, done) => {
          if (err) throw err;
          try {
            console.log('Importing CSV file to DB');
            csvData.forEach(row => {
              if (row[0] == '0'){                
                row.push('0')                
              }
              client.query(query, row, (err, res) => {
               
                if (err) {
                  console.log(err.stack);
                } 
              });
            });
          } finally {
            console.log('Succesful import to DB');
            done();
          }
        });
      });
    stream.pipe(csvStream);

    }
}

 
