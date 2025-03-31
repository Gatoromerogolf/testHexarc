let tablaMenuEs = [];
let tablaMenuA = [];
let primeraVez = 0;
let max = 0;
// let apellidouser = localStorage.getItem("apellido");
// const nombreUser = localStorage.getItem("nombre");
// const apenom = nombreUser + ' ' + apellidouser;
// const empresa = localStorage.getItem("empresa");
// const CUIT = localStorage.getItem("CUIT");

const ria = localStorage.getItem("ria");
// const max = Number(ria === 0 ? valorCategorias[0].precio[1] : valorCategorias[1].precio[1]);
// console.log (`valor de maximo ${max}`)

const servicio = localStorage.getItem("servicio");
// let capitulo = "A";
const idioma = Number(localStorage.getItem("idioma"));
let totalMax = 0;
let totalCal = 0;
let matrizPreguntas = [];
let respuestas = [];
let textoCheck = [];
let textoRespuestas = [];

document.getElementById("nombreEmpresa").textContent = empresa;
document.getElementById("nombreUsuario").textContent = apenom;

/* -----------------------------------------
ejecutarProceso         
------------------------------------------> */
// Llamas a la función `ejecutarProceso` para iniciar el flujo
// ejecutarProceso();

async function ejecutarProceso() {
    capitulos = await leeCapitulos();
    totalCapitulos = await leeTotalCapitulos(CUIT);
    // matrizPreguntas = await recuperarPreguntas(capitulo);
    textoCheck = await leeTextoCheck();
    textoRespuestas = await leeTextoRespuestas();
    valorCategorias = await leeListaPrecios();
    max = Number(
        ria === 0 ? valorCategorias[0].precio[1] : valorCategorias[1].precio[1]
    );
    // console.log (`valor de maximo ${max}`)

    const { tipificacion, textoTipificacion } = await obtieneTipificacion();

    document.getElementById("tipificacion").textContent = tipificacion;
    document.getElementById("causaTipificacion").innerHTML = textoTipificacion;

    const elementos = document.querySelectorAll(".company-name");

    elementos.forEach((elemento) => {
        elemento.textContent = empresa;
    });

    localStorage.setItem("textoTipificacion", textoTipificacion);
    localStorage.setItem("tipificacion", tipificacion);

}

