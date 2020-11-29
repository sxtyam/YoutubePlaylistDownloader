const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

let links = [];
let driver = new Builder().forBrowser('chrome').build();
const actions = driver.actions();

async function collectLinks(playlistLink) {
  await driver.get(playlistLink);
  let elements = await driver.findElements(By.className('yt-simple-endpoint style-scope ytd-playlist-video-renderer'));
  for (let i = 0; i < elements.length; i++) {
    let link = await elements[i].getAttribute('href');
    links.push(link);
    if (i == elements.length - 1) {
      for (let j = 0; j < links.length; j++) {
        console.log(j);
        await driver.get('https://www.y2mate.com/en63');
        let url = await driver.findElement(By.id('txt-url'));
        // console.log(url);
        await url.sendKeys(links[j], Key.RETURN);
        await driver.wait(until.elementLocated(By.className('btn btn-success')), 10000);
        let downloadButton = await driver.findElements(By.className('btn btn-success'));
        // console.log(downloadButton);
        await downloadButton[0].click();
        console.log('clicked');

        await driver.wait(until.elementLocated(By.className('btn btn-success btn-file')), 10000);
        let downloadButton2 = await driver.findElements(By.className('btn btn-success btn-file'));
        // console.log(downloadButton2);
        await downloadButton2[0].click();
        console.log('clicked');

        console.log('Waiting for download');
        await driver.sleep(2000);
        console.log('Wait finished');
        
        let windowHandles = await driver.getAllWindowHandles();
        console.log(windowHandles);

        if (windowHandles.length == 2) {
          console.log('before switching');
          await driver.switchTo().window(windowHandles[1]);
          console.log('after switching');
          await driver.close();
          console.log('closed');
          await driver.switchTo().window(windowHandles[0]);
          console.log('Final switch');
        }
      }
    }
  }
};

collectLinks('https://www.youtube.com/playlist?list=PL38QlIeqCY_YThz55wOBYdo6UlElN7BFF');