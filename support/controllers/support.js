const User = require("../../models/user");
const Account = require("../../models/account");
const Support = require("../../models/support");
const {validationResult} = require("express-validator");
const { v4: uuidv4 } = require('uuid');
const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.createSupport = async (req,res)=>{
  
  
  if(req.files!=null){
    files = req.files;
    array_file =[];
    for(const file of files) {
      array_file.push(file.filename);
    }
    array_file = JSON.stringify(array_file);
    
  }else{    
    array_file = null;
  }
  
  
  email = req.user!=null ? req.user.email : req.body.email;
  
  user_id  = req.user!=null ? req.user._id : null;
  
  content =  {  
    
    message : req.body.message,
    name : req.body.name,
    subject : req.body.subject,
    email : email,
    user_read : 1,
    admin_read : 1,
    file : array_file,
    category : req.body.category
  }
  if( user_id != null){
    content.user_id = user_id;
}
  await Support
      .create(content)
  .then(async data => {
    try {
      await sendGridMail.send(create_support_email(req,data._id));
      res.send({message:"Support Ticket Generated Successfully",
      ticket_id : data._id
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
   
  content =  {  
    user_id : req.user._id,
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


exports.replyTicketSupportUser = async (req,res)=>{
  parent_id = req.params.parent_id;
  const errors = validationResult(req);
  
   
  content =  {  
    
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


exports.getTicket = async (req, res) => {

   main_ticket = await Support.findOne({_id : req.params.id});
   Support.find({parent_id : req.params.id}).populate({
    path: 'user_id', 
    select: ['first_name', 'last_name', 'email'], 
    populate: {
      path: 'account_id',
      model : "Account",
      select: ['avatar']
      
  }
  }).then(data => {
    res.json({
      ticket : main_ticket,
      reply : data
    });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while getting."
    });
  });
}


exports.getAllTicket = (req,res)=>{
  Support.find( { user_id : req.user._id,"parent_id":{"$exists":false}}).populate({
    path: 'user_id', 
    select: ['first_name', 'last_name', 'email'], 
    populate: {
      path: 'account_id',
      model : "Account",
      select: ['avatar']
      
  }
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
  Support.find( { user_id : req.user.id,"parent_id":{"$exists":false}}).populate({
    path: 'user_id', 
    select: ['first_name', 'last_name', 'email'], 
    populate: {
      path: 'account_id',
      model : "Account",
      select: ['avatar']
      
  }
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
  Support.find({
    admin_read : 1
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

exports.getTicketNotificationUser = (req,res)=>{
  Support.find({
    user_read : 1
  }).then(data => {   
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving."
    });
  }); 
}


exports.readNotificationAdmin = async (req,res)=>{
  const id = req.params.id;
await Support.findOneAndUpdate(
        {_id: req.params.id},
        {$set : {admin_read : 0}},
        {new: true},
        (err,support) => {
            if(err){
                return res.status(404).json({
                    error : err
                })
            
            }
    
            if(support===null){
                return res.status(404).json({
                    message : "Ticket Not Found."
                })
            }
    
            res.send({message : "Notification Read"});
        }
        )
}

exports.readNotificationUser = async (req,res)=>{
  const id = req.params.id;
  await Support.findOneAndUpdate(
    { _id: req.params.id, user_id:req.user._id},
    {$set : {user_read : 0}},
    {new: true},
    (err,support) => {
        if(err){
            return res.status(404).json({
                error : err
            })
        
        }

        if(support===null){
            return res.status(404).json({
                message : "Ticket Not Found."
            })
        }

        res.send({message : "Notification Read"});
    }
    )
}

exports.ticketStatusChange = async (req,res)=>{
  const id = req.params.parent_id;
  closed_by = req.body.closed_by!=null ? req.body.closed_by : 'user';
  
  await Support.findOneAndUpdate(
    { _id: req.params.parent_id, status: {$ne : 'Closed'} },
    {$set : {status_by : closed_by,status_at:Date.now(),status:req.body.status}},
    {new: true},
    (err,support) => {
        if(err){
            return res.status(404).json({
                error : err
            })
        
        }

        if(support===null){
            res.send({message : "Either Ticket is not found or it's status is closed."});
        }

        res.send({message : "Ticket Status Change Successfully."});
    }
    )   
}


exports.forgotTicketId = (req,res)=>{
  if(req.body.status=='all'){
    $query = Support.find({
      email : req.body.email
    }).select('_id');
  }else{
    $query = Support.find({
      email : req.body.email,
      status : req.body.status
    }).select('_id');
  }
  $query
  .then(async data => {   
    
    if(data.length===0){
      return res.json({message:"No Ticket Found with this Email id."})
    }
    try {
      await sendGridMail.send(forgot_email_ticket(req,data));
      return res.send({message:"Ticket Details has been send to this email id.",
      
    });
    } catch (error) {
      return res.status(500).send({
        message:
          error.message || "Some error occurred while generating reset password."
      });
    }
  })
  .catch(err => {
    return res.status(500).send({
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