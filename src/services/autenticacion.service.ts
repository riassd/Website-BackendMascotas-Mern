import { injectable, /* inject, */ BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Llaves } from '../config/llaves';
import { Usuario } from '../models';
import { UsuarioRepository } from '../repositories';
const generador = require('password-generator');
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

@injectable({ scope: BindingScope.TRANSIENT })
export class AutenticacionService {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository

  ) { }

  /*
   * Add service methods here
   */

  GenerarContrasena() {
    const contrasena = generador(8, false);
    return contrasena;
  }

  CifrarContrasena(contrasena: string) {
    const contrasenaCifrada = cryptoJS.MD5(contrasena).toString();
    return contrasenaCifrada;
  }

  IdentificarUsuario(usuario: string, contrasena: string) {
    try {
      let p = this.usuarioRepository.findOne({ where: { correo: usuario, contrasena: contrasena } });

      if (p) {
        return p;


      }
      return false;
    } catch {
      return false;
    }
  }

  GenerarTokenJWT(usuario: Usuario) {
    let token = jwt.sign({
      data:{
        id: usuario.id,
        correo: usuario.correo,
        nombre: usuario.nombre,
      }
    },
      Llaves.contrasenaJWT);
      return token;
  }
  ValidarTokenJWT(token:string){
try {
  let datos=jwt.verify(token, Llaves.contrasenaJWT);
  if(datos){return datos};
  return false;
} catch {
  return false;
}
  }
}