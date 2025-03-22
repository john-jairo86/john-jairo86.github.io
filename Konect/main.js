document.addEventListener("DOMContentLoaded", () => {
    let db;
    const request = indexedDB.open("KonectDB", 1);

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

    request.onerror = (event) => {
        console.error("Error al abrir la base de datos", event.target.error);
    };

    document.getElementById("copiar").addEventListener("click", () => {
        const id = document.getElementById("editIndex").value;
        const data = {
            area: document.getElementById("area").value,
            fecha: document.getElementById("fecha").value,
            nombre: document.getElementById("nombre_c").value,
            rut: document.getElementById("rut").value,
            direccion: document.getElementById("direccion_ont_olt").value,
            id_llamada: document.getElementById("id_ll").value,
            board: document.getElementById("board").value,
            nodo: document.getElementById("nodo").value,
            observacion: document.getElementById("obs").value
        };

        const transaction = db.transaction(["registros"], "readwrite");
        const store = transaction.objectStore("registros");

        if (id) {
            data.id = Number(id);
            store.put(data);
        } else {
            store.add(data);
        }

        transaction.oncomplete = () => {
            // Swal.fire("Éxito", "Datos guardados en IndexedDB", "success");
            document.getElementById("editIndex").value = "";
            mostrarDatos();
        };

        transaction.onerror = (event) => {
            console.error("Error al guardar en IndexedDB", event.target.error);
        };
    });

    function mostrarDatos() {
        const tableBody = document.getElementById("tableBody_users");
        tableBody.innerHTML = "";

        const transaction = db.transaction(["registros"], "readonly");
        const store = transaction.objectStore("registros");
        const request = store.openCursor();

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const row = `<tr>
                    <td>${cursor.value.area}</td>
                    <td>${cursor.value.fecha}</td>
                    <td>${cursor.value.nombre}</td>
                    <td>${cursor.value.rut}</td>
                    <td>${cursor.value.direccion}</td>
                    <td>${cursor.value.id_llamada}</td>
                    <td>${cursor.value.board}</td>
                    <td>${cursor.value.nodo}</td>
                    <td>${cursor.value.observacion}</td>
                    <td class="text-center">
                        <button class='btn btn-warning btn-sm' onclick='editarRegistro(${cursor.key})'><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class='btn btn-danger btn-sm' onclick='eliminarRegistro(${cursor.key})'><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>`;
                tableBody.innerHTML += row;
                cursor.continue();
            }
        };
    }

    window.eliminarRegistro = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar!"
        }).then((result) => {
            if (result.isConfirmed) {
                const transaction = db.transaction(["registros"], "readwrite");
                const store = transaction.objectStore("registros");
                store.delete(id);

                transaction.oncomplete = () => {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-start",
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });
                    Toast.fire({
                        icon: "success",
                        title: "Registro eliminado correctamente"
                    });
                    mostrarDatos();
                };
            }
        });
    };


    window.editarRegistro = (id) => {
        const transaction = db.transaction(["registros"], "readonly");
        const store = transaction.objectStore("registros");
        const request = store.get(id);

        request.onsuccess = (event) => {
            const data = event.target.result;
            if (data) {
                document.getElementById("editIndex").value = data.id;
                document.getElementById("area").value = data.area;
                document.getElementById("fecha").value = data.fecha;
                document.getElementById("nombre_c").value = data.nombre;
                document.getElementById("rut").value = data.rut;
                document.getElementById("direccion_ont_olt").value = data.direccion;
                document.getElementById("id_ll").value = data.id_llamada;
                document.getElementById("board").value = data.board;
                document.getElementById("nodo").value = data.nodo;
                document.getElementById("obs").value = data.observacion;

                const modal = new bootstrap.Modal(document.getElementById("tipiguia"));
                modal.show();
            }
        };
    };
});





// Verifica el estado del modo oscuro en localStorage
const checkbox = document.getElementById("checkbox");
const dataT = document.getElementById("datatable_users");


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



