/**
 * @jest-environment node
 */
const puppeteer = require('puppeteer');
const full4s = require("@suvelocity/tester");

const path = "file://" + __dirname + "/src/index.html";
let page;
let browser;

  const projectName = "pre.Todo App";

  jest.setTimeout(15000);

describe(projectName, () => {
beforeAll(async () => {
  browser = await puppeteer.launch({
      // headless: false,
      args: ["--disable-web-security"],
      // slowMo:50
  });
  page = await browser.newPage();
});

afterEach(async () => {
    await full4s.afterEach(page);
  });

  afterAll(async () => {
    await full4s.afterAll(projectName);
    await browser.close();
  });

  test("Add multiple Items seperated by ','", async () => {
  const multipleText = 'first, second, third';

  await page.goto(path);
  await page.waitForSelector('body #text-input');
  await page.click('body #text-input');
  await page.type('#text-input', multipleText, {delay: 250});
  await page.select('body #priority-selector', '3');
  await page.waitForSelector('body #add-button');
  await page.click('body #add-button');
  await page.waitFor(1500);

  const tasks = await page.$$('.todo-text');
  const first = await (await tasks[0].getProperty("innerText")).jsonValue();
  const second = await (await tasks[1].getProperty("innerText")).jsonValue();
  const third = await (await tasks[2].getProperty("innerText")).jsonValue();
  expect(first).toBe("first");
  expect(second).toBe("second");
  expect(third).toBe("third");

});

test("Has menu", async () => {
  const multipleText = 'first, second, third';

  await page.goto(path);
  await page.waitForSelector('body #text-input');
  const menu = await page.$$('#menu');
  expect(menu.length).toBe(1);

});



});