const mongoose = require('mongoose');

/**
 * Checks whether an ID string is a valid MongoDB ObjectId hex string
 */
function isValidObjectId(id) {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(String(id)) && String(new mongoose.Types.ObjectId(id)) === String(id);
}

/**
 * Builds a flexible query filter matching either MongoDB _id or legacy sqlite_id.
 * Works seamlessly whether callers pass '507f1f77bcf86cd799439011' or '42'.
 *
 * @param {string|number} id
 * @param {string} idField - e.g. '_id' or 'book_id' or 'user_id'
 * @param {string} sqliteIdField - e.g. 'sqlite_id' or 'sqlite_book_id'
 */
function buildIdFilter(id, idField = '_id', sqliteIdField = 'sqlite_id') {
  if (id === undefined || id === null || id === '') return { [idField]: null };

  const idStr = String(id).trim();
  const numId = Number(idStr);
  const isNum = !isNaN(numId) && Number.isInteger(numId);
  const isObjId = isValidObjectId(idStr);

  if (isObjId && isNum) {
    return {
      $or: [
        { [idField]: new mongoose.Types.ObjectId(idStr) },
        { [sqliteIdField]: numId }
      ]
    };
  }

  if (isObjId) {
    return {
      $or: [
        { [idField]: new mongoose.Types.ObjectId(idStr) },
        { [sqliteIdField]: numId || -1 }
      ]
    };
  }

  if (isNum) {
    return { [sqliteIdField]: numId };
  }

  return { [idField]: idStr };
}

/**
 * Normalizes document for frontend API response, ensuring:
 * - 'id' is always present (string)
 * - Dates are ISO formatted
 * - Virtuals or plain objects preserved
 */
function serializeDoc(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  if (!obj.id && obj._id) {
    obj.id = String(obj._id);
  }
  return obj;
}

function serializeDocs(docs) {
  if (!Array.isArray(docs)) return [];
  return docs.map(serializeDoc);
}

module.exports = {
  isValidObjectId,
  buildIdFilter,
  serializeDoc,
  serializeDocs
};

