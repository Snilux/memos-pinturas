// middlewares/multerConfig.js

const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Importar el módulo File System

// 1. Definir la ruta de subida
// __dirname es la carpeta actual (middlewares)
// '..' sube un nivel (a la raíz del proyecto)
// Luego entra a public/uploads/images
// *** ¡ASEGÚRATE QUE ESTA RUTA SEA CORRECTA PARA TU PROYECTO! ***
const UPLOAD_DIR = path.join(__dirname, "..", "public", "uploads", "images");

console.log(`[Multer Config] Directorio de subida configurado: ${UPLOAD_DIR}`);

// 2. Crear el directorio si no existe (Solución TEMPORAL)
//    ADVERTENCIA: En plataformas como Railway/Heroku, este directorio
//    se borrará en cada despliegue o reinicio. NO ES PERSISTENTE.
//    Para producción, usa Almacenamiento de Objetos (S3, GCS) o Volúmenes Persistentes.
try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    console.log(`[Multer Config] Directorio creado: ${UPLOAD_DIR}`);
  } else {
    // console.log(`[Multer Config] Directorio ya existe: ${UPLOAD_DIR}`); // Log opcional
  }
} catch (err) {
  console.error(
    `[Multer Config] ¡ERROR CRÍTICO! No se pudo crear el directorio de subida ${UPLOAD_DIR}:`,
    err
  );
  // Considera qué hacer si no se puede crear el directorio.
  // ¿Detener la app? ¿Deshabilitar subidas?
}

// 3. Configurar el almacenamiento en disco de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // El directorio ya debería existir gracias al código anterior.
    // Solo pasamos la ruta a multer.
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // Generar un nombre de archivo único (tu lógica parece buena)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Usar 'imagen-' como prefijo o el fieldname original si lo prefieres
    cb(null, "imagen-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// 4. Configurar Multer (puedes añadir filtros de archivo, límites, etc.)
const fileFilter = (req, file, cb) => {
  // Aceptar solo imágenes
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    console.warn(
      "[Multer Config] Intento de subir archivo no permitido:",
      file.mimetype
    );
    cb(new Error("¡Solo se permiten archivos de imagen!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Ejemplo: Limitar a 10MB
  },
});

module.exports = upload;
