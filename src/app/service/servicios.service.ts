import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Boleta } from '../model/Boleta';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ServiciosService {
  private ruta: string="";
  constructor(private http: Http) {

  }
  traeDatos(rut, tipo, folio,fecha,monto): Promise<Boleta[]> { 
      
    //this.ruta = 'http://localhost:61849/api/Boleta?rut=' + rut + '&tipo=' + tipo + '&folio=' + folio + '&fecha=' + fecha + '&monto='+ monto;
    this.ruta = 'https://ws-boletas.asinco.cl/api/Boleta?rut=' + rut + '&tipo=' + tipo + '&folio=' + folio + '&fecha=' + fecha + '&monto='+ monto;
    
    return this.http.get(this.ruta)
        .toPromise()
        .then(
        (response) => {
            let respuesta: any = response;
            let boleta: Boleta[] = JSON.parse(respuesta._body);
            return boleta;
        }
        ).catch()

}
  

}
