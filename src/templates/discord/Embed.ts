
const EMBED_COLOR = 0xC27C0E
const EMBED_TITLE_LIMIT = 256;
const EMBED_DESCRIPTION_LIMIT = 4096;
const EMBED_FIELDS_LIMIT = 25;
/**
 * Embed response structure.
 * Belongs to Interaction Response's data.
 * https://discord.com/developers/docs/resources/channel#embed-object
 */
export class Embed {
    title?: string
    type?: string = 'rich';
    description?: string
    url?: string
    timestamp?: string // ISO8601 timestamp
    color?: number = EMBED_COLOR;
    footer?: Footer
    image?: Image
    thumbnail?: Thumbnail
    video?: Video
    provider?: Provider
    author?: Author
    fields?: Field[] = [];

    setTitle(title: string) {
        if (title.length >= EMBED_TITLE_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${EMBED_TITLE_LIMIT} characters in title.\n` +
                `${JSON.stringify(title)}`);
        }
        this.title = title.slice(0, EMBED_TITLE_LIMIT);
    }
    setType(type: string) { this.type = type; }
    setDescription(description?: string) {
        if (!description) { return; }
        if (description.length >= EMBED_DESCRIPTION_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${EMBED_DESCRIPTION_LIMIT} characters in description.\n` +
                `${JSON.stringify(description)}`);
        }
        this.description = description.slice(0, EMBED_DESCRIPTION_LIMIT);
    }
    setUrl(url: string) { this.url = url; }
    setTimestampOn() { this.timestamp = new Date().toISOString(); }
    setColor(color: number) { this.color = color; }
    initFooter(text: string) {
        this.footer = new Footer(text);
    }
    initImage(url: string) {
        this.image = new Image(url);
    }
    initThumbnail(url: string) {
        this.thumbnail = new Thumbnail(url);
    }
    initVideo() {
        this.video = new Video();
    }
    initProvider() {
        this.provider = new Provider();
    }
    initAuthor(name: string) {
        this.author = new Author(name);
    }
    addField(name?: string, value?: string, inline?: boolean) {
        if (!this.fields || !name || !value) { return; }
        const field = new Field(name, value, inline);
        if (this.fields.length >= EMBED_FIELDS_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${EMBED_FIELDS_LIMIT} fields.\n` +
                `${JSON.stringify(field)}`);
            return;
        }
        this.fields.push(field);
    }
    addBlankField() {
        if (!this.fields) { return; }
        const field = new Field('', '', false);
        if (this.fields.length >= EMBED_FIELDS_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${EMBED_FIELDS_LIMIT} fields.\n` +
                `${JSON.stringify(field)}`);
            return;
        }
        this.fields.push(field);
    }
}


const FOOTER_TEXT_LIMIT = 2048;
/**
 * Embed response's Footer structure.
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure
 */
class Footer {
    text: string
    icon_url?: string
    proxy_icon_url?: string

    constructor(text: string) {
        if (text.length >= FOOTER_TEXT_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${FOOTER_TEXT_LIMIT} characters in footer text.\n` +
                `${JSON.stringify(text)}`);
        }
        this.text = text.slice(0, FOOTER_TEXT_LIMIT);
    }

    setIconUrl(icon_url: string) { this.icon_url = icon_url; }
    setProxyIconUrl(proxy_icon_url: string) { this.proxy_icon_url = proxy_icon_url; }
}

/**
 * Embed response's Image structure.
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure
 */
class Image {
    url: string
    proxy_url?: string
    height?: number
    width?: number

    constructor(url: string) {
        this.url = url;
    }

    setUrl(url: string) { this.url = url; }
    setProxyUrl(proxy_url: string) { this.proxy_url = proxy_url; }
    setHeight(height: number) { this.height = height; }
    setWidth(width: number) { this.width = width; }
}

/**
 * Embed response's Thumbnail structure.
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-thumbnail-structure
 */
class Thumbnail {
    url: string
    proxy_url?: string
    height?: number
    width?: number

    constructor(url: string) {
        this.url = url;
    }

    setUrl(url: string) { this.url = url; }
    setProxyUrl(proxy_url: string) { this.proxy_url = proxy_url; }
    setHeight(height: number) { this.height = height; }
    setWidth(width: number) { this.width = width; }
}

/**
 * Embed response's Video structure.
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-video-structure
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
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-provider-structure
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
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure
 */
class Author {
    name: string
    url?: string
    icon_url?: string
    proxy_icon_url?: string

    constructor(name: string) {
        if (name.length >= AUTHOR_NAME_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${AUTHOR_NAME_LIMIT} characters in author name.\n` +
                `${JSON.stringify(name)}`);
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
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure
 */
class Field {
    name: string
    value: string
    inline?: boolean | undefined

    constructor(name: string, value: string, inline?: boolean) {
        if (name.length >= FIELD_NAME_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${FIELD_NAME_LIMIT} characters in field name.\n` +
                `${JSON.stringify(name)}`);
        }
        if (value.length >= FIELD_VALUE_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${FIELD_VALUE_LIMIT} characters in field value.\n` +
                `${JSON.stringify(value)}`);
        }
        this.name = name.slice(0, FIELD_NAME_LIMIT);
        this.value = value.slice(0, FIELD_VALUE_LIMIT);
        this.inline = inline;
    }

    setName(name: string) { this.name = name; }
    setValue(value: string) { this.value = value; }
    setInline(isInline: boolean) { this.inline = isInline; }
}
