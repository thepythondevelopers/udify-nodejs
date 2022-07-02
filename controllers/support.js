const db = require("../models");
const Support = db.support;
const User = db.user;
const Account = db.account;
const Op = db.Sequelize.Op;
const {validationResult} = require("express-validator");
const { v4: uuidv4 } = require('uuid');
const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.createSupport = async (req,res)=>{
  
  
  if(req.files!=null){
    files = req.files;
    array_file =[];
    for(const file of files) {
      //return res.json(file);
      array_file.push(file.filename);
    }
    array_file = JSON.stringify(array_file);
    
  }else{
    
    array_file = null;
  }
  
  // const errors = validationResult(req);
  // if(!errors.isEmpty()){
  //     return res.status(402).json({
  //         error : errors.array()
  //     })
  // }
  email = req.user!=null ? req.user.email : req.body.email;
  
  user_id  = req.user!=null ? req.user.id : '';
  guid = uuidv4();
  guid = guid.replace(/-/g,""); 
  content =  {  
    id : guid,
    user_id : user_id,
    parent_id : 0,
    message : req.body.message,
    name : req.body.name,
    subject : req.body.subject,
    email : email,
    user_read : 1,
    admin_read : 1,
    file : array_file,
    category : req.body.category
  }
  
  await Support
      .create(content)
  .then(async data => {
    try {
      await sendGridMail.send(create_support_email(req,guid));
      res.send({message:"Support Ticket Generated Successfully",
      ticket_id : guid
    });
    } catch (error) {
      res.status(500).send({
        message:
          error.message || "Some error occurred while generating reset password."
      });
      
    }

    
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while saving."
    });
  });   
}

exports.replyTicketSupport = async (req,res)=>{
  parent_id = req.params.parent_id;
  const errors = validationResult(req);
  // if(!errors.isEmpty()){
  //     return res.status(402).json({
  //         error : errors.array()
  //     })
  // }
  guid = uuidv4();
  guid = guid.replace(/-/g,""); 
  content =  {  
    id : guid,
    user_id : req.user.id,
    parent_id : parent_id,
    message : req.body.message,
    status : req.body.status,
    user_read : 1,
    admin_read : 1
  }
  
  await Support
      .create(content)
  .then(data => {
    res.send({message:"Support Ticket Reply Successfully"});
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while saving."
    });
  });   
}


exports.replyTicketSupportUser = async (req,res)=>{
  parent_id = req.params.parent_id;
  const errors = validationResult(req);
  
  guid = uuidv4();
  guid = guid.replace(/-/g,""); 
  content =  {  
    id : guid,
    user_id : req.user.id,
    parent_id : parent_id,
    message : req.body.message,
    
    user_read : 1,
    admin_read : 1
  }
  
  await Support
      .create(content)
  .then(data => {
    res.send({message:"Support Ticket Reply Successfully"});
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while saving."
    });
  });   
}


exports.getTicket = (req, res) => {
  Support.findOne({ where: {
      id : req.params.id
  },
  include: [{
    model: Support,
    as: 'reply',
    include: [{
      model: User,
    attributes: [ 'first_name', 'last_name', 'email']
    },
    {
      model: Account,
      attributes: [ 'avatar']
    }
  ]
    
  },
  {
    model: User,
    attributes: [ 'first_name', 'last_name', 'email']
},
{
  model: Account,
  attributes: [ 'avatar']
}
],
   })
    .then(data => {
      if(data===null){
        res.json({message:"No Ticket Found."})
      }else{
        res.send(data);
      }
      
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving."
      });
    });
};


exports.getAllTicket = (req,res)=>{
  Support.findAll({ where: {
    user_id : req.user.id
    },
    include: [
    {
      model: User,
      attributes: [ 'first_name', 'last_name', 'email']
  },
  {
    model: Account,
    attributes: [ 'avatar']
  }
  ]
 })
  .then(data => {   
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving."
    });
  }); 
}

