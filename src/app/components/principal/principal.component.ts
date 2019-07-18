import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { Boleta } from '../../model/Boleta';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';
import { ServiciosService } from '../../service/servicios.service';
import { PDF417BarcodeComponent, PDF417BarcodeModule } from 'angular2-pdf417-barcode';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  public txtRut : string;
  public txtTipoDocumento : string;
  public txtFolio : number;
 

  public   cantidad: number;
 public   numDoc : number;
 public   estado : number;
 public   rutEmisor : string;
 public   tipoDocu : string;
 public   folioDte : number;
 public   fechaFact : string;
 public   nombreCliente : string; 
 public   montoNeto : number;
 public   montoexento : number;
 public   montoIva : number;
 public   montoTotal : number;
 public   timbreDte : string;
 public   dteCompleto : string;
 public   archivoPdf : string;
 public   linea : number;
 public   glosa : string;
 public   unidad : string;
 public   precioUnitario : number;
 public   monto : number;
 public   exento : number;
 public pruebaBarra: string;

  public boletas : Boleta[];

  constructor(private ServiciosService : ServiciosService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    let boletas ={
      rut:"",
      tipo:"",
      folio:0
    };
  }

  guardarDatos(_rut, _tipo, _folio){
    let boleta = {
      rut:_rut,
      tipo:_tipo,
      folio:_folio
    }
    localStorage.setItem("boleta", JSON.stringify( boleta ));
    console.log(boleta);
  }

}
