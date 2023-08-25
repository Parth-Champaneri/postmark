// init.js
const { Pool } = require('pg');
const postmark  = require('postmark');
const EmailsService = require('./services/EmailService');
const EmailsDAO = require('./dao/EmailsDAO');
const TemplateService = require('./services/TemplateService');
const TemplatesDAO = require('./dao/TemplatesDAO');

let pool, emailsDAO, templatesDAO, postmarkClient, emailService,tempaltesService;

function initDatabase() {
    pool = new Pool({
        user: 'parthc',
        host: 'localhost',
        database: 'postmark',
        password: '',
        port: 5432,
    });
  emailsDAO = new EmailsDAO(pool);
  templatesDAO = new TemplatesDAO (pool);

}

function initPostmark() {
    // MY FIRST SERVER
    postmarkClient = new postmark.ServerClient('92b1f920-aadc-43b4-a4cc-649851511761');
}

function initServices() {
  emailService = new EmailsService(postmarkClient, emailsDAO);
  tempaltesService = new TemplateService(postmarkClient,templatesDAO);
}

async function init() {
    initDatabase();
    initPostmark();
    initServices();
}

module.exports = { init, getEmailService: () => emailService, getTemplateService: ()=> tempaltesService };