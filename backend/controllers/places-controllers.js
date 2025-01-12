//getPlaceById
//getPlaceByUserId
//createPlace
//updatePlace
//delete palce
import HttpError from "../models/http-error.js";
import Place from "../models/place.js";
import getCoordsForAddress from "../util/location.js";
import fs from "fs"
import { body, validationResult } from "express-validator";
import User from "../models/user.js";
import mongoose from "mongoose";

export const createPlace = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(400, "Error in validations"));
  }
  const session = await mongoose.startSession(); // بدء جلسة للمعاملة
  session.startTransaction(); // بدء المعاملة

  try {
    const location = await getCoordsForAddress(req.body.address);
    req.body.location = location;
    const user = await User.findById(req.body.creator).session(session);
    if (!user) {
      return next(new HttpError(400, "can't find creator"));
    }
    const place = await Place.create([req.body], { session });
    user.places.push(place[0]._id);
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      status: "success",
      data: {
        place,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(new HttpError(400, err));
  }
};
export const getPlaceById = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.Pid);
    if (!place) {
      return next(new HttpError(400, "id doesn't exist"));
    }
    res.status(200).json({
      status: "success",
      data: {
        place,
      },
    });
  } catch (err) {
    return next(new HttpError(400, "id doesn't correct "));
  }
};
export const getPlacesByUserID = async (req, res, next) => {
  try {
    const PlaceS = await User.findById(req.params.Uid).populate("places");
    if (!PlaceS) {
      return next(new HttpError(400, "id doesn't exist"));
    }
    res.status(200).json({
      status: "success",
      data: {
        USER:PlaceS,
      },
    });
  } catch (err) {
    return next(new HttpError(400, "id doesn't correct "));
  }
};
export const updatePlace = async (req, res, next) => {
  try {
    let place = await Place.findById(req.params.Pid);
    if (!place) {
      return next(new HttpError(400, "Cannot Update"));
    }
    if(place.creator.toString()!==req.userData.id)
    {
      return next(new HttpError(400, "you can't do that"));
    }
    place.title=req.body.title||place.title;
    place.description=req.body.description||place.description;
    await place.save()
    res.status(200).json({
      status: "success",
      data: {
        place,
      },
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError(400, "id doesn't correct "));
  }
};
//deletePlace
// export const deletePlace = async (req, res, next) => {
//   const session = await mongoose.startSession(); // بدء جلسة للمعاملة
//   session.startTransaction(); // بدء المعاملة
//   try{
//     const place=await Place.findByIdAndDelete(req.params.Pid,{session})
//     const user=await User.findById(place.creator).session(session);;
//     await session.commitTransaction();
//     session.endSession();
//     res.status(200).json({
//       status:"success",
//       data : "deleted "
//     })
//   }catch (err)
//   {
//     await session.abortTransaction();
//     session.endSession();
//     return next(new HttpError(400, "id doesn't correct "))
//   }
// };
export const deletePlace = async (req, res, next) => {
  const session = await mongoose.startSession(); // بدء جلسة للمعاملة
  session.startTransaction(); // بدء المعاملة

  try {
    // حذف المكان
    const place = await Place.findById(req.params.Pid).session( session );
    if (!place) {
      return next(new HttpError(400, "no place found"));
    }
    if(place.creator.toString()!==req.userData.id)
      {
        return next(new HttpError(400, "you can't do that"));
      }
    // البحث عن المستخدم
    const user = await User.findById(place.creator).session(session);
    if (!user) {
      return next(new HttpError(400, "User not found"));
    }

    // حذف المكان من قائمة الأماكن الخاصة بالمستخدم
    user.places.pull(place._id)
    await user.save({ session });
    await place.deleteOne({session})
    // تأكيد المعاملة
    await session.commitTransaction();
    session.endSession();
    fs.unlink(place.image,(err)=>{
      console.log(err);
    })
    res.status(200).json({
      status: "success",
      data: "deleted",
    });
  } catch (err) {
    // إلغاء المعاملة وإنهاء الجلسة في حالة حدوث خطأ
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    return next(new HttpError(400, "ID is not correct"));
  }
};
