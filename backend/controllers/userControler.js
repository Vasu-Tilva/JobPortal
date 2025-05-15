import { response } from "express";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      role,
      firstNiche,
      secondNiche,
      thirdNiche,
      password,
      coverLetter,
    } = req.body;

    if (!name || !email || !phone || !address || !password || !role) {
      return next(new ErrorHandler("All fields are required.", 400));
    }
    if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
      return next(
        new ErrorHandler("Please provide your prefered niches.", 400)
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email is already registerd.", 400));
    }

    const userData = {
      name,
      email,
      phone,
      address,
      role,
      niches: {
        firstNiche,
        secondNiche,
        thirdNiche,
      },
      password,
      coverLetter,
    };

    if (req.files && req.files.resume) {
      const { resume } = req.files;
      if (resume && resume.tempFilePath) {
        try {
          const cloudinaryResponse = await cloudinary.uploader.upload(
            resume.tempFilePath,
            {
              folder: "Job_Seekers_Resume",
              access_mode: "public",
            }
          );
          if (!cloudinaryResponse || cloudinaryResponse.error) {
            return next(new ErrorHandler(`Failed to upload resume. ${JSON.stringify(cloudinaryResponse.error)}`, 500));
          }
          userData.resume = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
          };
        } catch (error) {
          return next(
            new ErrorHandler(`Failed to upload resume. ${error.message}`, 500)
          );
        }
      } else {
        return next(new ErrorHandler("Resume file is missing.", 400));
      }
    }

    const user = await User.create(userData);

    sendToken(user, 201, res, "User Registered");
  } catch (error) {
    next(error);
    console.log(error);
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, role, password } = req.body;
  if (!role || !email || !password) {
    return next(
      new ErrorHandler("Email, Password and Role are required.", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  if (user.role != role) {
    return next(new ErrorHandler("Invalid user role.", 400));
  }

  sendToken(user, 200, res, "User Logged In.");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    coverLetter: req.body.coverLetter,
    niches: {
      firstNiche: req.body.firstNiche,
      secondNiche: req.body.secondNiche,
      thirdNiche: req.body.thirdNiche,
    },
  };

  console.log(newUserData);

  const { firstNiche, secondNiche, thirdNiche } = newUserData.niches;
  

  if (
    req.user.role === "Job Seeker" &&
    (!firstNiche || !secondNiche || !thirdNiche)
  ) {
    return next(
      new ErrorHandler("Please provide your all prefered niches.", 400)
    );
  }

  if (req.files) {
    const resume = req.files.resume;
    if (resume) {
      const currentResumeId = req.user.resume.public_id;
      if (currentResumeId) {
        await cloudinary.uploader.destroy(currentResumeId);
      }
      const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "Job_Seekers_Resume",
      });
      if (!newResume || newResume.error) {
        return next(new ErrorHandler(`Faild to upload new resume.`, 500));
      }
      newUserData.resume ={
        public_id: newResume.public_id,
        url: newResume.secure_url,
      };
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
    message: "Profile updated.",
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Current password is incorrect.", 400));
  }

  if(!req.body.newPassword){
    return next(
      new ErrorHandler("Please Enter New Password", 400)
    );
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("New password & confirm password do not match.", 400)
    );
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res, "Password updated successfully.");
});