const div = document.getElementById('div');
const trow = document.querySelector('.trow');
const tbody = document.querySelector('.tbody');
const searchInput = document.querySelector('#filter');
const exportBtn = document.getElementById('export-csv');
const addToTableBtn = document.querySelector('.addToTable');
const usernameInput = document.querySelector('#username');
const emailInput = document.querySelector('#mail');
const numberInput = document.querySelector('#number');
const websiteInput = document.querySelector('#website');
const companyInput = document.querySelector('#company');
const addressInput = document.querySelector('#address');

let originalData = [];

// Add event listener to "Add Data" button
addToTableBtn.addEventListener('click', () => {
  // Get the values from input fields
  const username = usernameInput.value;
  const email = emailInput.value;
  const number = numberInput.value;
  const website = websiteInput.value;
  const company = companyInput.value;
  const address = addressInput.value;

  // Check if any of the input fields are empty
  if (!username || !email || !number || !website || !company || !address) {
    alert('Please fill in all fields');
    return;
  }

  // Add the new data to the original data array
  const newData = {
    username,
    email,
    phone: number,
    website,
    company: { name: company },
    address: { city: address }
  };

  originalData.push(newData);
  renderData(originalData);

  // Clear input fields after adding data to the table
  usernameInput.value = '';
  emailInput.value = '';
  numberInput.value = '';
  websiteInput.value = '';
  companyInput.value = '';
  addressInput.value = '';
});

// Render data function
const renderData = (datas) => {
  // Clear previous table rows
  tbody.innerHTML = ''; 
  datas.forEach(element => {
    // Create each table row for each td 
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    tdName.textContent = element.username;
    tr.appendChild(tdName);

    const tdEmail = document.createElement('td');
    tdEmail.textContent = element.email;
    tr.appendChild(tdEmail);

    const tdPhone = document.createElement('td');
    tdPhone.textContent = element.phone;
    tr.appendChild(tdPhone);

    const tdWebsite = document.createElement('td');
    tdWebsite.textContent = element.website;
    tr.appendChild(tdWebsite);

    const tdCompany = document.createElement('td');
    tdCompany.textContent = element.company.name;
    tr.appendChild(tdCompany);

    const tdAddress = document.createElement('td');
    tdAddress.textContent = element.address.city;
    tr.appendChild(tdAddress);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete'
    tr.appendChild(deleteBtn);
    deleteBtn.addEventListener('click', () => {
     tbody.removeChild(tr)
    })

    tbody.appendChild(tr);
  });
};

// Filter function to filter the original data
const filterData = (query) => {
  if (!query) return originalData;
  return originalData.filter(item => {
    return Object.values(item).some(value =>
      String(value).toLowerCase().includes(query.toLowerCase())
    );
  });
};

// Fetching data from the API
fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
  .then(data => {
    originalData = data;
    renderData(originalData);
    const theader = ['Username', 'Email', 'Phone Number', 'Websites', 'Company', 'Address'];
    theader.forEach(thead => {
      const th = document.createElement('th');
      th.textContent = thead;
      trow.appendChild(th);
    });

    // Search input Data
    searchInput.addEventListener('input', () => {
      const filteredData = filterData(searchInput.value);
      renderData(filteredData);
    });

    // Export CSV functionality
    exportBtn.addEventListener('click', () => {
      exportToCSV(originalData);
    });
  });

// Function to export table data to CSV
const exportToCSV = (data) => {
  // Prepare CSV header
  const headers = ['Username', 'Email', 'Phone Number', 'Websites', 'Company', 'Address'];
  const csvRows = [];
  csvRows.push(headers.join(',')); // Join headers with commas

  // Prepare CSV rows
  data.forEach(element => {
    const row = [
      element.username,
      element.email,
      element.phone,
      element.website,
      element.company.name,
      element.address.city
    ];
    csvRows.push(row.join(',')); // Join each row with commas
  });

  // Create a Blob from the CSV data
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });

  // Create a link element and trigger a download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.csv';
  document.body.appendChild(a);
  a.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};