exports.getAllTicketAdmin = (req,res)=>{
  Support.findAll({
    include: [
      {
        model: User,
        attributes: [ 'first_name', 'last_name', 'email']
    },
    {
      model: Account,
      attributes: [ 'avatar']
    }
    ]
  })
  .then(data => {   
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving."
    });
  }); 
}

exports.getTicketNotificationAdmin = (req,res)=>{
  Support.findAll({where:{
    admin_read : 1
  }})
  .then(data => {   
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving."
    });
  }); 
}

exports.getTicketNotificationUser = (req,res)=>{
  Support.findAll({where:{
    user_read : 1
  }})
  .then(data => {   
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving."
    });
  }); 
}


exports.readNotificationAdmin = (req,res)=>{
  const id = req.params.id;
  Support.update(
    {admin_read : 0},
    { where: { id: req.params.id } }
  )
  .then(data => {
    res.send({message : "Notification Read"});
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while updating Integration."
    });
  });   
}

exports.readNotificationUser = (req,res)=>{
  const id = req.params.id;
  Support.update(
    {user_read : 0},
    { where: { id: req.params.id, user_id:req.user.id } }
  )
  .then(data => {
    res.send({message : "Notification Read"});
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while updating Integration."
    });
  });   
}

exports.ticketClosed = (req,res)=>{
  const id = req.params.id;
  closed_by = req.closed_by!=null ? req.closed_by : 'user';
  Support.update(
    {closed_by : closed_by,closed_at:Date.now(),status:'Closed'},
    { where: { id: req.params.id,status: {[Op.not]:'Closed'} } }
  )
  .then(data => {
    
    if(data==0){
      res.send({message : "Either Ticket is not found or it's status is closed."});  
    }else{
      res.send({message : "Ticket Closed Successfully."});
    }
    
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while updating Integration."
    });
  });   
}


