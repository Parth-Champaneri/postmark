/*
Compiling a template if it's using a layout
*/

client.getTemplates()
  .then((templates) => {
    const templateIds = templates.Templates.map((template) => template.TemplateId);
    return Promise.all(templateIds.map((id) => client.getTemplate(id)));
  })
  .then((templatesWithContent) => {

    let tags = Mustache.parse(templatesWithContent[1].HtmlBody);
    let tagNames = tags.filter(tag => tag[0] === 'name').map(tag => tag[1]);

    // Making the final template given a layout
    const view={
      product_name: "Product Name",
      name:"Parth",
    }
    const template = templatesWithContent[1].HtmlBody
    const layout = templatesWithContent[0].HtmlBody
    const layoutView={
      "@content": Mustache.render(template, view)
    }
    const result = Mustache.render(layout,layoutView);

    client.sendEmail({
      From: 'info@myresumetailor.com',
      To: 'parth.champaneri@hotmail.com',
      Subject: Mustache.render(templatesWithContent[1].Subject,view),
      HtmlBody:result,
      TextBody: Mustache.render(templatesWithContent[1].TextBody,view),
    }).catch(err=>{
      console.log(err);
    }).then(res=>{
      console.log(res.Message);
      console.log(res)  
    });

    res.json(templatesWithContent[0].HtmlBody);
  })
  .catch((err) => {
    console.log(err);
    res.send('Error fetching templates');
  });