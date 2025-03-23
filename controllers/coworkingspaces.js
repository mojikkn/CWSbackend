const Coworkingspace = require('../models/Coworkingspace');
const Reservation = require('../models/Reservation.js');

exports.getCoworkingspaces = async (req,res,next) => {
    let query;
    //copy req.query
    const reqQuery = {...req.query};

    //fields to exclude
    const removeFields = ['select','sort','page','limit'];

    //loop over remove fields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    console.log(reqQuery);

    //create query string
    let queryStr = JSON.stringify(reqQuery);
    //create operators
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    //finding resource
    query = Coworkingspace.find(JSON.parse(queryStr)).populate('reservations');

    //select
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }    

    //pagination
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 25;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;

    try {
        const total = await Coworkingspace.countDocuments();
        query = query.skip(startIndex).limit(limit);
        //executing query
        const coworkingspaces = await query;
        //pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {page:page+1, limit}
        }

        if (startIndex > 0) {
            pagination.prev = {page:page-1, limit}
        }
        res.status(200).json({success:true, count:coworkingspaces.length, data:coworkingspaces});
    } catch (err) {
        res.status(400).json({success:false});
    }
};

exports.getCoworkingspace = async (req,res,next) => {
    try {
        const coworkingspace = await Coworkingspace.findById(req.params.id);
        if (!coworkingspace) {
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data:coworkingspace});
    } catch (err) {
        res.status(400).json({success:false});
    }
};

exports.createCoworkingspace = async (req,res,next) => {
    const coworkingspace = await Coworkingspace.create(req.body);
    res.status(201).json({success:true, data:coworkingspace});
};

exports.updateCoworkingspace = async (req,res,next) => {
    try {
        const coworkingspace = await Coworkingspace.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators:true
        });
        if (!coworkingspace) {
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data:coworkingspace});
    } catch (err) {
        res.status(400).json({success:false});
    }
};

exports.deleteCoworkingspace = async (req,res,next) => {
    try {
        const coworkingspace = await Coworkingspace.findById(req.params.id);
        if (!coworkingspace) {
            return res.status(400).json({success:false});
        }
        await Reservation.deleteMany({coworkingspace:req.params.id});
        await Coworkingspace.deleteOne({_id:req.params.id});
        res.status(200).json({success:true, data: {}});
    } catch (err) {
        res.status(400).json({success:false});
    }    
};