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
    const request = indexedDB.open("KonectDB2", 1);
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


    function resetWizard() {

        currentStep = 0;
        showStep(currentStep);

        document.querySelectorAll(".step select").forEach(select => {
            select.value = "";
            select.classList.remove("is-invalid");
        });

    }

    /* =========================
       BOTON COPIAR (REINICIA)
    ========================= */
    document.getElementById("copiar").addEventListener("click", () => {

        resetWizard();

    });

    // Guardar / Actualizar
    document.getElementById("copiar").addEventListener("click", (e) => {
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
        const texto = `Cedula: ${data.cedula}\nId: ${data.idCampo}\nTelefono: ${data.telefono}\nNombre: ${data.nombre}\nRut: ${data.rut}\nCodigo: ${data.codigo_c}\nNodo: ${data.nodo}\nDirección: ${data.direccion}\nOnt: ${data.ont}\nOlt: ${data.olt}\nTarjeta: ${data.tarjeta}\nPuerto: ${data.puerto}\nObservación: ${data.observacion}`;
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
            const request = indexedDB.open("KonectDB2", 1);

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

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       FUNCION GENERICA WIZARD
    ====================================================== */
    function initWizard(config) {

        const {
            stepClass,
            nextBtnId,
            prevBtnId,
            requiredFields = [],
            generarBtnId,
            onGenerate
        } = config;

        const steps = document.querySelectorAll(stepClass);
        const nextBtn = document.getElementById(nextBtnId);
        const prevBtn = document.getElementById(prevBtnId);
        const generarBtn = generarBtnId ? document.getElementById(generarBtnId) : null;

        let currentStep = 0;

        function showStep(index) {
            steps.forEach((step, i) => {
                step.classList.toggle("active", i === index);
            });
        }

        function validarPasos() {
            if (!generarBtn) return;

            const completos = requiredFields.every(id => {
                const campo = document.getElementById(id);
                return campo && campo.value.trim() !== "";
            });

            generarBtn.disabled = !completos;
        }

        /* =========================
           NEXT
        ========================== */
        nextBtn?.addEventListener("click", () => {

            const campo = steps[currentStep]?.querySelector("select, input");

            if (campo && !campo.value) {
                campo.classList.add("is-invalid");
                return;
            }

            campo?.classList.remove("is-invalid");

            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        });

        /* =========================
           PREV
        ========================== */
        prevBtn?.addEventListener("click", () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });

        /* =========================
           AUTO AVANCE (SELECT + INPUT)
        ========================== */
        steps.forEach((step, index) => {

            const campo = step.querySelector("select, input");

            if (campo) {
                campo.addEventListener("change", () => {

                    if (index === currentStep && campo.value) {

                        campo.classList.remove("is-invalid");

                        if (currentStep < steps.length - 1) {
                            currentStep++;
                            showStep(currentStep);
                        }

                        validarPasos();
                    }
                });
            }
        });

        /* =========================
           VALIDACION CAMPOS
        ========================== */
        requiredFields.forEach(id => {
            const campo = document.getElementById(id);
            campo?.addEventListener("change", validarPasos);
        });

        /* =========================
           GENERAR
        ========================== */
        generarBtn?.addEventListener("click", (e) => {

            const incompletos = requiredFields.filter(id =>
                document.getElementById(id).value === ""
            );

            if (incompletos.length > 0) {
                e.preventDefault();
                alert("Debe completar todos los pasos.");
                return;
            }

            onGenerate && onGenerate();
        });

        /* =========================
           RESET
        ========================== */
        function reset() {
            currentStep = 0;
            showStep(currentStep);

            steps.forEach(step => {
                const campo = step.querySelector("select, input");

                if (campo) {
                    campo.value = "";
                    campo.classList.remove("is-invalid");
                }
            });

            validarPasos();
        }

        showStep(currentStep);
        validarPasos();

        return { reset };
    }

    /* =====================================================
       WIZARD 1 (INTERNET)
    ====================================================== */
    const wizard1 = initWizard({
        stepClass: ".step",
        nextBtnId: "nextBtn",
        prevBtnId: "prevBtn",
        generarBtnId: "generarBtn",
        requiredFields: [
            "servicio_falla",
            "perdida_m",
            "conectado",
            "luces",
            "estado_ont",
            "redes_u"
        ],
        onGenerate: () => {

            const datos = {
                cedula: document.getElementById("cedula").value,
                idCampo: document.getElementById("idCampo").value,
                telefono: document.getElementById("telefono").value,
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

            const observacionCompleta = `
ID: ${datos.idCampo}
Telefono: ${datos.telefono}
RUT: ${datos.rut}
Código Cliente: ${datos.codigo_c}
Nodo: ${datos.nodo}
Dirección: ${datos.direccion}
ONT: ${datos.ont}
OLT: ${datos.olt}
Tarjeta: ${datos.tarjeta}
Puerto: ${datos.puerto}
Observación: ${datos.observacion}
            `.trim();

            const baseURL = "https://docs.google.com/forms/d/e/1FAIpQLScBARUWj5MxH9pp9ax1QWFa-2voO9cx75yEE0q3qq_ZiD593Q/viewform?usp=pp_url";

            const url = baseURL
                + "&entry.1279701728=" + encodeURIComponent(datos.cedula)
                + "&entry.737091952=" + encodeURIComponent(datos.rut)
                + "&entry.1274396=" + encodeURIComponent(document.getElementById("servicio_falla").value)
                + "&entry.1796537453=" + encodeURIComponent(datos.idCampo)
                + "&entry.354392636=" + encodeURIComponent(datos.codigo_c)
                + "&entry.971510061=" + encodeURIComponent(datos.ont)
                + "&entry.2068363297=" + encodeURIComponent(datos.olt)
                + "&entry.16222912=" + encodeURIComponent(document.getElementById("perdida_m").value)
                + "&entry.288532483=" + encodeURIComponent(document.getElementById("conectado").value)
                + "&entry.1848968622=" + encodeURIComponent(document.getElementById("luces").value)
                + "&entry.763051468=" + encodeURIComponent(document.getElementById("estado_ont").value)
                + "&entry.1097538933=" + encodeURIComponent(document.getElementById("redes_u").value)
                + "&entry.1623308877=" + encodeURIComponent(observacionCompleta);

            window.open(url, "_blank");
        }
    });

    /* =====================================================
       WIZARD 2 (SUMINISTRO)
    ====================================================== */
    const wizard2 = initWizard({
        stepClass: ".step_s",
        nextBtnId: "nextBtn_s",
        prevBtnId: "prevBtn_s",
        generarBtnId: "generarBtn_s",
        requiredFields: [
            "cedula",
            "servicio_falla_s",
            "instalacion_s",
            "comunica_cliente",
            "falla_sumi",
            "generador",
            "luces_s",
            "fecha_hora"
        ],
        onGenerate: () => {

            const datos = {
                cedula: document.getElementById("cedula").value,
                telefono: document.getElementById("telefono").value,
                rut: document.getElementById("rut").value,
                direccion: document.getElementById("direccion").value,
                ont: document.getElementById("ont").value,
                olt: document.getElementById("olt").value,
                tarjeta: document.getElementById("tarjeta").value,
                puerto: document.getElementById("puerto").value,
                nodo: document.getElementById("nodo").value,
                observacion: document.getElementById("observacion").value
            };

            const observacionCompleta = `
Cédula: ${datos.cedula}
RUT: ${datos.rut}
Telefono: ${datos.telefono}
Dirección: ${datos.direccion}
ONT: ${datos.ont}
OLT: ${datos.olt}
Tarjeta: ${datos.tarjeta}
Puerto: ${datos.puerto}
Nodo: ${datos.nodo}
Observación: ${datos.observacion}
            `.trim();


            const valorFecha = document.getElementById("fecha_hora").value;

            let año = "", mes = "", dia = "", hora = "", minuto = "";

            if (valorFecha) {
                const [fechaParte, horaParte] = valorFecha.split("T");
                [año, mes, dia] = fechaParte.split("-");
                [hora, minuto] = horaParte.split(":");
            }


            const baseURL = "https://docs.google.com/forms/d/e/1FAIpQLScOnqtEkPZTISXN4o3vrsi_vjMF3GcPuBlb0dIqJOuZVmeklQ/viewform?usp=pp_url";

            const url = baseURL
                + "&entry.5694922=" + encodeURIComponent(datos.cedula)
                + "&entry.955460218=" + encodeURIComponent(datos.rut)
                + "&entry.213109764=" + encodeURIComponent(document.getElementById("servicio_falla_s").value)
                + "&entry.216870845=" + encodeURIComponent(datos.telefono)
                + "&entry.575117188=" + encodeURIComponent(datos.direccion)
                + "&entry.977079435=" + encodeURIComponent(datos.ont)
                + "&entry.789181094=" + encodeURIComponent(datos.olt)
                + "&entry.415672825=" + encodeURIComponent(datos.tarjeta)
                + "&entry.44152504=" + encodeURIComponent(datos.puerto)
                + "&entry.137275158=" + encodeURIComponent(datos.nodo)
                + "&entry.1907905929=" + encodeURIComponent(document.getElementById("instalacion_s").value)
                + "&entry.932424681=" + encodeURIComponent(document.getElementById("comunica_cliente").value)
                + "&entry.2011962965=" + encodeURIComponent(document.getElementById("falla_sumi").value)
                + "&entry.704266693=" + encodeURIComponent(document.getElementById("generador").value)
                + "&entry.1566836783=" + encodeURIComponent(document.getElementById("luces_s").value)
                + "&entry.1163287562=" + encodeURIComponent(observacionCompleta)

                // 👇 FECHA Y HORA (YA CORREGIDO)
                + "&entry.2142598155_year=" + encodeURIComponent(año)
                + "&entry.2142598155_month=" + encodeURIComponent(mes)
                + "&entry.2142598155_day=" + encodeURIComponent(dia)
                + "&entry.2142598155_hour=" + encodeURIComponent(hora)
                + "&entry.2142598155_minute=" + encodeURIComponent(minuto);

            window.open(url, "_blank");
        }
    });

    /* =====================================================
       BOTON COPIAR (RESET SOLO WIZARD 2)
    ====================================================== */
    document.getElementById("copiar")?.addEventListener("click", () => {
        wizard1.reset();
        wizard2.reset();
    });

});

