const express = require('express');
const postmark = require('postmark');
const Mustache = require('mustache');
const { init, getEmailService, getTemplateService } = require('./loaders');
const cors = require('cors');
// Routes
const emailRoutes = require('./routes/EmailRoutes');
const templateRoutes = require('./routes/TemplateRoutes');
const webhookClick = require('./routes/ClickHook');

const app = express();
const port = 3000;

// Load everything
init();

app.use(cors({origin: '*'}));
app.use(express.json());
app.use('/email', emailRoutes(getEmailService(), getTemplateService()));
app.use('/template',templateRoutes(getTemplateService()) )
app.use('/hook', webhookClick);



app.get('/getTemplates', async (req,res)=>{

  var templates = await getTemplates();  
  res.json({ templates });
})

async function getTemplates() {
  try {
    const response = await client.getTemplates();
    const templates = response.Templates.filter(template => template.TemplateType === "Standard");
    const layouts = response.Templates.filter(template => template.TemplateType === "Layout");
    return {templates,layouts};
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});





// ---- ADDING USERS ----
// async function addUser(userEmail) {
//   const query = 'INSERT INTO users(user_email, created_at) VALUES($1, $2)';
//   const values = [userEmail, new Date()];
  
//   try {
//     const res = await pool.query(query, values);
//     console.log('User added successfully');
//   } catch (err) {
//     console.log('Error occurred during user addition:', err);
//   }
// }
// addUser('parth.champaneri@hotmail.com')