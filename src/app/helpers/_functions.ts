/**
 * function helps to load styles file dynamic 
 * @param stylePath path of css file
 * @param id unique identifier of link element
 * @param lang optional param for language type
 */
export function loadStyles(stylePath: string, id: string, lang?: 'en' | 'ar') {
    if (lang) {
        const htmlRoot = document.getElementsByTagName('html')[0];
        htmlRoot.lang = lang;
        htmlRoot.dir = lang == 'ar' ? 'rtl' : 'ltr';
    }

    const head = document.getElementsByTagName('head')[0];
    let cssLink = document.getElementById(id) as HTMLLinkElement;

    if (cssLink) {
        cssLink.href = stylePath;
    } else {
        const style = document.createElement('link');
        style.id = id;
        style.rel = 'stylesheets';
        style.href = `${stylePath}`;

        head.appendChild(style);
    }
}