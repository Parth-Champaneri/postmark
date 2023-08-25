import React, { useEffect, useState } from 'react';
import './App.css';
const App = () => {

  const [templates, setTemplates] = useState([]);
  const [emailTypes, setEmailTypes] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedEmailType, setSelectedEmailType] = useState('');
  const [label, setLabel] = useState('');
  // const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchPostmarkTemplates();
    fetchEmailTypes();
  }, []);

  const fetchPostmarkTemplates = () => {
    // get templates from our server
    // Update the 'templates' state with the response data
    fetch("http://localhost:3000/template/getAllTemplates")
        .then((response) => response.json())
        .then((data) => setTemplates(data.templates.Templates)) // if the response data is in { templates: [...] }
        .catch((error) => console.error(error));
  };

  const fetchEmailTypes = () => {
    // Make a request to your server to fetch email types
    // Update the 'emailTypes' state with the response data
    // For example:
    fetch("http://localhost:3000/template/emailTypes")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
          setEmailTypes(data.emailTypes)
        }
      )
      .catch((error) => console.error(error));
  };

  const handleSave = async () => {
    // Make a request to your server to save the data
    // Include the selectedTemplate, selectedEmailType, label, and description
    // For example:
    console.log(selectedTemplate);
    const data = {
      postmark_template_id: selectedTemplate,
      email_type_id: selectedEmailType,
      version_label: label
    };

    setIsSaving(true);
    setErrorMessage('')

    try {
      const response = await fetch('http://localhost:3000/template/newEmailVersion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });  
      const responseData = await response.json();

      // Handle the response data if needed
      console.log(responseData);
      setIsSaving(false);
      // Reset the form inputs
      setSelectedTemplate('');
      setSelectedEmailType('');
      setLabel('');
      // setDescription('');
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      setErrorMessage(error.message);
    }

    // fetch('http://localhost:3000/template/newEmailVersion', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // })
    // .then((response) => response.json())
    // .then((data) => {
    //   // Handle the response from the server if needed

    //   console.log(data);
    //   setIsSaving(false);
    //   // Reset the form inputs
    //   setSelectedTemplate('');
    //   setSelectedEmailType('');
    //   setLabel('');
    //   // setDescription('');
    // })
    // .catch((error) => {
    //   console.error(error);
    //   setIsSaving(false);
    //   setErrorMessage(error.error);
    // });
  };

  const isFormValid = () => {
    return (
      selectedTemplate !== '' &&
      selectedEmailType !== '' &&
      label !== '' 
      // description !== ''
    );
  };

  return (
    <div className='newTemplateForm'>
      <div>
        <h1>Email Template Form</h1>
        <label htmlFor="template">Select Postmark Template:</label>
        <select
          id="template"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          >
          <option value="">-- Select Template --</option>
          {templates.map((template) => (
            <option key={template.TemplateId} value={template.TemplateId}>
              {template.Name} + {template.TemplateId} + {template.Alias}
            </option>
          ))}
        </select>
      </div>

      <div>
      <label htmlFor="emailType">Select Email Type:</label>
        <select
          id="emailType"
          value={selectedEmailType}
          onChange={(e) => setSelectedEmailType(e.target.value)}
          >
          <option value="">-- Select Email Type --</option>
          {emailTypes.map((type) => (
            <option key={type.email_type_id} value={type.email_type_id}>  
              {type.email_type}
            </option>
          ))}
        </select>
      </div>


      <div>
        <label htmlFor="label">Label:</label>
        <input
          type="text"
          id="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          />
      </div>
      {/* <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          />

      </div> */}

      <div>
        <button
          type="button"
          disabled={!isFormValid() || isSaving}
          onClick={handleSave}
          >
          Save
        </button>
        <div>
            {/* Render other components and UI elements */}
            {errorMessage && <p>{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default App;
