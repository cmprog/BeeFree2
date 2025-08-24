/**
 * Appends the html as given to the element's children. This differs from setting innerHtml
 * in that it will not replace any existing child elements which already exist.
 * 
 * @param {HTMLElement} element The element to which the html should be appended.
 * @param {string} html The raw html text to be appended to the element.
 */
export function appendChildHtml(element, html) {

    const templateEl = document.createElement('template');

    // Trim the HTML to prevent dummy text nodes which can happen
    // from new lines in multi-line string literals.
    templateEl.innerHTML = html.trim();

    element.appendChild(templateEl.content.firstChild);
};