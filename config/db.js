const mysql = require("mysql2");
// dotenv solo es necesario para cargar el archivo .env en local
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log("Inicializando configuración de DB (createConnection)...");

// Determinar qué host usar: Prioriza el privado de Railway, luego el público, luego el local
const dbHost =
  process.env.MYSQLPRIVATEHOST ||
  process.env.MYSQLHOST ||
  process.env.DB_HOST ||
  "localhost";
const dbUser = process.env.MYSQLUSER || process.env.DB_USER || "root";
const dbPassword = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "";
const dbName =
  process.env.MYSQLDATABASE || process.env.DB_NAME || "memos_pinturas";
const dbPort = process.env.MYSQLPORT || process.env.DB_PORT || 3306;

// Log de los parámetros que se usarán
console.log(`Attempting DB connection with:`);
console.log(
  `  Host: ${dbHost} (Source: ${
    process.env.MYSQLPRIVATEHOST
      ? "MYSQLPRIVATEHOST"
      : process.env.MYSQLHOST
      ? "MYSQLHOST"
      : process.env.DB_HOST
      ? "DB_HOST"
      : "Default"
  })`
);
console.log(
  `  Port: ${dbPort} (Source: ${
    process.env.MYSQLPORT
      ? "MYSQLPORT"
      : process.env.DB_PORT
      ? "DB_PORT"
      : "Default"
  })`
);
console.log(
  `  User: ${dbUser} (Source: ${
    process.env.MYSQLUSER
      ? "MYSQLUSER"
      : process.env.DB_USER
      ? "DB_USER"
      : "Default"
  })`
);
console.log(
  `  Database: ${dbName} (Source: ${
    process.env.MYSQLDATABASE
      ? "MYSQLDATABASE"
      : process.env.DB_NAME
      ? "DB_NAME"
      : "Default"
  })`
);
console.log(`  Password: ${dbPassword ? "******" : "Empty"}`); // No mostrar la contraseña en logs

// Usar createConnection (como pediste)
const connection = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: dbPort,
  connectTimeout: 20000, // Aumentar un poco el timeout por si la red está lenta (20 segundos)
});

// Conectar manualmente
connection.connect((err) => {
  if (err) {
    // Log más detallado del error de conexión
    console.error(
      `Error al conectar a la base de datos (${dbHost}:${dbPort}): ${err.code} - ${err.message}`
    );
    console.error(err.stack); // Stack trace completo
    // Considerar terminar la app si la conexión falla al inicio en producción
    // if (process.env.NODE_ENV === 'production') { process.exit(1); }
    return;
  }
  console.log(
    `Conexión a la base de datos ${dbName} exitosa (ID: ${connection.threadId})`
  );
});

// Manejar errores post-conexión
connection.on("error", function (err) {
  console.error(`Error en la conexión DB (después de conectar): ${err.code}`);
  // Implementar lógica de reconexión si es necesario para createConnection
});

// Exportar la conexión (o la promesa si usas async/await con mysql2)
module.exports = connection;
// module.exports = connection.promise(); // Recomendado si usas async/await en controladores
