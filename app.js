const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const https = require('https')

const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

async function downloadPlaylist(playlistLink) {
  let links = [];
  let driver = new Builder().forBrowser('chrome').build();
  const actions = driver.actions();

  await driver.get(playlistLink);
  let elements = await driver.findElements(By.className('yt-simple-endpoint style-scope ytd-playlist-video-renderer'));
  for (let i = 0; i < elements.length; i++) {
    let link = await elements[i].getAttribute('href');
    links.push(link);
    if (i == elements.length - 1) {
      for (let j = 0; j < links.length; j++) {
        await driver.get('https://www.y2mate.com/en63');
        let url = await driver.findElement(By.id('txt-url'));
        await url.sendKeys(links[j], Key.RETURN);
        await driver.wait(until.elementLocated(By.className('btn btn-success')), 10000);
        let downloadButton = await driver.findElements(By.className('btn btn-success'));
        await downloadButton[0].click();

        await driver.wait(until.elementLocated(By.className('btn btn-success btn-file')), 10000);
        let downloadButton2 = await driver.findElements(By.className('btn btn-success btn-file'));
        await downloadButton2[0].click();

        await driver.sleep(2000);

        let windowHandles = await driver.getAllWindowHandles();

        if (windowHandles.length > 1) {
          for (let k = 1; k < windowHandles.length; k++) {
            await driver.switchTo().window(windowHandles[k]);
            await driver.close();
            await driver.switchTo().window(windowHandles[0]);
          }
        }

        if(j == links.length - 1) {
          console.log('quitting driver')
          await driver.quit();
          https.get('/');
        }
      }
    }
  }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
  res.render('index.ejs')
})

app.post('/download', function (req, res) {
  downloadPlaylist(req.body.playlistURL.toString());
  res.render('downloading.ejs');
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has been started!");
})