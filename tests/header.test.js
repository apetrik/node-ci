
const { PageWithAuth } = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await PageWithAuth.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

test("header logo", async () => {
  const logo = await page.getContentsOf("a.brand-logo");
  expect(logo).toEqual("Blogster");
});

test("click sign in", async () => {
  await page.click(".right a");
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test("when signed in, log out button shown", async () => {
  await page.login();
  const logo = await page.getContentsOf("a[href='/auth/logout']");
  expect(logo).toEqual("Logout");
});
