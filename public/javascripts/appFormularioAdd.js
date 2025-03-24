document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const uploadArea = document.getElementById('uploadArea');
  const imageUpload = document.getElementById('imageUpload');
  const imagePreview = document.getElementById('imagePreview');


  // Función para manejar la carga de imágenes
  imageUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        document.querySelector('.upload-placeholder').style.display = 'none';
      }
      
      reader.readAsDataURL(file);
    }
  });

  // Drag and drop para la zona de carga
  uploadArea.addEventListener('dragover', function(e) {
    console.log("Área de carga clickeada");
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', function() {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
      imageUpload.files = e.dataTransfer.files;
      
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        document.querySelector('.upload-placeholder').style.display = 'none';
      }
      
      reader.readAsDataURL(file);
    }
  });


  // Hacer clic en la zona de carga para activar el input de archivo
  // uploadArea.addEventListener('click', function() {
  //   imageUpload.click();
  // });

  // Restablecer la vista previa cuando se hace clic en la imagen
  imagePreview.addEventListener('click', function(e) {
    e.stopPropagation(); // Evitar que el clic se propague al área de carga
  });
});