// 92b1f920-aadc-43b4-a4cc-649851511761

const express = require('express');
const postmark = require('postmark');
const { Pool } = require('pg');
const Mustache = require('mustache');

const pool = new Pool({
  user: 'parthc',
  host: 'localhost',
  database: 'postmark',
  password: '',
  port: 5432,
});

const app = express();
const port = 3000;
const client = new postmark.Client('46aab0d4-2426-4385-88c0-0f38be318272');


// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res);
//   pool.end();
// });

app.get('/', (req, res) => {
  client.getTemplates()
  .then((templates) => {
    const templateIds = templates.Templates.map((template) => template.TemplateId);
    return Promise.all(templateIds.map((id) => client.getTemplate(id)));
  })
  .then((templatesWithContent) => {

    console.log(templatesWithContent[0].HtmlBody)

    const view={
      product_name: "Test d",
      name:"layout",
    }
    const template = templatesWithContent[1].HtmlBody
    
    const layout = templatesWithContent[0].HtmlBody

    // let finalEmailTemplate = layout.replace('{{{ @content }}}', Mustache.render(template, view));
    const layoutView={
      "@content": Mustache.render(template, view)
    }
    const result = Mustache.render(layout,layoutView);

    // console.log(result);

    const sub = Mustache.render(templatesWithContent[1].Subject,view)
    const textbody =Mustache.render(templatesWithContent[1].TextBody,view)

    // console.log(Object.keys(templatesWithContent[1]));
    // console.log(templatesWithContent[0].HtmlBody);

    // console.log(Object.keys(templatesWithContent[0]))
    // console.log("templattype"+currTemp.TemplateType)
    // console.log("serverid: "+currTemp.AssociatedServerId)
    // console.log("active: "+currTemp.Active)
    // console.log("textbody: " +currTemp.TextBody)
    // console.log("subjecct: "+currTemp.Subject)
    // console.log("Name: "+currTemp.Name)

    // client.sendEmailWithTemplate({
    //   From: 'info@myresumetailor.com',
    //   To: 'info@myresumetailor.com',
    //   TemplateId: '31809845',
    //   TemplateModel: {
    //     product_name: 'PRODUCT B',
    //     name: 'Champ',
    //   },
    // });
    
    client.sendEmail({
      From: 'info@myresumetailor.com',
      To: 'info@myresumetailor.com',
      Subject: Mustache.render(templatesWithContent[1].Subject,view),
      HtmlBody:result,
      TextBody: Mustache.render(templatesWithContent[1].TextBody,view),
    }).catch(err=>{
      console.log(err);
    }).then(res=>{
      console.log("sucess")
      console.log(res)  
    });

    res.json(templatesWithContent[1]);
  })
  .catch((err) => {
    console.log(err);
    res.send('Error fetching templates');
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
// 



function replaceTemplateVariables(template) {
  var variables = {
    "product_name": "PRODUCT A1",
    "name": "Parth",
  }
  console.log(template);
  let modifiedTemplate = template;
  for (const [key, value] of Object.entries(variables)) {
    modifiedTemplate = modifiedTemplate.replace(new RegExp(`{{\\s*${key.trim()}\\s*}}`, 'g'), value);
  }
  return modifiedTemplate;
}

