import React, { Component } from "react";

import $ from 'jquery';
import Popper from 'popper.js';
import Config from './config.js';
import Functions from './helpers.js';
import ReactHtmlParser from 'react-html-parser';
 
class Payment extends Component {
	
	
	
	state = {
    
    	main_balence :'',
	    cards : '',	
	    card_number:'',
	    expiry_month:'',
	    expiry_year:'',
	    cvv:'', 
		tran_history_all : '',
		tran_endpoint : 'user/wallet/transaction_history',
		user_list : '',
		selected_mobile : '',
		selected_uname:'',
		selected_user_id:'',
		contactsearch:'',
		myrequest:'',
		requestsenttome:'',
		payment_request_code:''
	
    }
	
	 
	constructor(props){
		super(props);
		this.handleLoad = this.handleLoad.bind(this);
        this.getCards = this.getCards.bind(this); 
		this.editCard = this.editCard.bind(this);
		this.addCard = this.addCard.bind(this);
		this.getAlltran = this.getAlltran.bind(this);
		this.switchTran = this.switchTran.bind(this);
		this.getAllUsers = this.getAllUsers.bind(this);
		this.selectUserMobile = this.selectUserMobile.bind(this);
		this.searchUser = this.searchUser.bind(this);
		this.getMyRequest = this.getMyRequest.bind(this);
		
		//this.send_payment = this.send_payment(this);
		//this.handleInputChange = this.handleInputChange(this);

	}
	
		componentDidMount() {
            			 
			 this.handleLoad();
 
    }
	
	handleLoad(){
		
	let user = JSON.parse(sessionStorage.getItem("user"));	   
	let auth = user.success.token;
	let endpoint = 'user/account/profile/details';
	let url = Config.baseurl2;
	let request_type = 'GET';
	let ref = this;
	
	  $.ajax(url, {
      method: 'POST',  
      dataType: "json",
	  data : {endpoint:endpoint,request_type:request_type,auth:auth},
	  success:function(result){
		 
		let wallet = JSON.parse(result);
		let bal = " N : " +  wallet.data.walletDetails[0].available_balance;
		ref.setState({main_balence:bal});
		 
	  },
	  error:function(xhr,status,error){
            alert(status);
      }
    });
		
	}
	
	settlePayment(){
		
		let endpoint = 'user/payment-request/settle';
		let request_type = 'POST';
		let user = JSON.parse(sessionStorage.getItem("user"));	   
	    let auth = user.success.token;
		let url = Config.baseurl2;
		
		
	  this.setState((prevState) => {	
	  
	  $.ajax(url, {
      method: 'POST',  
      dataType: "json",
	  data : {endpoint:endpoint,request_type:request_type,auth:auth,request_id:prevState.payment_request_code},
	  success:function(result){
		 
		var res = JSON.parse(result);
		
		    console.log("pppppppppppppppppppppp",res);
			if(res.error==true)
			{
				$('#errormessage').html(res.msg);
				$('#errormodel').modal();
			}
			else{
				$('#errormessage').html(res.msg);
				$('#errormodel').modal();
			}
		 
	  },
	  error:function(xhr,status,error){
            alert(status);
      }
    });
	  });
		
	}
	
	
	getMyRequest(){
	
    let user = JSON.parse(sessionStorage.getItem("user"));	   
	let auth = user.success.token;
	let endpoint = 'user/payment-request/all';
	let url = Config.baseurl2;
	let request_type = 'GET';
    let html = '';  
    let html2 = '';    	
	let self = this;
		
		$.ajax(url, {
      method: 'POST',  
      dataType: "json",
	  data : {endpoint:endpoint,request_type:request_type,auth:auth},
	  success:function(result){
		 
		console.log('MY REQ',result);
		
		let myreq = JSON.parse(result);
		$.each(myreq.data, function(index, element) {
			
			let name_arr = element.receiver.full_name.split(" ");
			let alfa1 =  element.receiver.full_name.charAt(0);
			let alfa2 = name_arr[1].charAt(0);
			let a1 = alfa1.toUpperCase();
			let a2 = alfa2.toUpperCase();
			
			let dt = new Date('2020-05-04 12:42:41');
			let reqdate = dt.toLocaleString();
			
			html += '<li class="contact list-group-item">'+
                              '<div class="row">'+
                                '<div class="col col-md-2">'+
                                  '<div class="btn-primary btn btn-social-icon btn-google btn-rounded">'+
                                    '<p class="mt-2">'+a1+a2+'</p>'+
                                  '</div>'+
                                '</div>'+
                                '<div class="col">'+
                                  '<h4 style="width:200px" class="name m-0">To: '+element.receiver.full_name+'</h4>'+
                                  '<h6 class="text-success">N '+element.amount+'</h6>'+
                                  '<span class="text-warning text-uppercase">'+element.status+'</span>'+
                                '</div>'+
                                '<div class="col text-right">'+
                                  '<small>'+reqdate+'</small>'+
                                '</div>'+
                              '</div>'+
                            '</li>'
			
		});
		
		 self.setState({myrequest:html});
	  },
	  error:function(xhr,status,error){
            alert(status);
      }
    });
	
	$.ajax(url, {
      method: 'POST',  
      dataType: "json",
	  data : {endpoint:'user/payment-request/mine',request_type:request_type,auth:auth},
	  success:function(result){
		 
		//console.log('MY REQ',result);
		
		let myreq = JSON.parse(result);
		$.each(myreq.data, function(index, element) {
			
			let name_arr = element.requestor.full_name.split(" ");
			let alfa1 =  element.requestor.full_name.charAt(0);
			let alfa2 = name_arr[1].charAt(0);
			let a1 = alfa1.toUpperCase();
			let a2 = alfa2.toUpperCase();
			
			let dt = new Date('2020-05-04 12:42:41');
			let reqdate = dt.toLocaleString();
			
			html2 += '<li class="contact list-group-item">'+
                              '<div class="row">'+
                                '<div class="col col-md-2">'+
                                  '<div class="btn-primary btn btn-social-icon btn-google btn-rounded">'+
                                    '<p class="mt-2">'+a1+a2+'</p>'+
                                  '</div>'+
                                '</div>'+
                                '<div class="col">'+
                                  '<h4 style="width:200px" class="name m-0">FORM: '+element.requestor.full_name+'</h4>'+
                                  '<h6 class="text-success">N '+element.amount+'</h6>'+
                                  '<span class="text-warning text-uppercase">'+element.status+'</span>'+
                                '</div>'+
                                '<div class="col text-right">'+
                                  '<small>'+reqdate+'</small>'+
                                '</div>'+
                              '</div>'+
                            '</li>'
			
		});
		
		 self.setState({requestsenttome:html2});
	  },
	  error:function(xhr,status,error){
            alert(status);
      }
    });
	
	
}


getRequestSentToMe(){
	/*let user = JSON.parse(sessionStorage.getItem("user"));	   
	let auth = user.success.token;
	
	let url = Config.baseurl2;
	let request_type = 'GET';
    let html = '';   	
	let self = this;
	
	*/
	
}

	
	handleInputChange(e) {
          		
     this.setState({ [e.target.id]: e.target.value});
  
    }
	
