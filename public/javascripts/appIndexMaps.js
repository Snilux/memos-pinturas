// Inicializar el mapa cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
  // Coordenadas del Ángel de la Independencia (como ejemplo)
  const lat = 18.880023547864074;
  const lng = -97.84897975906077;

  // Crear el mapa y establecer la vista en las coordenadas con un nivel de zoom
  const map = L.map("mapa").setView([lat, lng], 15);

  // Añadir la capa de OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  // Crear un icono personalizado para el marcador
  const iconoTienda = L.icon({
    iconUrl: "img/icono__memosPinturas.png",
    iconSize: [40, 40], // tamaño del icono
    iconAnchor: [20, 40], // punto del icono que corresponde a la ubicación del marcador
    popupAnchor: [0, -40], // punto desde el que se debe abrir el popup en relación con el iconAnchor
  });

  // Añadir un marcador en las coordenadas
  const marker = L.marker([lat, lng], { icon: iconoTienda }).addTo(map);

  // Añadir un popup al marcador
  marker
    .bindPopup(
      `
            <div class="popup__contenido">
                <h3 class="popup__titulo">Memos Pinturas</h3>
                <p class="popup__direccion">Cuapiaxtla - Acatlán de Osorio, 75290 </p>
                <p>San Miguel Zacaola, Puebla, México.</p>
                <a href="tel:+2215913273" class="popup__enlace">Llamar: (52) 221-591-32-73</a>
            </div>
        `
    )
    .openPopup();

  // Hacer que el botón "Cómo Llegar" abra Google Maps con las direcciones
  document
    .getElementById("como-llegar")
    .addEventListener("click", function (e) {
      e.preventDefault();
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
        "_blank"
      );
    });
});
