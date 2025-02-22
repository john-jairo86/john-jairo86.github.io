document.addEventListener("DOMContentLoaded", function () {
    const checkbox = document.getElementById("checkbox");
    const dataT = document.getElementById("dataTable");
    const copiarBtn = document.getElementById("copiar");

    if (localStorage.getItem("darkMode") === "true") {
        checkbox.checked = true;
        document.body.classList.add("dark");
        dataT.classList.add("table-dark");
    } else {
        checkbox.checked = false;
        document.body.classList.remove("dark");
        dataT.classList.remove("table-dark");
    }

    // Escucha el cambio en el checkbox para activar/desactivar el modo oscuro
    checkbox.addEventListener("change", () => {
        document.body.classList.toggle("dark");
        dataT.classList.toggle("table-dark");
        localStorage.setItem("darkMode", checkbox.checked ? "true" : "false");
    });

    let table = new DataTable('#dataTable',{
        responsive: true
    });

    function loadFromLocalStorage() {
        let data = JSON.parse(localStorage.getItem('formData')) || [];
        data.forEach(row => {
            table.row.add(row).draw(false);
        });
    }

    copiarBtn.addEventListener("click", async function (e) {
        e.preventDefault();
        
        const $AREA = document.getElementById("area").value;
        const $FECHA = document.getElementById("fecha").value;
        const $NOMBRE_C = document.getElementById("nombre_c").value;
        const $RUT = document.getElementById("rut").value;
        const $DIRECCION_ONT_OLT = document.getElementById("direccion_ont_olt").value;
        const $ID_LL = document.getElementById("id_ll").value;
        const $BOARD = document.getElementById("board").value;
        const $NODO = document.getElementById("nodo").value;
        const $OBS = document.getElementById("obs").value;

        const textToCopy = `Area: ${$AREA}\nFecha: ${$FECHA}\nRut: ${$NOMBRE_C}\nNombre: ${$RUT}\nId: ${$ID_LL}\nBoard: ${$BOARD}\nNodo: ${$NODO}\nDirección / Ont / Olt: ${$DIRECCION_ONT_OLT}\nObservación: ${$OBS}`;

        try {
            await navigator.clipboard.writeText(textToCopy);

            Swal.fire({
                toast: true,
                position: 'top-start',
                icon: 'success',
                title: `Datos copiados: ${$AREA} ${$FECHA} ${$NOMBRE_C} ${$RUT} ${$ID_LL} ${$BOARD} ${$NODO} ${$DIRECCION_ONT_OLT} ${$OBS}`,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });

            let storedData = JSON.parse(localStorage.getItem('formData')) || [];
            let rowData = [$AREA, $FECHA, $NOMBRE_C, $RUT, $DIRECCION_ONT_OLT, $ID_LL, $BOARD, $NODO, $OBS];
            storedData.push(rowData);
            localStorage.setItem('formData', JSON.stringify(storedData));
            table.row.add(rowData).draw(false);

            // Limpiar inputs
            ['nombre_c', 'rut', 'id_ll', 'board', 'nodo', 'direccion_ont_olt', 'obs'].forEach(id => {
                document.getElementById(id).value = "";
            });
        } catch (err) {
            console.error('Error al copiar al portapapeles:', err);
        }
    });

    loadFromLocalStorage();
});
   
    
    
document.addEventListener("click", async (e) => {
  // variables del dom
  const $AREA = document.getElementById("area").value,
    $FECHA = document.getElementById("fecha").value = new Date().toLocaleString(),
    $NOMBRE_C = document.getElementById("nombre_c").value,
    $RUT = document.getElementById("rut").value,
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
Nombre: ${$NOMBRE_C} 
Rut: ${$RUT} 
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
        title: `${$AREA} ${$FECHA} ${$NOMBRE_C} ${$RUT} ${$ID_LL} ${$BOARD} ${$NODO} ${$DIRECCION_ONT_OLT} ${$OBS}`
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
    
    
    
    
    
    
    
    
    