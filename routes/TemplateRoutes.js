// EmailRoutes.js
const express = require('express');
const router = express.Router();

module.exports = (templateService) => {

    const handleServerError = (res, error, message) => {
        console.error(message, error);
        res.status(500).send({ error: message + error });
    };

    router.get('/getAllTemplates', async (req, res) => {
        try {
            const templates = await templateService.getAllPostmarkTemplates();
            if (!templates) throw new Error('No templates found');
            res.status(200).send({ templates });
        } catch (error) {
            handleServerError(res, error, 'Error getting all templates: ');
        }
    });

    router.get('/getAllEmailVersions/:email_type_id', async (req, res) => {
        try {
            const email_type_id = req.params.email_type_id;
            const versions = await templateService.getAllEmailVersions(email_type_id);
            if (!versions) throw new Error('No templates found');
            res.status(200).send({ versions });
        } catch (error) {
            handleServerError(res, error, 'Error getting all templates: ');
        }
    });

    router.get('/emailTypes', async (req, res) => {
        try {
            const emailTypes = await templateService.getAllEmailTypes();
            if (!emailTypes) throw new Error('No email types found');
            res.status(200).send({ emailTypes });
        } catch (error) {
            handleServerError(res, error, 'Error getting all email types: ');
        }
    });

    router.get('/getTempTags/:postmark_template_id', async (req, res) => {
        try {
            const postmark_template_id = req.params.postmark_template_id;
            const tags = await templateService.getTemplateTags(postmark_template_id);
            res.status(200).send({ tags });
        } catch (error) {
            handleServerError(res, error, 'Error getting Template Tags: ');
        }
    });

    router.post('/newEmailVersion', async (req, res) => {
        try {
            const { postmark_template_id, version_label, email_type_id } = req.body;
            const template = await templateService.getPostmarkTemplate(postmark_template_id);
            const newVersion = {
                postmark_template_id,
                version_label,
                email_type_id,
                email_content: template.HtmlBody,
                subject: template.Subject,
                textbody: template.TextBody,
                name: template.Name
            };

            await templateService.createNewEmailVersion(newVersion);
            
            res.status(200).send({ res: `New Email Version Created: ${newVersion.version_label}` });
        } catch (error) {
            handleServerError(res, error, 'Error creating new version: ');
        }
    });

    router.post('/newEmailType', async (req, res) => {
        try {
            const { postmark_template_id, email_type } = req.body;
            const new_email_type = await templateService.createNewEmailType(postmark_template_id, email_type);
            res.status(200).send({ res: `New Email Type Created: ${email_type}`});
        } catch (error) {
            handleServerError(res, error, 'Error creating new email type: ');
        }
    });

    return router;  
};