// Copiar a portapapeles y mostrar en modal
document.addEventListener("click", async (e) => {
    // variables del dom
    const $AREA = document.getElementById("area").value = "Soporte";
    $FECHA = document.getElementById("fecha").value = new Date().toLocaleString();
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
            await navigator.clipboard.writeText(`Área: ${$AREA}
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
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: `Área: ${$AREA}
Fecha: ${$FECHA} 
Nombre: ${$NOMBRE_C} 
Rut: ${$RUT} 
Id: ${$ID_LL} 
Board: ${$BOARD}
Nodo: ${$NODO}
Dirección / Ont / Olt: ${$DIRECCION_ONT_OLT}
Observación: ${$OBS}`
            })

            //limpiando inputs
            document.getElementById("nombre_c").value = "",
                document.getElementById("rut").value = "",
                document.getElementById("id_ll").value = "",
                document.getElementById("board").value = "",
                document.getElementById("nodo").value = "",
                document.getElementById("direccion_ont_olt").value = "",
                document.getElementById("obs").value = "";

                document.getElementById("nombre_c").focus();
        } catch (err) {
            console.error('Error al copiar al portapapeles:', err)
        }
    }
})



// datatatable
let dataTable;
let dataTableIsInitialized = false;

const dataTableOptions = {
    //scrollX: "2000px",
    lengthMenu: [5, 10, 15, 20, 100, 200, 500],
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4, 5, 6] },
        { orderable: false, targets: [5, 6] },
        { searchable: false, targets: [1] }
        //{ width: "50%", targets: [0] }
    ],
    pageLength: 5,
    destroy: true,
    language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún usuario encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuario encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    }
};

const initDataTable = async () => {
    if (dataTableIsInitialized) {
        dataTable.destroy();
    }

    await listUsers();

    dataTable = $("#datatable_users").DataTable(dataTableOptions);

    dataTableIsInitialized = true;
};

const listUsers = async () => {
    // try {
    //     const response = await fetch("https://jsonplaceholder.typicode.com/users");
    //     const users = await response.json();

    //     let content = ``;
    //     users.forEach((user, index) => {
    //         content += `
    //             <tr>
    //                 <td>${index + 1}</td>
    //                 <td>${user.name}</td>
    //                 <td>${user.email}</td>
    //                 <td>${user.address.city}</td>
    //                 <td>${user.company.name}</td>
    //                 <td><i class="fa-solid fa-check" style="color: green;"></i></td>
    //                 <td>
    //                     <button class="btn btn-sm btn-primary"><i class="fa-solid fa-pencil"></i></button>
    //                     <button class="btn btn-sm btn-danger"><i class="fa-solid fa-trash-can"></i></button>
    //                 </td>
    //             </tr>`;
    //     });
    //     tableBody_users.innerHTML = content;
    // } catch (ex) {
    //     alert(ex);
    // }
};




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
            const dbName = "KonectDB";
            const storeName = "registros";
            let request = indexedDB.open(dbName);

            request.onsuccess = function (event) {
                let db = event.target.result;
                let transaction = db.transaction(storeName, "readwrite");
                let store = transaction.objectStore(storeName);

                let clearRequest = store.clear();

                clearRequest.onsuccess = function () {
                    // 
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-start",
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
                        title: "Tabla eliminada con exito"
                    });
                    mostrarDatos(); // Actualizar la tabla después de eliminar los datos
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

function mostrarDatos() {
    const tableBody = document.getElementById("tableBody_users");
    tableBody.innerHTML = "";

    const dbName = "KonectDB";
    let request = indexedDB.open(dbName);

    request.onsuccess = function (event) {
        let db = event.target.result;
        const transaction = db.transaction(["registros"], "readonly");
        const store = transaction.objectStore("registros");
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const row = `<tr>
                    <td>${cursor.value.area}</td>
                    <td>${cursor.value.fecha}</td>
                    <td>${cursor.value.nombre}</td>
                    <td>${cursor.value.rut}</td>
                    <td>${cursor.value.direccion}</td>
                    <td>${cursor.value.id_llamada}</td>
                    <td>${cursor.value.board}</td>
                    <td>${cursor.value.nodo}</td>
                    <td>${cursor.value.observacion}</td>
                    <td class="text-center">
                        <button class='btn btn-warning btn-sm' onclick='editarRegistro(${cursor.key})'><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class='btn btn-danger btn-sm' onclick='eliminarRegistro(${cursor.key})'><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>`;
                tableBody.innerHTML += row;
                cursor.continue();
            }
        };
    };
}



window.addEventListener("load", async () => {
    await initDataTable();
});
