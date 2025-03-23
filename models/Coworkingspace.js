const mongoose = require('mongoose');

const CoworkingspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    district: {
        type: String,
        required: [true, 'Please add a district']
    },
    province: {
        type: String,
        required: [true, 'Please add a province']
    },
    tel: {
        type: String
    },
    openTime: {
        type: String,
        required: [true, 'Please add open time']
    },
    closeTime: {
        type: String,
        required: [true, 'Please add close time']
    },
    picture: {
        type: String,
        required: false
    }
},  {
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

CoworkingspaceSchema.virtual('reservations',{
    ref:'Reservation',
    localField:'_id',
    foreignField:'coworkingspace',
    justOne:false
});

module.exports = mongoose.model('Coworkingspace', CoworkingspaceSchema);