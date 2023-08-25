const Mustache = require('mustache');

class EmailService {
    constructor(postmarkClient, emailsDAO) {
        this.postmarkClient = postmarkClient;
        this.emailsDAO = emailsDAO;
    }
    async sendEmail(from, to, template, emailVersionId, model) {
        try {
          const userId = 2;
    
          const response = await this.postmarkClient.sendEmail({
            From: from,
            To: to,
            Subject: Mustache.render(template.subject, model),
            HtmlBody: Mustache.render(template.email_content, model),
            TextBody: Mustache.render(template.textbody, model),
          });
    
          await this.emailsDAO.saveSentEmail(userId, emailVersionId, response.MessageID, response.SubmittedAt);
          console.log(`Email sent successfully to ${to}`);
        } catch (error) {
          console.error('Error sending email:', error);
          throw error; 
        }
      } 

      async saveEmailEvent(sentEmailId, eventType, eventTime) {
        try {
          await this.emailsDAO.saveEmailEvent(sentEmailId, eventType, eventTime);
          console.log(`Email event saved successfully for email ${sentEmailId}`);
        } catch (error) {
          console.error('Error saving email event:', error);
          throw error; 
        }
      }
}
module.exports = EmailService;