// const express = require('express');
// const app = express();
const { Builder, By, Key, until } = require('selenium-webdriver');
// const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

let links = [];
let driver = new Builder().forBrowser('chrome').build();
const actions = driver.actions();

async function collectLinks() {
    await driver.get('https://www.youtube.com/playlist?list=PL38QlIeqCY_ZPvQI_CekD7OGxtvOuY2bS');
    let elements = await (await driver.findElements(By.className('yt-simple-endpoint style-scope ytd-playlist-video-renderer'))).forEach(element => {
        let link = element.getAttribute('href');
        links.push(link);
    })
};

async function downloadVideo(link) {
    await driver.get('https://en.savefrom.net/1-youtube-video-downloader-3/');
    await driver.findElement(By.name('sf_url')).sendKeys(link, Key.RETURN);
    
    setTimeout(async function() {
        await (await driver.findElements(By.className('link link-download no-downloadable subname ga_track_events download-icon'))).forEach(async function(element) {
            console.log("Clicking!");
            await actions
                .keyDown(Key.ALT)
                .click(element)
                .keyUp(Key.ALT)
                .perform();
        })
    }, 3000);
};

downloadVideo('https://www.youtube.com/watch?v=nkxMZbHnWmU');

// app.get("/", function (req, res) {
//     example();
//     res.render("index.ejs");
// })

// app.listen(3000, function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Server has been started on port 3000!");
//     }
// })