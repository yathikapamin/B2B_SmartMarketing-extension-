// Simple test to check nodemailer
const nodemailer = require('nodemailer');

console.log('Nodemailer loaded:', typeof nodemailer);
console.log('createTransporter:', typeof nodemailer.createTransporter);
console.log('Nodemailer object keys:', Object.keys(nodemailer));
