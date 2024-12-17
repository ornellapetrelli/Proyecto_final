import ENVIROMENT from "../config/enviroment.config.js";
import User from "../models/user.js";
import ResponseBuilder from "../utils/builders/responseBuilder.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail } from "../utils/mail.util.js";

export const registerUserController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password || !name) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad request')
                .setPayload({ detail: 'Faltan campos requeridos (nombre, correo, o contraseña)' })
                .build();
            return res.status(400).json(response);
        }

        const existentUser = await User.findOne({ email });
        if (existentUser) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad request')
                .setPayload({ detail: 'El correo electrónico ya está registrado' })
                .build();
            return res.status(400).json(response);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = jwt.sign(
            { email },
            ENVIROMENT.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const url_verification = `http://localhost:${ENVIROMENT.PORT}/api/auth/verify/${verificationToken}`;

        await sendEmail({
            to: email,
            subject: 'Verifica tu correo electrónico',
            html: `
      <h1>Verificación de correo electrónico</h1>
      <p>Haz clic en el siguiente enlace para verificar tu correo electrónico:</p>
      <a style='background-color: black; color: white; padding: 5px; border-radius: 5px;' href="${url_verification}">Verificar ahora</a>
    `
        });

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            emailVerified: false
        });

        await newUser.save();

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(201)
            .setMessage('Usuario creado con éxito')
            .setPayload({})
            .build();
        return res.status(201).json(response);

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error interno del servidor')
            .setPayload({ detail: error.message })
            .build();
        return res.status(500).json(response);
    }
};

export const verifyMailValidationTokenController = async (req, res) => {
    try {
        const { verification_token } = req.params;
        if (!verification_token) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setPayload({ detail: 'Falta enviar el token de verificación' })
                .build();
            return res.json(response);
        }

        const decoded = jwt.verify(verification_token, ENVIROMENT.JWT_SECRET);

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Usuario no encontrado')
                .setPayload({ detail: 'No se encontró el usuario con este correo' })
                .build();
            return res.status(404).json(response);
        }

        if (user.emailVerified) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Correo ya verificado')
                .setPayload({ detail: 'Este correo electrónico ya ha sido verificado' })
                .build();
            return res.status(400).json(response);
        }

        user.emailVerified = true;
        await user.save();

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Correo electrónico verificado con éxito')
            .setPayload({ message: 'Correo electrónico validado correctamente' })
            .build();
        res.json(response);

    } catch (error) {
        console.error('Error en la verificación de correo:', error);
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error interno del servidor')
            .setPayload({ detail: error.message })
            .build();
        return res.status(500).json(response);
    }
};

export const loginController = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        const response = new ResponseBuilder()
          .setOk(false)
          .setStatus(400)
          .setMessage('Credenciales incorrectas')
          .setPayload({ detail: 'El usuario no existe' })
          .build();
        return res.json(response);
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        const response = new ResponseBuilder()
          .setOk(false)
          .setStatus(400)
          .setMessage('Credenciales incorrectas')
          .setPayload({ detail: 'Contraseña incorrecta' })
          .build();
        return res.json(response);
      }
  
      if (!user.emailVerified) {
        const response = new ResponseBuilder()
          .setOk(false)
          .setStatus(403)
          .setMessage('Correo no verificado')
          .setPayload({ detail: 'Por favor, verifica tu correo electrónico antes de iniciar sesión' })
          .build();
        return res.json(response);
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Inicio de sesión exitoso')
        .setPayload({ token })
        .build();
  
      return res.json(response);
  
    } catch (error) {
      console.error(error);
      const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(500)
        .setMessage('Error al iniciar sesión')
        .setPayload({ detail: 'Ocurrió un error en el servidor' })
        .build();
      return res.json(response);
    }
  };

export const forgotPasswordController = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No se encontró el usuario con ese correo.' });
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        const resetLink = `http://localhost:3000/usuarios/restablecer/${resetToken}`;
        await sendEmail({
            to: email,
            subject: 'Restablecer Contraseña',
            html: `<p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
                   <a href="${resetLink}">Restablecer Contraseña</a>
                   <p>El enlace expira en 1 hora.</p>`,
        });

        res.status(200).json({ message: 'Correo enviado. Por favor, verifica tu bandeja de entrada.' });
    } catch (error) {
        console.error('Error en forgotPasswordController:', error);
        res.status(500).json({ message: 'Error al enviar el correo de recuperación.' });
    }
};

export const resetPasswordController = async (req, res) => {
    const { resetToken, newPassword } = req.body;

    if (!resetToken) {
        console.error('Token no proporcionado');
        return res.status(400).json({ message: 'Token no proporcionado.' });
    }
    if (!newPassword) {
        console.error('Nueva contraseña no proporcionada');
        return res.status(400).json({ message: 'Nueva contraseña no proporcionada.' });
    }

    try {
        console.log('Token recibido:', resetToken);
        console.log('Nueva contraseña:', newPassword);

        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded);

        const user = await User.findById(decoded.id);
        if (!user) {
            console.log('Usuario no encontrado');
            return res.status(404).json({ message: 'Token inválido o usuario no encontrado.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Contraseña restablecida con éxito.' });
    } catch (error) {
        console.error('Error en resetPasswordController:', error);
        res.status(500).json({ message: 'Error al restablecer la contraseña.' });
    }
};
