
const EMBED_TITLE_LIMIT = 256;
const EMBED_DESCRIPTION_LIMIT = 4096;
const EMBED_FIELDS_LIMIT = 25;
/**
 * Embed response structure.
 * Belongs to Interaction Response's data.
 */
export class Embed {
    title?: string
    type?: string = 'rich'; // Will probably be deprecated in the future
    description?: string
    url?: string
    timestamp?: string // ISO8601 timestamp
    color?: number = 0xFFD700;
    footer?: Footer = new Footer();
    image?: Image = new Image();
    thumbnail?: Thumbnail = new Thumbnail();
    video?: Video = new Video();
    provider?: Provider = new Provider();
    author?: Author = new Author();
    fields?: Field[] = [];

    setTitle(title: string) {
        if (title.length >= EMBED_TITLE_LIMIT) {
            console.error(`Attempted to exceed limit of ${EMBED_TITLE_LIMIT} characters in title.\n${JSON.stringify(title)}`);
        }
        this.title = title.slice(0, EMBED_TITLE_LIMIT);
    }
    // setType(type) { this.type = type; } // Will probably be deprecated in the future
    setDescription(description: string) {
        if (description.length >= EMBED_DESCRIPTION_LIMIT) {
            console.error(`Attempted to exceed limit of ${EMBED_DESCRIPTION_LIMIT} characters in description.\n${JSON.stringify(description)}`);
        }
        this.description = description.slice(0, EMBED_DESCRIPTION_LIMIT);
    }
    setUrl(url: string) { this.url = url; }
    setTimestampOn() { this.timestamp = new Date().toISOString(); }
    setColor(color: number) { this.color = color; }
    addField(name: string, value: string, inline?: boolean) {
        if (!this.fields) { return; }
        const field = new Field(name, value, inline);
        if (this.fields.length >= EMBED_FIELDS_LIMIT) {
            console.error(`Attempted to exceed limit of ${EMBED_FIELDS_LIMIT} fields.\n${JSON.stringify(field)}`);
            return;
        }
        this.fields.push(field);
    }
}


const FOOTER_TEXT_LIMIT = 2048;
/**
 * Embed response's Footer structure.
 */
class Footer {
    text: string
    icon_url?: string
    proxy_icon_url?: string

    setText(text: string) {
        if (text.length >= FOOTER_TEXT_LIMIT) {
            console.error(`Attempted to exceed limit of ${FOOTER_TEXT_LIMIT} characters in footer text.\n${JSON.stringify(text)}`);
        }
        this.text = text.slice(0, FOOTER_TEXT_LIMIT);
    }
    setIconUrl(icon_url: string) { this.icon_url = icon_url; }
    setProxyIconUrl(proxy_icon_url: string) { this.proxy_icon_url = proxy_icon_url; }
}

/**
 * Embed response's Image structure.
 */
class Image {
    url: string
    proxy_url?: string
    height?: number
    width?: number

    setUrl(url: string) { this.url = url; }
    setProxyUrl(proxy_url: string) { this.proxy_url = proxy_url; }
    setHeight(height: number) { this.height = height; }
    setWidth(width: number) { this.width = width; }
}

/**
 * Embed response's Thumbnail structure.
 */
class Thumbnail {
    url: string
    proxy_url?: string
    height?: number
    width?: number

    setUrl(url: string) { this.url = url; }
    setProxyUrl(proxy_url: string) { this.proxy_url = proxy_url; }
    setHeight(height: number) { this.height = height; }
    setWidth(width: number) { this.width = width; }
}

/**
 * Embed response's Video structure.
 */
class Video {
    url?: string
    proxy_url?: string
    height?: number
    width?: number

    setUrl(url: string) { this.url = url; }
    setProxyUrl(proxy_url: string) { this.proxy_url = proxy_url; }
    setHeight(height: number) { this.height = height; }
    setWidth(width: number) { this.width = width; }
}

/**
 * Embed response's Provider structure.
 */
class Provider {
    name?: string
    url?: string

    setName(name: string) { this.name = name; }
    setUrl(url: string) { this.url = url; }
}

const AUTHOR_NAME_LIMIT = 256;
/**
 * Embed response's Author structure.
 */
class Author {
    name: string
    url?: string
    icon_url?: string
    proxy_icon_url?: string

    setName(name: string) {
        if (name.length >= AUTHOR_NAME_LIMIT) {
            console.error(`Attempted to exceed limit of ${AUTHOR_NAME_LIMIT} characters in author name.\n${JSON.stringify(name)}`);
        }
        this.name = name.slice(0, AUTHOR_NAME_LIMIT);
    }
    setUrl(url: string) { this.url = url; }
    setIconUrl(icon_url: string) { this.icon_url = icon_url; }
    setProxyIconUrl(proxy_icon_url: string) { this.proxy_icon_url = proxy_icon_url; }
}

const FIELD_NAME_LIMIT = 256;
const FIELD_VALUE_LIMIT = 1024;
/**
 * Embed response's Field structure.
 */
class Field {
    name: string
    value: string
    inline?: boolean

    constructor(name: string, value: string, inline?: boolean) {
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

    setName(name: string) { this.name = name; }
    setValue(value: string) { this.value = value; }
    setInline(on: boolean) { this.inline = on; }
}
