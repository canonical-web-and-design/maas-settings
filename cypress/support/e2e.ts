/// <reference types="cypress" />

import "cypress-axe";
import "cypress-wait-until";
import "@percy/cypress";
import "./commands";

export type A11yPageContext = { url?: string; title?: string };
declare global {
  namespace Cypress {
    interface Chainable {
      addMachine(hostname?: string): void;
      addMachines(hostname: string[]): void;
      deleteMachine(hostname: string): void;
      deletePool(pool: string): void;
      login(options?: {
        username?: string;
        password?: string;
        shouldSkipIntro?: boolean;
        shouldSkipSetupIntro?: boolean;
      }): void;
      loginNonAdmin(): void;
      runMAASCommand(command: string, args: string): void;
      testA11y(pageContext: A11yPageContext): void;
      waitForPageToLoad(): void;
      waitForTableToLoad(options?: {
        name?: string | RegExp;
      }): Cypress.Chainable<JQuery<HTMLElement>>;
      getMainNavigation(): Cypress.Chainable<JQuery<HTMLElement>>;
      expandMainNavigation(): void;
    }
  }
}

Cypress.on("uncaught:exception", (err, _runnable) => {
  /*
   Prevent cypress tests from failing when visiting maas.io
   due to scripts not being loaded early enough:
   Error examples: 'canonicalGlobalNav is not defined'
   */
  const unloadedScripts = ["canonicalGlobalNav", "hljs", "drpNs", "cpNs"];
  if (unloadedScripts.some((script) => err.message.includes(script))) {
    return false;
  }
});