//  ver si no va esto....
document.addEventListener("DOMContentLoaded", async function () {
    await ejecutarProceso(); // Ejecuta todo cuando el DOM está listo

    console.table(capitulos);
    // matrizPreguntas = await recuperarPreguntas(capitulo);
    let contenedor = document.getElementById("contenedorTablas"); // Contenedor donde agregaremos todo

    for (const capitulo of capitulos) {
        console.log(`procesando capitulo ${capitulo.letra}`);
        if (capitulo.letra == "E" || capitulo.letra == "F") {
            continue;
        }

        matrizPreguntas = await recuperarPreguntas(capitulo.letra);

        // Crear tres líneas en blanco antes del título
        for (let i = 0; i < 2; i++) {
            let espacio = document.createElement("br");
            contenedor.appendChild(espacio);
        }

        // Crear el título del capítulo ::::::::::::::::::::::::::.
        let titulo = document.createElement("h3");
        titulo.textContent = `Factor: ${capitulo.nombre}`;
        contenedor.appendChild(titulo);

        // Crear la tabla :::::::::::::::::::::::::::::::::::::::::
        let tabla = document.createElement("table");
        tabla.classList.add("tablaHexagono");

        // Busca las respuestas de ese capítulo
        console.log(`busca respuesta de CUIT ${CUIT} y capitulo ${capitulo.letra}`);
        const data = await buscaRespuesta(CUIT, capitulo.letra);
        const respuestas = data.respuestas || []; // Si no hay respuestas, asigna un array vacío
        console.table(respuestas);

        // Crear el encabezado (seccion):::::::::::::::::::::::::::

        // Solo se incluyen las secciones con preguntas tipo 1 o 52.
        // hay que ver dentro de las preguntas de esa seccion hay alguna con tipo 1 o 52
        // si no hay ninguna, no se incluye.

        // tiene que leer todos los registros de respuestas (uno por seccion)
        // o sea, que tiene que leer todas las secciones del capitulo
        // si la sección tiene % menor al minimo segun ria tiene que incluirla.
        //    lista precio segunda posición de capitulo Z pregunta 1: no ria,  pregunta 2: ria

        for (const respuesta of respuestas) {
            if (respuesta.porcentaje > max) {
                console.log(
                    `descarto capitulo ${capitulo.nombre}, seccion ${respuesta.seccion} con % ${respuesta.porcentaje}`
                );
                console.log("**********************");
                continue;
            }

            console.log(
                `encontro para incluir capitulo ${capitulo.nombre}, seccion ${respuesta.seccion} con % ${respuesta.porcentaje}`
            );

            const existeTipo = matrizPreguntas.some(
                (p) =>
                    p.Capitulo == respuesta.capitulo &&
                    p.Seccion == respuesta.seccion &&
                    (p.tipo == 1 || p.tipo == 52)
            );

            if (!existeTipo) {
                console.log(
                    `No hay 1 o 52 en matrizPreguntas para seccion ${respuesta.seccion}.`
                );
                continue; // Salta a la siguiente iteración del bucle
            }

            let thead = document.createElement("thead");
            let filaEncabezado = document.createElement("tr");
            filaEncabezado.classList.add("fila-factor");

            let thFactor = document.createElement("th");
            const indice = respuesta.seccion;
            const descripcion = await obtenerNombreSeccion(
                indice,
                idioma,
                capitulo.letra
            );
            thFactor.textContent =
                "[ " +
                respuesta.porcentaje +
                " % ]   -   Seccion: " +
                respuesta.seccion +
                ". " +
                descripcion;
            thFactor.style.fontSize = "17px";
            thFactor.classList.add("factor");
            thFactor.setAttribute("colspan", "4");
            if (capitulo.letra == "A") {
                thFactor.style.backgroundColor = "#FAF0E6";
            }
            if (capitulo.letra == "B") {
                thFactor.style.backgroundColor = "#F0E68C";
            }
            if (capitulo.letra == "C") {
                thFactor.style.backgroundColor = "#D3D3D3";
            }
            if (capitulo.letra == "D") {
                thFactor.style.backgroundColor = "#F0F8FF";
            }

            filaEncabezado.appendChild(thFactor);
            thead.appendChild(filaEncabezado);
            tabla.appendChild(thead);

            //  crea subtitulo de la sección
            let tbody = document.createElement("tbody");

            let filaSituacion = document.createElement("tr"); //fila adicional "Situación"
            filaSituacion.classList.add("seccion");
            filaSituacion.style.borderBottom = "1px solid black"; // Línea divisoria


            let celdaSituacionNum = document.createElement("td");
            celdaSituacionNum.textContent = " # "; // Texto de la situación
            celdaSituacionNum.style.width = "10px";
            celdaSituacionNum.style.fontWeight = "600";
            filaSituacion.appendChild(celdaSituacionNum);

            let celdaSituacion = document.createElement("td");
            celdaSituacion.textContent = "Situación"; // Texto de la situación
            celdaSituacion.style.width = "300px";
            celdaSituacion.style.fontWeight = "600";
            celdaSituacion.style.fontSize = "16px";
            filaSituacion.appendChild(celdaSituacion);

            // let celdaInformado = document.createElement('td');
            // celdaInformado.textContent = "Informado"; // Texto de 'Informado'
            // celdaInformado.style.width = '70px';
            // celdaInformado.style.fontWeight = "600";
            // celdaInformado.style.fontSize = "16px";
            // filaSituacion.appendChild(celdaInformado);

            tbody.appendChild(filaSituacion);

            // let thFactor2 = document.createElement("th");
            // const indice2 = respuesta.seccion;
            // const descripcion2 = await obtenerNombreSeccion(indice, idioma, capitulo.letra);
            // thFactor2.textContent = "[ " + respuesta.porcentaje + " % ]   -   Seccion: " + respuesta.seccion + '. ' + descripcion;
            // thFactor2.style.fontSize = "17px";
            // thFactor2.classList.add("factor");
            // thFactor2.setAttribute('colspan', '4');
            // filaEncabezado.appendChild(thFactor2);
            // thead.appendChild(filaEncabezado2);
            // tabla.appendChild(thead2);

            // Crear el cuerpo de la tabla::::::::::::::::::::::::::::::

            //  Filtra las preguntas para la seccion seleccionada
            let info = respuesta.seccion;
            let preguntasSeccion = matrizPreguntas.filter(
                (pregunta) => pregunta.Seccion == info
            );

            // itera por todas las preguntas filtradas

            for (const pregunta of preguntasSeccion) {
                let filaSeccion = document.createElement("tr");
                filaSeccion.classList.add("situacion2");

                // let celdaNumero = document.createElement('th');
                // celdaNumero.style.width = "5px"; // Define el ancho en píxeles
                // celdaNumero.textContent = pregunta.Numero;
                // filaSeccion.appendChild(celdaNumero);

                // let consigna = document.createElement('th');
                // consigna.style.width = "300px"; // Define el ancho en píxeles
                // consigna.textContent = pregunta.Descrip;
                // filaSeccion.appendChild(consigna);

                // let respondido = document.createElement('th');
                // respondido.style.width = "20px"; // Define el ancho en píxeles
                // poneRespuesta(respuesta, pregunta).then((texto) => {
                //     respondido.textContent = texto;
                //     filaSeccion.appendChild(respondido);

                //     if (pregunta.tipo == "52") {
                //         if (texto == "No efectivo" || texto == "Poco efectivo" ) {
                //         // if (texto == "No efectivo") {
                //         lineaDatosFd.appendChild(filaSeccion)}
                //     };

                //     if (pregunta.tipo == "1") {
                //         if (texto == "NO") {
                //         // if (texto == "No efectivo") {
                //         lineaDatosFd.appendChild(filaSeccion)}
                //     };
                // })

                // let tbody = document.createElement("tbody");

                let filaRespuesta = document.createElement("tr");
                filaRespuesta.classList.add("situacion2");

                let celdaNumero = document.createElement("td");
                celdaNumero.style.width = "5px"; // Define el ancho en píxeles
                celdaNumero.textContent = pregunta.Numero;
                filaRespuesta.appendChild(celdaNumero);

                let consigna = document.createElement("td");
                consigna.style.width = "300px"; // Define el ancho en píxeles
                consigna.textContent = pregunta.Descrip;
                consigna.style.fontSize = "16px";
                filaRespuesta.appendChild(consigna);

                // let respondido = document.createElement('td');
                // respondido.style.width = "90px"; // Define el ancho en píxeles
                poneRespuesta(respuesta, pregunta).then((texto) => {
                    // respondido.textContent = texto;
                    // respondido.style.fontSize = "16px";
                    // filaRespuesta.appendChild(respondido);

                    if (pregunta.tipo == "52") {
                        if (texto == "No efectivo" || texto == "Poco efectivo" ) {
                        // if (texto == "No efectivo") {
                        // filaRespuesta.appendChild(filaSeccion)
                        tbody.appendChild(filaRespuesta);}
                    };

                    if (pregunta.tipo == "1") {
                        if (texto == "NO") {
                        // if (texto == "No efectivo") {
                        // filaRespuesta.appendChild(filaSeccion)
                        tbody.appendChild(filaRespuesta);}
                    };
                })

                tabla.appendChild(tbody);

                // Agregar la tabla al contenedor
                contenedor.appendChild(tabla);
            }
        }
    }
});

