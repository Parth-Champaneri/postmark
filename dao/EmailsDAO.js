const { Pool } = require('pg');

class EmailsDAO {
    constructor(pool) {
        this.pool = pool;
    }

    async saveSentEmail(userId, emailVersionId, postmarkMessageId, saveSentEmail) {
        const client = await this.pool.connect();
        try {
          const insertQuery = 'INSERT INTO sent_emails(user_id, email_version_id, postmark_message_id, submitted_at) VALUES($1, $2, $3, $4)';
          const values = [userId, emailVersionId, postmarkMessageId, saveSentEmail];
          await client.query(insertQuery, values);
          console.log(`Email sent to user with ID: ${userId} logged successfully.`);
        } catch (error) {
          console.error('Error logging sent email: ', error);
          throw error; 
        } finally {
          client.release();
        }
      }

      async saveEmailEvent(sentEmailId, eventType, eventTime) {
        const client = await this.pool.connect();
        try {
          const insertQuery = 'INSERT INTO email_events(sent_email_id, event_type, event_time) VALUES($1, $2, $3)';
          const values = [sentEmailId, eventType, eventTime];
          await client.query(insertQuery, values);
          console.log(`Email event for sent email with ID: ${sentEmailId} logged successfully.`);
        } catch (error) {
          console.error('Error logging email event: ', error);
          throw error; 
        } finally {
          client.release();
        }
      }
}
module.exports = EmailsDAO;
