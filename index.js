const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

const port = 8080;

//imports language code to language name dictionary
const languageCodes = require('./languageCodes.js');
const codeToLanguage = languageCodes.codeToLanguage;


// use body-parser middleware to parse the request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

async function translateDeepl(url, xpath){
    //launching puppeteer with a different user-agent
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            `Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M)
            AppleWebKit/537.36 (KHTML, like Gecko)
            Chrome/59.0.3071.125 Mobile Safari/537.36`
        ]
    });
    const page = await browser.newPage();

    //waits for page to open
    await page.goto(url, {
        waitUntil: 'networkidle2',
    });
    await page.waitForTimeout(10000);

    const [textBoxElement] = await page.$x(xpath);
    const tranlsatedText = await page.evaluate(element => element.textContent, textBoxElement);

    await browser.close();

    return tranlsatedText;
}

app.get('/', (req, res) => {
    res.send({data: `send a post request with a translateTo
        (You can use either language code(es, cz and etc.)
        or language name - english, czech, etc)
        Then, you must add a textToTranslate.`}); 
});

app.post('/', async (req, res) => {
    const data = req.body;
    const textToTranslate = req.body.textToTranslate.toLowerCase();
    var translateTo = req.body.translateTo;

    //converts language name into language code
    if(translateTo.length > 2){
        for(const k in codeToLanguage){
            if(codeToLanguage[k] == translateTo){
                translateTo = k;
            }
        }
    }

	const translatedText = await translateDeepl(
	`https://www.deepl.com/translator#en/${translateTo}/${encodeURIComponent(textToTranslate)}`,
    '/html/body/div[4]/main/div[5]/div[1]/div[2]/section[2]/div[3]/div[1]/d-textarea/div/p'
	);
    
    res.send({translatedText: translatedText});
});

app.listen(port, () => console.log(`Live on localhost:${port}`));