/* -----------------------------------------
obtieneTipificacion          
------------------------------------------> */
async function obtieneTipificacion() {
    // Gobierno Corporativo
    const capituloA = totalCapitulos.find((item) => item.capitulo === "A");
    const capituloB = totalCapitulos.find((item) => item.capitulo === "B");
    const capituloC = totalCapitulos.find((item) => item.capitulo === "C");
    const capituloD = totalCapitulos.find((item) => item.capitulo === "D");
    const capituloE = totalCapitulos.find((item) => item.capitulo === "E");
    const capituloF = totalCapitulos.find((item) => item.capitulo === "F");

    if (ria == 1) {
        valor1 = 95;
        valor2 = 75;
        valor3 = 55;
    } else {
        valor1 = 90;
        valor2 = 70;
        valor3 = 50;
    }

    //  MRG SUPERIOR - 
    if (Number(capituloA.porcentaje) > valor1) { 
        if (  // COMPETITIVA - 1
            Number(capituloB.porcentaje) > valor1 &&
            Number(capituloC.porcentaje) > valor1 &&
            Number(capituloD.porcentaje) > valor1 &&
            Number(capituloE.porcentaje) > valor1 &&
            Number(capituloF.porcentaje) > valor1
        ) {
            tipificacion = "COMPETITIVA";
            textoTipificacion =
                "<strong><span class='company-name' style='font-size: 16px'></span></strong> se tipifica preliminarmente como Competitiva porque en el marco del Sistema HexaRCi una empresa es tipificada como Competitiva cuando detenta un desempeño destacado en su manejo de la totalidad de los riesgos: de Gobierno Corporativo, del Apetito de Riesgo, de Mercado y de los Procesos. Su situación financiera así como la generación de resultados son consistentemente saludables.<br><br>En general las empresas competitivas son capaces de superar y mantenerse por delante de sus competidores, ofreciendo productos o servicios de valor que le permite atraer y retener clientes. También generar una situación financiera satisfactoria para sus propietarios y con ello efectuar las inversiones necesarias para mantener su liderazgo.";
            return { tipificacion, textoTipificacion };
        }
        if (  // RESILIENTE - 2
            Number(capituloB.porcentaje) > valor2 &&
            Number(capituloC.porcentaje) > valor2 &&
            Number(capituloD.porcentaje) > valor2 &&
            Number(capituloE.porcentaje) > valor2 &&
            Number(capituloF.porcentaje) > valor2
        ) {
            tipificacion = "RESILIENTE";
            textoTipificacion =
                "<strong><span class='company-name' style='font-size: 16px'></span></strong> se tipifica preliminarmente como Resiliente porque en el marco del Sistema HexaRCi una empresa es tipificada como Resiliente cuando detenta un desempeño destacado en su manejo de los Riesgos de Gobierno Corporativo y un desempeño relevante en su manejo de los riesgos del Apetito de Riesgo, de los Riesgos de Mercado y de los Riesgos de los Procesos.  Su situación financiera así como la generación de resultados son saludables.<br><br>En general las empresas resilientes son capaces de adaptarse, resistir y recuperarse rápidamente frente a adversidades, crisis o cambios bruscos en el entorno. La resiliencia empresarial se refleja en la habilidad para, no solo superar desafíos, sino también aprender de ellos y salir fortalecida mediante su estructura, cultura y recursos y mantener su operación en el largo plazo.";
            return { tipificacion, textoTipificacion };
        }
        if (Number(capituloE.porcentaje) > valor3) {  // VULNERABLE - 5
            tipificacion = "VULNERABLE";
            textoTipificacion =
                "<strong><span class='company-name' style='font-size: 16px'></span></strong> se tipifica preliminarmente como Vulnerable porque en el marco del Sistema HexaRCi una empresa es tipificada como Vulnerable cuando frente una situación financiera endeble detenta un desempeño destacado en su manejo de los riesgos de Gobierno Corporativo, siendo ésta la fortaleza que debería permitir su recuperación.<br><br>En general las empresas vulnerables enfrentan desafíos significativos, tales como competencia creciente, presión en los márgenes, falta de diferenciación en el mercado o endeblez financiera. Aunque operan con normalidad, su posición no es segura a mediano o largo plazo.";
            return { tipificacion, textoTipificacion };
        }
        //  INESTABLE  - 8
        tipificacion = "INESTABLE";
        textoTipificacion =
        "<strong><span class='company-name' style='font-size: 16px'></span></strong> se tipifica preliminarmente como Inestable porque en el marco del Sistema HexaRCi una empresa es tipificada como Inestable cuando, aun detentando a una situación financiera delicada, muestra un desempeño destacado en su manejo de los riesgos de Gobierno Corporativo, siendo ésta la fortaleza que debería permitir su recuperación.<br><br>En general las empresas inestables enfrentan problemas significativos, como pérdidas recurrentes, modelos de negocio obsoletos o mala gestión. Su viabilidad está en riesgo si no implementan cambios significativos."; 
        return { tipificacion, textoTipificacion };
    }

    //  MRG ALTO
    if (Number(capituloA.porcentaje) > valor2) {
        if (  //  SOLIDA -  3
            Number(capituloD.porcentaje) > valor2 &&
            Number(capituloE.porcentaje) > valor1
        ) {
            tipificacion = "SOLIDA";
            textoTipificacion =
                "<strong><span class='company-name' style='font-size: 16px'></span></strong> se tipifica preliminarmente como Sólida porque en el marco del Sistema HexaRCi una empresa es tipificada como Sólida cuando detenta un desempeño relevante en su manejo de los Riesgos de Gobierno Corporativo y de los Riesgos de los Procesos. Su Situación Financiera es muy saludable.<br><br>En general las empresas sólidas son capaces  de manejar el quehacer diario sin contratiempos significativos. Las empresas sólidas son estables, financieramente seguras, con fundamentos sólidos y procesos eficientes. Su estabilidad y consistencia las hacen confiables en su mercado.";
            return { tipificacion, textoTipificacion };
        }

        if (   //  SOLIDA -  4
            Number(capituloD.porcentaje) > valor2 &&
            Number(capituloE.porcentaje) > valor2
        ) {
            tipificacion = "SOLIDA";
            textoTipificacion =
                "<strong><span class='company-name' style='font-size: 16px'></span></strong> se tipifica preliminarmente como Sólida porque en el marco del Sistema HexaRCi una empresa es tipificada como Sólida cuando detenta un desempeño relevante en su manejo de los Riesgos de Gobierno Corporativo y de los Riesgos de los Procesos. Su Situación Financiera es saludable.<br><br>En general las empresas sólidas son capaces  de manejar el quehacer diario sin contratiempos significativos. Las empresas sólidas son estables, financieramente seguras, con fundamentos sólidos y procesos eficientes. Su estabilidad y consistencia las hacen confiables en su mercado.";
            return { tipificacion, textoTipificacion };
        }

        if (Number(capituloE.porcentaje) > valor3) {  //  INESTABLE - 9.
            tipificacion = "INESTABLE";
            textoTipificacion =
                "<strong><span class='company-name' style='font-size: 16px'></span></strong> se tipifica preliminarmente como Inestable porque en el marco del Sistema HexaRCi una empresa será tipificada como Inestable cuando detenta una situación financiera endeble con un desempeño en su manejo de los Riesgos de Gobierno Corporativo que requiere mejoras.<br><br>La necesidad de mejoras en el manejo de los riesgos del Gobierno Corporativo es relevante porque éste representa el conjunto de procesos, principios y valores que rigen la forma en que una organización es estrategizada, administrada, controlada y transparentada.<br><br>Fallas en el sistema de Gobierno pueden conducir a la disfuncionalidad de los procesos, impacta en el Apetito de Riesgo, en el manejo de los riesgos de mercado; y, como consecuencia, puede llevar a un deterioro aún más profundo de la situación financiera futura.<br><br>En general las empresas inestables enfrentan problemas significativos, como pérdidas recurrentes, modelos de negocio obsoletos o mala gestión. Su viabilidad está en riesgo si no implementan cambios significativos.";
            return { tipificacion, textoTipificacion };
        }

        //   INESTABLE  - 11
        tipificacion = "INESTABLE";
        textoTipificacion =
            "<strong><span class='company-name' style='font-size: 16px'></span></strong> se tipifica preliminarmente como Inestable porque en el marco del Sistema HexaRCi una empresa será tipificada como Inestable cuando detenta una situación financiera muy endeble con un desempeño en su manejo de los Riesgos de Gobierno Corporativo que requiere mejoras.<br><br>La necesidad de mejoras en el manejo de los riesgos del Gobierno Corporativo es relevante porque éste representa el conjunto de procesos, principios y valores que rigen la forma en que una organización es estrategizada, administrada, controlada y transparentada.<br><br>Fallas en el sistema de Gobierno pueden conducir a la disfuncionalidad de los procesos, impacta en el Apetito de Riesgo, en el manejo de los riesgos de mercado; y, como consecuencia, puede llevar a un deterioro aún más profundo de la situación financiera futura.<br><br>En general las empresas inestables enfrentan problemas significativos, como pérdidas recurrentes, modelos de negocio obsoletos o mala gestión. Su viabilidad está en riesgo si no implementan cambios significativos.";  
        return { tipificacion, textoTipificacion };
    }

    //  MRG BAJO
    if (Number(capituloA.porcentaje) > valor3) {

        if (Number(capituloE.porcentaje) > valor1) {  // VULNERABLE - 6
            tipificacion = "VULNERABLE";
            textoTipificacion =
                "<strong><span class='company-name' style='font-size: 16px'></span></strong> se tipifica preliminarmente como Vulnerable porque en el marco del Sistema HexaRCi una empresa es tipificada como Vulnerable cuando, aunque detente una situación financiera muy saludable, necesita mejoras significativas en su desempeño en el manejo de los Riesgos de Gobierno Corporativo.<br><br>La necesidad de mejoras significativas en el manejo de los riesgos del Gobierno Corporativo es relevante porque éste representa el conjunto de procesos, principios y valores que rigen la forma en que una organización es estrategizada, administrada, controlada y transparentada. Fallas en el sistema de Gobierno pueden conducir a la disfuncionalidad de los procesos, impacta en el Apetito de Riesgo, en el manejo de los riesgos de mercado; y como consecuencia pueden llevar a un deterioro de la situación financiera futura.<br><br>En general las empresas vulnerables enfrentan desafíos significativos, tales como competencia creciente, presión en los márgenes, falta de diferenciación en el mercado o endeblez financiera. Aunque operan con normalidad, su posición no es segura a mediano o largo plazo.";
            return { tipificacion, textoTipificacion };
        }

        if (Number(capituloE.porcentaje) > valor2) {   // VULNERABLE - 7
            tipificacion = "VULNERABLE";
            textoTipificacion =
                "<strong><span class='company-name' style='font-size: 16px'></span></strong> se tipifica preliminarmente como Vulnerable porque en el marco del Sistema HexaRCi una empresa es tipificada como Vulnerable cuando, aunque detente una situación financiera saludable, necesita mejoras significativas en su desempeño en el manejo de los Riesgos de Gobierno Corporativo.<br><br>La necesidad de mejoras significativas en el manejo de los riesgos del Gobierno Corporativo es relevante porque éste representa el conjunto de procesos, principios y valores que rigen la forma en que una organización es estrategizada, administrada, controlada y transparentada. Fallas en el sistema de Gobierno pueden conducir a la disfuncionalidad de los procesos, impacta en el Apetito de Riesgo, en el manejo de los riesgos de mercado; y como consecuencia pueden llevar a un deterioro de la situación financiera futura.<br><br>En general las empresas vulnerables enfrentan desafíos significativos, tales como competencia creciente, presión en los márgenes, falta de diferenciación en el mercado o endeblez financiera. Aunque operan con normalidad, su posición no es segura a mediano o largo plazo.";
            return { tipificacion, textoTipificacion };
        }

        if (Number(capituloE.porcentaje) > valor3) {  // INESTABLE  - 10
            tipificacion = "INESTABLE";
            textoTipificacion =
                "<strong><span class='company-name' style='font-size: 16px'></span></strong> se tipifica preliminarmente como Inestable porque en el marco del Sistema HexaRCi una empresa será tipificada como Inestable cuando detenta una situación financiera endeble con un desempeño en su manejo de los Riesgos de Gobierno Corporativo que requiere mejoras significativas.<br><br>La necesidad de mejoras sustantivas en el manejo de los riesgos del Gobierno Corporativo es relevante porque éste representa el conjunto de procesos, principios y valores que rigen la forma en que una organización es estrategizada, administrada, controlada y transparentada.<br><br>Fallas en el sistema de Gobierno pueden conducir a la disfuncionalidad de los procesos, impacta en el Apetito de Riesgo, en el manejo de los riesgos de mercado; y, como consecuencia, puede llevar a un deterioro aún más profundo de la situación financiera futura.<br><br>En general las empresas inestables enfrentan problemas significativos, como pérdidas recurrentes, modelos de negocio obsoletos o mala gestión. Su viabilidad está en riesgo si no implementan cambios significativos.";
            return { tipificacion, textoTipificacion };
        }

        //   DEBIL  -  12     
        tipificacion = "DEBIL";
        textoTipificacion =
            "<strong><span class='company-name' style='font-size: 16px'></span></strong> se tipifica preliminarmente como Débil porque en el marco del Sistema HexaRCi una empresa es tipificada como Débil cuando muestra un manejo con deficiencias significativas en su desempeño en el manejo de los Riesgos de Gobierno Corporativo. Detenta una situación financiera muy endeble.<br><br>La necesidad de mejoras sustantivas en el manejo de los riesgos del Gobierno Corporativo es relevante porque éste representa el conjunto de procesos, principios y valores que rigen la forma en que una organización es estrategizada, administrada, controlada y transparentada.<br><br>Fallas en el sistema de Gobierno pueden conducir a la disfuncionalidad de los procesos, impacta en el Apetito de Riesgo, en el manejo de los riesgos de mercado; y como consecuencia puede llevar a un deterioro aún más profundo de la situación financiera futura.<br><br>En general las empresas débiles enfrentan riesgo serio de colapso, tales como problemas financieros graves, pérdida de confianza de clientes, proveedores y empleados y con poca capacidad para operar eficientemente";
        return { tipificacion, textoTipificacion };
    }

    //  MRG INFERIOR

    if (Number(capituloE.porcentaje) > valor1) {  // DEBIL 13.
        tipificacion = "DEBIL";
        textoTipificacion =
        "<strong><span class='company-name' style='font-size: 16px'></span></strong> se tipifica preliminarmente como Débil porque en el marco del Sistema HexaRCi una empresa es tipificada como Débil cuando muestra un manejo con deficiencias muy significativas en su desempeño en el manejo de los Riesgos de Gobierno Corporativo, aun cuando se encuentre detentando una situación financiera saludable.<br><br>La necesidad de mejoras drásticas en el manejo de los riesgos del Gobierno Corporativo es relevante porque éste representa el conjunto de procesos, principios y valores que rigen la forma en que una organización es estrategizada, administrada, controlada y transparentada.<br><br>Fallas en el sistema de Gobierno pueden conducir a la disfuncionalidad de los procesos, impacta en el Apetito de Riesgo, en el manejo de los riesgos de mercado; y, como consecuencia, puede llevar a un deterioro de la situación financiera futura.<br><br>En general las empresas débiles enfrentan riesgo serio de colapso, tales como problemas financieros graves, pérdida de confianza de clientes, proveedores y empleados y con poca capacidad para operar eficientemente.";
        return { tipificacion, textoTipificacion };
    }

    //   DEBIL  -  14
    tipificacion = "DEBIL";
    textoTipificacion =
        "<strong><span class='company-name' style='font-size: 16px'></span></strong> se tipifica preliminarmente como Débil porque en el marco del Sistema HexaRCi una empresa es tipificada como Débil cuando muestra un manejo con deficiencias muy significativas en su desempeño en el manejo de los Riesgos de Gobierno Corporativo, aun cuando pueda detentar una situación financiera relativamente saludable.<br><br>La necesidad de mejoras drásticas en el manejo de los riesgos del Gobierno Corporativo es relevante porque éste representa el conjunto de procesos, principios y valores que rigen la forma en que una organización es estrategizada, administrada, controlada y transparentada.<br><br>Fallas en el sistema de Gobierno pueden conducir a la disfuncionalidad de los procesos, impacta en el Apetito de Riesgo, en el manejo de los riesgos de mercado; y, como consecuencia, puede llevar a un deterioro de la situación financiera futura.<br><br>En general las empresas débiles enfrentan riesgo serio de colapso, tales como problemas financieros graves, pérdida de confianza de clientes, proveedores y empleados y con poca capacidad para operar eficientemente.";
    return { tipificacion, textoTipificacion };
}

