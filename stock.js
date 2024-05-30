const form = document.querySelector('.form');
const cardContainer = document.getElementById('cardContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentPage = 1;
const cardsPerPage = 4;

prevBtn.style.display = 'none';
nextBtn.style.display = 'none';

let stockData = [];
let totalPages = 0;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const stock = e.target.querySelector('input[type="search"]').value;
  const url = `https://real-time-finance-data.p.rapidapi.com/search?query=${stock}&language=en`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '41fac22fb2msh8cdb62af4cf27fap1cf2e6jsna505088b2a24',
        'X-RapidAPI-Host': 'real-time-finance-data.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching data from server');
    }

    const data = await response.json();

    if (data.data.stock.length > 0) {
      stockData = data.data.stock;
      totalPages = Math.ceil(stockData.length / cardsPerPage);
      currentPage = 1; // Reset to the first page whenever a new search is made
      displayStockData();
    } else {
      throw new Error('No stock data available');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Error fetching data. Please try again later.');
  }
});

function displayStockData() {
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentStocks = stockData.slice(startIndex, endIndex);

  cardContainer.innerHTML = '';
  currentStocks.forEach((stock) => {
    const card = createCard(stock);
    cardContainer.appendChild(card);
  });

  prevBtn.style.display = currentPage === 1 ? 'none' : 'inline-block';
  nextBtn.style.display = currentPage === totalPages ? 'none' : 'inline-block';
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    displayStockData();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    displayStockData();
  }
});

function createCard(stock) {
  const card = document.createElement('div');
  card.classList.add('card');

  card.innerHTML = `
    <h2><span style="color: black;"><u>${stock.symbol}</u></span></h2>
    <p><span style="color: green;">${stock.name}</span></p>
    <p><span style="color: black;">Price:</span> ${stock.price}</p>
    <p><span style="color: black;">Change:</span> ${stock.change}</p>
    <p><span style="color: black;">Change %:</span> ${stock.change_percent}</p>
    <p><span style="color: black;">Country code:</span> ${stock.country_code}</p>
    <p><span style="color: black;">Exchange:</span> ${stock.exchange}</p>
    <p><span style="color: black;">Exchange open:</span> ${stock.exchange_open}</p>
    <p><span style="color: black;">Exchange close:</span> ${stock.exchange_close}</p>
  `;

  return card;
}
