const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;
app.use(express.json())
const WINDOW_SIZE = 10;

let numberWindow = [];

const calculateAverage = (numbers) => {
    let sum=0
    numbers.forEach(function(item,index){
        sum+=item;
    });
    return sum/numbers.length;
};

app.get('/numbers/:numberid', async (req, res) => {
    var access_token=0;
  const { numberid } = req.params;
  let type1=null;
  console.log(numberid)
  const validIds = ['p', 'f', 'e', 'r'];
  try {
    fetch("http://20.244.56.144/test/auth", { 
      
   // Adding method type 
   method: "POST", 
     
   // Adding body or contents to send 
   body: JSON.stringify({ 
    
        "companyName": "Codesign",
        "clientID": "e49424d2-8c5b-4ada-906a-a205a1df8811",
        "clientSecret": "nAGAHfzCViJFdlzV",
        "ownerName": "Lalith",
        "ownerEmail": "2100030155cseh@gmail.com",
        "rollNo": "2100030155"
    
   }),  
}).then(response=>response.json())
.then(jsonData=>  accessToken=jsonData["access_token"]);
console.log(accessToken);
console.log("-------------------------------------------------------------------------")
    if(numberid=="e"){ type1="even"}
    else if(numberid="f"){ type1="fibo"}
    else if(numberid="p"){ type1="prime"}
    else if(numberid="r"){ type1="random"}
   fetch(`http://20.244.56.144/test/${type1}`, {
  headers: {Authorization: `Bearer ${accessToken}`}
})
    .then(resp => resp.json())
   .then(json => console.log(JSON.stringify(json)))
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
   
    res.status(500).json(error);
  }
});

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});