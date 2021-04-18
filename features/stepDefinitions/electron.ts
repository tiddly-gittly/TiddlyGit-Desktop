/* eslint-disable @typescript-eslint/no-unused-expressions */
import { setWorldConstructor, Given, Then, When } from '@cucumber/cucumber';
import { delay } from 'bluebird';
import { expect } from 'chai';
import { TiddlyGitWorld } from '../supports/world';

setWorldConstructor(TiddlyGitWorld);

Given('the app is launched', { timeout: 120 * 1000 }, async function (this: TiddlyGitWorld) {
  await this.start();
  const windowCount = await this.app?.client?.getWindowCount();
  expect(windowCount).equal(1);
});

Then('the element {string} is on the page', { timeout: 120 * 1000 }, async function (this: TiddlyGitWorld, elementSelector: string) {
  const result = await this.getElement(elementSelector);
  expect(result).to.not.be.undefined;
  this.updateContext({ previousElement: result });
});
Then('click on this element', { timeout: 120 * 1000 }, async function (this: TiddlyGitWorld) {
  expect(this.context?.previousElement).to.not.be.undefined;
  if (this.context?.previousElement !== undefined) {
    await this.context.previousElement.click();
  }
});
Then('{string} window show up', { timeout: 120 * 1000 }, async function (this: TiddlyGitWorld, windowName: string) {
  // await delay(1000);
  const windowCount = await this.app?.client?.getWindowCount();
  expect(windowCount).equal(2);

  const handles = await this.app?.client?.getWindowHandles();
  expect(handles).to.not.be.undefined;
  if (handles !== undefined) {
    // DEBUG: console
    console.log(`handles`, handles);
    await this.app?.client?.switchToWindow(handles[0]);
    await delay(1000);
  }
});
