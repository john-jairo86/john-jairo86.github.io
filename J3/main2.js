const steps_s = document.querySelectorAll(".step_s");
const nextBtn_s = document.getElementById("nextBtn_s");
const prevBtn_s = document.getElementById("prevBtn_s");

let currentStep_s = 0;

function showStep_s(index) {
    steps_s.forEach((step, i) => {
        step.classList.toggle("active", i === index);
    });
}

nextBtn_s.addEventListener("click", () => {
    const select = steps_s[currentStep_s].querySelector("select");
    if (!select.value) {
        select.classList.add("is-invalid");
        return;
    }
    select.classList.remove("is-invalid");

    if (currentStep_s < steps_s.length - 1) {
        currentStep_s++;
        showStep_s(currentStep_s);
    }
});


//Continua retroceder con flechas
prevBtn_s.addEventListener("click", () => {
    if (currentStep_s > 0) {
        currentStep_s--;
        showStep_s(currentStep_s);
    }
});

document.querySelectorAll("select").forEach(select => {
    select.addEventListener("change", () => {
        if (select.value && currentStep_s < steps_s.length - 1) {
            currentStep_s++;
            showStep_s(currentStep_s);
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       PASOS OBLIGATORIOS
    ========================== */
    const pasosObligatorios_s = [
        "cedula",
        "servicio_falla_s",
        "instalacion_s",
        "comunica_cliente",
        "falla_sumi",
        "generador",
        "luces_s"
    ];

    const generarBtn_s = document.getElementById("generarBtn_s");

    /* =========================
       VALIDAR PASOS
    ========================== */
    function validarPasos() {
        const completos_s = pasosObligatorios_s.every(id => {
            const campo = document.getElementById(id);
            return campo && campo.value.trim() !== "";
        });

        generarBtn_s.disabled = !completos_s;
    }

    /* =========================
       ESCUCHAR CAMBIOS
    ========================== */
    pasosObligatorios_s.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener("change", validarPasos);
        }
    });

    /* =========================
       CLICK GENERAR
    ========================== */
    generarBtn_s.addEventListener("click", function (e) {

        // Seguridad adicional
        const incompletos_s = pasosObligatorios_s.filter(id =>
            document.getElementById(id).value === ""
        );

        if (incompletos_s.length > 0) {
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
            idcampo: document.getElementById("idcampo"),
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
Cédula: ${datosFormulario.cedula}        
RUT: ${datosFormulario.rut}
Telefono: ${datosFormulario.telefono}
Dirección: ${datosFormulario.direccion}
ONT: ${datosFormulario.ont}
OLT: ${datosFormulario.olt}
Tarjeta: ${datosFormulario.tarjeta}
Puerto: ${datosFormulario.puerto}
Nodo: ${datosFormulario.nodo}
Observación: ${datosFormulario.observacion}
        `.trim();

        /* =========================
           URL GOOGLE FORM
        ========================== */
        const baseURL =
            "https://docs.google.com/forms/d/e/1FAIpQLScOnqtEkPZTISXN4o3vrsi_vjMF3GcPuBlb0dIqJOuZVmeklQ/viewform?usp=pp_url";

        const url = baseURL
            + "&entry.5694922=" + encodeURIComponent(datosFormulario.cedula)
            + "&entry.955460218=" + encodeURIComponent(datosFormulario.rut)
            + "&entry.213109764=" + encodeURIComponent(document.getElementById("servicio_falla_s").value)
            + "&entry.216870845=" + encodeURIComponent(datosFormulario.telefono)
            + "&entry.575117188=" + encodeURIComponent(datosFormulario.direccion)
            + "&entry.977079435=" + encodeURIComponent(datosFormulario.ont)
            + "&entry.789181094=" + encodeURIComponent(datosFormulario.olt)
            + "&entry.415672825=" + encodeURIComponent(datosFormulario.tarjeta)
            + "&entry.44152504=" + encodeURIComponent(datosFormulario.puerto)
            + "&entry.137275158=" + encodeURIComponent(datosFormulario.nodo)
            + "&entry.1907905929=" + encodeURIComponent(document.getElementById("instalacion_s").value)
            + "&entry.932424681=" + encodeURIComponent(document.getElementById("comunica_cliente").value)
            + "&entry.2011962965=" + encodeURIComponent(document.getElementById("falla_sumi").value)
            + "&entry.704266693=" + encodeURIComponent(document.getElementById("generador").value)
            + "&entry.1566836783=" + encodeURIComponent(document.getElementById("luces_s").value)
            + "&entry.1163287562=" + encodeURIComponent(observacionCompleta);

        /* =========================
           ABRIR FORM
        ========================== */
        window.open(url, "_blank");
    });

}); 