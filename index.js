const httpServer = require('http');
const url = require('url');
const fs = require('fs');

const replaceTemplate = require('./modules/replaceTemplate');

const tempLoan = require('./data/data.json');

//Calculate the PV
function Calculate(amount,interest,years) {
    //const months = years*12
    const months = years*12;
    //calculate i = interest/12
    const interests = interest/12;
    //Calculate the PV
    const PV = Math.round((amount/(interests)) * (1-(1/((1+((interests)))**(months))))*100)/100;
    return PV
}
//Add the PV into tempLoan
tempLoan.forEach(function(item) {
    item.PV = Calculate(item.loanAmount,item.interest,item.loanTermYears);
})

// console.log(tempLoan);
//const PV = Math.round((PMT/i) * (1-(1/((1+i)**month)))*100)/100;
 /////////////////////////////////
// Template
const templateHTMLLoan = fs.readFileSync(
    `${__dirname}/template/templateCalculate.html`,
    'utf-8'
  );

const dataObj = tempLoan;// string to JavaScript Object JSON

////////////////////////////////
//Create Server
// const server = httpServer.createServer(function (req, res) {// call back function
const server = httpServer.createServer( (req, res) =>{// call back function

    // const urlParameter = url.parse(req.url, true);
    // console.log(JSON.stringify(urlParameter.query));// convert to String
    // console.log(JSON.stringify(urlParameter.pathname));// convert to String
    const {query,pathname} = url.parse(req.url, true); // object distructors
    if(query.id <=4){// if there is query parameter named id read as string
        // Courses page
        if (pathname === '/' || pathname.toLowerCase() === '/loan') {
            res.writeHead(200, {// Every thing ran successfully
                'Content-type': 'text/html'
            });
            const loan = dataObj[Number(query.id)];// convert string to numeric value
            //const strLoanName = JSON.stringify(loan);
            const loanHTML = replaceTemplate(templateHTMLLoan, loan);// function that will replace the course values in the HTML
            //   res.end(` We received our first request from the client at resource ${urlParameter.pathname.toLowerCase()} with query parameter ${urlParameter.query.id}
            //   ${JSON.stringify(course)}// convert object back to string
            //   `)
            res.end(loanHTML);
        }
    }
    else if(query.id >= 5) {
        res.writeHead(200, {// Server did not find what you were looking for
            'Content-type': 'text/html'
        });
        res.end(`Please enter an id that is <=4 and >=0`)
    }
    else{
            res.writeHead(404, {// Server did not find what you were looking for
                'Content-type': 'text/html'
            });
            res.end(`resource not found`)
        }
    });

//Start Listening to requests
server.listen(8000, 'localhost', ()=> {
    console.log('Listening to requests on port 8000');
});

