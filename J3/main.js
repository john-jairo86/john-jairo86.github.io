document.addEventListener("click", async (e) => {
    const fecha = document.getElementById("fecha").value = new Date().toLocaleString();
    const $CEDULA = document.getElementById("cedula").value;
})


const registroModal = document.getElementById('registroModal');
registroModal.addEventListener('shown.bs.modal', () => {
    document.getElementById('idCampo').focus();
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
                    <td>${item.fecha}</td>
                    <td>${item.nombre}</td>
                    <td>${item.rut}</td>
                    <td>${item.direccion}</td>
                    <td>${item.idCampo}</td>
                    <td>${item.observacion}</td>
                    <td id="btn_table" class="text-center">
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
            fecha: fecha.value,
            cedula: cedula.value,
            idCampo: idCampo.value,
            telefono: telefono.value,
            nombre: nombre.value,
            rut: rut.value,
            codigo_c: codigo_c.value,
            nodo: nodo.value,
            direccion: direccion.value,
            ont: ont.value,
            olt: olt.value,
            tarjeta: tarjeta.value,
            puerto: puerto.value,
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
                document.getElementById("idCampo").value = "",
                document.getElementById("telefono").value = "",
                document.getElementById("nombre").value = "",
                document.getElementById("rut").value = "",
                document.getElementById("codigo_c").value = "",
                document.getElementById("nodo").value = "",
                document.getElementById("direccion").value = "",
                document.getElementById("ont").value = "",
                document.getElementById("olt").value = "",
                document.getElementById("tarjeta").value = "",
                document.getElementById("puerto").value = "",
                document.getElementById("observacion").value = "";
            document.getElementById("editId").value = "";
            // bootstrap.Modal.getInstance(document.getElementById("registroModal")).hide();
        };
        document.getElementById("idCampo").focus()
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
            title: `Fecha: ${registro.fecha}
            Cedula: ${registro.cedula}
            Id: ${registro.idCampo}
            Telefono: ${registro.telefono}
            Nombre: ${registro.nombre}
            Rut: ${registro.rut}
            Codigo: ${registro.codigo_c}
            Nodo: ${registro.nodo}
            Dirección: ${registro.direccion}
            Ont: ${registro.ont}
            Olt: ${registro.olt}
            Tarjeta: ${registro.tarjeta}
            Puerto: ${registro.puerto}
            Observación: ${registro.observacion}

`
        })

    });

    // Copiar datos al portapapeles
    function copiarPortapapeles(data) {
        const texto = `Cedula: ${data.cedula}\nId: ${data.idCampo}\nTelefono: ${data.telefono}\nNombre: ${data.nombre}\nRut: ${data.rut}\nCodigo: ${data.codigo_c }\nNodo: ${data.nodo}\nDirección: ${data.direccion}\nOnt: ${data.ont}\nOlt: ${data.olt}\nTarjeta: ${data.tarjeta}\nPuerto: ${data.puerto}\nObservación: ${data.observacion}`;
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
            cedula.value = r.cedula;
            idCampo.value = r.idCampo;
            telefono.value = r.telefono;
            fecha.value = r.fecha;
            nombre.value = r.nombre;
            rut.value = r.rut;
            codigo_c.value = r.codigo_c;
            nodo.value = r.nodo;
            direccion.value = r.direccion;
            ont.value = r.ont;
            olt.value = r.olt;
            tarjeta.value = r.tarjeta;
            puerto.value = r.puerto;
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

const steps = document.querySelectorAll(".step");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let currentStep = 0;

function showStep(index) {
    steps.forEach((step, i) => {
        step.classList.toggle("active", i === index);
    });
}

nextBtn.addEventListener("click", () => {
    const select = steps[currentStep].querySelector("select");
    if (!select.value) {
        select.classList.add("is-invalid");
        return;
    }
    select.classList.remove("is-invalid");

    if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
    }
});


//Continua retroceder con flechas
prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
});

