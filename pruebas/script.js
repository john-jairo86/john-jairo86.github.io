document.addEventListener("DOMContentLoaded", async (e) => {
    e.preventDefault();

    const checkbox = document.getElementById("checkbox");
    const dataT = document.getElementById("dataTable");

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

    // let table = new DataTable('#dataTable', {
    //     responsive: true
    // });
})



let db;
document.addEventListener("DOMContentLoaded", () => {
    let request = indexedDB.open("FormDB", 1);
    request.onupgradeneeded = (event) => {
        db = event.target.result;
        db.createObjectStore("records", { keyPath: "id" });
    };
    request.onsuccess = (event) => {
        db = event.target.result;
        loadTable();
    };
});



document.addEventListener("click", async (e) => {
    const $AREA = document.getElementById("area").value,
        $FECHA = document.getElementById("fecha").value = new Date().toLocaleString(),
        $NOMBRE_C = document.getElementById("nombre").value,
        $RUT = document.getElementById("rut").value,
        $DIRECCION_ONT_OLT = document.getElementById("direccion").value,
        $ID_LL = document.getElementById("id").value,
        $BOARD = document.getElementById("board").value,
        $NODO = document.getElementById("nodo").value,
        $OBS = document.getElementById("observacion").value;



    if (e.target.matches("#saveBtn")) {
        try {
            await navigator.clipboard.writeText(`
Area: ${$AREA}
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



        } catch (err) {
            console.error('Error al copiar al portapapeles:', err)
        }



        let record = {
            area: document.getElementById("area").value,
            id: document.getElementById("id").value,
            nombre: document.getElementById("nombre").value,
            rut: document.getElementById("rut").value,
            direccion: document.getElementById("direccion").value,
            board: document.getElementById("board").value,
            nodo: document.getElementById("nodo").value,
            observacion: document.getElementById("observacion").value,
            fecha: document.getElementById("fecha").value
        };
        let transaction = db.transaction(["records"], "readwrite");
        let store = transaction.objectStore("records");
        store.put(record);
        transaction.oncomplete = () => { loadTable(); };


        //limpiando inputs
        document.getElementById("nombre").value = "",
            document.getElementById("rut").value = "",
            document.getElementById("id").value = "",
            document.getElementById("board").value = "",
            document.getElementById("nodo").value = "",
            document.getElementById("direccion").value = "",
            document.getElementById("observacion").value = "";
    }
})





function loadTable() {
    let transaction = db.transaction(["records"], "readonly");
    let store = transaction.objectStore("records");
    let request = store.getAll();
    request.onsuccess = (event) => {
        let tbody = document.querySelector("#dataTable tbody");
        tbody.innerHTML = "";
        event.target.result.forEach((record) => {
            let row = `<tr id="row-${record.id}">
                        <td>${record.area}</td><td>${record.nombre}</td><td>${record.rut}</td><td>${record.direccion}</td><td>${record.id}</td>
                        <td>${record.board}</td><td>${record.nodo}</td><td>${record.observacion}</td><td>${record.fecha}</td>
                        <td class="text-center">
                            <button class='btn btn-warning btn-sm' onclick='editRecord(${JSON.stringify(record)})'><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class='btn btn-danger btn-sm' onclick='deleteRecord("${record.id}")'><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>`;
            tbody.innerHTML += row;
        });



        $(document).ready(function () {
            if ($.fn.DataTable.isDataTable("#dataTable")) {
                $("#").DataTable().destroy(); // Destruye la tabla existente
            }

            $("#dataTable").DataTable({
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
            });
        });

        // $("#dataTable").DataTable();
    };
}

function editRecord(record) {
    document.getElementById("area").value = record.area;
    document.getElementById("id").value = record.id;
    document.getElementById("nombre").value = record.nombre;
    document.getElementById("rut").value = record.rut;
    document.getElementById("direccion").value = record.direccion;
    document.getElementById("board").value = record.board;
    document.getElementById("nodo").value = record.nodo;
    document.getElementById("observacion").value = record.observacion;
    document.getElementById("fecha").value = record.fecha;
    new bootstrap.Modal(document.getElementById("dataModal")).show();
}




function deleteRecord(id) {
    let transaction = db.transaction(["records"], "readwrite");
    let store = transaction.objectStore("records");
    store.delete(id);
    transaction.oncomplete = () => { loadTable(); };
}

function clearForm() {
    // document.getElementById("dataForm").reset();
    // document.getElementById("id").value = Date.now().toString();
}




// Función para eliminar la base de datos IndexedDB
        function deleteIndexedDB() {
            let request = indexedDB.deleteDatabase("FormDB");
            
            request.onsuccess = function() {
                console.log("Base de datos 'FormDB' eliminada con éxito.");
                alert("Base de datos eliminada exitosamente");
            };
            
            request.onerror = function(event) {
                console.error("Error al eliminar la base de datos:", event.target.error);
                alert("Error al eliminar la base de datos");
            };
        }

        document.getElementById("deleteDB").addEventListener("click", deleteIndexedDB);



        