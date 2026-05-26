/**
 * Public API of the core module — apps should only import from here.
 */
export * from './dom.js';
export * from './events.js';
export * from './storage.js';
export * from './i18n.js';
export * from './canvas.js';
export * from './gestures.js';
export { AudioManager } from './audio.js';
export { System } from './system.js';
export { Desktop } from './desktop.js';
export { startStatusBarClock, applyGithubPagesFix } from './shell.js';
