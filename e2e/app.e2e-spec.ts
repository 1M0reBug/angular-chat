import { IdtMessagingPage } from './app.po';

describe('idt-messaging App', () => {
  let page: IdtMessagingPage;

  beforeEach(() => {
    page = new IdtMessagingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
