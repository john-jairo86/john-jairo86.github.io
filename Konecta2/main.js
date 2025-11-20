document.addEventListener("click", async (e) => {
    const fecha = document.getElementById("fecha").value = new Date().toLocaleString();
    const $AREA = document.getElementById("area").value = "Soporte";
})


const registroModal = document.getElementById('registroModal');
  registroModal.addEventListener('shown.bs.modal', () => {
    document.getElementById('nombre').focus();
  });


document.addEventListener("DOMContentLoaded", () => {
    let db;
    const request = indexedDB.open("KonectDB", 1);
    let dataTable;

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains("registros")) {
            db.createObjectStore("registros", { keyPath: "id", autoIncrement: true });
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        mostrarDatos();
    };

    // Mostrar datos
    function mostrarDatos() {
        const transaction = db.transaction(["registros"], "readonly");
        const store = transaction.objectStore("registros");
        const request = store.getAll();

        request.onsuccess = (e) => {
            const registros = e.target.result.reverse(); // mostrar primero los nuevos
            if (dataTable) dataTable.destroy();
            const tbody = document.getElementById("tableBody");
            tbody.innerHTML = "";

            registros.forEach((item) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${item.area}</td>
                    <td>${item.fecha}</td>
                    <td>${item.nombre}</td>
                    <td>${item.rut}</td>
                    <td>${item.direccion}</td>
                    <td>${item.idCampo}</td>
                    <td>${item.board}</td>
                    <td>${item.olt}</td>
                    <td>${item.observacion}</td>
                    <td>
                        <button class="btn btn-sm btn-warning btn-edit" data-id="${item.id}"><i class="fa-solid fa-pen-to-square" data-id="${item.id}"></i></button>

                        <button class="btn btn-sm btn-danger btn-del" data-id="${item.id}"><i class="fa-solid fa-trash-can" data-id="${item.id}"></i></button>

                        <button class="btn btn-sm btn-secondary btn-copy" data-id="${item.id}"><i class="fa-solid fa-copy" data-id="${item.id}"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            dataTable = $("#tablaRegistros").DataTable({ order: [] });
        };
    }

    // Guardar / Actualizar
    document.getElementById("formRegistro").addEventListener("submit", (e) => {
        e.preventDefault();
        const registro = {
            area: area.value,
            fecha: fecha.value,
            nombre: nombre.value,
            rut: rut.value,
            direccion: direccion.value,
            idCampo: idCampo.value,
            board: board.value,
            olt: olt.value,
            observacion: observacion.value
        };

        const editId = document.getElementById("editId").value;
        const tx = db.transaction(["registros"], "readwrite");
        const store = tx.objectStore("registros");

        if (editId) {
            registro.id = Number(editId);
            store.put(registro);
        } else {
            store.add(registro);
        }

        tx.oncomplete = () => {
            copiarPortapapeles(registro);
            mostrarDatos();
            document.getElementById("nombre").value = "",
                document.getElementById("rut").value = "",
                document.getElementById("idCampo").value = "",
                document.getElementById("board").value = "",
                document.getElementById("olt").value = "",
                document.getElementById("direccion").value = "",
                document.getElementById("observacion").value = "";
            document.getElementById("editId").value = "";
            // bootstrap.Modal.getInstance(document.getElementById("registroModal")).hide();
        };
        document.getElementById("nombre").focus()
        // console.log(registro.area);
        const Toast = Swal.mixin({
                toast: true,
                position: 'top-start',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: `Area: ${registro.area}
                Fecha: ${registro.fecha}
                Rut: ${registro.rut}
                Dirección: ${registro.direccion}
                Id: ${registro.id}
                Board: ${registro.board}
                Olt: ${registro.olt}
                Observación: ${registro.observacion },
`
            })
        
    });

    // Copiar datos al portapapeles
    function copiarPortapapeles(data) {
        const texto = `Área: ${data.area}\nFecha: ${data.fecha}\nNombre: ${data.nombre}\nRUT: ${data.rut}\nDirección: ${data.direccion}\nID: ${data.idCampo}\nBoard: ${data.board}\nOLT: ${data.olt}\nObservación: ${data.observacion}`;
        navigator.clipboard.writeText(texto);
        // console.log(texto);
        const Toast = Swal.mixin({
                toast: true,
                position: 'top-start',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: `${texto},
`
            })
    }

    // Botones de acción
    document.getElementById("tableBody").addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id);
        if (e.target.classList.contains("btn-del")) eliminar(id);
        if (e.target.classList.contains("fa-trash-can")) eliminar(id);
        if (e.target.classList.contains("btn-edit")) editar(id);
        if (e.target.classList.contains("fa-pen-to-square")) editar(id);
        if (e.target.classList.contains("btn-copy")) copiar(id);
        if (e.target.classList.contains("fa-copy")) copiar(id);
    });

    // Eliminar
    function eliminar(id) {
        const tx = db.transaction(["registros"], "readwrite");
        tx.objectStore("registros").delete(id);
        tx.oncomplete = mostrarDatos;
    }

    // Editar
    function editar(id) {
        const tx = db.transaction(["registros"], "readonly");
        const store = tx.objectStore("registros");
        const req = store.get(id);
        req.onsuccess = (e) => {
            const r = e.target.result;
            area.value = r.area;
            fecha.value = r.fecha;
            nombre.value = r.nombre;
            rut.value = r.rut;
            direccion.value = r.direccion;
            idCampo.value = r.idCampo;
            board.value = r.board;
            olt.value = r.olt;
            observacion.value = r.observacion;
            editId.value = r.id;
            new bootstrap.Modal(document.getElementById("registroModal")).show();
        };
    }

    // Copiar desde botón
    function copiar(id) {
        const tx = db.transaction(["registros"], "readonly");
        const store = tx.objectStore("registros");
        const req = store.get(id);
        req.onsuccess = (e) => copiarPortapapeles(e.target.result);
    }

    // Botón nuevo
    document.getElementById("btnNuevo").addEventListener("click", () => {
        // document.getElementById("formRegistro").reset();
        document.getElementById("editId").value = "";

    });
});

// Verifica el estado del modo oscuro en localStorage
const checkbox = document.getElementById("checkbox");
const dataT = document.getElementById("tablaRegistros");


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


 function limpiarPersonas() {
    Swal.fire({
        title: "¿Estas seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DC3545",
        cancelButtonColor: "#3085d6",
        cancelButtonText: "Cancelar",
        confirmButtonText: "¡Si, borralo!"
    }).then((result) => {
        if (result.isConfirmed) {

            // Abrir la BD
            const request = indexedDB.open("KonectDB", 1);

            request.onsuccess = function (event) {
                let db = event.target.result;

                // Limpiar store
                let transaction = db.transaction("registros", "readwrite");
                let store = transaction.objectStore("registros");

                let clearRequest = store.clear();

                clearRequest.onsuccess = function () {

                    // LIMPIAR DataTable si existe
                    if (typeof dataTable !== "undefined" && dataTable) {
                        dataTable.clear().destroy();
                    }

                    // Vaciar la tabla HTML
                    document.getElementById("tableBody").innerHTML = "";

                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });

                    Toast.fire({
                        icon: "success",
                        title: "Tabla eliminada con éxito"
                    });

                    
                };

                clearRequest.onerror = function () {
                    console.error("Error al limpiar la tabla:", clearRequest.error);
                };
            };

            request.onerror = function () {
                console.error("Error al abrir la base de datos:", request.error);
            };
        }
    });
}