/* -----------------------------------------
buscaRespuesta    
------------------------------------------> */
async function buscaRespuesta(CUIT, capitulo) {
    try {
        const response = await fetch(
            `/busca-respuesta-capitulo-ordenado?CUIT=${CUIT}&capitulo=${capitulo}`
        );
        if (!response.ok) {
            throw new Error("Respuesta no OK de buscaRespuesta");
        }

        const resultado = await response.json();
        return { exists: resultado.exists, respuestas: resultado.records || [] };
    } catch (error) {
        console.error("Error al realizar la solicitud en buscaRespuesta:", error);
        return { exists: false, respuestas: [] };
    }
}

/* -----------------------------------------  ::::: ANULADO .  NO SE LLAMA :::::::
actualizarHTML  
------------------------------------------>  ::::::::::::::::::::::::::::::::::::*/
// async function actualizarHTML(respuestas) {
//     let lineaDatosFd = document.getElementById("factor");

//     // Crear fila con la clase 'factor'
//     let filaFactor = document.createElement("tr");
//     filaFactor.classList.add("factor");

//     let celdaFactor = document.createElement("th");
//     celdaFactor.colSpan = 4; // Para que ocupe cuatro columnas
//     celdaFactor.style.fontSize = "20px"; // Ajusta el tamaño según necesites

