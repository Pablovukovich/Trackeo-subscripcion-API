import Subscripcion from "../models/subscripcion.model";

export const crearSubscripcion = async (req, res, next) => {
  try {
    const subscripcion = await Subscripcion.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: subscripcion });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscripciones = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error("No sos propretiario de esta cuenta ");
      error.status = 401;
      throw error;
    }

    const subscripciones = await Subscripcion.find({ user: req.params.id });

    res.status(201).json({ success: true, data: subscripciones });
  } catch (error) {
    next(error);
  }
};

export const getSubscripciones = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error("No sos propretiario de esta cuenta ");
      error.status = 401;
      throw error;
    }

    const subscripciones = await Subscripcion.find()

    res.status(200).json({ success: true, data: subscripciones });
  } catch (error) {
    next(error);
  }
};
