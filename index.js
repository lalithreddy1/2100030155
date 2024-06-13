const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Configuration
const WINDOW_SIZE = 10;

let numberWindow = [];

// Helper function to calculate average
const calculateAverage = (numbers) => {
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return numbers.length > 0 ? sum / numbers.length : 0;
};

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;
  const type1=null;
  console.log(numberid)
  const validIds = ['p', 'f', 'e', 'r'];
  try {
    accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4MjYwMzMzLCJpYXQiOjE3MTgyNjAwMzMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImU0OTQyNGQyLThjNWItNGFkYS05MDZhLWEyMDVhMWRmODgxMSIsInN1YiI6IjIxMDAwMzAxNTVjc2VoQGdtYWlsLmNvbSJ9LCJjb21wYW55TmFtZSI6IkNvZGVzaWduIiwiY2xpZW50SUQiOiJlNDk0MjRkMi04YzViLTRhZGEtOTA2YS1hMjA1YTFkZjg4MTEiLCJjbGllbnRTZWNyZXQiOiJuQUdBSGZ6Q1ZpSkZkbHpWIiwib3duZXJOYW1lIjoiTGFsaXRoIiwib3duZXJFbWFpbCI6IjIxMDAwMzAxNTVjc2VoQGdtYWlsLmNvbSIsInJvbGxObyI6IjIxMDAwMzAxNTUifQ.7vhVSBO7uC4RMca0Y_3B1mzojeaC3C5U4UYkk6Dc96g" 
    console.log("hello world");
    if(numberid=="e"){ type1="even"}
    else if(numberid="f"){ type1="fibo"}
    else if(numberid="p"){ type1="prime"}
    else if(numberid="r"){ type1="random"}
    const response = await axios.get(`http://20.244.56.144/test/${type1}`,{ 'Authorization': {headers: {'Authorization': `Bearer ${accessToken}`} }});
    const newNumbers = response.data.numbers;

    const windowPrevState = [...numberWindow];

    newNumbers.forEach(num => {
      if (!numberWindow.includes(num)) {
        numberWindow.push(num);
        if (numberWindow.length > WINDOW_SIZE) {
          numberWindow.shift();
        }
      }
    });

    const responseData = {
      numbers: newNumbers,
      windowPrevState,
      windowCurrState: numberWindow,
      avg: calculateAverage(numberWindow).toFixed(2)
    };

    res.json(responseData);
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      res.status(504).json({ error: 'Test server response timeout' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});