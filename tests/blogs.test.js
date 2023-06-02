const { PageWithAuth } = require("./helpers/page");

let page;
beforeEach(async () => {
  page = await PageWithAuth.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});
describe('when logged in', () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });
  it('should open add blog page', async () => {
    
    const label = await page.getContentsOf("form label");
    expect(label).toEqual('Blog Title')
  });
  describe('and using incorrect inputs', () => {
    beforeEach(async () => {
      
    });
  })

  
});






