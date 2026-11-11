/**
 * All the menus, by name, for menus to open each other (for example MENUS.MAIN.open()).
 * Filled in by initMenus() in menus.js during startup.
 *
 * This lives in its own module, with no imports, so any module can use MENUS without creating
 * an import cycle. Menus extend Menu, so a cycle between menu.js and the menus can make a menu
 * load before Menu exists.
 *
 * @type {import('./menus.js').MenuSet}
 */
export const MENUS = /** @type {any} */ ({});
