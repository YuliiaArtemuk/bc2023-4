const http = require("http");
const fs = require ("fs");
const xml = require("fast-xml-parser");

const host = 'localhost';
const port = 8000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') { 
        fs.readFile('data.xml', 'utf-8', (err, data) => { 
            if (err) {
                handleError(500, "Error reading data file", res);
            } else {
            const maxRate = findMaxRate(data);
            console.log(maxRate);
             
          const builder = new xml.XMLBuilder();
          const xmlStr = builder.build({"data" : {"max_rate" : maxRate}});
          res.writeHead(200, { 'Content-Type': 'application/xml' });
            res.end(xmlStr); 
            }
        });
      } 
});

function findMaxRate(xmlData) { 

  const parser = new xml.XMLParser();
  const rates = parser.parse(xmlData)["exchange"]["currency"]

  let maxRate = 0; 

  for (const rate of rates) { 
    const rateValue = rate["rate"] 

    if (rateValue > maxRate) { 
      maxRate = rateValue; 
    }
  }

  return maxRate; 
}

server.listen(port, () => { 
  console.log(`Server is running on port ${port}`); 
}); 