//     switch (capitulo) {
//         case "A":
//             celdaFactor.textContent =
//                 "Factor: Manejo de los Riesgos de Gobierno Corporativo";
//             break;
//         case "B":
//             celdaFactor.textContent = "Factor: Manejo del Apetito de Riesgo";
//             break;
//         case "C":
//             celdaFactor.textContent = "Factor: Manejo de los Riesgos de Mercado";
//             break;
//         case "D":
//             celdaFactor.textContent = "Factor: Manejo de los Riesgos de Procesos";
//             break;
//         default:
//             celdaFactor.textContent = "error en el Factor";
//     }

//     filaFactor.appendChild(celdaFactor);
//     lineaDatosFd.appendChild(filaFactor);

//     // const max = Number(ria === 0 ? valorCategorias[0].precio[1] : valorCategorias[1].precio[1]);

//     // console.log (`valor de maximo ${max}`)

//     await procesarCategoria({ min: 0, max: max }, "tablaSeccion");

//     async function procesarCategoria(rango, elementoID) {
//         let tablaMenuA = respuestas.filter(
//             (respuesta) =>
//                 respuesta.porcentaje > rango.min && respuesta.porcentaje <= rango.max
//         );

//         if (tablaMenuA.length > 0) {
//             await llenaUnaParte(tablaMenuA, lineaDatosFd);
//         } else {
//             let fila = document.createElement("tr");
//             let celdaNombre = document.createElement("td");
//             celdaNombre.style.width = "500px";
//             celdaNombre.textContent = "*** No hay elementos en esta categoría ***";
//             celdaNombre.style.textAlign = "center";
//             fila.appendChild(celdaNombre);
//             lineaDatosFd.appendChild(fila);
//         }
//     }
// }










/* -----------------------------------------  ::::: ANULADO .  NO SE LLAMA :::::::

// /* -----------------------------------------
// llenaUnaParte
// ------------------------------------------> */
// async function llenaUnaParte(tablaMenuA, lineaDatosFd) {
//     console.table(matrizPreguntas);