// ===== STORAGE =====
const keys = {
    int: "lista_int",
    tv: "lista_tv",
    tl: "lista_tl"
};

// ===== MOSTRAR / TOGGLE =====
// ===== MOSTRAR / TOGGLE =====
function mostrar(tipo) {
    const box = document.getElementById("box_" + tipo);

    // Toggle
    if (!box.hidden) {
        box.hidden = true;
        return;
    }

    // Cerrar todos
    ["int", "tv", "tl"].forEach(t => {
        document.getElementById("box_" + t).hidden = true;
    });

    // Abrir seleccionado
    box.hidden = false;
}

// ===== CERRAR AL HACER CLICK FUERA =====
document.addEventListener("click", function (e) {
    const dentroDeBox = e.target.closest('[id^="box_"]');
    const esBoton = e.target.closest('[onclick^="mostrar"]');

    if (!dentroDeBox && !esBoton) {
        ["int", "tv", "tl"].forEach(t => {
            document.getElementById("box_" + t).hidden = true;
        });
    }
});

// ===== CLICK FUERA (CERRAR) =====
document.addEventListener("click", function (e) {
    ["int", "tv", "tl"].forEach(tipo => {
        const box = document.getElementById("box_" + tipo);
        const btn = document.getElementById("btn_" + tipo);

        if (!box || !btn) return;

        if (!box.contains(e.target) && !btn.contains(e.target)) {
            box.hidden = true;
        }
    });
});

