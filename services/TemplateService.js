const mustache = require('mustache');

class TemplateService {
  constructor(postmarkClient, templatesDAO) {
    this.postmarkClient = postmarkClient;
    this.templatesDAO = templatesDAO;
  }
  /*
  Returns template stored in local postgres
  */
  async getTemplate(email_version_id) {
    try {
        const template = await this.templatesDAO.getTemplate(email_version_id);
        if (template === null) {
            console.log(`No template found with id: ${email_version_id}`);
            return null;
        }
        console.log(`Retrieved template with id: ${email_version_id}`);
        return template;
    } catch (error) {
        console.error(`Error retrieving template with id: ${email_version_id}`, error);
        throw error; // optionally re-throw the error so calling code can handle it
    }
  }

  // Get Local Email Types
  async getAllEmailTypes() {
    try {
        const emailTypes = await this.templatesDAO.getAllEmailTypes();
        if (!emailTypes || emailTypes.length === 0) {
            console.log(`No email types found`);
            return null;
        }
        console.log(`Retrieved all email types`);
        return emailTypes;
    } catch (error) {
        console.error(`Error retrieving email types`, error);
        throw error; // optionally re-throw the error so calling code can handle it
    }
}

// Get Local Email Types
async getAllEmailVersions(email_type_id) {
  try {
      const emailVersions = await this.templatesDAO.getAllEmailVersions(email_type_id);
      if (!emailVersions || emailVersions.length === 0) {
          console.log(`No email versions found`);
          return null;
      }
      console.log(`Retrieved all email versions for ${email_type_id}`);
      return emailVersions;
  } catch (error) {
      console.error(`Error retrieving email versions for ${email_type_id}`, error);
      throw error; // optionally re-throw the error so calling code can handle it
  }
}

  /*
  Get all template content from postmark
  */
  async getPostmarkTemplate(postmark_template_id) {
    try {
        const template = await this.postmarkClient.getTemplate(postmark_template_id);
        if (template === null) {
            console.log(`No template found with id in postmark: ${postmark_template_id}`);
            return null;
        }
        console.log(`Retrieved template with id from postmark: ${postmark_template_id}`);
        return template;
    } catch (error) {
        console.error(`Error retrieving template with id: ${postmark_template_id}`, error);
        throw error; // optionally re-throw the error so calling code can handle it
    }
  }

  /* Get all postmark templates
  */
  async getAllPostmarkTemplates() {
    try {
        const templates = await this.postmarkClient.getTemplates({templateType: 'Standard'});
        if (templates === null) {
            console.log(`No templates found in Postmark.`);
            return null;
        }
        console.log(`Retrieved all templates from Postmark.`);
        return templates;
    } catch (error) {
        console.error(`Error retrieving all templates from Postmark`, error);
        throw error;
    }
  }

  async getTemplateTags(template) {
    try {
      const tags = [];
      // Extract tags from email_content
      const emailContentTags = mustache.parse(template.email_content)
        .filter(token => token[0] === 'name')
        .map(token => token[1]);
      tags.push(...emailContentTags);
  
      // Extract tags from subject
      const subjectTags = mustache.parse(template.subject)
        .filter(token => token[0] === 'name')
        .map(token => token[1]);
      tags.push(...subjectTags);
  
      // Extract tags from textbody
      const textBodyTags = mustache.parse(template.textbody)
        .filter(token => token[0] === 'name')
        .map(token => token[1]);
      tags.push(...textBodyTags);
  
      const uniqueTags = [...new Set(tags)];
      return uniqueTags;
    } catch (error) {
      console.error(`Error retrieving template tags with id: ${version_id}`, error);
      throw error;
    }
  }

  async createNewEmailVersion(newVersion){
    try {
      // Save this template version to the 'email_versions' table
      const result = await this.templatesDAO.saveEmailVersion(newVersion);
      return result;
    } catch (error) {
      console.error(`Error fetching and saving template version: `, error);
      throw error;
    }
  }

  async createNewEmailType(postmarkTemplateId, email_type) {
    try {
      await this.templatesDAO.saveEmailType(email_type, postmarkTemplateId);
      console.log(`New email type ${email_type} with template id ${postmarkTemplateId} created successfully`);
    } catch (error) {
      console.error('Error creating new email type:', error);
    }
  }
}

module.exports = TemplateService;