//     for (const respuesta of tablaMenuA) {
//         // hay que ver de cada seccion que tipo de pregunta tiene
//         // solo tienen que considerarse si contienen preguntas tipo 1 o 52
//         // si tienen 1 solo van las que tienen como respuesta un 2 (NO)
//         // si tienen 52 solo van las que tienen como respuesta NO (un 2) o (1 o 2) enlas
//         // que van de 1 a 4 (No efectivo, Poco efectivo)

//         // tablaMenuaA tiene todas las respuestas que hayan tenido como porcentaje de
//         // sección un valor menor al maximo (70 o75%)
//         //  tiene capitulo, seccion y el string de respuestas de todas las preguntas

//         // habria que buscar por cada elemento de tablaMenuA, donde indica la seccion,
//         // recorrer las preguntas de esa seccion para ver si tiene tipo 1 o 52
//         // si no tiene ninguna, eliminar la fila de tablaMenuaA

//         // if (!existeTipo) continue;

//         // console.log(`✅ Se encontró tipo 1 o 52 para capitulo=${respuesta.capitulo}, seccion=${respuesta.seccion}`);

//         const existeTipo = matrizPreguntas.some(
//             (p) =>
//                 p.Capitulo == respuesta.capitulo &&
//                 p.Seccion == respuesta.seccion &&
//                 (p.tipo == 1 || p.tipo == 52)
//         );

//         if (!existeTipo) {
//             console.log(
//                 `No hay 1 o 52 en matrizPreguntas para capitulo ${respuesta.capitulo} y seccion ${respuesta.seccion}.`
//             );
//             continue; // Salta a la siguiente iteración del bucle
//         }

//         // Ahora tengo que ver que la respuesta tenga al menos un valor 2 si es tipo 1 (es el NO como respuesta) o un valor 1 o 2 si es tipo  52 (No efectivo o Poco efectivo)
//         // si no lo tienen, hay que ignorar la seccion.

//         // con cada respuesta leida de tablaMenuA

//         //  con la respuesta.seccion recorrer toda la matrizPreguntas con matrizPreguntas.Seccion = respuesta.seccion
//         // selecciono la que tenga tipo 1 o 52.
//         // Si es tipo 1
//         //       si respuesta.respuesta[matrizPreguntas.Numero - 1] == 2 hay que seguir imprimiendo
//         // Si es tipo 52
//         //       si respuesta.respuesta[matrizPreguntas.Numero - 1] < 3 hay que seguir imprimiendo

//         // puedo definir sigoProceso = false
//         // lo pongo en true si hay que seguir imprimiendo
//         // despues pregunto   if (!sigoProceso) continue;

//         console.log(`Procesando respuesta: seccion=${respuesta.seccion}`);

//         // Filtrar las preguntas que cumplen con capitulo y seccion
//         const preguntasFiltradas = matrizPreguntas.filter(
//             (p) =>
//                 p.Capitulo === respuesta.capitulo &&
//                 p.Seccion === respuesta.seccion &&
//                 (p.tipo === 1 || p.tipo === 52)
//         );

//         console.log(`Preguntas filtradas:`, preguntasFiltradas);

//         let sigoProceso = false;

//         // Recorrer las preguntas filtradas
//         for (const pregunta of preguntasFiltradas) {
//             const indice = pregunta.Numero - 1; // Calcular la posición
//             const valorLeido = respuesta.respuesta[indice]; // Obtener respuesta

//             // console.log(`🔍 Evalua pregunta ${pregunta.Numero}: tipo=${pregunta.tipo}, valorLeido=${valorLeido}`);

//             //     console.log(`⛔ Condición no cumplida,
//             if (
//                 (pregunta.tipo === 1 && valorLeido == 2) ||
//                 (pregunta.tipo === 52 && valorLeido < 3)
//             ) {
//                 sigoProceso = true;
//             }
//         }

//         if (!sigoProceso) {
//             console.log(`⛔ No cumplida, salta sgte seccion : ${respuesta.seccion}`);
//             continue;
//         }

//         let filaSeccion = document.createElement("tr");
//         filaSeccion.classList.add("seccion");

//         let celdaNombre = document.createElement("th");
//         celdaNombre.setAttribute("colspan", "4"); // Combina 4 columnas
//         // const capitulo = "A";
//         const indice = respuesta.seccion;
//         const descripcion = await obtenerNombreSeccion(indice, idioma, capitulo);
//         celdaNombre.textContent =
//             "[ " +
//             respuesta.porcentaje +
//             " % ]   -   Seccion: " +
//             respuesta.seccion +
//             ". " +
//             descripcion;
//         // celdaNombre.style.width = '550px';
//         celdaNombre.style.fontSize = "17px";
//         filaSeccion.appendChild(celdaNombre);

//         lineaDatosFd.appendChild(filaSeccion);

//         let filaSituacion = document.createElement("tr"); //fila adicional "Situación"
//         filaSituacion.classList.add("seccion");

//         let celdaSituacionNum = document.createElement("th");
//         celdaSituacionNum.textContent = " # "; // Texto de la situación
//         celdaSituacionNum.style.width = "10px";
//         filaSituacion.appendChild(celdaSituacionNum);

//         let celdaSituacion = document.createElement("th");
//         celdaSituacion.textContent = "Situación"; // Texto de la situación
//         celdaSituacion.style.width = "500px";
//         filaSituacion.appendChild(celdaSituacion);

//         let celdaInformado = document.createElement("th");
//         celdaInformado.textContent = "Informado"; // Texto de 'Informado'
//         celdaInformado.style.width = "50px";
//         filaSituacion.appendChild(celdaInformado);

//         lineaDatosFd.appendChild(filaSituacion);

//         // let celdaFlag = document.createElement('th');
//         // celdaFlag.textContent = "Obs"; // Texto de 'banderida'
//         // celdaFlag.style.width = '10px';
//         // filaSituacion.appendChild(celdaFlag);

//         let info = respuesta.seccion;
//         let preguntasSeccion = matrizPreguntas.filter(
//             (pregunta) => pregunta.Seccion == info
//         );

//         for (const pregunta of preguntasSeccion) {
//             let filaSeccion = document.createElement("tr");
//             filaSeccion.classList.add("situacion2");

//             let celdaNumero = document.createElement("th");
//             celdaNumero.style.width = "5px"; // Define el ancho en píxeles
//             celdaNumero.textContent = pregunta.Numero;
//             filaSeccion.appendChild(celdaNumero);

//             let consigna = document.createElement("th");
//             consigna.style.width = "400px"; // Define el ancho en píxeles
//             consigna.textContent = pregunta.Descrip;
//             consigna.style.fontSize = "14px";
//             filaSeccion.appendChild(consigna);

