import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Boleta } from '../../model/Boleta';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';

//SERVICES
import { ServiciosService } from '../../service/servicios.service';
import { RepositoryService } from '../../service/repository.service';

@Component({
  selector: 'app-turistour',
  templateUrl: './turistour.component.html',
  styleUrls: ['./turistour.component.css'],
})
export class TuristourComponent implements OnInit {

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

  constructor(private ServiciosService : ServiciosService,
    private repService: RepositoryService,
    private route: ActivatedRoute,
    private router: Router) { 

  }

  ngOnInit() {
    this.actionBtn = true;
    this.validarCapcha = false;
    //this.validarCapcha = true;
  }

  public txtTipoDocumento = 'BL';
  boletas = [
    { 'id' : 'BL' , 'name' : 'Boleta Electronica'},
    { 'id' : 'BX' , 'name' : 'Boleta Exenta'},
    { 'id' : 'FL' , 'name' : 'Factura Electronica'},
    { 'id' : 'FX' , 'name' : 'Factura Exenta'},
  ]

  getBoleta(){
    this.ServiciosService.traeDatos(this.rut, this.txtTipoDocumento, this.txtFolio, this.txtFecha, this.txtMonto)
    .then(
      (d) =>{
        if(d.length>0){
          this.repService.setData(d);
          this.router.navigate(['/boleta']);
        }else{
          this.actionMsj=true;
        }
      },
      (d)=>{
        console.log(d)
        if(d.status==400){
          this.actionMsj=true;
        }
      }
      );
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
}
