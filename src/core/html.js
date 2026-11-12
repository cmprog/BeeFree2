/**
 * Appends the html as given to the element's children. This differs from setting innerHtml
 * in that it will not replace any existing child elements which already exist.
 *
 * @template {Element} [T=HTMLElement]
 * @param {Element} element The element to which the html should be appended.
 * @param {string} html The raw html text to be appended to the element.
 * @param {{ new(): T }} [type] The kind of element the html creates, such as HTMLSelectElement.
 *     Only used for type checking. Defaults to HTMLElement.
 * @return {T} The appended child.
 */
export function appendChildHtml(element, html, type) {

    const templateEl = document.createElement('template');

    // Trim the HTML to prevent dummy text nodes which can happen
    // from new lines in multi-line string literals.
    templateEl.innerHTML = html.trim();

    return /** @type {T} */ (element.appendChild(templateEl.content.firstChild));
}

/**
 * Finds the first element matching the selector, like querySelector, but typed as an HTML element
 * so properties like innerText, value and disabled can be used without type errors.
 *
 * @template {Element} [T=HTMLElement]
 * @param {ParentNode} parent The element (or document) to search within.
 * @param {string} selector A CSS selector.
 * @param {{ new(): T }} [type] The kind of element expected, such as HTMLInputElement.
 *     Only used for type checking. Defaults to HTMLElement.
 * @returns {T} The element, or null if nothing matches.
 */
export function queryElement(parent, selector, type) {
    return /** @type {T} */ (parent.querySelector(selector));
}

/**
 * Finds all elements matching the selector, like querySelectorAll, but typed as HTML elements.
 *
 * @template {Element} [T=HTMLElement]
 * @param {ParentNode} parent The element (or document) to search within.
 * @param {string} selector A CSS selector.
 * @param {{ new(): T }} [type] The kind of element expected. Only used for type checking.
 * @returns {T[]}
 */
export function queryAllElements(parent, selector, type) {
    return /** @type {T[]} */ (Array.from(parent.querySelectorAll(selector)));
}
