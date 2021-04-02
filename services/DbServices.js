const Sended = require('../models/sended');
const Pending = require('../models/pending');
const Failed = require('../models/failed');
const Deprecated = require('../models/deprecated');

const saveSended = async (data) => await Sended.create({ phone: data.phone, message: data.message, key: data.key, retry: data.retry, createPending: data.createdAt, updatePending: data.updatedAt });

const saveFailed = async (data) => await Failed.create({ phone: data.phone, message: data.message, key: data.key, retry: data.retry, createPending: data.createdAt, updatePending: data.updatedAt });

const getPendingById = async (id) => await Pending.findByPk(id);

const savePending = async (data) => await Pending.create({ phone: data.phone, message: data.message, key: data.key });

const updatePending = async (id, data) => await Pending.update({ ...data }, {
    where: { id }
});

const deletePending = async (id) => await Pending.destroy({
    where: { id }
});

const deprecatePending = async (data) => await Pending.update({ isDeprecated: true }, {
    where: { 
        phone: data.phone,
        key: data.key
    }
});

const saveDeprecated = async (data) => await Deprecated.create({ phone: data.phone, message: data.message, key: data.key, retry: data.retry, createPending: data.createdAt, updatePending: data.updatedAt });

module.exports = {
    saveSended,
    saveFailed,
    getPendingById,
    savePending,
    updatePending,
    deletePending,
    deprecatePending,
    saveDeprecated
}