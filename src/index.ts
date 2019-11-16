import { app } from './app';

console.log('Application starting');

// prevent this from being imported/required - can only be run directly
if (!module.parent) {
  app();
}
else {
  // throw a fatal error and crash
  throw new Error('[FATAL] Cannot require this app. Crashing.');
}
