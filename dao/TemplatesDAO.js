class TemplatesDAO {

    constructor(pool) {
        this.pool = pool;
    }

    async saveEmailType(newEmailType,postmark_template_id) {
        const client = await this.pool.connect();
        try {
            const insertQuery = 'INSERT INTO email_types(email_type, postmark_template_id) VALUES($1, $2)';
            const values = [newEmailType.email_type, newEmailType.postmark_template_id];
            const result = await client.query(insertQuery, values);
            if (result.rowCount === 0) {
            throw new Error('No rows were inserted'); // If no rows were inserted, throw an error
            }
            console.log(`Email type '${newEmailType.email_type}' with postmark template ID '${newEmailType.postmark_template_id}' saved successfully.`);
            return result;
        } catch (error) {
            console.error(`Error saving the email type: ${newEmailType.email_type}`, error);
            throw error;
        } finally {
            client.release();
        }
    }

    async saveEmailVersion(newVersion) {
        const client = await this.pool.connect();
        try {
            const insertQuery = 'INSERT INTO email_versions(email_type_id, email_content, subject, version_label, textbody) VALUES($1, $2, $3, $4, $5)';
            const values = [newVersion.email_type_id, newVersion.email_content, newVersion.subject, newVersion.version_label,newVersion.textbody];
            const result = await client.query(insertQuery, values);
            if (result.rowCount == 0) {
                throw new Error('No rows were inserted');  // If no rows were inserted, throw an error
            }
            console.log(`Version of template: ${newVersion.version_label} saved successfully for email type id ${newVersion.email_type_id}.`);
            return result;
        } catch (error) {
            console.error(`Error saving the version of template: ${newVersion.name}`, error);
            throw error;
        } finally {
            client.release();
        }
    }

    async getAllEmailVersions(email_type_id){
        const client = await this.pool.connect();
        try {
            const insertQuery = 'SELECT version_id, email_type_id, version_label from email_versions where email_type_id = $1';
            const values = [email_type_id];
            const result = await client.query(insertQuery, values);
            if (result.rowCount == 0) {
                throw new Error(`No email_versions were found for ${email_type_id}`);  // If no rows were inserted, throw an error
            }
            console.log(`Versions for ${email_type_id} found: ${result.rowCount.length}.`);
            return result.rows;
        } catch (error) {
            console.error(`Error getting versions for: ${email_type_id}`, error);
            throw error;
        } finally {
            client.release();
        }
    }

    async getTemplate(email_version_id) {
        const client = await this.pool.connect();
        try {
            const selectQuery = 'SELECT * FROM email_versions WHERE version_id = $1';
            const values = [email_version_id];
            const result = await client.query(selectQuery, values);
            if (result.rows.length === 0) {
                console.error(`No template found with id: ${email_version_id}`);
                return null;
            }
            // console.log(result.rows[0]);
            console.log(`Retrieved template with email version id: ${email_version_id}.`);
            return result.rows[0];
        } catch (error) {
            console.error(`Error retrieving the template with id: ${email_version_id}`, error);
        } finally {
            client.release();
        }
    }

    async getAllEmailTypes() {
        const client = await this.pool.connect();
        try {
            const selectQuery = 'SELECT * FROM email_types';
            const result = await client.query(selectQuery);
            if (result.rows.length === 0) {
                console.error(`No email types found`);
                return null;
            }
            return result.rows;
        } catch (error) {
            console.error(`Error retrieving email types`, error);
            return error;
        } finally {
            client.release();
        }
    }
}
module.exports = TemplatesDAO;
