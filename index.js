const express = require('express');
const axios = require('axios');
const app = express();
const port =9876;

const WINDOW_SIZE = 10;
const testServerUrl = 'http://20.244.56.144/test';
let windowNumbers = [];
const calculateAverage = (numbers) => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length) || 0;
};

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;
  var t=0;
  if (!['p', 'f', 'e', 'r'].includes(numberid)) {
    return res.status(400).json({ error: 'Invalid numberid' });
  }
  if(numberid=="e"){t="even"}
  else if(numberid=="f"){t="fibo"}
  else if(numberid=="p"){t="primes"}
  else{t="rand"}
const authToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4MjY2NTM0LCJpYXQiOjE3MTgyNjYyMzQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImU0OTQyNGQyLThjNWItNGFkYS05MDZhLWEyMDVhMWRmODgxMSIsInN1YiI6IjIxMDAwMzAxNTVjc2VoQGdtYWlsLmNvbSJ9LCJjb21wYW55TmFtZSI6IkNvZGVzaWduIiwiY2xpZW50SUQiOiJlNDk0MjRkMi04YzViLTRhZGEtOTA2YS1hMjA1YTFkZjg4MTEiLCJjbGllbnRTZWNyZXQiOiJuQUdBSGZ6Q1ZpSkZkbHpWIiwib3duZXJOYW1lIjoiTGFsaXRoIiwib3duZXJFbWFpbCI6IjIxMDAwMzAxNTVjc2VoQGdtYWlsLmNvbSIsInJvbGxObyI6IjIxMDAwMzAxNTUifQ.KLsoFja5G--OjfJh8a6aLdpeX6oxUr2UoKqz6-Sd3ms"
  try {
    const response = await axios.get(`${testServerUrl}/${t}`, {
      timeout: 500,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    const newNumbers = response.data.numbers;
    
    windowNumbers = [...new Set([...windowNumbers, ...newNumbers])];
    if (windowNumbers.length > WINDOW_SIZE) {
      windowNumbers = windowNumbers.slice(-WINDOW_SIZE);
    }
    
    const average = calculateAverage(windowNumbers);

    const result = {
      numbers: newNumbers,
      windowPrevState: windowNumbers.slice(0, windowNumbers.length - newNumbers.length),
      windowCurrState: windowNumbers,
      avg: average
    };
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
