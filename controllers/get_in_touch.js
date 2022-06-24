require('dotenv').config();
const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const {validationResult} = require("express-validator");

 

exports.getInTouch = async (req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error : errors.array()
        })
    }
    try {
        await sendGridMail.send(getInTouch_email(req));
        console.log('Test email sent successfully');
        res.send({message:'Email Send Successfully'});
      } catch (error) {
        res.status(500).send({
          message:
            error.message || "Some error occurred while generating reset password."
        });
        
      }
}    

function getInTouch_email(req) {
    const body = `<!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="utf-8">
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
        font-weight: 400;font-size: 16px;line-height: 1.8;color:#555555;margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;">
        <center style="width: 100%; background-color: #f1f1f1;">
        <div style="max-width: 100%; margin: 0 auto; background: #F7F9FD;" class="email-container">
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
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                          <td style="text-align:left;">
                          
                              <tr class="text-inner" background="https://udifyapi.pamsar.com/uploads/email/bg.png" style="border: none;max-width: 100%;
        margin: 0 auto; background-color:#fff;	padding: 2em;background-size: contain;">
        <td>
                            <h1 style="text-align: center;">Get In Touch</h1>
                            <p><strong>First Name:</strong>${req.body.first_name}</p>
                <p><strong>Last Name:</strong>${req.body.last_name}</p>
                <p><strong>Email:</strong>${req.body.email}</</p>
                <p><strong>Supplier:</strong>${req.body.supplier}</</p>
                <p><strong>State:</strong>${req.body.state}</</p>
                                <td>
                               </tr>
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
      to: 'admin@yopmail.com',
      from: process.env.SENDGRID_FROM_ADDRESS,
      subject: 'Get In Touch',
      text: body,
      html: `${body}`,
    };
  }