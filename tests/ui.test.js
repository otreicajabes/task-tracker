const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// The app must already be running at this address
const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';

describe('Task Tracker frontend', () => {
  let driver;

    beforeAll(async () => {
    const options = new chrome.Options().addArguments(
      '--headless=new',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1280,800'
    );

    // Use Brave locally; on Jenkins, set CHROME_BIN or leave it unset to use Chrome
    const bravePath = 'C:\\Users\\Jabes\\AppData\\Local\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
    options.setChromeBinaryPath(process.env.CHROME_BIN || bravePath);

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }, 90000);

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  test('user can add a task and see it in the list', async () => {
    // Unique title so the test still works if other tasks already exist
    const title = 'Learn Jenkins ' + Date.now();

    await driver.get(BASE_URL);
    expect(await driver.getTitle()).toBe('Task Tracker');

    await driver.findElement(By.id('task-input')).sendKeys(title);
    await driver.findElement(By.id('add-btn')).click();

    // Wait until a list item with our title appears
    const item = await driver.wait(
      until.elementLocated(By.xpath(`//ul[@id='task-list']//span[text()='${title}']`)),
      5000
    );
    expect(await item.getText()).toBe(title);
  });
});