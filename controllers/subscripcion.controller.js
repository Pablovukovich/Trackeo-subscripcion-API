import Subscripcion from "../models/subscripcion.model.js";
import { worflowClient } from '../config/upstash.js'
import  {SERVER_URL}  from "../config/env.js";
//crear subscripcion
export const crearSubscripcion = async (req, res, next) => {
  try {
    const subscripcion = await Subscripcion.create({
      ...req.body,
      user: req.user._id,
    });
    await worflowClient.trigger(
      {
        url:`${SERVER_URL}/api/vi/subscripciones/reminder`,
        body:{
          subscriptionId: subscripcion.id
        },
        headers: {
          'content-type': 'application/json'
        },
        retries: 0
      }
    )
    res.status(201).json({ success: true, data: subscripcion });
  } catch (error) {
    next(error);
  }
};

//obtener subscripciones de un usuario
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

//obtener todas las subscripciones(role:admin)
export const getSubscripciones = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error("No sos propretiario de esta cuenta ");
      error.status = 401;
      throw error;
    }

    const subscripciones = await Subscripcion.find();

    res.status(200).json({ success: true, data: subscripciones });
  } catch (error) {
    next(error);
  }
};

// Obtiene una suscripción específica por su ID
export const getSubscripcionById = async (req, res, next) => {
  try {
    const subscripcion = await Subscripcion.findById(req.params.id);

    if (!subscripcion) {
      const error = new Error("Suscripción no encontrada.");
      error.status = 404;
      throw error;
    }

    // Opcional: Si quieres asegurar que solo el propietario pueda verla
    if (req.user.id !== subscripcion.user.toString()) {
      const error = new Error("No estás autorizado para ver esta suscripción.");
      error.status = 401;
      throw error;
    }

    res.status(200).json({ success: true, data: subscripcion });
  } catch (error) {
    next(error);
  }
};

//Eliminar subscripcion
export const deleteSubscripcion = async (req, res, next) => {
  try {
    const subscripcion = await Subscripcion.findById(req.params.id);

    if (!subscripcion) {
      const error = new Error("Suscripción no encontrada.");
      error.status = 404;
      throw error;
    }

    if (req.user.id !== subscripcion.user.toString()) {
      const error = new Error("No estás autorizado para ver esta suscripción.");
      error.status = 401;
      throw error;
    }

    await Subscripcion.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Suscripción eliminada correctamente." });
  } catch (error) {
    next(error);
  }
};

// Controlador para actualizar una suscripción
export const updateSubscripcion = async (req, res, next) => {
  try {
    const subscripcion = await Subscripcion.findById(req.params.id);

    if (!subscripcion) {
      const error = new Error("Suscripción no encontrada.");
      error.status = 404;
      throw error;
    }

    if (req.user.id !== subscripcion.user.toString()) {
      const error = new Error(
        "No estás autorizado para actualizar esta suscripción."
      );
      error.status = 401;
      throw error;
    }

    const updatedSubscripcion = await Subscripcion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedSubscripcion });
  } catch (error) {
    next(error);
  }
};

// Controlador para cancelar una suscripción
export const cancelSubscripcion = async (req, res, next) => {
  try {
    const subscripcion = await Subscripcion.findById(req.params.id);

    if (!subscripcion) {
      const error = new Error("Suscripción no encontrada.");
      error.status = 404;
      throw error;
    }

    if (req.user.id !== subscripcion.user.toString()) {
      const error = new Error(
        "No estás autorizado para cancelar esta suscripción."
      );
      error.status = 401;
      throw error;
    }

    // Lógica para cancelar la suscripción (ej. cambiar un campo 'status' a 'cancelled')
    subscripcion.estado = "Cancelada";
    await subscripcion.save();

    res
      .status(200)
      .json({
        success: true,
        data: subscripcion,
        message: "Suscripción cancelada correctamente.",
      });
  } catch (error) {
    next(error);
  }
};

//obtener procxima renovacion
export const getProximaRenovacion = async (req, res, next) => {
  try {
    const subscripcion = await Subscripcion.findById(req.params.id);

    // 1. Verificar si la suscripción existe
    if (!subscripcion) {
      const error = new Error("Suscripción no encontrada.");
      error.status = 404; // No Encontrado
      throw error;
    }

    // 2. Verificar autorización: El usuario autenticado debe ser el propietario de la suscripción
    if (req.user.id !== subscripcion.user.toString()) {
      const error = new Error("No estás autorizado para ver esta información.");
      error.status = 401; // No Autorizado
      throw error;
    }

    // 3. Determinar el estado actual, actualizándolo si ha expirado
    let estadoActualDeLaSuscripcion = subscripcion.estado;
    const ahora = new Date();

    if (
      subscripcion.renovarFecha &&
      subscripcion.renovarFecha < ahora &&
      subscripcion.estado === "Activa"
    ) {
      estadoActualDeLaSuscripcion = "Expirada";
      // OPCIONAL: Si quieres que este cambio se persista inmediatamente en la base de datos,
      // descomenta las siguientes líneas. Ten en cuenta que esto activará de nuevo el hook 'pre('save')'.
      // subscripcion.estado = 'Expirada';
      // await subscripcion.save();
    }

    // 4. Obtener la fecha de próxima renovación directamente del documento
    const proximaRenovacion = subscripcion.renovarFecha;

    // 5. Enviar la respuesta con la fecha de próxima renovación y el estado potencialmente actualizado
    res.status(200).json({
      success: true,
      data: {
        id: subscripcion._id,
        name: subscripcion.name,
        frecuencia: subscripcion.frecuencia,
        proximaRenovacion: proximaRenovacion,
        estado: estadoActualDeLaSuscripcion, // Usar el estado potencialmente actualizado
      },
    });
  } catch (error) {
    next(error);
  }
};