//             let respondido = document.createElement("th");
//             respondido.style.width = "20px"; // Define el ancho en píxeles
//             poneRespuesta(respuesta, pregunta).then((texto) => {
//                 respondido.textContent = texto;
//                 filaSeccion.appendChild(respondido);

//                 if (pregunta.tipo == "52") {
//                     if (texto == "No efectivo" || texto == "Poco efectivo") {
//                         // if (texto == "No efectivo") {
//                         lineaDatosFd.appendChild(filaSeccion);
//                     }
//                 }

//                 if (pregunta.tipo == "1") {
//                     if (texto == "NO") {
//                         // if (texto == "No efectivo") {
//                         lineaDatosFd.appendChild(filaSeccion);
//                     }
//                 }
//             });

//             // const imagen = document.createElement('img');
//             // if (texto == "NO") {
//             // imagen.src = '../img/advertencia-rojo.png';  // Reemplaza con la ruta de tu imagen
//             // celdaRpta.textContent = imagen;
//             // celdaRpta.appendChild(imagen);
//             // }
//             // if (texto == "No efectivo") {
//             // imagen.src = '../img/advertencia-rojo.png';  // Reemplaza con la ruta de tu imagen
//             //     celdaRpta.appendChild(imagen);
//             // }

//             // if(texto == "Poco efectivo") {
//             //         imagen.src = '../img/alerta-rojo.png';  // Reemplaza con la ruta de tu imagen
//             //         celdaRpta.appendChild(imagen);
//             // }

//             // if(texto == "Efectivo") {
//             //         imagen.src = '../img/advertencia.png';  // Reemplaza con la ruta de tu imagen
//             //         celdaRpta.appendChild(imagen);
//             // }
//             //     else {
//             //     celdaRpta.textContent = ' ';
//             //     }

//             // celdaRpta.textContent = pregunta.tipo;
//             // celdaRpta.style.width = "20px"; // Define el ancho en píxeles
//             // filaSeccion.appendChild(celdaRpta);
//         }
//     }

//     // lineaDatosFd.appendChild(filaSeccion);
// }

/* -----------------------------------------
armarDetalleGeneral
------------------------------------------> */
// function armarDetalleGeneral(info, nombreSeccion, puntaje, porciento, respuestas, textoCheck, textoRespuestas) {
//     let lineaModalGeneral = document.getElementById("lineaModalGeneral");
//     // eliminarFilas();
//     let preguntasSeccion = matrizPreguntas.filter(pregunta =>
//         pregunta.Seccion == info
//     );

//     // console.table(preguntasSeccion);

//     for (const pregunta of preguntasSeccion) {

//         let filaSeccion = document.createElement('tr');
//         // const fila = lineaModalGeneral.insertRow();     // Crear una nueva fila en la tabla

//         let celdaNumero = document.createElement('th');
//         celdaNumero.textContent = pregunta.Numero;
//         filaSeccion.appendChild(celdaNumero);

//         let consigna = document.createElement('th');
//         consigna.textContent = pregunta.Descrip;
//         filaSeccion.appendChild(consigna);

//         // busca el registro de respuesta de la seccion que está trabajando
//         let celdaRpta = document.createElement('th');
//         celdaRpta.textContent = pregunta.tipo;
//     }
// }

/* -----------------------------------------
poneRespuesta
------------------------------------------> */
async function poneRespuesta(respuesta, pregunta) {
    // recupera la respuesta segun el numero de pregunta....;
    const registroRespuestasSeccion = respuesta; //es el arreglo de respuestas para todas las preguntas de la seccion)
    let arrayRespuestas = registroRespuestasSeccion.respuesta;

    valorRespuesta = arrayRespuestas[pregunta.Numero - 1]; // resta 1 por la posición 0

    // segun el tipo de respuesta (en pregunta.tipo) se convierte para mostrar
    // tipo 1:  1: si,  2: no
    if (pregunta.tipo == 1) {
        if (valorRespuesta == 1) {
            return "SI";
        } else {
            return "NO";
        }
    }

    if (pregunta.tipo == 3) {
        return valorRespuesta;
    }

    if (pregunta.tipo == 51) {
        const registroTextoRespuestas = textoRespuestas.find(
            (item) => item.pregunta == pregunta.tipo
        );
        return registroTextoRespuestas.textos[valorRespuesta - 1];
    }

    if (pregunta.tipo > 50) {
        try {
            const registroTextoRespuestas = textoRespuestas.find(
                (registro) => registro.pregunta === pregunta.tipo
            );
            if (!registroTextoRespuestas) {
                console.error(
                    `No se encontró un registro con pregunta igual a ${pregunta.tipo}`
                );
            }
            valorRespuesta = arrayRespuestas[pregunta.Numero - 1]; // resta 1 por la posición 0
            if (valorRespuesta == "9") {
                return "No aplica";
            } else {
                const texto = registroTextoRespuestas.textos[valorRespuesta - 1];
                return texto;
            }
        } catch (error) {
            console.error("Error procesando bloque para pregunta.tipo > 50:", error);
        }
    }

    if (pregunta.tipo > 40 && pregunta.tipo < 50) {
        console.log(
            `\n Pregunta a procesar ${pregunta.Numero} y tipo ${pregunta.tipo} \n`
        );
        let indicesCheck = 0;
        const registroTextoCheck = textoCheck.find(
            (item) => item.pregunta == pregunta.tipo
        );
        if (!registroTextoCheck) {
            console.log(
                "No se encontró ninguna fila con la pregunta:",
                pregunta.tipo
            );
            return;
        }
        valorRespuesta = arrayRespuestas[pregunta.Numero - 1]; // resta 1 por la posición 0
        const valoresTextoCheck = registroTextoCheck.textos;
        // console.log(`registro Respuestas seccion  ${registroRespuestasSeccion.respuesta}`);
        if (pregunta.tipo == 42 || pregunta.tipo == 43) {
            arrayRespuestas = registroRespuestasSeccion.respuesta;
        } else {
            arrayRespuestas = registroRespuestasSeccion.respuesta[6];
        }
        // console.log(`array rsepuestas  ${arrayRespuestas}`)
        let conjunto = "";
        arrayRespuestas.forEach((indice, i) => {
            const texto = valoresTextoCheck[indice - 1]; // Obtener el texto correspondiente al índice
            if (i > 0) {
                conjunto += ", "; // Agregar una coma y un espacio antes de cada texto (excepto el primero)
            }
            conjunto += texto;
        });
        return conjunto;
    }
}

