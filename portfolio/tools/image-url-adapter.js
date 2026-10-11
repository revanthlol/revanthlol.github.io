// Framer also assigns generated responsive URLs directly to native image elements.
const offlineImageURL = value => globalThis.__offlineUrls[value] || value;
const offlineSrcset = value => String(value).split(',').map(entry => {
    const parts = entry.trim().split(/\s+/);
    parts[0] = offlineImageURL(parts[0]);
    return parts.join(' ');
}).join(', ');
for (const key of ['src', 'srcset']) {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, key);
    Object.defineProperty(HTMLImageElement.prototype, key, {
        ...descriptor,
        set(value) { descriptor.set.call(this, key === 'src' ? offlineImageURL(value) : offlineSrcset(value)); }
    });
}
const offlineSetAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function (name, value) {
    if (this instanceof HTMLImageElement) {
        if (name.toLowerCase() === 'src') value = offlineImageURL(value);
        if (name.toLowerCase() === 'srcset') value = offlineSrcset(value);
    }
    return offlineSetAttribute.call(this, name, value);
};
