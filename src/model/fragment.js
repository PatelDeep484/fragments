// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
//const logger = require('../logger');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');
const logger = require('../logger');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (id) {
      this.id = id;
    } else {
      this.id = randomUUID();
    }

    if (ownerId && type && Fragment.isSupportedType(type)) {
      this.ownerId = ownerId;
    } else {
      if (!ownerId) {
        throw new Error('The ownerID is not valid');
      }
      if (!type) {
        throw new Error(`Fragment missing type not found!`);
      } else {
        throw new Error(`Fragment type or size is wrong`);
      }
    }

    if (created) {
      this.created = created;
    } else {
      this.created = new Date().toISOString();
    }

    if (updated) {
      this.updated = updated;
    } else {
      this.updated = new Date().toISOString();
    }

    if (!type) {
      throw new Error(`Fragment missing type not found!`);
    } else if (Fragment.isSupportedType(type)) {
      this.type = type;
    } else {
      throw new Error(`Fragment type or size is wrong`);
    }

    if (typeof size === 'number' && size >= 0) {
      this.size = size;
    } else {
      if (!size) {
        this.size = 0;
      } else {
        throw new Error(`Fragment type or size is wrong`);
      }
    }
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    // TODO
    const fragment = await readFragment(ownerId, id);
    if (!fragment) {
      throw new Error(`Fragment not found`);
    }
    return fragment;
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    // TODO
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    // TODO
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    // TODO
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (Buffer.isBuffer(data) == false) {
      logger.debug('data is thrown ======================================================');
      throw new Error('data is not a Buffer');
    }
    this.size = Buffer.byteLength(data);
    await this.save();
    try {
      return await writeFragmentData(this.ownerId, this.id, data);
    } catch (err) {
      logger.debug('data is thrown ======================================================');
      throw new Error('Error setting fragments');
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    // TODO
    return this.type.startsWith('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    // TODO
    //return new Array(this.type.split(';')[0]);
    // const parsedContentType = contentType.parse(this.type);
    // return [parsedContentType.type];
    switch (this.mimeType) {
      case 'text/plain':
        return ['text/plain'];
      case 'text/markdown':
        return ['text/plain', 'text/markdown', 'text/html'];
      case 'text/html':
        return ['text/plain', 'text/html'];
      case 'application/json':
        return ['application/json', 'text/plain'];
      default:
        return ['notSupported/ext'];
    }
  }
  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    // TODO

    const contentTypes = [
      'text/plain',
      'text/plain; charset=utf-8',
      'text/markdown',
      'text/html',
      'application/json',
    ];

    if (contentTypes.includes(value) == true) {
      return true;
    }
    return false;
  }
}

module.exports.Fragment = Fragment;
