document.addEventListener("click", async (e) => {
  // variables del dom
  const $AREA = document.getElementById("area").value,
    $FECHA = document.getElementById("fecha").value = new Date().toLocaleDateString(),
    $RUT = document.getElementById("rut").value,
    $NOMBRE_C = document.getElementById("nombre_c").value,
    $DIRECCION_ONT_OLT = document.getElementById("direccion_ont_olt").value,
    $ID_LL = document.getElementById("id_ll").value,
    $BOARD = document.getElementById("board").value,
    $NODO = document.getElementById("nodo").value,
    $OBS = document.getElementById("obs").value;



  //Copiar y mostrar tipificacion
  if (e.target.matches("#copiar")) {
    try {
      await navigator.clipboard.writeText(`Area: ${$AREA}
Fecha: ${$FECHA} 
Rut: ${$RUT} 
Nombre: ${$NOMBRE_C} 
Id: ${$ID_LL} 
Board: ${$BOARD}
Nodo: ${$NODO}
Dirección / Ont / Olt: ${$DIRECCION_ONT_OLT}
Observación: ${$OBS}`)

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-start',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'success',
        title: `${$AREA} ${$FECHA} ${$RUT} ${$NOMBRE_C} ${$ID_LL} ${$BOARD} ${$NODO} ${$DIRECCION_ONT_OLT} ${$OBS}`
      })

      //limpiando inputs
      document.getElementById("nombre_c").value = "",
        document.getElementById("rut").value = "",
        document.getElementById("id_ll").value = "",
        document.getElementById("board").value = "",
        document.getElementById("nodo").value = "",
        document.getElementById("direccion_ont_olt").value = "",
        document.getElementById("obs").value = "";

    } catch (err) {
      console.error('Error al copiar al portapapeles:', err)
    }
  }
})


const checkbox = document.getElementById("checkbox");

//tema oscuro está guardado en el localStorage
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  checkbox.checked = true;
} else {
  document.body.classList.remove("dark");
  checkbox.checked = false;
}

// Guardamos el estado del checkbox en el localStorage
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");

  // Guardamos el estado en localStorage
  if (checkbox.checked) {
    localStorage.setItem("darkMode", "true");
  } else {
    localStorage.setItem("darkMode", "false");
  }
});