	getAllUsers(){
		
		let self = this;
		let html = '';
		let all_users  = JSON.parse(sessionStorage.getItem("all_users"));
		
		$.each(all_users.data, function(index, element) {
			
			let name_arr = element.full_name.split(" ");
			let alfa1 =  element.full_name.charAt(0);
			let alfa2 = name_arr[1].charAt(0);
			let a1 = alfa1.toUpperCase();
			let a2 = alfa2.toUpperCase();
			let selid = element.phone+"_"+element.full_name+"_"+element.id;

			html += '<a class="selectU" id="'+selid+'"><li class="contact list-group-item">'+
                              '<div class="row">'+
                                '<div class="col col-md-2">'+
                                  '<div class="btn-primary btn btn-social-icon btn-google btn-rounded">'+
                                    '<p class="mt-2">'+a1+a2+'</p>'+
                                  '</div>'+
                                '</div>'+
                                '<div class="col">'+
                                  '<h4 class="name m-0">'+element.full_name+
                                '</div>'+
                              '</div>'+
                            '</li></a>';
			
			
	   });
		$(document).on("click", "a.selectU" , function() {
                 self.selectUserMobile(this.id);
                 });
		
		self.setState({user_list:html});
		console.log('PAYMENT USERS ',all_users);
	}
	
	
	searchUser(){
		
		let self = this;
		let html = '';
		let all_users  = JSON.parse(sessionStorage.getItem("all_users"));
		
		
		this.setState((prevState) => {
		$.each(all_users.data, function(index, element) {
			let pattern =  prevState.contactsearch ;
			console.log(pattern);
			let ifmatch =   element.full_name.includes(pattern);
			if(ifmatch){
			
			let name_arr = element.full_name.split(" ");
			let alfa1 =  element.full_name.charAt(0);
			let alfa2 = name_arr[1].charAt(0);
			let a1 = alfa1.toUpperCase();
			let a2 = alfa2.toUpperCase();
			let selid = element.phone+"_"+element.full_name+"_"+element.id;

			html += '<a class="selectU" id="'+selid+'"><li class="contact list-group-item">'+
                              '<div class="row">'+
                                '<div class="col col-md-2">'+
                                  '<div class="btn-primary btn btn-social-icon btn-google btn-rounded">'+
                                    '<p class="mt-2">'+a1+a2+'</p>'+
                                  '</div>'+
                                '</div>'+
                                '<div class="col">'+
                                  '<h4 class="name m-0">'+element.full_name+
                                '</div>'+
                              '</div>'+
                            '</li></a>';
			
			}
	   });
		 $(document).on("click", "a.selectU" , function() {
                 self.selectUserMobile(this.id);
                 });
				 
				 
		
		self.setState({user_list:html});
		//console.log('PAYMENT USERS ',all_users);
		});	
	}
	
	
	
    send_payment(){
		
		
		let endpoint = 'user/payment-request/new';
		let request_type = 'POST';
		let user = JSON.parse(sessionStorage.getItem("user"));	   
	    let auth = user.success.token;
		let url = Config.baseurl2;
		let amount = $('#label-enterAmount').val();
		let note = $('#paynote').val();
		
	  this.setState((prevState) => {	
	  alert('hello');
	  $.ajax(url, {
      method: 'POST',  
      dataType: "json",
	  data : {endpoint:endpoint,request_type:request_type,auth:auth,receiver_id:prevState.selected_user_id,amount:amount,note:note},
	  success:function(result){
		 
		var res = JSON.parse(JSON.stringify(result));
		var res2 = JSON.parse(result);
		    console.log(res);
			if(res.error==true)
			{
				$('#errormessage').html(res2.msg);
				$('#errormodel').modal();
			}
			else{
				$('#errormessage').html(res2.msg);
				$('#errormodel').modal();
			}
		 
	  },
	  error:function(xhr,status,error){
            alert(status);
      }
    });
	  });
		
	}
	
	
	selectUserMobile(mobile){
		
	//alert(mobile);
     $('#searchpeopleModal').modal("hide");	
	 let user_data = mobile.split("_");
	 let sel_mobile_no = user_data[0];
	 let sel_uname = "Send Payment To : " + user_data[1];
	 let sel_uid = user_data[2];
	 
	 this.setState({selected_mobile:sel_mobile_no});
	 this.setState({selected_uname:sel_uname});
	 this.setState({selected_user_id:sel_uid});
	
		
	}
	
	
	
	
	
	
	addCard(){
		
	   let endpoint = 'user/card/add_card';
	  //let endpoint = 'user/user_card/validate_and_charge';
	   let user = JSON.parse(sessionStorage.getItem("user"));
	   let auth = user.success.token;
	   let request_type = 'POST';
		
		this.setState((prevState) => {
        $.ajax({
        url: Config.baseurl,
        type: "POST",
        crossDomain: true,
        data: {endpoint:endpoint,request_type:request_type,auth:auth,card_number:prevState.card_number,expiry_month:prevState.expiry_month,expiry_year:prevState.expiry_year,cvv:prevState.cvv},
        dataType: "json",
        success:function(result){
            
			let res = JSON.parse(result);
		    console.log(res);
			if(res.error==true)
			{
				$('#errormessage').html(res.msg);
				$('#errormodel').modal();
			}
			else{
				$('#resetotp').modal();
			}
  
		  
        },
        error:function(xhr,status,error){
            console.log(status);
        }
    });
		   
		   
		   
		   
        });
		
	}
	
	
	getCards(){
	let ref = this;
	let endpoint = 'user/card/get_cards';
	let html ="";
	let html2 = "";
	   let user = JSON.parse(sessionStorage.getItem("user"));
	   let auth = user.success.token;
	    $.ajax({
        url: Config.baseurl,
        type: "POST",
        crossDomain: true,
        data: {endpoint:endpoint,auth:auth},
        dataType: "json",
        success:function(result){
           		//$('#main-cards').html(JSON.stringify(JSON.parse(result)));
				
				console.log("CARDS",result);
								

				
				let cards = JSON.parse(result);
				$.each(cards.data, function(index, element) {
					
                 //console.log(element.card_number); 
				 
				 html2 += "&lt; h1 &gt; How are you &lt;/h1&gt; ";
				 html +='<div class="col-md-4 col-xs-12">'+
				                          '<div class="cards-thumbnail thumbnail">'+
				                         '<div class="d-flex justify-content-between align-items-center">'+
                                          '<div class="d-flex justify-content-between align-items-center">'+
                                          ' <div class="mr-2">'+
                                          '<img src="'+element.brand_logo+'" alt="" width=65>'+
                                          '</div>'+
                                          '</div>'+
                                          '</div>'+
                                          '<div class="card-body">'+
                                          '<div class="ml-2">'+
                                          '<p>'+element.card_type+'</p>'+
                                          '<h4>'+element.card_number+'</h4>'+
                                          '<p>CVV: '+element.cvv+'</p>'+
										  '<p>Expiry:'+element.expiry_month+'/'+element.expiry_year+'</p>'+
										  
                                          '<h4>'+element.bank+'</h4>'+
				                         // '<button id="'+element.id+'" style="float:right"class="crd" "><i class="mdi-account-edit"></i></button>'+
                                          '</div>'+
                                          '</div>'+
                                          '</div>'+
                                          '</div>';
										  
										  
										 
				 
				 
				 
                 });
				 $(document).on("click", "button.crd" , function() {
                 ref.editCard(this.id);
                 });
				 
				 ref.setState({cards:html});
				 //$('#mcard').html(html);
				 //ReactDOM.render(<Payment />, $('#mcard')[0]);
				 //this.forceUpdate();
				 
				 
              
		  
        },
        error:function(xhr,status,error){
            console.log(status);
        }
		});
	
	
		
	}
	
	
	editCard(id){
		alert(id);
	}
	
	
	getAccounts(){
		
		
	}
	
