import { pool } from "../db.js";

const getUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Usuario");
        console.log(rows[0])
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener los Usuario:", error);
        res.status(500).json({ message: "Fallo al obtener los Usuarios de la base de datos" });
    }

}

const getUsuario = async (req, res) => {
    try {
        console.log(req.params.documento)
        const [rows] = await pool.query("SELECT * FROM Usuario WHERE Documento = ?", [req.params.documento]);

        if (rows.length === 0) return res.status(404).json({ message: 'Datos no encontrados' })

        res.json(rows[0]);
    } catch (error) {
        console.error("Error al obtener los Usuario:", error);
        res.status(500).json({ message: "Fallo al obtener el Usuario de la base de datos" });
    }

}


const postUsuario = async (req, res) => {
    console.log(req.body)

    const { documento, tipo_documento } = req.body;

    if (!documento || !tipo_documento) {
        return res.status(400).json({ message: "La documento y el tipo documento son requeridos." });
    }

    try {
        
        const [result] = await pool.query('INSERT INTO Usuario (Documento, tipo_documento) VALUES (?, ?)', [documento, tipo_documento]);

        res.status(201).json({ message: "Usuario agregado exitosamente", Documento: result.insertId });
    } catch (error) {
        console.error("Error al agregar el vehículo:", error);
        res.status(500).json({ message: "Fallo al agregar el vehículo a la base de datos" });
    }
};

const patchUsuario = async (req, res) => {
    const { documento } = req.params;
    const { documento_nuevo ,tipo_documento } = req.body;

    console.log(req.body)

    try {

        if (documento != documento_nuevo) {
            const [rows] = await pool.query('UPDATE Usuario SET Documento = IFNULL(?, Documento), tipo_documento = IFNULL(?, tipo_documento) WHERE Documento = ?', [documento_nuevo, tipo_documento, documento]);
            if (rows.affectedRows === 0) return res.status(404).json({ message: 'Datos no encontrados' });
        }

        // Si la nueva placa es diferente, aplica la actualización
        const [rows] = await pool.query('UPDATE Usuario SET  tipo_documento  = IFNULL(?,tipo_documento ) WHERE Documento = ?', [tipo_documento, documento]);

        if (rows.length === 0) return res.status(404).json({ message: 'Datos no encontrados' })

        
        res.json({ message: 'Vehículo actualizado exitosamente', vehicle: rows });
    } catch (error) {
        console.error("Error al actualizar el vehículo:", error);
        res.status(500).json({ message: "Fallo al actualizar el vehículo en la base de datos" });
    }
};


const deleteUsuario = async (req, res) => {
    try {
        const [rows] = await pool.query('DELETE FROM Usuario WHERE documento = ? ', [req.params.documento]);

        if (rows.length === 0) return res.status(404).json({ message: 'Datos no encontrados' })


        res.status(200).json({ message: "El usuario " + req.params.documento + " se elimino correctamente" });
    } catch (error) {
        console.error("Error al obtener los usuario:", error);
        res.status(500).json({ message: "Fallo al obtener el Usuario de la base de datos" });
    }
}

export const Usuario = { getUsuarios, getUsuario, patchUsuario, postUsuario, deleteUsuario }

