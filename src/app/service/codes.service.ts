import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { CodeEntity } from '../models/codes.entity';
import { CodesI, PostCodesI } from '../models/codes.interface';
import * as fs from 'fs';
import * as fastcsv from 'fast-csv';
import { pool } from '../utils';

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(CodeEntity)
    private codesRepository: Repository<CodeEntity>,
    private httpService: HttpService,
  ) {}

  add(codes: PostCodesI): Observable<PostCodesI> {
    return from(this.codesRepository.save(codes));
  }

  findAll(): Observable<CodesI[]> {
    return from(this.codesRepository.find());
  }

  // Get a random code.
  getRandomCode(): any {
    return this.httpService
      .get('https://api.postcodes.io/random/postcodes')
      .pipe(
        map((response) => response.data),
        map((data) => ({
          status: data.status,
          postcode: data.result['postcode'],
          country: data.result['country'],
          region: data.result['region'],
          longitude: data.result['longitude'],
          latitude: data.result['latitude'],
        })),
      );
  }

  // Get nearest postcodes for a given longitude & latitude.
  getNearestCodes(params): any {
    const codes = this.httpService
      .get(
        `https://api.postcodes.io/postcodes?lon=${params.lon}&lat=${params.lat}`,
      )
      .pipe(
        map((response) => response.data),
        map((data) => ({
          status: data.status,
          postcode: data.result.map((x) => [x.postcode, x.country, x.region]),
        })),
      );
    return codes;
  }

  // Get nearest postcodes for a given longitude & latitude and save it in the DB.
  getPostCodes(params): any {
    const lon = params.lon;
    const lat = params.lat;

    const codes = this.httpService
      .get(`https://api.postcodes.io/postcodes?lon=${lon}&lat=${lat}`)
      .pipe(
        map((response) => response.data),
        map((data) => ({
          status: data.status,
          postcode: data.result,
        })),
      );
    codes.forEach((value) => {
      const propertyValues = value.postcode.map((x) => x.postcode);
      const query = `UPDATE code_entity SET nearest_postcodes=ARRAY['${propertyValues}'] WHERE lat='${lat}' and lon='${lon}';`;

      pool.connect((err, client, done) => {
        if (err) throw err;
        try {
          client.query(query, (err, res) => {
            if (err) {
              console.log(err.stack);
            }
          });
        } finally {
          done();
          console.log('Succesful added nearest postcodes to DB by given longitude and latitude.');          
        }
      });      
    });
    return codes;
    
  }

  // // Download file.
  // getCodes():any {

  //   const {google} = require('googleapis');
  //   const drive = google.drive();
  //   var fileId = '1M6fWgTPCcAq6hBM_C83tDQROPvHj697N';
  //   var dest = fs.createWriteStream('/tmp/code.csv');
  //   drive.files.get({
  //     fileId: fileId,
  //     alt: 'media'
  //   })
  //       .on('end', function () {
  //         console.log('Done');
  //       })
  //       .on('error', function (err) {
  //         console.log('Error during download', err);
  //       })
  //       .pipe(dest);

  // }

  // Load CSV file to DB.
  loadCsv(): any {
    const stream = fs.createReadStream('/ruben/src/app/src/postcodesgeo.csv');
    const csvData = [];
    const csvStream = fastcsv
      .parse()
      .on('data', function (data) {
        csvData.push(data);
      })
      .on('end', function () {
        // remove the first line: header
        csvData.shift();

        const query = 'INSERT INTO code_entity ( lat, lon) VALUES ($1, $2)';
        pool.connect((err, client, done) => {
          if (err) throw err;
          try {
            console.log('Importing CSV file to DB');
            csvData.forEach((row) => {
              // Checking if the row has empty, if so, it adds null coordinates.
              if (row[0] == '0') {
                console.log(
                  'There are no coordinates in this row ' +
                    row +
                    ' ,adding null coordinates.',
                );
                row.push('0');
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
