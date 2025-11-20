// Serverless function for Vercel/Netlify: /api/sendMail
// Uses Nodemailer + Gmail OAuth2. Requires env vars:
// GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_USER_EMAIL, RECAPTCHA_SECRET_KEY
const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const fetch = require('node-fetch');

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const USER_EMAIL = process.env.GMAIL_USER_EMAIL || 'atharv26101948@gmail.com';
const RECIPIENT_EMAIL = 'atharv26101948@gmail.com';
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  try{
    const {name,email,message,recaptchaToken} = req.body || {};
    if(!name || !email || !message) return res.status(400).json({error:'Missing fields'});
    // Verify reCAPTCHA if token present
    if(recaptchaToken){
      const sp = new URLSearchParams();
      sp.append('secret', RECAPTCHA_SECRET);
      sp.append('response', recaptchaToken);
      const r = await fetch('https://www.google.com/recaptcha/api/siteverify',{method:'POST',body:sp});
      const rd = await r.json();
      if(!rd.success) return res.status(400).json({error:'reCAPTCHA verification failed'});
    }
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN});
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service:'gmail',
      auth:{
        type:'OAuth2',
        user:USER_EMAIL,
        clientId:CLIENT_ID,
        clientSecret:CLIENT_SECRET,
        refreshToken:REFRESH_TOKEN,
        accessToken: accessToken && accessToken.token ? accessToken.token : accessToken
      }
    });
    const mailOptions = {
      from: `"Portfolio Contact" <${USER_EMAIL}>`,
      to: RECIPIENT_EMAIL,
      subject: `New message from ${name} (${email})`,
      text: `From: ${name} <${email}>\n\n${message}`,
      replyTo: email
    };
    await transport.sendMail(mailOptions);
    return res.status(200).json({success:true});
  }catch(err){
    console.error('sendMail error', err);
    return res.status(500).json({error:'Internal Server Error'});
  }
};