// ===== INIT =====
function init() {
    if (!localStorage.getItem(keys.int)) {
        localStorage.setItem(keys.int, JSON.stringify([
            
        ]));
    }

    if (!localStorage.getItem(keys.tv)) {
        localStorage.setItem(keys.tv, JSON.stringify([
           
        ]));
    }

    if (!localStorage.getItem(keys.tl)) {
        localStorage.setItem(keys.tl, JSON.stringify([
           
        ]));
    }
}

// ===== RENDER =====
function render(tipo) {
    let lista = JSON.parse(localStorage.getItem(keys[tipo])) || [];
    renderLista(tipo, lista);
}

function renderLista(tipo, lista) {
    const ul = document.getElementById("list_" + tipo);
    ul.innerHTML = "";

    lista.forEach(txt => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between";

        const span = document.createElement("span");
        span.textContent = txt;
        span.style.cursor = "pointer";
        span.onclick = () => selectText(txt);

        const div = document.createElement("div");

        const btnEdit = document.createElement("button");
        btnEdit.className = "btn btn-warning btn-sm me-1";
        btnEdit.textContent = "✏️";
        btnEdit.onclick = () => editarDesdeTexto(tipo, txt);

        const btnDelete = document.createElement("button");
        btnDelete.className = "btn btn-danger btn-sm";
        btnDelete.textContent = "🗑️";
        btnDelete.onclick = () => eliminarDesdeTexto(tipo, txt);

        div.appendChild(btnEdit);
        div.appendChild(btnDelete);

        li.appendChild(span);
        li.appendChild(div);

        ul.appendChild(li);
    });
}

