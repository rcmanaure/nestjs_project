import { HttpService, Injectable } from '@nestjs/common';
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

  getCodes(): any {
  const download = require('download');

  // Url of the image
  const url = 'https://drive.google.com/file/d/1M6fWgTPCcAq6hBM_C83tDQROPvHj697N';
  // Path at which image will get downloaded
  const filePath = `${__dirname}/files`;

  download(url,filePath)
  .then(() => {
    console.log('Download Completed');
  })

      // return test;
    }
}
