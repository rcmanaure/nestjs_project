import { HttpService, Injectable, Res } from '@nestjs/common';
import { drive } from 'googleapis/build/src/apis/drive'
import {map} from 'rxjs/operators';
 
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

    const fs = require('fs');
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

   
}