	switchTran(ttype){
		
		if(ttype == 0){
		this.setState({tran_endpoint:'user/wallet/transaction_history'})
		}
		else if(ttype == 1){
		this.setState({tran_endpoint:'user/wallet/transaction_history/credit'})	
		}
		else{
		this.setState({tran_endpoint:'user/wallet/transaction_history/debit'})		
		}
		
		this.getAlltran();
	}
	
	
	getAlltran(){
		let self = this;
		
		
		let ref = this;
	   let html ="";
	   let user = JSON.parse(sessionStorage.getItem("user"));
	   let auth = user.success.token;
	   let request_type = 'GET';
	   
	   this.setState((prevState) => {
        		
	    $.ajax({
        url: Config.baseurl2,
        type: "POST",
        crossDomain: true,
        data: {endpoint:prevState.tran_endpoint,request_type:request_type,auth:auth},
        dataType: "json",
        success:function(result){
           		//$('#main-cards').html(JSON.stringify(JSON.parse(result)));
				
				console.log("TRAN",result);
								

				
				let tran = JSON.parse(result);
				$.each(tran.data, function(index, element) {
					let a_type = '';
					let narret = "";
					if(element.type == 'debit'){
						a_type = ' DEBITED FROM YOUR WALLET';
						narret = 'MONEY SENT TO ';
					}
					else
					{
                      a_type = ' CREDITED TO YOUR WALLET';
					  narret = 'MONEY RECIEVED FROM ';
                    } 						
					
                 html += '<div class="col-md-4 col-xs-12 filter all credit">'+
                  '<div class="cards-thumbnail  thumbnail">'+
                    '<h6 className="card-title"><i className="mdi mdi-arrow-up-drop-circle-outline text-danger" /><b style="color:green">'+narret+'</b>' +
					element.sender_name+
					'</h6>'+
					'<h6> <b style="color:#E91E63;">NGN:</b><b style="color:green"> '+element.amount+'</b>'+a_type+ ' </h6>'+
					'<h6> <b style="color:#E91E63;">REF NO.</b>'+element.reference+'</h6>'+
					'<h6> <b style="color:#E91E63;">Note.</b>'+element.description+'</h6>'+
                    '<p class="text-muted">'+element.created_at+'</p>'+
                  '</div>'+
                '</div>';
				
                 });
				 
				ref.setState({tran_history_all:html});
				 
				 
              
		  
        },
        error:function(xhr,status,error){
            console.log(status);
        }
		});
		
		});
		
	}
	
	
	
	
	
