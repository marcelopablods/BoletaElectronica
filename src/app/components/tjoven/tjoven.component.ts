import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Input} from '@angular/core';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { Boleta } from '../../model/Boleta';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';
import { PDF417BarcodeComponent, PDF417BarcodeModule } from 'angular2-pdf417-barcode';


//SERVICES
import { ServiciosService } from '../../service/servicios.service';
import { RepositoryService } from '../../service/repository.service';

@Component({
  selector: 'app-tjoven',
  templateUrl: './tjoven.component.html',
  styleUrls: ['./tjoven.component.css'],
})
export class TjovenComponent implements OnInit {

  //Declaracion datos de la consulta
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
  public   pruebaBarra: string;
  public   montoTxt : string;
  public   rutaLogo : string;
  public   logoEmpresa : string;
  public   fechaVenc : string;
  public   rutCliente : string;
  public   direccion : string;
  public   comuna : string;
  public   ciudad : string;
  public   giro : string;
  public   observacion : string;
  public   formaPago : string;
  public   vendedor : string;
  public   noOperacion : string;
  public   tipo : string;
  public   subTotal: number;

  public boletas : Boleta[];

//Declaracion parametros sp
  public rut = '76803031-6';
  public txtFolio:number;
  public txtFecha : string;
  public txtMonto : number;
  public btnConsultar:boolean;

  //Deshabilitar/Habilitar elementos
  actionBtn:boolean;
  actionMsj:boolean;
  validarCapcha:boolean;
  declarativeFormCaptchaValue:any;  
  txtRespuesta:string;

  @Input() opts: any = {};
  problems: any;
 
  private canvasTest: any;
  private ctx: any;


