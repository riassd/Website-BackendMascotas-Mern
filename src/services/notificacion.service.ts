import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UsuarioRepository} from '../repositories';
const sgMail = require('@sendgrid/mail');
require('dotenv').config();
@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionService {
  constructor(
    
    /* Add @inject to inject parameters */
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
  ) { }
  enviarCorreo(destino: string, asunto: string, cuerpo: string) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: destino,
      from: process.env.CORREO_SENDGRID,
      subject: asunto,
      html: cuerpo,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log('Correo electrónico enviado');
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }

}
