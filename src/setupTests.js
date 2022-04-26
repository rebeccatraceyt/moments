// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// import setupServer function from msw library
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

// To connect mock service worker to project's test:
//  - create a server instance with all handlers defined in handlers.js
//  - start the server before the tests are runm in case the default handlers are overwritten in the tests
//  - reset the handlers after each test
//  - close the server

// create server instance, by calling setupServer function with the spread handler
const server = setupServer(...handlers);

// call server's listen method, before the tests
beforeAll(() => server.listen());

// reset the handlers, after each handler
afterEach(() => server.resetHandlers());

// shut the server down after the tests have been run
afterAll(() => server.close());