document.querySelectorAll("select").forEach(select => {
    select.addEventListener("change", () => {
        if (select.value && currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       PASOS OBLIGATORIOS
    ========================== */
    const pasosObligatorios = [
        "servicio_falla",
        "perdida_m",
        "conectado",
        "luces",
        "estado_ont",
        "redes_u"
    ];

    const generarBtn = document.getElementById("generarBtn");

    /* =========================
       VALIDAR PASOS
    ========================== */
    function validarPasos() {
        const completos = pasosObligatorios.every(id => {
            const campo = document.getElementById(id);
            return campo && campo.value.trim() !== "";
        });

        generarBtn.disabled = !completos;
    }

    /* =========================
       ESCUCHAR CAMBIOS
    ========================== */
    pasosObligatorios.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener("change", validarPasos);
        }
    });

    /* =========================
       CLICK GENERAR
    ========================== */
    generarBtn.addEventListener("click", function (e) {

        // Seguridad adicional
        const incompletos = pasosObligatorios.filter(id =>
            document.getElementById(id).value === ""
        );

        if (incompletos.length > 0) {
            e.preventDefault();
            alert("Debe completar todos los pasos antes de generar.");
            return;
        }

        /* =========================
           CAPTURA DATOS
        ========================== */
        const datosFormulario = {
            editId: document.getElementById("editId").value,
            cedula: document.getElementById("cedula").value,
            idCampo: document.getElementById("idCampo").value,
            telefono: document.getElementById("telefono").value,
            nombre: document.getElementById("nombre").value,
            rut: document.getElementById("rut").value,
            codigo_c: document.getElementById("codigo_c").value,
            nodo: document.getElementById("nodo").value,
            direccion: document.getElementById("direccion").value,
            ont: document.getElementById("ont").value,
            olt: document.getElementById("olt").value,
            tarjeta: document.getElementById("tarjeta").value,
            puerto: document.getElementById("puerto").value,
            observacion: document.getElementById("observacion").value
        };

        /* =========================
           OBSERVACION COMPLETA
        ========================== */
        const observacionCompleta = `
ID: ${datosFormulario.idCampo}
Telefono: ${datosFormulario.telefono}
RUT: ${datosFormulario.rut}
Código Cliente: ${datosFormulario.codigo_c}
Nodo: ${datosFormulario.nodo}
Dirección: ${datosFormulario.direccion}
ONT: ${datosFormulario.ont}
OLT: ${datosFormulario.olt}
Tarjeta: ${datosFormulario.tarjeta}
Puerto: ${datosFormulario.puerto}
Observación: ${datosFormulario.observacion}
        `.trim();

        /* =========================
           URL GOOGLE FORM
        ========================== */
        const baseURL =
            "https://docs.google.com/forms/d/e/1FAIpQLScBARUWj5MxH9pp9ax1QWFa-2voO9cx75yEE0q3qq_ZiD593Q/viewform?usp=pp_url";

        const url = baseURL
            + "&entry.1279701728=" + encodeURIComponent(datosFormulario.cedula)
            + "&entry.737091952=" + encodeURIComponent(datosFormulario.rut)
            + "&entry.1274396=" + encodeURIComponent(document.getElementById("servicio_falla").value)
            + "&entry.1796537453=" + encodeURIComponent(datosFormulario.idCampo)
            + "&entry.354392636=" + encodeURIComponent(datosFormulario.codigo_c)
            + "&entry.971510061=" + encodeURIComponent(datosFormulario.ont)
            + "&entry.2068363297=" + encodeURIComponent(datosFormulario.olt)
            + "&entry.16222912=" + encodeURIComponent(document.getElementById("perdida_m").value)
            + "&entry.288532483=" + encodeURIComponent(document.getElementById("conectado").value)
            + "&entry.1848968622=" + encodeURIComponent(document.getElementById("luces").value)
            + "&entry.763051468=" + encodeURIComponent(document.getElementById("estado_ont").value)
            + "&entry.1097538933=" + encodeURIComponent(document.getElementById("redes_u").value)
            + "&entry.1623308877=" + encodeURIComponent(observacionCompleta);

        /* =========================
           ABRIR FORM
        ========================== */
        window.open(url, "_blank");
    });

});