/* -----------------------------------------
poneBandera
------------------------------------------> */
async function poneBandera(respuesta, pregunta) {
    return new Promise((resolve) => {
        let img = document.createElement("img");
        const registroRespuestasSeccion = respuesta;
        let arrayRespuestas = registroRespuestasSeccion.respuesta;
        valorRespuesta = arrayRespuestas[pregunta.Numero - 1]; // resta 1 por la posición 0
        // tipo 1:  1: si,  2: no
        img.style.width = "20px"; // Opcional: ajusta el tamaño de la imagen
        img.style.height = "20px";
        if (pregunta.tipo == 1) {
            if (valorRespuesta == 1) {
                img.src = "../img/marca-de-verificacion.png";
                img.alt = "Correcto";
            } else {
                img.src = "../img/incorrecto.png";
                img.alt = "Incorrecto";
            }
            resolve(img); // Devuelve el elemento img
        }
        if (pregunta.tipo == 3) {
            img.src = "../img/pregunta.png";
            resolve(img); // Devuelve el elemento img
        }
        if (pregunta.tipo == 41 || pregunta.tipo == 42 || pregunta.tipo == 43) {
            img.src = "../img/pregunta-1.png";
            resolve(img); // Devuelve el elemento img
        }
        if (pregunta.tipo == 51) {
            img.src = "../img/pregunta-1.png";
            resolve(img); // Devuelve el elemento img
        }
        if (pregunta.tipo > 50) {
            const registroTextoRespuestas = textoRespuestas.find(
                (registro) => registro.pregunta === pregunta.tipo
            );
            valorRespuesta = arrayRespuestas[pregunta.Numero - 1]; // resta 1 por la posición 0
            if (valorRespuesta == "9") {
                img.src = "../img/blanco.png"; // Reemplaza con la ruta de tu imagen
                resolve(img);
            } else {
                const texto = registroTextoRespuestas.textos[valorRespuesta - 1];
                if (texto == "No efectivo") {
                    img.src = "../img/peligro.png";
                } else if (texto == "Poco efectivo") {
                    img.src = "../img/advertencia-rojo.png";
                } else if (texto == "Efectivo") {
                    img.src = "../img/advertencia.png";
                } else if (texto == "Muy efectivo") {
                    img.src = "../img/comprobar.png";
                } else if (texto == "No hay") {
                    img.src = "../img/peligro.png";
                } else if (texto == "Mensual") {
                    img.src = "../img/comprobar.png";
                } else if (texto == "Ad hoc") {
                    img.src = "../img/comprobado.png";
                } else if (texto == "Anual") {
                    img.src = "../img/comprobar.png";
                } else if (texto == "Mensual" && pregunta.tipo == 55) {
                    img.src = "../img/advertencia.png";
                }
                resolve(img);
            }
        }
    });
}

/* -----------------------------------------
cerrarModal
------------------------------------------> */
function cerrarModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        console.log("Cerrando modal"); // Debugging: Confirmar que el modal se cierra
        modal.style.display = "none";
    }
}

/* -----------------------------------------
obtenerNombreSeccion
------------------------------------------> */
async function obtenerNombreSeccion(indice, idioma, capitulo) {
    try {
        const response = await fetch(
            `/secciones?indice=${indice}&idioma=${idioma}&capitulo=${capitulo}`
        );
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.length > 0) {
            return data[0].descripcion;
        } else {
            return "Descripción no disponible";
        }
    } catch (error) {
        console.error(
            `para leer indice ${indice}, idioma ${idioma}, capitulo ${capitulo}`
        );
        console.error("Error al obtener la descripción:", error);
        return "Descripción no disponible";
    }
}

/* -----------------------------------------
lee Capitulos
------------------------------------------> */
async function leeCapitulos() {
    try {
        const respuesta = await fetch(`/capitulos?idioma=${idioma}`);
        if (respuesta.ok) {
            const capitulos = await respuesta.json();
            return capitulos;
        } else {
            console.error("Error al obtener los datos");
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
    }
    return false;
}

/* -----------------------------------------
lee totalCapitulos
------------------------------------------> */
async function leeTotalCapitulos(CUIT) {
    try {
        const respuesta = await fetch(`/totalCapitulos?CUIT=${CUIT}`);
        if (respuesta.ok) {
            const totalCapitulos = await respuesta.json();
            return totalCapitulos;
        } else {
            console.error("Error al obtener los datos");
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
    }
    return false;
}
/* -----------------------------------------
recuperarPreguntas          
------------------------------------------> */
async function recuperarPreguntas(capitulo) {
    try {
        let url = "/preguntas";
        if (capitulo !== null) {
            url += `?capitulo=${encodeURIComponent(capitulo)}`;
        }

        const response = await fetch(url);
        if (response.ok) {
            const result = await response.json(); // Procesa la respuesta como JSON
            // console.log("termino lectura preguntas");
            return Array.isArray(result) ? result : []; // Asegura devolver un arreglo
        } else {
            console.error("Error al obtener las preguntas:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        return [];
    }
}

/* -----------------------------------------
leeTextoCheck          
------------------------------------------> */
async function leeTextoCheck() {
    try {
        const response = await fetch("/textocheck");
        if (response.ok) {
            const result = await response.json();
            return Array.isArray(result) ? result : []; // Asegura devolver un arreglo
        } else {
            console.error("Error al obtener las preguntas:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        return [];
    }
}

/* -----------------------------------------
leeTextoRespuestas         
------------------------------------------> */
async function leeTextoRespuestas() {
    try {
        const response = await fetch("/textorespuestas");
        if (response.ok) {
            const result = await response.json();
            // console.log("Datos recibidos de /textorespuestas:", result); // Verifica la estructura aquí
            return Array.isArray(result) ? result : []; // Asegura devolver un arreglo
        } else {
            console.error("Error al obtener las preguntas:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        return [];
    }
}

/* -----------------------------------------
leeListaPrecios         
------------------------------------------> */
async function leeListaPrecios() {
    try {
        const response = await fetch("/leeListaPrecios");
        if (response.ok) {
            const result = await response.json();
            const precioZ = Array.isArray(result)
                ? result.filter((item) => item.capitulo === "Z")
                : [];
            return precioZ;
        } else {
            console.error("Error al obtener las preguntas:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        return [];
    }
}
