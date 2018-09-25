// model: pour
var
  mongoose = require('mongoose'),
  pourSchema = new mongoose.Schema({
    ip: { type: String },
    pour_date: { type: Date, default: Date.now },
    wallet_address: { type: String },
    pour_amount: { type: Number, default: 0 },
    comment: { type: String }
  }),
  Pour = mongoose.model('Pour', pourSchema);

module.exports = Pour;
