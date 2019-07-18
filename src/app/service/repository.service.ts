import { Injectable } from '@angular/core';

@Injectable()
export class RepositoryService {

	private data:any;
	private barCode:any;
    constructor() { }
  
    setData(_data){
    	this.data = _data;
    }
  
    getData(){
  		return this.data;
    }

    setBarCode(_bar){
    	this.barCode = _bar;
    }

    getBarCode(){
    	return this.barCode;
    }



}