  constructor(private ServiciosService : ServiciosService,
    private repService: RepositoryService,
    private route: ActivatedRoute,
    private router: Router) { 

  }
  formatearNumero(value){
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  ngOnInit() {
    this.actionBtn = true;
    //this.validarCapcha = false;
    this.validarCapcha = true;
  }
  

  public txtTipoDocumento = 'BL';
  tipoboletas = [
    { 'id' : 'BL' , 'name' : 'Boleta Electronica'},
    { 'id' : 'FL' , 'name' : 'Factura Electronica'},
  ]

  //Funcion para traer los datos de la boleta
  getBoleta(){
    
    this.ServiciosService.traeDatos(this.rut, this.txtTipoDocumento, this.txtFolio, this.txtFecha, this.txtMonto)
    .then(
      (d) =>{
        if(d.length>0){
          this.boletas = d;
          alert(this.boletas)
          for(var i=0;i<this.boletas.length;i++){
            this.boletas[i].precioUnitario = this.formatearNumero(this.boletas[i].precioUnitario)
            this.boletas[i].monto =  this.formatearNumero(this.boletas[i].monto);
          
          }
            
          this.cantidad = this.boletas[0].cantidad; 
          this.numDoc = this.boletas[0].numDoc;
          this.estado = this.boletas[0].estado;
          this.rutEmisor = this.boletas[0].rutEmisor;
          this.tipoDocu = this.boletas[0].tipoDocu;
          this.folioDte = this.boletas[0].folioDte;
          this.fechaFact = this.boletas[0].fechaFact;
          this.nombreCliente = this.boletas[0].nombreCliente;
          this.montoNeto =  this.formatearNumero(this.boletas[0].montoNeto);
          this.montoexento = this.formatearNumero(this.boletas[0].montoexento);
          this.montoIva = this.formatearNumero(this.boletas[0].montoIva);
          this.montoTotal = this.formatearNumero(this.boletas[0].montoTotal);
          this.dteCompleto = this.boletas[0].dteCompleto;
          this.archivoPdf = this.boletas[0].archivoPdf;
          this.linea = this.boletas[0].linea;
          this.glosa = this.boletas[0].glosa;
          this.unidad = this.boletas[0].unidad;
          this.precioUnitario = this.boletas[0].precioUnitario;
          this.monto = this.boletas[0].monto;
          this.exento = this.boletas[0].exento;
          this.timbreDte = this.boletas[0].timbreDte;
          this.montoTxt = this.boletas[0].montoTxt;
          this.logoEmpresa = this.boletas[0].logoEmpresa;
          this.fechaVenc = this.boletas[0].fechaVenc;
          this.rutCliente = this.boletas[0].rutCliente;
          this.direccion = this.boletas[0].direccion;
          this.comuna = this.boletas[0].comuna;
          this.ciudad = this.boletas[0].ciudad;
          this.giro = this.boletas[0].giro;
          this.observacion = this.boletas[0].observacion;
          this.formaPago = this.boletas[0].formaPago;
          this.vendedor = this.boletas[0].vendedor;
          this.noOperacion = this.boletas[0].noOperacion;
          
          
          this.pruebaBarra =  this.timbreDte;
          switch(this.tipoDocu){
            case "BL":
            this.tipo = "BOLETA ELECTRÓNICA";
            break;
            case "BX":
            this.tipo = "BOLETA EXENTA";
            break;
            case "FL":
            this.tipo = "FACTURA ELECTRÓNICA";
            break;
            case "FX":
            this.tipo = "FACTURA EXENTA";
            break;
          }
          if(this.estado == 900){
            this.actionMsj=true;
            this.txtRespuesta = "Folio anulado.";
          }else{
            this.descargarPdf2(); 
            this.actionMsj = false;
          }
          
        }else{
          this.actionMsj=true;
          this.txtRespuesta = "No existe documento electrónico con esa información.";
        }
        
      },
      (d)=>{
        if(d.status==400){
          this.actionMsj=true;
        }
      }
      );
  }

  dibujarPDF(){
    /*obtenemos el los datos para construir el barcode en un canvas*/
    let barcode = this.repService.getBarCode();
    this.canvasTest = document.getElementById("testCanvas");
    this.ctx = this.canvasTest.getContext('2d');



    /* create a new canvas and get drawing context */
    let aspectratio     : number = this.opts.aspect   || 4;
    let errorcorrection : number = this.opts.errlvl   || -1;
    let pixelheight     : number = this.opts.pxh      || 1;
    let pixelwidth      : number = this.opts.pxw      || 1;

    this.ctx.width  = pixelwidth  * barcode['num_cols'];
    this.ctx.height  =  pixelheight * barcode['num_rows'];

    /* print barcode pixels */
    var y = 0;
    /* for each row */
    for (var r = 0; r < barcode['num_rows']; ++r) {
      var x = 0;
      /* for each column */
      for (var c = 0; c < barcode['num_cols']; ++c) {
        if (barcode['bcode'][r][c] == 1) {
          this.ctx.fillRect(x, y, pixelwidth, pixelheight);
        }
        x += pixelwidth;
      }
      y += pixelheight;
    }
  }

  evaluarValor(valor:any){
    if(valor>0)
    return valor
    else
    return ''
  }

  evaluarBtn(){
    if(this.txtFolio> 0 && this.txtFecha.length == 10 && this.txtMonto >0 && this.validarCapcha==true){
      this.actionBtn = false;
    }

  }

  resolved(captchaResponse: string){
    this.validarCapcha = true;
    this.evaluarBtn();
    //console.log(`Resolved captcha with response ${captchaResponse}:`);
  }

  /*se obtienen los parametros para crear el barcode pdf*/

  //Funcion que genera el pdf y lo descarga
  descargarPdf2(){
    this.dibujarPDF();
    //var canvas = <HTMLCanvasElement> document.getElementById("#myCanvas");
    var imgTest = new Image();
    imgTest.src = this.canvasTest.toDataURL("image/png");

    const doc = new jsPDF();

    html2canvas(document.getElementById('contenido')).then(function(canvas) {
      doc.addImage(imgTest,'PNG',12,230,100,30);

      doc.save('documento_electronico.pdf');


    });
    
    doc.setFontSize(8);
    doc.text('Timbre Electronico S.I.I.',23,267);
    doc.setFontSize(6);
    doc.text('Res. 38 de 22/03/2007',27,270);
    doc.text('Res. 38 de 22/03/2007',27,270);
    doc.text('Verifique documento en: www.sii.cl',21,273);
    let logo = "data:image/png;base64,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";
    switch(this.rutEmisor) { 
      case '76803031-6' : { 
        doc.addImage(logo,'JPG',8,15,110,40); 
         break; 
      }
    } 
      
    doc.roundedRect(120,15,65,35,1,1,"S");
    doc.addFont('Courier New','Courier New','');
    doc.setFontType ('Normal'); 
    doc.setFont ('Courier New');
    
         /*DATOS ENCABEZADO*/
    doc.roundedRect(120,15,65,35,1,1,"S");
    doc.addFont('Courier New','Courier New','');
    doc.setFontType ('Normal'); 
    doc.setFont ('Courier New');
    doc.setFontSize(8);
    doc.text('SEÑOR (ES) : ',10,65);
    doc.setFontSize(8);
    doc.text(this.nombreCliente,32,65);
    doc.setFontSize(8);
    doc.text('R.U.T            : ',10,71);
    doc.setFontSize(8);
    doc.text(this.rutCliente,32,71);
    doc.setFontSize(8);
    doc.text('DIRECCIÓN:',10,77);
    doc.setFontSize(8);
    doc.text(this.direccion,32,77);
    doc.setFontSize(8);
    doc.text('COMUNA    :',10,83);
    doc.setFontSize(8);
    doc.text(this.comuna,32,83);
    doc.setFontSize(8);
    doc.text('CIUDAD      :',10,89);
    doc.setFontSize(8);
    doc.text(this.ciudad,32,89);
    doc.setFontSize(8);
    doc.text('GIRO            :',10,95);
    doc.setFontSize(8);
    doc.text(this.giro,32,95);
    doc.setFontSize(8);
    doc.text('Observaciones:',10,101);
    doc.setFontSize(8);
    doc.text(this.observacion,34,101);
    doc.setFontSize(8);
    doc.text('FECHA EMISIÓN:',102,65);
    doc.setFontSize(8);
    doc.text(this.fechaFact,130,65);
    doc.setFontSize(8);
    doc.setFontSize(9);
    doc.text('VENDEDOR     :',102.5,87);
    doc.setFontSize(8);
    doc.text(this.vendedor,130,87);
    doc.setFontSize(8);
    doc.text('N° OPERACION  :',102.5,93);
    doc.setFontSize(8);
    doc.text(this.noOperacion,130,93);
    
    doc.setTextColor ( 255 , 0 , 0 )
    doc.setFontSize(14);
    doc.text('R.U.T ',130,20);
    doc.text(this.rutEmisor,147,20);
    doc.setFontSize(14);
    doc.text(this.tipo,125,31);
    doc.text('N° ',140,48);
    doc.text(this.folioDte.toString(),146,48);
    doc.setFontSize(8);
    doc.text('S.I.I. - SANTIAGO ORIENTE',130,53);
    doc.roundedRect(8,60,178,45,1,1,'');
      //-----------------------------------------
      /* Encabezado descripcion*/
      
    doc.setTextColor ( 0 , 0 , 0 ); 
    doc.roundedRect(8,106,178,80,1,1,''); 
    doc.roundedRect(8,106,17,8,1,1,'');
    doc.setFontSize(7);
    doc.text('CANTIDAD',10,111);
    doc.roundedRect(25,106,110,8,1,1,'');
    doc.text('DESCRIPCIÓN',70,111);
      //----------------------------------
    doc.roundedRect(135,106,26,8,1,1,'');
    doc.text('VALOR UNITARIO',137,111);
      //----------------------------------
    doc.roundedRect(161,106,25,8,1,1,'');
    doc.text('TOTAL',168,111); 
      //---------------------------------- 
    doc.roundedRect(8,106,17,80,1,1,'');
    doc.roundedRect(135,106,26,80,1,1,'');
      //----------------------------------
      /*Datos Descripcion*/
    
    let ejey = 118;
      
  
    for(let i=0;i<this.boletas.length;i++){
      doc.addFont('Courier New','Courier New','');
      doc.setFontType ('Normal'); 
      doc.setFont ('Courier New');
      doc.setFontSize(8);
      if(this.boletas[i].cantidad.toString().length == 1){
        doc.text(this.evaluarValor(this.boletas[i].cantidad.toString()),21.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].cantidad.toString()).length == 2) {
        doc.text(this.evaluarValor(this.boletas[i].cantidad.toString()),20,ejey);
      }else if(this.evaluarValor(this.boletas[i].cantidad.toString()).length == 3){
        doc.text(this.evaluarValor(this.boletas[i].cantidad.toString()),18.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].cantidad.toString()).length == 4){
        doc.text(this.evaluarValor(this.boletas[i].cantidad.toString()),17,ejey);
      }else if(this.evaluarValor(this.boletas[i].cantidad.toString()).length == 5){
        doc.text(this.evaluarValor(this.boletas[i].cantidad.toString()),15.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].cantidad.toString()).length == 6){
        doc.text(this.evaluarValor(this.boletas[i].cantidad.toString()),14,ejey);
      }else if(this.evaluarValor(this.boletas[i].cantidad.toString()).length == 7){
        doc.text(this.evaluarValor(this.boletas[i].cantidad.toString()),12.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].cantidad.toString()).length == 8){
        doc.text(this.evaluarValor(this.boletas[i].cantidad.toString()),11,ejey);
      }else if(this.evaluarValor(this.boletas[i].cantidad.toString()).length == 9){
        doc.text(this.evaluarValor(this.boletas[i].cantidad.toString()),9.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].cantidad.toString()).length == 10){
        doc.text(this.evaluarValor(this.boletas[i].cantidad.toString()),8,ejey);
      }else{
        doc.text('Error',21.5,ejey);
      }
    
      doc.text(this.boletas[i].glosa,27,ejey);
      if(this.boletas[i].precioUnitario.toString().length == 1){
        doc.text(this.evaluarValor(this.boletas[i].precioUnitario.toString()),156,ejey);
      }else if(this.evaluarValor(this.boletas[i].precioUnitario.toString()).length == 2) {
        doc.text(this.evaluarValor(this.boletas[i].precioUnitario.toString()),154.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].precioUnitario.toString()).length == 3){
        doc.text(this.evaluarValor(this.boletas[i].precioUnitario.toString()),153,ejey);
      }else if(this.evaluarValor(this.boletas[i].precioUnitario.toString()).length == 4){
        doc.text(this.evaluarValor(this.boletas[i].precioUnitario.toString()),151.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].precioUnitario.toString()).length == 5){
        doc.text(this.evaluarValor(this.boletas[i].precioUnitario.toString()),151,ejey);
      }else if(this.evaluarValor(this.boletas[i].precioUnitario.toString()).length == 6){
        doc.text(this.evaluarValor(this.boletas[i].precioUnitario.toString()),149.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].precioUnitario.toString()).length == 7){
        doc.text(this.evaluarValor(this.boletas[i].precioUnitario.toString()),147,ejey);
      }else if(this.evaluarValor(this.boletas[i].precioUnitario.toString()).length == 8){
        doc.text(this.evaluarValor(this.boletas[i].precioUnitario.toString()),145.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].precioUnitario.toString()).length == 9){
        doc.text(this.evaluarValor(this.boletas[i].precioUnitario.toString()),144,ejey);
      }else if(this.evaluarValor(this.boletas[i].precioUnitario.toString()).length == 10){
        doc.text(this.evaluarValor(this.boletas[i].precioUnitario.toString()),142.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].precioUnitario.toString()).length == 11){
        doc.text(this.evaluarValor(this.boletas[i].precioUnitario.toString()),141,ejey);
      }else if(this.evaluarValor(this.boletas[i].precioUnitario.toString()).length == 12){
        doc.text(this.evaluarValor(this.boletas[i].precioUnitario.toString()),139.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].precioUnitario.toString()).length == 13){
        doc.text(this.evaluarValor(this.boletas[i].precioUnitario.toString()),138,ejey);
      }else if(this.evaluarValor(this.boletas[i].precioUnitario.toString()).length == 14){
        doc.text(this.evaluarValor(this.boletas[i].precioUnitario.toString()),136.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].precioUnitario.toString()).length == 15){
        doc.text(this.evaluarValor(this.boletas[i].precioUnitario.toString()),135,ejey);
      }else{
        doc.text('Error',156,ejey);
      }
      
      if(this.boletas[i].monto.toString().length == 1){
        doc.text(this.evaluarValor(this.boletas[i].monto.toString()),181,ejey);
      }else if(this.evaluarValor(this.boletas[i].monto.toString()).length == 2) {
        doc.text(this.evaluarValor(this.boletas[i].monto.toString()),180.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].monto.toString()).length == 3){
        doc.text(this.evaluarValor(this.boletas[i].monto.toString()),179,ejey);
      }else if(this.evaluarValor(this.boletas[i].monto.toString()).length == 4){
        doc.text(this.evaluarValor(this.boletas[i].monto.toString()),177.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].monto.toString()).length == 5){
        doc.text(this.evaluarValor(this.boletas[i].monto.toString()),176.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].monto.toString()).length == 6){
        doc.text(this.evaluarValor(this.boletas[i].monto.toString()),175,ejey);
      }else if(this.evaluarValor(this.boletas[i].monto.toString()).length == 7){
        doc.text(this.evaluarValor(this.boletas[i].monto.toString()),173,ejey);
      }else if(this.evaluarValor(this.boletas[i].monto.toString()).length == 8){
        doc.text(this.evaluarValor(this.boletas[i].monto.toString()),171.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].monto.toString()).length == 9){
        doc.text(this.evaluarValor(this.boletas[i].monto.toString()),170,ejey);
      }else if(this.evaluarValor(this.boletas[i].monto.toString()).length == 10){
        doc.text(this.evaluarValor(this.boletas[i].monto.toString()),168.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].monto.toString()).length == 11){
        doc.text(this.evaluarValor(this.boletas[i].monto.toString()),167,ejey);
      }else if(this.evaluarValor(this.boletas[i].monto.toString()).length == 12){
        doc.text(this.evaluarValor(this.boletas[i].monto.toString()),165.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].monto.toString()).length == 13){
        doc.text(this.evaluarValor(this.boletas[i].monto.toString()),164,ejey);
      }else if(this.evaluarValor(this.boletas[i].monto.toString()).length == 14){
        doc.text(this.evaluarValor(this.boletas[i].monto.toString()),162.5,ejey);
      }else if(this.evaluarValor(this.boletas[i].monto.toString()).length == 15){
        doc.text(this.evaluarValor(this.boletas[i].monto.toString()),161,ejey);
      }else{
        doc.text('Error',181,ejey);
      }
      ejey = ejey + 4;

      
      
    }
      
    doc.roundedRect(8,187,178,7,1,1,'');
    doc.text('SON: '.concat(this.montoTxt),11,192);
      //----------------------------------
    doc.roundedRect(8,197,60,7,1,1,'');
    doc.roundedRect(8,204,60,13,1,1,'');
    doc.roundedRect(68,197,21,7,1,1,'');
    doc.roundedRect(68,204,21,13,1,1,'');
    doc.roundedRect(89,197,21,7,1,1,'');
    doc.roundedRect(89,204,21,13,1,1,'');
    doc.roundedRect(110,197,25,7,1,1,'');
    doc.roundedRect(110,204,25,13,1,1,'');
    doc.roundedRect(135,197,26,5,1,1,'');
    doc.roundedRect(135,202,26,5,1,1,'');
    doc.roundedRect(135,207,26,5,1,1,'');
    doc.roundedRect(135,212,26,5,1,1,'');
    
    doc.roundedRect(161,197,25,5,1,1,'');
    doc.roundedRect(161,202,25,5,1,1,'');
    doc.roundedRect(161,207,25,5,1,1,'');
    doc.roundedRect(161,212,25,5,1,1,'');
      //----------------------------------
    doc.addFont('Courier New','Courier New','');
    doc.setFontType ('Normal'); 
    doc.setFont ('Courier New');
    //doc.text('DOCUMENTO DE REFERENCIA',14,202);
    //doc.text('FOLIO',73,202);
    //doc.text('FECHA',96,202);
    //doc.text('RAZÓN REF.',113,202);
    doc.setFontSize(8);
    switch(this.tipo){
      case "BOLETA ELECTRÓNICA":
      doc.text('',138,200);
      doc.text('',138,205);
      doc.text('',138,210);
      break;
      case "BOLETA EXENTA":
      doc.text('',138,200);
      doc.text('',138,205);
      doc.text('',138,210);
      break;
      case "FACTURA ELECTRÓNICA":
      doc.text('EXENTO',138,200);
      doc.text('SUBTOTAL',138,205);
      doc.text('I.V.A.(19%)',138,210);
      break;
      case "FACTURA EXENTA":
      doc.text('EXENTO',138,200);
      doc.text('SUBTOTAL',138,205);
      doc.text('I.V.A.(19%)',138,210);
      break;
    }
    //doc.text('EXENTO',138,200);
    //doc.text('SUBTOTAL',138,205);
    //doc.text('I.V.A.(19%)',138,210);
    doc.text('TOTAL',138,215);
      //----------------------------------
    
    //minimo eje x 160
    doc.addFont('Courier New','Courier New','');
    doc.setFontType ('Normal'); 
    doc.setFont ('Courier New');
    doc.setFontSize(8);
    if(this.montoexento.toString().length == 1){
      doc.text(this.montoexento.toString(),181,200);
    }else if(this.montoexento.toString().length == 2) {
      doc.text(this.montoexento.toString(),180.5,200);
    }else if(this.montoexento.toString().length == 3){
      doc.text(this.montoexento.toString(),179,200);
    }else if(this.montoexento.toString().length == 4){
      doc.text(this.montoexento.toString(),177.5,200);
    }else if(this.montoexento.toString().length == 5){
      switch(this.tipo){
        case "BOLETA ELECTRÓNICA":
        doc.text('',176,200);
        break;
        case "BOLETA EXENTA":
        doc.text('',176,200);
        break;
        case "FACTURA ELECTRÓNICA":
        doc.text(this.montoexento.toString(),176,200);
        break;
        case "FACTURA EXENTA":
        doc.text(this.montoexento.toString(),176,200);
        break;
      }
      //doc.text(this.montoexento.toString(),176,200);
    }else if(this.montoexento.toString().length == 6){
      doc.text(this.montoexento.toString(),174.5,200);
    }else if(this.montoexento.toString().length == 7){
      doc.text(this.montoexento.toString(),173,200);
    }else if(this.montoexento.toString().length == 8){
      doc.text(this.montoexento.toString(),171.5,200);
    }else if(this.montoexento.toString().length == 9){
      doc.text(this.montoexento.toString(),170,200);
    }else if(this.montoexento.toString().length == 10){
      doc.text(this.montoexento.toString(),168.5,200);
    }else if(this.montoexento.toString().length == 11){
      doc.text(this.montoexento.toString(),167,ejey);
    }else if(this.montoexento.toString().length == 12){
      doc.text(this.montoexento.toString(),165.5,ejey);
    }else if(this.montoexento.toString().length == 13){
      doc.text(this.montoexento.toString(),164,ejey);
    }else if(this.montoexento.toString().length == 14){
      doc.text(this.montoexento.toString(),162.5,ejey);
    }else if(this.montoexento.toString().length == 15){
      doc.text(this.montoexento.toString(),161,ejey);
    }else{
      doc.text('Error',181,215);
    }
  
    this.subTotal = this.montoNeto ;
    
    if(this.subTotal.toString().length == 1){
      doc.text(this.formatearNumero(this.subTotal),181,205);
    }else if(this.subTotal.toString().length == 2) {
      doc.text(this.formatearNumero(this.subTotal),180.5,205);
    }else if(this.subTotal.toString().length == 3){
      switch(this.tipo){
        case "BOLETA ELECTRÓNICA":
        doc.text('',178,205);
        break;
        case "BOLETA EXENTA":
        doc.text('',178,205);
        break;
        case "FACTURA ELECTRÓNICA":
        doc.text(this.formatearNumero(this.subTotal),178,205);
        break;
        case "FACTURA EXENTA":
        doc.text(this.formatearNumero(this.subTotal),178,205);
        break;
      }
      //doc.text(this.formatearNumero(this.subTotal),178,205);
    }else if(this.subTotal.toString().length == 4){
      doc.text(this.formatearNumero(this.subTotal),177.5,205);
    }else if(this.subTotal.toString().length == 5){
      doc.text(this.formatearNumero(this.subTotal),175,205);
    }else if(this.subTotal.toString().length == 6){
      doc.text(this.formatearNumero(this.subTotal),175,205);
    }else if(this.subTotal.toString().length == 7){
      doc.text(this.formatearNumero(this.subTotal),173,205);
    }else if(this.subTotal.toString().length == 8){
      doc.text(this.formatearNumero(this.subTotal),171.5,205);
    }else if(this.subTotal.toString().length == 9){
      doc.text(this.formatearNumero(this.subTotal),170,205);
    }else if(this.subTotal.toString().length == 10){
      doc.text(this.formatearNumero(this.subTotal),168.5,205);
    }else if(this.subTotal.toString().length == 11){
      doc.text(this.formatearNumero(this.subTotal),167,ejey);
    }else if(this.subTotal.toString().length == 12){
      doc.text(this.formatearNumero(this.subTotal),165.5,ejey);
    }else if(this.subTotal.toString().length == 13){
      doc.text(this.formatearNumero(this.subTotal),164,ejey);
    }else if(this.subTotal.toString().length == 14){
      doc.text(this.formatearNumero(this.subTotal),162.5,ejey);
    }else if(this.subTotal.toString().length == 15){
      doc.text(this.formatearNumero(this.subTotal),161,ejey);
    }else{
      doc.text('Error',181,215);
    }

    if(this.montoIva.toString().length == 1){
      doc.text(this.formatearNumero(this.montoIva),181,210);
    }else if(this.montoIva.toString().length == 2) {
      switch(this.tipo){
        case "BOLETA ELECTRÓNICA":
        doc.text('',180.5,210);
        break;
        case "BOLETA EXENTA":
        doc.text('',180.5,210);
        break;
        case "FACTURA ELECTRÓNICA":
        doc.text(this.formatearNumero(this.montoIva),180.5,210);
        break;
        case "FACTURA EXENTA":
        doc.text(this.formatearNumero(this.montoIva),180.5,210);
        break;
      }
      //doc.text(this.formatearNumero(this.montoIva),180.5,210);
    }else if(this.montoIva.toString().length == 3){
      doc.text(this.formatearNumero(this.montoIva),178,205);
    }else if(this.montoIva.toString().length == 4){
      doc.text(this.formatearNumero(this.montoIva),177.5,210);
    }else if(this.montoIva.toString().length == 5){
      doc.text(this.formatearNumero(this.montoIva),175,210);
    }else if(this.montoIva.toString().length == 6){
      doc.text(this.formatearNumero(this.montoIva),175,210);
    }else if(this.montoIva.toString().length == 7){
      doc.text(this.formatearNumero(this.montoIva),173,210);
    }else if(this.montoIva.toString().length == 8){
      doc.text(this.formatearNumero(this.montoIva),171.5,210);
    }else if(this.montoIva.toString().length == 9){
      doc.text(this.formatearNumero(this.montoIva),170,210);
    }else if(this.montoIva.toString().length == 10){
      doc.text(this.formatearNumero(this.montoIva),168.5,210);
    }else if(this.montoIva.toString().length == 11){
      doc.text(this.formatearNumero(this.montoIva),167,ejey);
    }else if(this.montoIva.toString().length == 12){
      doc.text(this.formatearNumero(this.montoIva),165.5,ejey);
    }else if(this.montoIva.toString().length == 13){
      doc.text(this.formatearNumero(this.montoIva),164,ejey);
    }else if(this.montoIva.toString().length == 14){
      doc.text(this.formatearNumero(this.montoIva),162.5,ejey);
    }else if(this.montoIva.toString().length == 15){
      doc.text(this.formatearNumero(this.montoIva),161,ejey);
    }else{
      doc.text('Error',181,215);
    }
  
    if(this.montoTotal.toString().length == 1){
      doc.text(this.montoTotal.toString(),181,215);
    }else if(this.montoTotal.toString().length == 2) {
      doc.text(this.montoTotal.toString(),180.5,215);
    }else if(this.montoTotal.toString().length == 3){
      doc.text(this.montoTotal.toString(),179,215);
    }else if(this.montoTotal.toString().length == 4){
      doc.text(this.montoTotal.toString(),177.5,215);
    }else if(this.montoTotal.toString().length == 5){
      doc.text(this.montoTotal.toString(),175.5,215);
    }else if(this.montoTotal.toString().length == 6){
      doc.text(this.montoTotal.toString(),175,215);
    }else if(this.montoTotal.toString().length == 7){
      doc.text(this.montoTotal.toString(),173,215);
    }else if(this.montoTotal.toString().length == 8){
      doc.text(this.montoTotal.toString(),171.5,215);
    }else if(this.montoTotal.toString().length == 9){
      doc.text(this.montoTotal.toString(),170,215);
    }else if(this.montoTotal.toString().length == 10){
      doc.text(this.montoTotal.toString(),168.5,215);
    }else if(this.montoTotal.toString().length == 11){
      doc.text(this.montoTotal.toString(),167,ejey);
    }else if(this.montoTotal.toString().length == 12){
      doc.text(this.montoTotal.toString(),165.5,ejey);
    }else if(this.montoTotal.toString().length == 13){
      doc.text(this.montoTotal.toString(),164,ejey);
    }else if(this.montoTotal.toString().length == 14){
      doc.text(this.montoTotal.toString(),162.5,ejey);
    }else if(this.montoTotal.toString().length == 15){
      doc.text(this.montoTotal.toString(),161,ejey);
    }else{
      doc.text('Error',181,215);
    }   
  }
}


