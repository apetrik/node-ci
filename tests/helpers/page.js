const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class PageWithAuth {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });
    const defaultPage = await browser.newPage();
    const customPage = new PageWithAuth(defaultPage);
    return new Proxy(customPage, {
      get: (target, property) => {
        return (
          customPage[property] || browser[property] || defaultPage[property]
        );
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    await this.page.setCookie({
      name: "session",
      value: session,
    });
    await this.page.setCookie({ name: "session.sig", value: sig });
    await this.page.goto("http://localhost:3000/blogs");
    await this.page.waitFor("a[href='/auth/logout']");
  }

  getContentsOf(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML);
  }
}

module.exports = {
  PageWithAuth,
};