exports.forgotTicketId = (req,res)=>{
  if(req.body.status=='all'){
    $query = Support.findAll({where:{
      email : req.body.email
    },attributes: ['id']});
  }else{
    $query = Support.findAll({where:{
      email : req.body.email,
      status : req.body.status
    },attributes: ['id']});
  }
  $query
  .then(async data => {   
    
    if(data.length===0){
      res.json({message:"No Ticket Found with this Email id."})
    }
    try {
      await sendGridMail.send(forgot_email_ticket(req,data));
      res.send({message:"Ticket Details has been send to this email id.",
      
    });
    } catch (error) {
      res.status(500).send({
        message:
          error.message || "Some error occurred while generating reset password."
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving."
    });
  });   
}



function create_support_email(req,ticket_id) {
  const body = `<!DOCTYPE html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
      <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <meta name="viewport" content="width=device-width"> 
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="x-apple-disable-message-reformatting"> 
      <title></title> 
  
      <link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700" rel="stylesheet">
  </head>
  <style>
  
          html,
  
  h1,h2,h3,h4,h5,h6{
      font-family: 'Poppins', sans-serif;
      color: #000000;
      margin-top: 0;
      font-weight: 600;
  }
  
  </style>
  <body width="100%" style="font-family: 'Poppins', sans-serif;
      font-weight: 400;font-size: 16px;line-height: 1.8;color:#555555;margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1; width: 100%;">
      <center style="width: 100%; background-color: #f1f1f1;">
      <div style="width: 100%; margin: 0 auto; background: #F7F9FD;" class="email-container">
        <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
            <tr>
            <td valign="top" style="padding: 1em 2.5em 0 2.5em;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td class="logo" style="text-align: center;">
                          <a href="#"><img src="https://udifyapi.pamsar.com/uploads/email/logo.png" width="200" height="50" alt="alt_text" border="0" /></a>
                        </td>
                    </tr>
                </table>
            </td>
            </tr>
            
                  <tr>
            <td valign="middle" class="hero" style="padding: 2em 0 2em 0;">
              <table role="presentation" border="0" cellpadding="40" cellspacing="0" width="100%">
                        
                            <tr class="text-inner" background="https://udifyapi.pamsar.com/uploads/email/bg.png" style="border: none;max-width: 100%;
      margin: 0 auto;  padding: 2em;background-size: contain;  background-color:#fff;background-image: url(https://udifyapi.pamsar.com/uploads/email/bg.png);">
      <td width="">
                          <h1 style="text-align: center;">Support</h1>
                          <p>Hello ${req.body.email} ,</p>
              <p>Your ticket has been raised and ticket id : ${ticket_id}</p>
              <p>Thanks</p>
                              </td>
                             </tr>                     
                     
              </table>
      </td>
            </tr>
        </table>
        <table class="footer" align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
              
          <tr>
            <td class="" style="text-align: center; padding: 0 7%;">
                
  <p style="font-size:12px;">© Copyright 2022 Udify.io. All rights reserved.</p>
            </td>
          </tr>
        </table>
  
      </div>
    </center>
  </body>
  </html>`;
  return {
    to: req.body.email,
    from: process.env.SENDGRID_FROM_ADDRESS,
    subject: 'Support',
    text: body,
    html: `${body}`,
  };
}

function forgot_email_ticket(req,data) {
  const body = `<!DOCTYPE html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
      <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <meta name="viewport" content="width=device-width"> 
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="x-apple-disable-message-reformatting"> 
      <title></title> 
  
      <link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700" rel="stylesheet">
  </head>
  <style>
  
          html,
  
  h1,h2,h3,h4,h5,h6{
      font-family: 'Poppins', sans-serif;
      color: #000000;
      margin-top: 0;
      font-weight: 600;
  }
  
  </style>
  <body width="100%" style="font-family: 'Poppins', sans-serif;
      font-weight: 400;font-size: 16px;line-height: 1.8;color:#555555;margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1; width: 100%;">
      <center style="width: 100%; background-color: #f1f1f1;">
      <div style="width: 100%; margin: 0 auto; background: #F7F9FD;" class="email-container">
        <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
            <tr>
            <td valign="top" style="padding: 1em 2.5em 0 2.5em;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td class="logo" style="text-align: center;">
                          <a href="#"><img src="https://udifyapi.pamsar.com/uploads/email/logo.png" width="200" height="50" alt="alt_text" border="0" /></a>
                        </td>
                    </tr>
                </table>
            </td>
            </tr>
            
                  <tr>
            <td valign="middle" class="hero" style="padding: 2em 0 2em 0;">
              <table role="presentation" border="0" cellpadding="40" cellspacing="0" width="100%">
                        
                            <tr class="text-inner" background="https://udifyapi.pamsar.com/uploads/email/bg.png" style="border: none;max-width: 100%;
      margin: 0 auto;  padding: 2em;background-size: contain;  background-color:#fff;background-image: url(https://udifyapi.pamsar.com/uploads/email/bg.png);">
      <td width="">
                          <h1 style="text-align: center;">Forgot Email Ticket</h1>
                          <p>Hello ${req.body.email} ,</p>

              <p>Below are the ticket details:-</p>
              ${data.map((d) => {
                return `<p>Ticket Id : ${d.id}</p>`
              })
            }
              <p>Thanks</p>
                              </td>
                             </tr>                     
                     
              </table>
      </td>
            </tr>
        </table>
        <table class="footer" align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
              
          <tr>
            <td class="" style="text-align: center; padding: 0 7%;">
                
  <p style="font-size:12px;">© Copyright 2022 Udify.io. All rights reserved.</p>
            </td>
          </tr>
        </table>
  
      </div>
    </center>
  </body>
  </html>`;
  return {
    to: req.body.email,
    from: process.env.SENDGRID_FROM_ADDRESS,
    subject: 'Forgot Email Ticket',
    text: body,
    html: `${body}`,
  };
}