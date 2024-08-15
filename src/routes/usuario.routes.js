import { Router } from "express";
import { Usuario } from "../controllers/usuario.controllers.js";


const router = Router()

router.get('/usuarios',Usuario.getUsuarios)

router.get('/usuarios/:documento', Usuario.getUsuario)

router.post('/usuarios', Usuario.postUsuario)

router.patch('/usuarios/:documento', Usuario.patchUsuario)

router.delete('/usuarios/:documento', Usuario.deleteUsuario)

export default router;