  render() {
    return (
        
      <div>
        {/*
                    Way Pay Content

                */}
        <div className="col-12 grid-margin">
		
          <div className="card card-statistics">
            <div className="row">
              <div className="card-col   col-md-2 col-6 border-right">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <i className="mdi mdi-account-multiple-outline text-primary mr-0 mr-sm-4 icon-lg" />
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <h4 className="mb-0 font-weight-medium" data-toggle="modal" data-target="#transferModal">Transfer
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-col   col-md-2 col-6 border-right">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <i className="mdi mdi-plus-circle-outline  text-primary mr-0 mr-sm-4 icon-lg" />
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <h4 className="mb-0 font-weight-medium" data-toggle="modal" data-target="#fundWalletModal">Fund
                          Wallet</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-col   col-md-2 col-6 border-right">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <i className="mdi mdi-basket text-primary mr-0 mr-sm-4 icon-lg" />
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <h4 className="mb-0 font-weight-medium" data-toggle="modal" data-target="#payMerchantModal">Pay
                          Merchant
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-col   col-md-2 col-6">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <i className=" mdi mdi-wallet text-primary mr-0 mr-sm-4 icon-lg" />
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <h4 className="mb-0 font-weight-medium" data-toggle="modal" data-target="#receiveMoneyModal">
                          Receive Money
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-col   col-md-2 col-6">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <i className=" mdi mdi-currency-usd  text-primary mr-0 mr-sm-4 icon-lg" />
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <h4 className="mb-0 font-weight-medium" data-toggle="modal" data-target="#retrievePaymentModal">
                          Retrieve
                          Payment</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-col   col-md-2 col-6">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <i className="mdi mdi-target text-primary mr-0 mr-sm-4 icon-lg" />
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <h4 className="mb-0 font-weight-medium" data-toggle="modal" data-target="#paymentRequestModal">
                          Payment
                          Requests</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Merchant*/}
        <h2>Merchant</h2>
        <div className="col-12 grid-margin">
          <div className="card card-statistics">
            <div className="row">
              <div className="card-col  col border-right">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <i className=" mdi mdi-cellphone  text-primary mr-0 mr-sm-4 icon-lg" />
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <h4 className="mb-0 font-weight-medium" data-toggle="modal" data-target="#airtimeTopupModal">
                          Airtime
                          TopUp </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-col col border-right">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <a href data-toggle="modal" data-target="#gotvModal"><img src="assets/images/gotv.png" className="wayapayicon" /></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-col   col">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <a href data-toggle="modal" data-target="#dstvModal"><img src="assets/images/dstv.jpg" className="wayapayicon" /></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-col   col">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <i className="  mdi mdi-timer  text-primary mr-0 mr-sm-4 icon-lg" />
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <h4 className="mb-0 font-weight-medium" data-toggle="modal" data-target="#startimeModal">
                          <a href="#">Start Times</a> </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-col   col">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <i className="  mdi mdi-flashlight  text-primary mr-0 mr-sm-4 icon-lg" />
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <h4 className="mb-0 font-weight-medium" data-toggle="modal" data-target="#electricityModal">
                          <a href="#">Electricity</a> </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav role="navigation">
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item dropdown">
              <a className="nav-link wayapaytab dropdown-toggle active" data-toggle="dropdown" href="#" style={{width:"232px"} } role="button" aria-haspopup="true" aria-expanded="false">
                <i className="mdi  mdi-currency-usd   text-primary mr-0 mr-sm-4 icon-lg" />
                wallet</a>
              <div className="dropdown-menu">
                <a className="dropdown-item " data-toggle="tab" role="tab" id href="#balance">
                  Balance
                  <strong id="bal1">{this.state.main_balence}</strong>
                </a>
                <a className="dropdown-item" data-toggle="tab" role="tab" id="cardslink" href="#cards" onClick={this.getCards}>Cards</a>
                <a className="dropdown-item" data-toggle="tab" role="tab" id="bankaccountlink" href="#bankAccount">Bank
                  Accounts</a>
                <a className="dropdown-item" data-toggle="tab" role="tab" id="transactionslink" href="#transactions" onClick={this.getAlltran}>Transactions</a>
                <a className="dropdown-item" data-toggle="tab" role="tab" id="paymentRequestlink" href="#paymentRequest">Payment Requests</a>
                <a className="dropdown-item" data-toggle="tab" role="tab" id="paymentsecuritylink" href="#">Payment
                  Security</a>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link wayapaytab dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                <i id="bal2" className="mdi mdi-wallet   text-primary mr-0 mr-sm-4 icon-lg" >
                {this.state.main_balence}
				</i>
				</a>
              <div className="dropdown-menu">
                <a className="dropdown-item" data-toggle="tab" role="tab" id href="#payments">Payment</a>
                <a className="dropdown-item " data-toggle="tab" role="tab" id href="#withdraw">Withdraw</a>
                <a className="dropdown-item sendPayment" data-toggle="tab" role="tab" id href="#transferAnotherP">Transfer to
                  Another User</a>
                <a className="dropdown-item" data-toggle="tab" role="tab" id href="#transferToPhone">Transfer to
                  Phone</a>
                <a className="dropdown-item" data-toggle="tab" role="tab" id href="#receiveMoney">Receive Money
                </a>
                <a className="dropdown-item" data-toggle="tab" role="tab" id href="#paymerchant">Pay Merchant</a>
              </div>
            </li>
            <li className="nav-item">
              <a href="#commission" id data-toggle="tab" role="tab" className="nav-link wayapaytab">
                <i className="mdi mdi-wallet-membership   text-primary mr-0 mr-sm-4 icon-lg  " /> N 0.00 Bonus
                Commission
              </a></li>
            <li className="nav-item">
              <a href="#bvn" id data-toggle="tab" role="tab" className="nav-link wayapaytab">
                <i className="  mdi mdi-link   text-primary mr-0 mr-sm-4 icon-lg " /> Link BVN
              </a></li>
          </ul>
        </nav>
        <div className="tab-content" id="wayapay">
          <div className="tab-pane fade block-center text-center col-md-6 " id="payments" role="tabpanel" aria-labelledby="page3-tab">
            <h2 className="text-center"> Payment</h2>
            <div className="popover-body text-center">
              <i className="mdi mdi-information-outline text-muted " />
              <p>You need to re-enable Quick Pay. Show your code to <br /> the merchant once enabled for quicker
                payments</p>
              <button className="btn btn-gradient-danger" data-toggle="modal" data-target="#QRCodeS">Enable</button>
              <hr />
            </div>
          </div>
          <div className="tab-pane fade block-center text-center col-md-6 " id="Withdrawpayment" role="tabpanel" aria-labelledby="page3-tab">
            <h2 className="text-center"> Money</h2>
            <p>
              You need to re-enable Quick Pay. Show your code to the Merchant once enable for quicker payments.
            </p>
            <button type="button" className="btn btn-primary"> Enable</button>
          </div>
          <div className="tab-pane fade block-center col-md-6 " id="withdraw" role="tabpanel" aria-labelledby="page3-tab">
            <h2 className="text-center"> Balance Withdraw</h2>
            <p className>Receive Bank Account</p>
            <div className="form-group">
              <label htmlFor="label-plan">Choose a Bank Account</label>
              <select id="label-plan" className="form-control ">
                <option>MTN</option>
                <option>GLO</option>
                <option>Airtel</option>
                <option>9 Mobile</option>
              </select>
            </div>
            <span className="text-muted">Select Account to Receive Withdraw</span>
            <br /><br />
            <table>
              <tbody>
                <tr>
                  <td>
                    <span>Withdraw Amount</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">N</span>
                      </div>
                      <input type="text" className="form-control" aria-label="Price of Plan" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-3">
              <a className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" href="#">Withdraw
                to Bank Account</a>
            </div>
          </div>
          <div className="tab-pane fade block-center col-md-6 " id="transferAnotherP" role="tabpanel" aria-labelledby="page3-tab">
            <h2 className="text-center"> Transfer</h2>
            <div className="text-center">
              <button type="button" className="btn btn-gradient-success btn-sm">
                Select
              </button>
            </div>
            <br /><br />
            <table className="table">
              <tbody>
                <tr>
                  <td colSpan={2}>
                    <span className="text-muted">Transfer Amount</span>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">N</span>
                      </div>
                      <input type="text" className="form-control form-control-lg" placeholder={0.00} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    Charge: N20.00
                  </td>
                  <td>
                    Total: N20.0
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-3">
              <a className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" href="#">Transfer
                Funds</a>
            </div>
          </div>
          <div className="tab-pane fade block-center col-md-6 " id="transferToPhone" role="tabpanel" aria-labelledby="page3-tab">
            <h2 className="text-center"> Transfer to Phone</h2>
            <p>
              Send money to, They would receive an SMS of your Transfer and once they
              sign in/sign up to Waya the money would be deposited into their wallet
            </p>
            <br /><br />
            <table className="table">
              <tbody>
                <tr>
                  <td colSpan={2}>
                    <span className="text-muted">Phone Number</span>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">+234</span>
                      </div>
                      <input type="text" className="form-control form-control-lg" placeholder={123456789} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="text-muted">Transfer Amount</span>
                    <h1>N</h1>
                  </td>
                  <td>
                    <h1>0.00</h1>
                  </td>
                </tr>
                <tr>
                  <td>
                    Charge: N20.00
                  </td>
                  <td>
                    Total: N20.0
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-3">
              <a className="btn btn-block btn-gradient-success btn-lg font-weight-medium auth-form-btn" href="#">Send NGN
                0.00 to</a>
            </div>
          </div>
          <div className="tab-pane fade block-center col-md-8 " id="receiveMoney" role="tabpanel" aria-labelledby>
            <div className="row">
              <div className="card-col  col ">
                <div className="card-body border">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <h4 className="mb-0 font-weight-medium sendPayment" data-target="#requestsPAymentModal" data-toggle="modal" onclick="openSelectuser();">
                          <i className=" mdi mdi-check-circle text-success" />
                          Send Payment Request</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-col col ">
                <div className="card-body border">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <h4 className="mb-0 font-weight-medium" data-target="#receiveMoneyQR" data-toggle="modal">
                          <i className=" mdi mdi-check-circle text-success" />
                          Generate QR Code
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade block-center col-md-8 " id="paymerchant" role="tabpanel" aria-labelledby>
            <div className="row">
              <div className="card-col  col ">
                <div className="card-body border">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <h4 className="mb-0 font-weight-medium sendPayment" data-target="#requestsPAymentModal" data-toggle="modal" onclick="openSelectuser();">
                          <i className=" mdi mdi-check-circle text-success" />
                          Scan to Pay</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-col col ">
                <div className="card-body border">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <h4 className="mb-0 font-weight-medium" data-target="#receiveMoneyQR" data-toggle="modal">
                          <i className=" mdi mdi-check-circle text-success" />
                          Pay with Phone Number
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade block-center col-md-6 " id="bvn" role="tabpanel" aria-labelledby>
            <h2 className="text-center"> Link BVN</h2>
            <p className="text-right">Why BVN?</p>
            <div className="form-label-group">
              <label htmlFor="label-cardnodstv">BVN (dial *565*o# to get BVN) </label>
              <input type="text" className="form-control form-control-lg" id="label-cardnodstv" placeholder="BVN (dial *565*o# to get BVN)" />
            </div>
            <div className="mt-3">
              <a className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" href="#">Validate
                BVN</a>
            </div>
          </div>
          <div className="tab-pane fade block-center col-md-6  text-center" id="commission" role="tabpanel" aria-labelledby="page3-tab">
            <h2 className="text-center"> Commission Wallet</h2>
            <h6 className="text-center">
              Hey Jude,<br />
              here are your Merchant Commission
            </h6>
            <img src="assets/images/card.png" className="img-responsive cardimg text-center" />
            <div className="template-demo mt-4 block-center">
              <p>
                <strong>The more you transact with WAYA, the more you earn!</strong>
              </p>
              <br />
              <p>
                your Total Accumulated Commission would be deposited into you wallet on the 26th of each month!
              </p></div>
          </div>
          <div className="tab-pane col-md-6 text-center fade block-center active show " id="balance" role="tabpanel" aria-labelledby="page3-tab">
            <h2 className="text-center"> Waya Payment</h2>
            <h6>
              Hey Jude,
              here are you Cards.
            </h6>
            <img src="assets/images/card.png" className="img-responsive cardimg" />
            <div className="template-demo mt-4">
              <div className="btn-group" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-outline-primary" data-toggle="modal" data-target="#withdrawModal">
                  TopUp Wallet </button>
                <button type="button" className="btn btn-outline-primary" data-toggle="modal" data-target="#withdrawMoney">
                  Withdraw Money </button>
              </div>
            </div>
          </div>
		  
		  
          {/* Cards*/}
          <div className="tab-pane fade block-center" id="cards" role="tabpanel" aria-labelledby="activities-tab">
            <h2 className="text-center">Cards</h2>
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#addCard">
              <i className="mdi mdi-plus" />
              Add Card</button>
			  
			  <div className="row" >
			  {ReactHtmlParser(this.state.cards)}
			  </div>
		     		
            
		
      
	  </div>		  
			  
            
          <div className="tab-pane fade" id="transactions" role="tabpanel">
            <div className="card">
              <div align="center" id="transactionsNotification">
                <button className="btn btn-default filter-button" onClick={() => this.switchTran(0)} data-filter="all">All</button>
                <button className="btn btn-default filter-button" onClick={() => this.switchTran(1)} data-filter="credit">Credit</button>
                <button className="btn btn-default filter-button" onClick={() => this.switchTran(2)} data-filter="debit">Debit</button>
              </div>
              <div className="row">
			  {ReactHtmlParser(this.state.tran_history_all)}
			  
              </div>
            </div>
            <div className="col-md-1">
              <br />
              <div id="datepicker" className="input-group date" data-date-format="mm-dd-yyyy">
                <input className="form-control" type="hidden" readOnly />
                <button className="input-group-addon btn btn-social-icon btn-youtube btn-rounded"><i className="mdi mdi-calendar" /></button>
              </div>
            </div>
          </div>
          <div className="tab-pane fade " id="bankAccount" role="tabpanel">
            <h2 className="text-center"> Bank Accounts </h2>
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#addBankCard">
              <i className="mdi mdi-plus" />
              Add Bank Account</button>
            <div className="row">
              <div className="col-md-3 col-xs-12 filter debit">
                <div className="cards-thumbnail  bg-gradient-danger card-img-holder text-white thumbnail">
                  <h4> Jude Jonathan</h4>
                  <h6>303030303030</h6>
                  <p>Skye Bank</p>
                  <button type="button" className="btn pull-right btn-gradient-danger btn-rounded btn-icon">
                    <i className="mdi mdi-delete" />
                  </button>
                </div>
              </div>
              <div className="col-md-3 col-xs-12 filter debit">
                <div className="cards-thumbnail   bg-gradient-info card-img-holder text-white thumbnail">
                  <h4> Jude Jonathan</h4>
                  <h6>303030303030</h6>
                  <p>Skye Bank</p>
                  <button type="button" className="btn pull-right btn-gradient-danger btn-rounded btn-icon">
                    <i className="mdi mdi-delete" />
                  </button>
                </div>
              </div>
              <div className="col-md-3 col-xs-12 filter debit">
                <div className="cards-thumbnail  bg-gradient-success card-img-holder text-white thumbnail">
                  <h4> Jude Jonathan</h4>
                  <h6>303030303030</h6>
                  <p>Skye Bank</p>
                  <button type="button" className="btn pull-right btn-gradient-danger btn-rounded btn-icon">
                    <i className="mdi mdi-delete" />
                  </button>
                </div>
              </div>
              <div className="col-md-3 col-xs-12 filter debit">
                <div className="cards-thumbnail   bg-gradient-info card-img-holder text-white thumbnail">
                  <h4> Jude Jonathan</h4>
                  <h6>303030303030</h6>
                  <p>Yes Bank</p>
                  <button type="button" className="btn pull-right btn-gradient-danger btn-rounded btn-icon">
                    <i className="mdi mdi-delete" />
                  </button>
                </div>
              </div>
              <div className="col-md-3 col-xs-12 filter debit">
                <div className="cards-thumbnail  bg-gradient-danger card-img-holder text-white thumbnail">
                  <h4> Jude Jonathan</h4>
                  <h6>303030303030</h6>
                  <p>SBI Bank</p>
                  <button type="button" className="btn pull-right btn-gradient-danger btn-rounded btn-icon">
                    <i className="mdi mdi-delete" />
                  </button>
                </div>
              </div>
              <div className="col-md-3 col-xs-12 filter debit">
                <div className="cards-thumbnail  bg-gradient-success card-img-holder text-white thumbnail">
                  <h4> Jude Jonathan</h4>
                  <h6>303030303030</h6>
                  <p>Access Bank</p>
                  <button type="button" className="btn pull-right btn-gradient-danger btn-rounded btn-icon">
                    <i className="mdi mdi-delete" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Payment Request */}
          <div className="tab-pane fade " id="paymentRequest" role="tabpanel">
            <h2 className="text-center"> Payment Requests</h2>
            <div className="row">
              <div className="card-col  col ">
                <div className="card-body border">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <h4 className="mb-0 font-weight-medium sendPayment" data-target="#requestsPAymentModal" data-toggle="modal" onclick="openSelectuser();">
                          <i className=" mdi mdi-check-circle text-success" />
                          Send payment requests</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-col col ">
                <div className="card-body border">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <h4 className="mb-0 font-weight-medium" data-target="#allPaymentRequestModal" data-toggle="modal" onClick={this.getMyRequest}>
                          <i className=" mdi mdi-check-circle text-success" />
                          All payment requests
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-col   col">
                <div className="card-body border">
                  <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                    <div className="wrapper text-center text-sm-left">
                      <div className="fluid-container">
                        <h4 className="mb-0 font-weight-medium" data-target="#settleRequestModal" data-toggle="modal"> <i className=" mdi mdi-check-circle text-success" />
                          Settle a requests</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
		
		
		 {/* Find Wallet in wayapay */}
        <div className="modal fade" id="airtimeTopupModal" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">Mobile Top-Up</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3">
                <i className="  mdi mdi-cellphone  text-primary mr-0 mr-sm-4 icon-lg">
                </i>
                <h4 className="text-danger">WayaWallet</h4>
                <p>Avail. Balance:<i className="  mdi mdi-currency-ngn " /> 15,81.00</p>
                <hr />
                <p>Recharge Data or Airtime from you Waya Wallet</p>
                <form className="pt-3">
                  <div className="form-group">
                    <label htmlFor="label-topup">Choose Top-Up</label>
                    <select id="label-topup" className="form-control ">
                      <option>Select</option>
                      <option>DATA Top</option>
                      <option>Airtime Topup</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="label-network">Choose Your Network</label>
                    <select id="label-network" className="form-control ">
                      <option>Select</option>
                      <option>MTN</option>
                      <option>GLO</option>
                      <option>Airtel</option>
                      <option>9 Mobile</option>
                    </select>
                  </div>
                  <div className="form-group hide " id="data">
                    <label htmlFor="label-dataplan">Choose Data Plan</label>
                    <select id="label-dataplan" className="form-control ">
                      <option>Select</option>
                      <option>5000</option>
                      <option>100</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="label-recharge">Enter a amount to Recharge</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">N</span>
                      </div>
                      <input type="text" className="form-control" aria-label="Enter a amount  to Recharge" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="label-recipient">Recipients Phone</label>
                    <input type="text" className="form-control form-control-lg" id="label-recipient" defaultValue="08xxxxxxxxx" placeholder="Recipients Phone" />
                  </div>
                  <p>For Security Reasons, Please enter Your Password</p>
                  <div className="form-group">
                    <input type="password" className="form-control form-control-lg" id="label-password" placeholder="Waya Wallet Password" />
                  </div>
                  <div className="mt-3">
                    <a className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" href="#">PURCHASE</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="gotvModal" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">GoTV</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3">
                <img src="assets/images/gotv.png" className="wayapayicon" />
                <h4 className="text-danger">Subscription</h4>
                <p>Avail. Balance: <i className="  mdi mdi-currency-ngn " /> 15,81.00</p>
                <hr />
                <p>Renew Your GoTV Subscription</p>
                <form className="pt-3">
                  <div className="form-group">
                    <label htmlFor="label-bouqet">Choose Bouqet</label>
                    <select id="label-bouqet" className="form-control ">
                      <option>Select</option>
                      <option>GoTv Value</option>
                      <option>GoTv Max</option>
                      <option>GoTv Plus</option>
                      <option>GoTv Lite Monthly</option>
                      <option>GoTv Lite Bouqet</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="label-plan">Plan Options</label>
                    <select id="label-plan" className="form-control ">
                      <option>Select</option>
                      <option>N 9600 - 2 Month</option>
                      <option>N 12800 - 3 Month</option>
                      <option>N 16000 - 4 Month</option>
                      <option>N 19200 - 5 Month</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="label-price">Price of Plan</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">N</span>
                      </div>
                      <input type="text" className="form-control" aria-label="Price of Plan" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="label-cardnoGotv">Card No or Customer No </label>
                    <input type="text" className="form-control form-control-lg" id="label-cardnoGotv" placeholder="e.g. 1234567890" />
                  </div>
                  <p>For Security Reasons, Please enter Your Password</p>
                  <div className="form-group">
                    <input type="password" className="form-control form-control-lg" id="label-password" placeholder="Waya Wallet Password" />
                  </div>
                  <div className="mt-3">
                    <a className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" href="#">PURCHASE</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="dstvModal" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">DsTV</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3">
                <img src="assets/images/dstv.jpg" className="wayapayicon" />
                <h4 className="text-danger">Subscription</h4>
                <p>Avail. Balance: <i className="  mdi mdi-currency-ngn " /> 15,81.00</p>
                <hr />
                <p>Renew Your DsTV Subscription</p>
                <form className="pt-3">
                  <div className="form-group">
                    <label htmlFor="label-dstvbouqet">Choose Bouqet</label>
                    <select id="label-dstvbouqet" className="form-control ">
                      <option>Select</option>
                      <option>DStv Access</option>
                      <option>DStv Family</option>
                      <option>DStv Compact</option>
                      <option>DStv Compact plus</option>
                      <option>DStv Premium</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="label-dstvplan">Plan Options</label>
                    <select id="label-dstvplan" className="form-control ">
                      <option>Select</option>
                      <option>N 9600 - 2 Month</option>
                      <option>N 12800 - 3 Month</option>
                      <option>N 16000 - 4 Month</option>
                      <option>N 19200 - 5 Month</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="label-price">Price of Plan</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">N</span>
                      </div>
                      <input type="text" className="form-control" aria-label="Price of Plan" placeholder={0.00} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="label-cardnodstv">Card No or Customer No </label>
                    <input type="text" className="form-control form-control-lg" id="label-cardnodstv" placeholder="e.g. 1234567890" />
                  </div>
                  <p>For Security Reasons, Please enter Your Password</p>
                  <div className="form-group">
                    <input type="password" className="form-control form-control-lg" id="label-password" placeholder="WayaWallet Password" />
                  </div>
                  <div className="mt-3">
                    <a className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" href="#">PURCHASE</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="startimeModal" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">Star Times</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3">
                <h4 className="text-danger">Subscription</h4>
                <p>Avail. Balance: <i className="  mdi mdi-currency-ngn " /> 15,81.00</p>
                <hr />
                <p>Renew Your Star Times Subscription</p>
                <form className="pt-3">
                  <div className="form-group">
                    <label htmlFor="label-price">Amount</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">N</span>
                      </div>
                      <input type="text" className="form-control" aria-label="Price of Plan" placeholder={0.00} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="label-cardnostartime">Card No or Customer No </label>
                    <input type="text" className="form-control form-control-lg" id="label-cardnodstvstartime" placeholder="e.g. 1234567890" />
                  </div>
                  <p>For Security Reasons, Please enter Your Password</p>
                  <div className="form-group">
                    <input type="password" className="form-control form-control-lg" id="label-startimepassword" placeholder="WayaWallet Password" />
                  </div>
                  <div className="mt-3">
                    <a className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" href="#">PURCHASE</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="electricityModal" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">Electricity</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3">
                <h4 className="text-danger">Subscription</h4>
                <p>Avail. Balance: <i className="  mdi mdi-currency-ngn " /> 15,81.00</p>
                <hr />
                <p>Renew Your Electricity Bill here</p>
                <form className="pt-3">
                  <div className="form-group">
                    <label htmlFor="label-cardnoelectricity">Account / Meter Number </label>
                    <input type="text" className="form-control form-control-lg" id="label-cardnoelectricity" placeholder="e.g. 1234567890" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="label-priceEle">Amount</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">N</span>
                      </div>
                      <input type="text" className="form-control" aria-label="Price of Plan" placeholder={0.00} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="label-supplierEle">Supplier </label>
                    <select id="label-dstvplan" className="form-control ">
                      <option>Select</option>
                      <option>Lkeja Electric Disco (Prepaid Accounts)</option>
                      <option>Lkeja Electric Disco (Post Accounts)</option>
                      <option>lbadan Electric Disco (Prepaid Accounts)</option>
                    </select>
                  </div>
                  <p>For Security Reasons, Please enter Your Password</p>
                  <div className="form-group">
                    <input type="password" className="form-control form-control-lg" id="label-startimepassword" placeholder="WayaWallet Password" />
                  </div>
                  <div className="mt-3">
                    <a className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" href="#">PURCHASE</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="fundWalletModal" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">TopUp via Card</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3">
                <div className="form-group">
                  <label htmlFor="label-bankcard">BankCard</label>
                  <select id="label-bankcard" className="form-control ">
                    <option>BankCard 11111111</option>
                    <option>BankCard 11111111</option>
                    <option>BankCard 11111111</option>
                    <option>BankCard 11111111</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="label-price">Topup Amount</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">N</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Topup Amount" placeholder={0.00} />
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button className="btn btn-primary">Top-up Wallet</button>
              </div>
            </div>
          </div>
        </div>
        {/* Pay Merchant in wayapay */}
        <div className="modal fade" id="payMerchantModal" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">Pay Merchant</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3">
                <div className="card card-statistics">
                  <div className="row">
                    <div className="card-col   col-md-6 col-6 border-right">
                      <div className="card-body">
                        <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                          <i className=" mdi mdi-currency-usd  text-primary mr-0 mr-sm-4 icon-lg" />
                          <div className="wrapper text-center text-sm-left">
                            <div className="fluid-container">
                              <h4 className="mb-0 font-weight-medium">Scan to Pay</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-col   col-md-6 col-6 border-right">
                      <div className="card-body">
                        <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                          <i className=" mdi mdi-account  text-primary mr-0 mr-sm-4 icon-lg" />
                          <div className="wrapper text-center text-sm-left">
                            <div className="fluid-container">
                              <h4 className="mb-0 font-weight-medium">Pay via Phone</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Receive Money in wayapay */}
        <div className="modal fade" id="receiveMoneyModal" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">Receive Money</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3">
                <div className="card card-statistics">
                  <div className="row">
                    <div className="card-col   col-md-6 col-6 border-right">
                      <div className="card-body">
                        <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                          <i className=" mdi mdi-currency-usd  text-primary mr-0 mr-sm-4 icon-lg" />
                          <div className="wrapper text-center text-sm-left">
                            <div className="fluid-container">
                              <h4 className="mb-0 font-weight-medium">Payment Request</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-col   col-md-6 col-6 border-right">
                      <div className="card-body">
                        <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                          <i className=" mdi mdi-account  text-primary mr-0 mr-sm-4 icon-lg" />
                          <div className="wrapper text-center text-sm-left">
                            <div className="fluid-container">
                              <h4 className="mb-0 font-weight-medium">QR Code</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Receive Money in wayapay */}
        <div className="modal fade" id="retrievePaymentModal" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">Retrieve Payment</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3">
                <p>
                  You can retrive payment using code sent to a Waya User phone number here.
                </p>
                <form>
                  <div className="form-label-group">
                    <input type="text" className="form-control form-control-lg" id="label-mnumber" placeholder="Mobile Number" />
                    <label htmlFor="label-mnumber">Mobile Number</label>
                  </div>
                  <div className="form-label-group">
                    <input type="text" className="form-control form-control-lg" id="label-pcode" placeholder="Payment Code" />
                    <label htmlFor="label-pcode">payment Code</label>
                  </div>
                  <div className="form-label-group">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>
                            <span style={{fontSize: '10px'}}>Amount to Retrieve</span>
                            <h2>N</h2>
                          </td>
                          <td>
                            <h2>0.00</h2>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Charge: N20.00
                          </td>
                          <td>
                            Total: N20.0
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </form>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button className="btn btn-gradient-success btn-lg btn-block">Retrieve NGN 0.00 from</button>
              </div>
            </div>
          </div>
        </div>
        {/* Receive Money in wayapay */}
		
        <div className="modal fade" id="paymentRequestModal" tabIndex={-1} style={{zIndex: 1111}} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">Receive Money</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3">
                <div className="card card-statistics">
                  <div className="row">
                    <div className="card-col   col-md-4 col-6 border-right">
                      <div className="card-body">
                        <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                          <i className=" mdi mdi-send  text-primary mr-0 mr-sm-4 icon-lg" />
                          <div className="wrapper text-center text-sm-left">
                            <div className="fluid-container">
                              <h4 className="mb-0 font-weight-medium">Send</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-col   col-md-4 col-6 border-right">
                      <div className="card-body">
                        <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                          <i className="  mdi mdi-currency-usd   text-primary mr-0 mr-sm-4 icon-lg" />
                          <div className="wrapper text-center text-sm-left">
                            <div className="fluid-container">
                              <h4 className="mb-0 font-weight-medium">Settle</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-col   col-md-4 col-6 border-right">
                      <div className="card-body">
                        <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                          <i className="  mdi mdi-bell   text-primary mr-0 mr-sm-4 icon-lg" />
                          <div className="wrapper text-center text-sm-left">
                            <div className="fluid-container">
                              <h4 className="mb-0 font-weight-medium">View All</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Search People*/}
        <div className="modal fade" id="searchpeopleModal" tabIndex={1} style={{zIndex: 2222}} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content  ">
              <div className="modal-header text-center">
                <button type="button" className="btn btn-outline-primary btn-icon-text btn-sm btn-block" data-toggle="modal" data-target="#addPhoneNo">
                  <i className="mdi mdi-plus btn-icon-prepend" /> Add Phone Number </button>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3 template-demo">
                <div id="custom-search-input" className="contactlist ">
                  <div className="input-group col-md-12">
                    <input id="contactsearch" onChange={this.handleInputChange.bind(this)} type="text" className="form-control input-lg" placeholder="Search Name/WayaID.." />
                    <span className="input-group-btn">
                      <button className="btn btn-primary btn-lg" type="button" onClick={this.searchUser}>
                        <i className="mdi mdi-account-search" />
                      </button>
                    </span>
                  </div>
                </div>
                <div className="full-width-tabs">
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                      <a className="nav-link active" onClick={this.getAllUsers} id="home-tab" data-toggle="tab" href="#Wayauser" role="tab" aria-controls="home" aria-selected="true">Waya Users</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" id="profile-tab" data-toggle="tab" href="#phoneContact" role="tab" aria-controls="profile" aria-selected="false">Phone Contacts</a>
                    </li>
                  </ul>
                  <div className="tab-content contactlist" style={{maxHeight: '350px', overflow: 'scroll'}}>
                    <div className="tab-pane fade active show" id="Wayauser" role="tabpanel" aria-labelledby="home-tab">
                      <div className="media">
                        <div className="media-body">
                          <ul className="list-group">
						  
						  
						 
						  {ReactHtmlParser(this.state.user_list)}
							
                            
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="phoneContact" role="tabpanel" aria-labelledby="profile-tab">
                      <div className="media">
                        <div className="media-body">
                          <ul className="list-group">
                            <li className="contact list-group-item">
                              <div className="row">
                                <div className="col col-md-2">
                                  <div className="btn-primary btn btn-social-icon btn-google btn-rounded">
                                    <p className="mt-2">DJ</p>
                                  </div>
                                </div>
                                <div className="col">
                                  <h4 className="name m-0">Disha Jonathan</h4>
                                  <small>0123456789</small>
                                </div>
                              </div>
                            </li>
                            <li className="contact list-group-item">
                              <div className="row">
                                <div className="col col-md-2">
                                  <div className="btn-primary btn btn-social-icon btn-google btn-rounded">
                                    <p className="mt-2">DJ</p>
                                  </div>
                                </div>
                                <div className="col">
                                  <h4 className="name m-0">Daniel Jonathan</h4>
                                  <small>0123456789</small>
                                </div>
                              </div>
                            </li>
                            <li className="contact list-group-item">
                              <div className="row">
                                <div className="col col-md-2">
                                  <div className="btn-primary btn btn-social-icon btn-google btn-rounded">
                                    <p className="mt-2">YS</p>
                                  </div>
                                </div>
                                <div className="col">
                                  <h4 className="name m-0">Yashesh Chudasama</h4>
                                  <small>0123456789</small>
                                </div>
                              </div>
                            </li>
                            <li className="contact list-group-item">
                              <div className="row">
                                <div className="col col-md-2">
                                  <div className="btn-primary btn btn-social-icon btn-google btn-rounded">
                                    <p className="mt-2">N</p>
                                  </div>
                                </div>
                                <div className="col">
                                  <h4 className="name m-0">Niraj</h4>
                                  <small>0123456789</small>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="addPhoneNo" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content  ">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">Add Phone Number Not on WAYA</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3 template-demo">
                <div className="form-label-group">
                  <input type="text" className="form-control" id="label-mnumber" placeholder="Mobile Number" />
                  <label htmlFor="label-mnumber">Mobile Number</label>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button className="btn btn-gradient-danger btn-sm ">Cancel</button>
                <button className="btn btn-gradient-primary btn-sm ">Confirm</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="requestsPAymentModal" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content  ">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">Request Payment</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3 template-demo">
                <div className="form-label-group text-center">
                  <button className="btn bg-gradient-success btn-sm " data-target="#searchpeopleModal" onClick={this.getAllUsers} data-toggle="modal">Select
                    USer</button>
                </div>
				<div className="form-label-group">
				{this.state.selected_uname}
                  
                </div>
                <div className="form-label-group">
				
                  <input type="text" className="form-control" id="label-enterAmount" placeholder="Enter Amount" />
                  <label htmlFor="label-enterAmount">Enter Amount</label>
                </div>
                <div className="form-label-group">
                  <textarea rows={8} className="form-control" placeholder="Note" id="paynote" defaultValue={""} />
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button onClick={this.send_payment.bind(this)} className="btn btn-primary btn-block ">Send Payment Request1</button>
              </div>
            </div>
          </div>
        </div>
        {/*Withdraw money*/}
        <div className="modal fade" id="withdrawMoney" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content  ">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">Balance Withdraw</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3 template-demo">
                <p className>Receive Bank Account</p>
                <div className="form-group">
                  <label htmlFor="label-plan">Choose a Bank Account</label>
                  <select id="label-plan" className="form-control ">
                    <option>select</option>
                    <option>skye Bank: 333333333</option>
                    <option>skye Bank: 333333333</option>
                    <option>skye Bank: 333333333</option>
                    <option>skye Bank: 333333333</option>
                  </select>
                </div>
                <span className="text-muted">Select Account to Receive Withdraw</span>
                <br /><br />
                <table style={{width: '100%'}}>
                  <tbody>
                    <tr>
                      <td>
                        <span>Withdraw Amount</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">N</span>
                          </div>
                          <input type="text" className="form-control" aria-label="Price of Plan" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-3">
                  <a className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" href="#">Withdraw
                    to Bank Account</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="withdrawModal" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content  ">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">Top-UP via card</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3 template-demo">
                <h2 className="text-center"> Balance Withdraw</h2>
                <p className>Receive Bank Account</p>
                <div className="form-group">
                  <label htmlFor="label-plan">Choose a Bank Account</label>
                  <select id="label-plan" className="form-control ">
                    <option>select</option>
                    <option>Bank card 1234556</option>
                    <option>Bank card 1234556</option>
                    <option>Bank card 1234556</option>
                  </select>
                </div>
                <span className="text-muted">Select Account to Receive Withdraw</span>
                <br /><br />
                <table style={{width: '100%'}}>
                  <tbody>
                    <tr>
                      <td>
                        <span>Withdraw Amount</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">N</span>
                          </div>
                          <input type="text" className="form-control" aria-label="Price of Plan" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-3">
                  <a className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" href="#">Withdraw
                    to Bank Account</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="allPaymentRequestModal" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content  ">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">All Payment Request</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3 template-demo">
                <div className="full-width-tabs">
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                      <a className="nav-link active" id="home-tab" data-toggle="tab" href="#requestsent" role="tab" aria-controls="home" aria-selected="true">Requests Sent to me</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" id="profile-tab" data-toggle="tab" href="#myrequest" role="tab" aria-controls="profile" aria-selected="false">My Requests</a>
                    </li>
                  </ul>
				  
                  <div className="tab-content contactlist" style={{maxHeight: '350px', overflow: 'scroll'}}>
                    <div className="tab-pane fade" id="myrequest" role="tabpanel" aria-labelledby="home-tab">
                      <div className="media">
                        <div className="media-body">
                          <ul className="list-group">
						  
						  
						  {ReactHtmlParser(this.state.myrequest)}
							
							
                            
                          </ul>
                        </div>
                      </div>
                    </div>
					{/*REQUEST SENT*/}
                    <div className="tab-pane fade show active" id="requestsent" role="tabpanel" aria-labelledby="profile-tab">
                      <div className="media">
                        <div className="media-body">
                          <ul className="list-group">
						  
						   {ReactHtmlParser(this.state.requestsenttome)}

						  
							
                            
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Settle Payment Request*/}
        <div className="modal fade" id="settleRequestModal" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content  ">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">Settle Payment Request</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3 template-demo">
                <div className="form-group">
                  <label htmlFor="payment_request_code">Payment Request Code</label>
                  <input type="text"  onChange={this.handleInputChange.bind(this)} className="form-control form-control-lg" id="payment_request_code" placeholder="Payment Request Code" />
                </div>
                <div className="form-group">
                  <button type="button" onClick={this.settlePayment.bind(this)} className="btn btn-primary btn-block "> Check</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*QRCODE Scanner*/}
        <div className="modal fade" id="QRCodeS" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">QR Code Scanner</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3 text-center">
                <img src="assets/images/barcode.jpg" className="img-responsive" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary btn-block "> SCAN QR CODE</button>
              </div>
            </div>
          </div>
        </div>
        {/*Receive Money*/}
        <div className="modal fade" id="receiveMoneyQR" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">Receive Money</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3">
                <div className="form-group">
                  <label htmlFor="label-price">Enter Amount</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">N</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Price of Plan" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="label-price">Transaction Ref</label>
                  <div className="input-group">
                    <input type="text" className="form-control" aria-label="Price of Plan" placeholder="Transaction Ref" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary btn-block " data-toggle="modal" data-target="#QRCodesRscan">
                  Generate payment Code</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="QRCodesRscan" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">Scan to Pay</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3 text-center">
                <img src="assets/images/barcode.jpg" className="img-responsive" />
                <br /><br />
                <p>Scan the above Code to pay N100</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-gradient-success"> Done</button>
              </div>
            </div>
          </div>
        </div>
		

 {/* Add Card*/}
        <div className="modal fade" id="addCard" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">Add Card </h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3">
                {/* CREDIT CARD FORM STARTS HERE */}
                <div className="panel panel-default credit-card-box">
                  <div className="panel-body">
                      <div className="row">
                        <div className="col-md-12">
                          
                          <div className="form-label-group">
                            <input type="text" className="form-control form-control-lg" name="card_number" value={this.state.card_number} id="card_number" onChange={this.handleInputChange.bind(this)}  placeholder="Valid Card Number" autoComplete="cc-number" required autofocus />
                            <label htmlFor="card_number">CARD NUMBER</label>
                            <span className="input-group-addon"><i className="fa fa-credit-card" /></span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xs-7 col-md-7">
                          <div className="form-label-group">
                            <input type="text" className="form-control" name="expiry_month" value={this.state.expiry_month}  id="expiry_month" onChange={this.handleInputChange.bind(this)} placeholder="Expiry Month" autoComplete="cc-exp" required />
                            <label htmlFor="expiry_month">Expiry Month</label>
                          </div>
                        </div>
                        <div className="col-xs-5 col-md-5 pull-right">
                          <div className="form-label-group">
                            <input type="text" className="form-control" name="expiry_year" value={this.state.expiry_year} id="expiry_year" onChange={this.handleInputChange.bind(this)} placeholder="Expiry Year" required />
                            <label htmlFor="expiry_year">Expiry Year</label>
                          </div>
                        </div>
                        <div className="col-xs-12 col-md-12 pull-right">
                          <div className="form-label-group">
                            <input type="text" className="form-control" name="cvv" value={this.state.cvv} id="cvv" placeholder="CVC" onChange={this.handleInputChange.bind(this)} autoComplete="cc-csc" required />
                            <label htmlFor="cvv">CVV</label>
                          </div>
                          <a className="text-muted" data-toggle="tooltip" data-placement="right" title data-original-title="Basic tooltip">What is CVV?</a>
                        </div>
                      </div>
                      <div className="row" style={{display: 'none'}}>
                        <div className="col-xs-12">
                          <p className="payment-errors" />
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button className="btn btn-gradient-primary btn-lg " onClick={this.addCard}>Add Card</button>
              </div>
            </div>
          </div>
        </div>
        {/* Add Bank Account*/}
        <div className="modal fade" id="addBankCard" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold">Add Card </h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3">
                {/* CREDIT CARD FORM STARTS HERE */}
                <div className="panel panel-default credit-card-box">
                  <div className="panel-body">
                    <form>
                      <div className="form-group">
                        <label htmlFor="label-plan">Choose Bank</label>
                        <select id="label-plan" className="form-control ">
                          <option>Bank1</option>
                          <option>Bank1</option>
                          <option>Bank1</option>
                          <option>Bank1</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="label-AccountNumber">Account Number </label>
                        <input type="text" className="form-control form-control-lg" id="label-AccountNumber" placeholder="Account Number" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="label-AccountNumber">Account Name </label>
                        <input type="text" className="form-control form-control-lg" id="label-AccountName" placeholder="Account Name" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="label-bankpassword">Password </label>
                        <input type="text" className="form-control form-control-lg" id="label-bankpassword" placeholder="Password" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button className="btn btn-gradient-primary btn-lg ">Add Bank Account</button>
              </div>
            </div>
          </div>
        </div>
		
		<div className="modal fade" id="errormodel" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 id="errormessage" className="modal-title w-100 font-weight-bold"></h4>
                <button type="button"  className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
				</div>
				</div>
				</div>
				</div>

      </div>
    );
  }
}
 
export default Payment;

