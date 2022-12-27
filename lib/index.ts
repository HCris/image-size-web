import { typeHandlers, imageType } from './types';
import { detector } from './detector';
import { ISizeCalculationResult } from './types/interface';

interface Options {
  disabledFS: boolean
  disabledTypes: imageType[]
}

const globalOptions: Options = {
  disabledFS: false,
  disabledTypes: [],
};

/**
 * Return size information based on a buffer
 *
 * @param {Buffer} buffer
 * @returns {Object}
 */
function lookup(buffer: Buffer): ISizeCalculationResult {
  // detect the file type... don't rely on the extension
  const type = detector(buffer);

  if (typeof type !== 'undefined') {
    if (globalOptions.disabledTypes.indexOf(type) > -1) {
      throw new TypeError('disabled file type: ' + type);
    }

    // find an appropriate handler for this file type
    if (type in typeHandlers) {
      const size = typeHandlers[type].calculate(buffer);
      if (size !== undefined) {
        size.type = type;
        return size;
      }
    }
  }


  // throw up, if we don't understand the file
  throw new TypeError(`unsupported file type: ${type}`);
}

// eslint-disable-next-line @typescript-eslint/no-use-before-define
module.exports = exports = imageSize; // backwards compatibility

export default imageSize;
export function imageSize(input: Buffer): ISizeCalculationResult

/**
 * @param {Buffer} input - buffer or relative/absolute path of the image file
 */
export function imageSize(input: Buffer): ISizeCalculationResult {
  // Handle buffer input
  if (!Buffer.isBuffer(input)) {
    throw new TypeError('invalid invocation. input should be a Buffer');
  }

  return lookup(input);
}

export const types = Object.keys(typeHandlers);
