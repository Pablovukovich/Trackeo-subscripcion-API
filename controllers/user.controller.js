import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(201).json({ succes: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if(!user){
        const error = new Error('User no encontrado')
        error.statusCode= 404;
        throw error
    }

    res.status(201).json({ succes: true, data: user });
  } catch (error) {
    next(error);
  }
};
