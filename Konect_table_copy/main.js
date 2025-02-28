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

    let table = new DataTable('#dataTable', {
        responsive: true
    });
})



document.addEventListener("click", async (e) => {
    const $AREA = document.getElementById("area").value,
        $FECHA = document.getElementById("fecha").value = new Date().toLocaleString(),
        $NOMBRE_C = document.getElementById("nombre_c").value,
        $RUT = document.getElementById("rut").value,
        $DIRECCION_ONT_OLT = document.getElementById("direccion_ont_olt").value,
        $ID_LL = document.getElementById("id_ll").value,
        $BOARD = document.getElementById("board").value,
        $NODO = document.getElementById("nodo").value,
        $OBS = document.getElementById("obs").value;

    if (e.target.matches("#copiar")) {
        //Copiar y mostrar tipificacion
        if (e.target.matches("#copiar")) {
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
    }
})









let db;

    // Abrir o crear la base de datos
    let request = indexedDB.open("MiDB", 1);

    request.onupgradeneeded = function(event) {
        let db = event.target.result;
        let objectStore = db.createObjectStore("Personas", { keyPath: "id", autoIncrement: true });

        // Índices para cada campo
        objectStore.createIndex("area", "area", { unique: false });
        objectStore.createIndex("fecha", "fecha", { unique: false });
        objectStore.createIndex("nombre", "nombre", { unique: false });
        objectStore.createIndex("rut", "rut", { unique: false });
        objectStore.createIndex("direccion", "direccion", { unique: false });
        objectStore.createIndex("board", "board", { unique: false });
        objectStore.createIndex("nodo", "nodo", { unique: false });
        objectStore.createIndex("observaciones", "observaciones", { unique: false });

        console.log("Base de datos creada.");
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log("Base de datos abierta.");
        cargarDatos();  // Cargar datos al iniciar la página
    };

    request.onerror = function(event) {
        console.error("Error al abrir la base de datos:", event.target.errorCode);
    };

    function agregarPersona() {
        let persona = {
            area: document.getElementById("area").value,
            fecha: document.getElementById("fecha").value,
            nombre: document.getElementById("nombre_c").value,
            rut: document.getElementById("rut").value,
            direccion: document.getElementById("direccion_ont_olt").value,
            id: document.getElementById("id_ll").value,
            board: document.getElementById("board").value,
            nodo: document.getElementById("nodo").value,
            observaciones: document.getElementById("obs").value
        };

        

        let transaction = db.transaction(["Personas"], "readwrite");
        let objectStore = transaction.objectStore("Personas");

        let request = objectStore.add(persona);

        request.onsuccess = function() {
            console.log("Persona agregada.");
            cargarDatos(); // Recargar la tabla
        };

        request.onerror = function() {
            console.error("Error al agregar la persona.");
        };
    }

    function cargarDatos() {
        let tbody = document.getElementById("tabla-body");
        tbody.innerHTML = ""; // Limpiar tabla antes de cargar

        let transaction = db.transaction(["Personas"], "readonly");
        let objectStore = transaction.objectStore("Personas");

        objectStore.openCursor().onsuccess = function(event) {
            let cursor = event.target.result;
            if (cursor) {
                let fila = document.createElement("tr");
                let datos = cursor.value;
                fila.innerHTML = `
                    <td>${datos.area}</td>
                    <td>${datos.fecha}</td>
                    <td>${datos.nombre}</td>
                    <td>${datos.rut}</td>
                    <td>${datos.direccion}</td>
                    <td>${datos.id}</td>
                    <td>${datos.board}</td>
                    <td>${datos.nodo}</td>
                    <td>${datos.observaciones}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick='copiarFila(${JSON.stringify(datos)})'>Copiar</button>
                    </td>
                `;
                tbody.appendChild(fila);
                cursor.continue();
            }
        };
    }

    function eliminarPersona(id) {
        let transaction = db.transaction(["Personas"], "readwrite");
        let objectStore = transaction.objectStore("Personas");

        let request = objectStore.delete(id);

        request.onsuccess = function() {
            console.log("Persona eliminada.");
            cargarDatos(); // Recargar la tabla
        };

        request.onerror = function() {
            console.error("Error al eliminar la persona.");
        };
    }

    function copiarFila(datos) {
        let texto = Object.values(datos).join(" ");
        
        navigator.clipboard.writeText(texto).then(() => {
            // alert("Información copiada: " + texto);
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
                title: `${texto}`
            })
        }).catch(err => {
            console.error("Error al copiar: ", err);
        });
    }


    



    function limpiarPersonas() {
        const dbName = "MiDB"; // Nombre de la base de datos
        const storeName = "Personas"; // Nombre de la tabla (almacén de objetos)
    
        let request = indexedDB.open(dbName);
    
        request.onsuccess = function(event) {
            let db = event.target.result;
            let transaction = db.transaction(storeName, "readwrite");
            let store = transaction.objectStore(storeName);
    
            let clearRequest = store.clear();
    
            clearRequest.onsuccess = function() {
                // console.log(`Todos los datos en '${storeName}' han sido eliminados.`);
                // alert(`Todos los datos en '${storeName}' han sido eliminados.`);
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
                    title: `Los datos de la tabla han sido eliminados`
                })
            };
    
            clearRequest.onerror = function() {
                console.error("Error al limpiar la tabla:", clearRequest.error);
                console.log("Error al limpiar la tabla.");
            };
        };
    
        request.onerror = function() {
            console.error("Error al abrir la base de datos:", request.error);
            console.log("Error al abrir la base de datos.");
            
        };
    }
