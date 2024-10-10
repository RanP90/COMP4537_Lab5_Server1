/**
 * This project includes code suggestions and assistance from ChatGPT 
 * to enhance certain functionalities and optimize code structure.
 */

import { userStrings } from './../lang/en/en.js';  

class PatientManager {
  constructor() {
    //this.apiUrl = "http://localhost:8008";  
    this.apiUrl = "http://192.34.62.102:8008";
    this.initEventListeners();  
  }

  // Initialize event listeners for insert and query buttons
  initEventListeners() {
    document
      .getElementById("insert-button")
      .addEventListener("click", () => this.insertPredefinedPatients());
    document
      .getElementById("send-query-button")
      .addEventListener("click", (event) => this.submitQuery(event));
  }

  // Function to insert predefined patients by sending a POST request
  async insertPredefinedPatients() {
    try {
      const patients = userStrings.samplePatients.map(([name, dateOfBirth], index) => ({
        patientID: index + 1,
        name,
        dateOfBirth
      }));

      const response = await fetch(`${this.apiUrl}/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: patients })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Display the server response
      document.getElementById('response').innerText = userStrings.messages.insertSuccess;
    } catch (error) {
      // Handle errors by displaying the error message from strings
      document.getElementById('response').innerText = userStrings.messages.errorOccurred;
      console.error("Error inserting predefined patients:", error);
    }
  }

  // Function to send a custom SQL query via POST
  async submitQuery(event) {
    event.preventDefault();  // Prevent form submission reload

    const query = document.getElementById('sql-query').value.trim();

    if (!query) {
      document.getElementById('response').innerText = "Please enter a SQL query.";
      return;
    }

    try {
      const response = await fetch(`${this.apiUrl}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Display the server response
      document.getElementById('response').innerText = JSON.stringify(result, null, 2);
    } catch (error) {
      // Handle errors by displaying the error message from strings
      document.getElementById('response').innerText = userStrings.messages.errorOccurred;
      console.error("Error submitting SQL query:", error);
    }
  }
}

new PatientManager();