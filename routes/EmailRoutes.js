// EmailRoutes.js
const express = require('express');
const { version } = require('mustache');
const router = express.Router();

module.exports = (emailService, templatesService) => {
  router.post('/sendEmail', async (req, res) => {
    try {
      const { sendTo, version_id,model} = req.body;
      const from = 'info@myresumetailor.com';

      const template = await templatesService.getTemplate(version_id);

      // We should save the tags within each email_version;
      const tags = await templatesService.getTemplateTags(template);
      const missingTags = tags.filter(tag => !(tag in model));
  
      if (missingTags.length > 0) {
        console.log(missingTags);
        // Just log the tags for now, for demo purposes!
        // return res.status(400).send({ error: 'Missing variables in the model' });
      }

      await emailService.sendEmail(from, sendTo, template, version_id, model);
      return res.status(200).send({ message: `Email sent successfully to ${sendTo}` });

    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).send({ error: 'Error sending email' });
    }
  });
  return router;  
};