// ===== BUSCADOR =====
function activarBusqueda(tipo) {
    const input = document.getElementById("search_" + tipo);

    input.addEventListener("keyup", function () {
        let filtro = this.value.toLowerCase();
        let lista = JSON.parse(localStorage.getItem(keys[tipo])) || [];

        let filtrados = lista.filter(txt =>
            txt.toLowerCase().includes(filtro)
        );

        renderLista(tipo, filtrados);
    });
}

// ===== SELECCION (ACUMULATIVA) =====
function selectText(txt) {
    const input = document.getElementById("observacion");

    if (input.value.trim() === "") {
        input.value = txt;
    } else {
        input.value += " " + txt;
    }
}

// ===== CRUD OPCIONES =====
function agregarOpcion(tipo) {
    let lista = JSON.parse(localStorage.getItem(keys[tipo])) || [];
    let nueva = prompt("Nueva opción");

    if (!nueva || !nueva.trim()) return;

    lista.push(nueva.trim());
    localStorage.setItem(keys[tipo], JSON.stringify(lista));
    render(tipo);
}

function editarDesdeTexto(tipo, texto) {
    let lista = JSON.parse(localStorage.getItem(keys[tipo])) || [];
    let i = lista.indexOf(texto);

    if (i === -1) return;

    let nuevo = prompt("Editar", lista[i]);

    if (!nuevo || !nuevo.trim()) return;

    lista[i] = nuevo.trim();
    localStorage.setItem(keys[tipo], JSON.stringify(lista));
    render(tipo);
}

function eliminarDesdeTexto(tipo, texto) {
    let lista = JSON.parse(localStorage.getItem(keys[tipo])) || [];
    let i = lista.indexOf(texto);

    if (i === -1) return;

    if (!confirm("¿Eliminar?")) return;

    lista.splice(i, 1);
    localStorage.setItem(keys[tipo], JSON.stringify(lista));
    render(tipo);
}

// ===== TABLA CRUD =====
document.getElementById("formRegistro").addEventListener("submit", e => {
    e.preventDefault();

    let data = {
        id: editId.value || Date.now(),
        nombre: nombre.value,
        observacion: observacion.value,
        fecha: new Date().toLocaleString()
    };

    let lista = JSON.parse(localStorage.getItem("tabla")) || [];
    let i = lista.findIndex(x => x.id == data.id);

    if (i > -1) lista[i] = data;
    else lista.push(data);

    localStorage.setItem("tabla", JSON.stringify(lista));
    cargarTabla();

    // limpiar formulario
    e.target.reset();
    editId.value = "";
});

// ===== EDITAR REGISTRO =====
function editar(id) {
    let lista = JSON.parse(localStorage.getItem("tabla")) || [];
    let r = lista.find(x => x.id == id);

    if (!r) return;

    editId.value = r.id;
    nombre.value = r.nombre;
    observacion.value = r.observacion;

    new bootstrap.Modal(document.getElementById("registroModal")).show();
}

// ===== ELIMINAR REGISTRO =====
function eliminar(id) {
    let lista = JSON.parse(localStorage.getItem("tabla")) || [];
    lista = lista.filter(x => x.id != id);

    localStorage.setItem("tabla", JSON.stringify(lista));
    cargarTabla();
}

// ===== LIMPIAR TABLA =====
function limpiarPersonas() {
    localStorage.removeItem("tabla");
    cargarTabla();
}

// ===== INIT GLOBAL =====
document.addEventListener("DOMContentLoaded", () => {
    init();

    ["int", "tv", "tl"].forEach(tipo => {
        render(tipo);
        activarBusqueda(tipo);
    });
});

