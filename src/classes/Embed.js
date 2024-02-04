
const TITLE_LIMIT = 256;
const DESCRIPTION_LIMIT = 4096;
const FIELDS_LIMIT = 25;
const FIELD_NAME_LIMIT = 256;
const FIELD_VALUE_LIMIT = 1024;
const FOOTER_TEXT_LIMIT = 2048;
const AUTHOR_NAME_LIMIT = 256;

// Structure for embed response
export class Embed {
    title = '';
    type = 'rich';
    description = '';
    url = '';
    timestamp = null;
    color = 0xFFD700;
    footer = new Footer();
    image = new Image();
    thumbnail = new Thumbnail();
    video = new Video();
    provider = new Provider();
    author = new Author();
    fields = [];

    setTitle(title) {
        if (title.length >= TITLE_LIMIT) {
            console.error(`Attempted to exceed limit of ${TITLE_LIMIT} characters in title.\n${JSON.stringify(title)}`);
        }
        this.title = title.slice(0, TITLE_LIMIT);
    }
    // setType(type) { this.type = type; }
    setDescription(description) {
        if (description.length >= DESCRIPTION_LIMIT) {
            console.error(`Attempted to exceed limit of ${DESCRIPTION_LIMIT} characters in description.\n${JSON.stringify(description)}`);
        }
        this.description = description.slice(0, DESCRIPTION_LIMIT);
    }
    setUrl(url) { this.url = url; }
    setTimestampOn() { this.timestamp = new Date().toISOString(); }
    setColor(color) { this.color = color; }
    addField(name, value, inline=false) {
        const field = new Field(name, value, inline);
        if (this.fields.length >= FIELDS_LIMIT) {
            console.error(`Attempted to exceed limit of ${FIELDS_LIMIT} fields.\n${JSON.stringify(field)}`);
            return;
        }
        this.fields.push(field);
    }
}

class Footer {
    text = '';
    icon_url = '';
    proxy_icon_url = '';

    setText(text) {
        if (text.length >= FOOTER_TEXT_LIMIT) {
            console.error(`Attempted to exceed limit of ${FOOTER_TEXT_LIMIT} characters in footer text.\n${JSON.stringify(text)}`);
        }
        this.text = text.slice(0, FOOTER_TEXT_LIMIT);
    }
    setIconUrl(icon_url) { this.icon_url = icon_url; }
    setProxyIconUrl(proxy_icon_url) { this.proxy_icon_url = proxy_icon_url; }
}

class Image {
    url = '';
    proxy_url = '';
    height = -1;
    width = -1;

    setUrl(url) { this.url = url; }
    setProxyUrl(proxy_url) { this.proxy_url = proxy_url; }
    setHeight(height) { this.height = height; }
    setWidth(width) { this.width = width; }
}

class Thumbnail {
    url = '';
    proxy_url = '';
    height = -1;
    width = -1;

    setUrl(url) { this.url = url; }
    setProxyUrl(proxy_url) { this.proxy_url = proxy_url; }
    setHeight(height) { this.height = height; }
    setWidth(width) { this.width = width; }
}

class Video {
    url = '';
    proxy_url = '';
    height = -1;
    width = -1;

    setUrl(url) { this.url = url; }
    setProxyUrl(proxy_url) { this.proxy_url = proxy_url; }
    setHeight(height) { this.height = height; }
    setWidth(width) { this.width = width; }
}

class Provider {
    name = '';
    url = '';

    setName(name) { this.name = name; }
    setUrl(url) { this.url = url; }
}

class Author {
    name = '';
    url = '';
    icon_url = '';
    proxy_icon_url = '';

    setName(name) {
        if (name.length >= AUTHOR_NAME_LIMIT) {
            console.error(`Attempted to exceed limit of ${AUTHOR_NAME_LIMIT} characters in author name.\n${JSON.stringify(name)}`);
        }
        this.name = name.slice(0, AUTHOR_NAME_LIMIT);
    }
    setUrl(url) { this.url = url; }
    setIconUrl(icon_url) { this.icon_url = icon_url; }
    setProxyIconUrl(proxy_icon_url) { this.proxy_icon_url = proxy_icon_url; }
}

class Field {
    constructor(name, value, inline=false) {
        if (name.length >= FIELD_NAME_LIMIT) {
            console.error(`Attempted to exceed limit of ${FIELD_NAME_LIMIT} characters in field name.\n${JSON.stringify(name)}`);
        }
        if (value.length >= FIELD_VALUE_LIMIT) {
            console.error(`Attempted to exceed limit of ${FIELD_VALUE_LIMIT} characters in field value.\n${JSON.stringify(value)}`);
        }
        this.name = name.slice(0, FIELD_NAME_LIMIT);
        this.value = value.slice(0, FIELD_VALUE_LIMIT);
        this.inline = inline;
    }

    setName(name) { this.name = name; }
    setValue(value) { this.value = value; }
    setInlineOn() { this.inline = true; }
}
