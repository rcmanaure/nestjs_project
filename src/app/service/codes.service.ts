import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { CodeEntity } from '../models/codes.entity';
import { CodesI, PostCodesI } from '../models/codes.interface';
import * as fs from 'fs';
import * as fastcsv from 'fast-csv';
import * as pg from 'pg';


@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(CodeEntity)
    private codesRepository: Repository<CodeEntity>,private httpService:HttpService
  ) {}

  add(codes: PostCodesI): Observable<PostCodesI> {
    return from(this.codesRepository.save(codes));
  }

  findAll(): Observable<CodesI[]> {
    return from(this.codesRepository.find());
  }

  // Get a random code.
  getRandomCode(): object {
    return this.httpService
    .get('https://api.postcodes.io/random/postcodes')
    .pipe(
      map((response) => response.data),
      map((data)=>({
        status : data.status,
        postcode : data.result['postcode'],
        country : data.result['country'],
        region : data.result['region'],
        longitude : data.result['longitude'],
        latitude : data.result['latitude'],       
        
      }))
    )
  }

    // Get nearest postcodes for a given longitude & latitude.
    getPostCodes(params): object { 
      var codes = this.httpService      
      .get(`https://api.postcodes.io/postcodes?lon=${params.lon}&lat=${params.lat}`)
      .pipe(
        map((response) => response.data),
        map((data)=>({
          status : data.status,
          postcode : data.result.map(x => [ x.postcode,x.country,x.region]),              
          
        }))
      )
      return codes
    }

  // Download file.
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

  // Load CSV file to DB.
  loadCsv():any {    
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
        const pool = new pg.Pool({
          host: "postgres",
          user: process.env.POSTGRES_USER,
          database: process.env.POSTGRES_DB,
          password: process.env.POSTGRES_PASSWORD,
          port: Number(process.env.POSTGRES_PORT)
        });
        const query =
          "INSERT INTO code_entity ( lat, lon) VALUES ($1, $2)";
        pool.connect((err, client, done) => {
          if (err) throw err;
          try {
            console.log('Importing CSV file to DB');
            csvData.forEach(row => {
              // Checking if the row has empty, if so, it adds null coordinates.
              if (row[0] == '0'){ 
                console.log('There are no coordinates in this row ' + row + ' ,adding null coordinates.');               
                row.push('0')                
              }
              client.query(query, row, (err, res) => {               
                if (err) {
                  console.log(err.stack);
                } 
              });
            });
          } finally {            
            done();
            console.log('Succesful CSV file import to DB.');
          }
        });
      });
    stream.pipe(csvStream);
    

    }
}
