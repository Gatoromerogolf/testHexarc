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

const elementos = document.querySelectorAll(".company-name");

elementos.forEach((elemento) => {
    elemento.textContent = empresa;
});

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

    // await buscaPrintResultados(CUIT, capitulo);
    // capitulo = "B"
    // matrizPreguntas = await recuperarPreguntas(capitulo);
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
        for (let i = 0; i < 3; i++) {
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
        const data = await buscaRespuesta(CUIT, capitulo.letra);
        const respuestas = data.respuestas || []; // Si no hay respuestas, asigna un array vacío

        // Crear el encabezado (seccion):::::::::::::::::::::::::::

        for (const respuesta of respuestas) {
            if (respuesta.porcentaje > max) {
                console.log(
                    `descarto capitulo ${capitulo.nombre}, seccion ${respuesta.seccion} con % ${respuesta.porcentaje}`
                );
                console.log("**********************");
                continue;
            }

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
            thFactor.setAttribute("colspan", "2");
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
            celdaSituacionNum.style.width = "8px";
            celdaSituacionNum.style.fontWeight = "600";
            filaSituacion.appendChild(celdaSituacionNum);

            let celdaSituacion = document.createElement("td");
            celdaSituacion.textContent = "Situación"; // Texto de la situación
            celdaSituacion.style.width = "300px";
            celdaSituacion.style.fontWeight = "600";
            celdaSituacion.style.fontSize = "16px";
            filaSituacion.appendChild(celdaSituacion);

            tbody.appendChild(filaSituacion);

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

                tbody.appendChild(filaRespuesta);

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

    // console.log(`capitulo A ${capituloA.porcentaje}`)

    //  MRG SUPERIOR
    if (Number(capituloA.porcentaje) > valor1) {
        if (
            Number(capituloB.porcentaje) > valor1 &&
            Number(capituloC.porcentaje) > valor1 &&
            Number(capituloD.porcentaje) > valor1 &&
            Number(capituloE.porcentaje) > valor1 &&
            Number(capituloF.porcentaje) > valor1
        ) {
            tipificacion = "COMPETITIVA";
            textoTipificacion =
                "<strong>Nombre Empresa</strong> se tipifica preliminarmente como Competitiva porque en el marco del Sistema HexaRCi una empresa es tipificada como Competitiva cuando detenta un desempeño destacado en su manejo de la totalidad de los riesgos: de Gobierno Corporativo, del Apetito de Riesgo, de Mercado y de los Procesos. Su situación financiera así como la generación de resultados son consistentemente saludables.<br><br>En general las empresas competitivas son capaces de superar y mantenerse por delante de sus competidores, ofreciendo productos o servicios de valor que le permite atraer y retener clientes. También generar una situación financiera satisfactoria para sus propietarios y con ello efectuar las inversiones necesarias para mantener su liderazgo.";
            return { tipificacion, textoTipificacion };
        }
        if (
            Number(capituloB.porcentaje) > valor2 &&
            Number(capituloC.porcentaje) > valor2 &&
            Number(capituloD.porcentaje) > valor2 &&
            Number(capituloE.porcentaje) > valor2 &&
            Number(capituloF.porcentaje) > valor2
        ) {
            tipificacion = "RESILIENTE";
            textoTipificacion =
                "Nombre Empresa se tipifica preliminarmente como Resiliente porque en el marco del Sistema HexaRCi una empresa es tipificada como Resiliente cuando detenta un desempeño destacado en su manejo de los Riesgos de Gobierno Corporativo y un desempeño relevante en su manejo de los riesgos del Apetito de Riesgo, de los Riesgos de Mercado y de los Riesgos de los Procesos.  Su situación financiera así como la generación de resultados son saludables.<br><br>En general las empresas resilientes son capaces de adaptarse, resistir y recuperarse rápidamente frente a adversidades, crisis o cambios bruscos en el entorno. La resiliencia empresarial se refleja en la habilidad para, no solo superar desafíos, sino también aprender de ellos y salir fortalecida mediante su estructura, cultura y recursos y mantener su operación en el largo plazo.";
            return { tipificacion, textoTipificacion };
        }
        if (Number(capituloE.porcentaje) > valor3) {
            tipificacion = "VULNERABLE";
            textoTipificacion =
                "Una empresa es vulnerable cuando enfrenta desafíos significativos, tales como competencia creciente, presión en los márgenes o falta de diferenciación en el mercado. Aunque todavía opera con normalidad, su posición no es segura a mediano o largo plazo.<br><br>En el contexto del Sistema HexaRCi una empresa es tipificada como Vulnerable cuando frente una Situación Financiera endeble muestra un manejo destacado en el manejo los riesgos de Gobierno Corporativo, al ser ésta la fortaleza que permitirá su recuperación.<br><br>La necesidad de mejoras significativas en el manejo de los riesgos del Gobierno Corporativo es relevante porque éste representa el conjunto de procesos, principios y valores que rigen la forma en que una organización es estrategizada, administrada, controlada y transparentada.  Las fallas en el sistema de Gobierno pueden conducir a la disfuncionalidad de los procesos. El sistema de gobierno corporativo impacta en el Apetito de Riesgo y su calidad operativa-funcional determina el manejo de los riesgos de mercado y de los procesos; y como consecuencia a un deterioro de la situación financiera futura.";
            return { tipificacion, textoTipificacion };
        }
        tipificacion = "INESTABLE";
        textoTipificacion =
            "Una empresa es Inestable cuando se enfrenta con problemas de significación, como pérdidas recurrentes, modelos de negocio obsoletos o mala gestión. Su viabilidad está en riesgo si no implementan cambios significativos.<br>En el contexto del Sistema HexaRCi una empresa será tipificada como Inestable cuando muestra una Situación Financiera endeble con un manejo de los Riesgos de Gobierno Corporativo que requiere mejoras.<br>La necesidad de mejoras en el manejo de los riesgos del Gobierno Corporativo es relevante porque éste representa el conjunto de procesos, principios y valores que rigen la forma en que una organización es estrategizada, administrada, controlada y transparentada. Las fallas en el sistema de Gobierno pueden conducir a la disfuncionalidad de los procesos. El sistema de gobierno corporativo impacta en el Apetito de Riesgo y su calidad operativa-funcional determina el manejo de los riesgos de mercado y de los procesos. Ello sumado a la endeblez de la situación financiera puede llevar a la empresa a una debilidad considerable.";
        return { tipificacion, textoTipificacion };
    }

    //  MRG ALTO
    if (Number(capituloA.porcentaje) > valor2) {
        if (
            Number(capituloD.porcentaje) > valor2 &&
            Number(capituloE.porcentaje) > valor1
        ) {
            tipificacion = "SOLIDA";
            textoTipificacion =
                "Una empresa es Sólida cuando tiene la capacidad de manejar el quehacer diario sin contratiempos significativos. Son empresas estables y financieramente seguras, con fundamentos sólidos y procesos eficientes. Su estabilidad y consistencia las hacen confiables en su mercado.<br>En el contexto del Sistema HexaRCi una empresa es tipificada como Sólida cuando muestra un manejo relevante de los Riesgos de Gobierno Corporativo y de los Riesgos de los Procesos. Asimismo y su Situación Financiera es sólida.";
            return { tipificacion, textoTipificacion };
        }
        if (
            Number(capituloD.porcentaje) > valor2 &&
            Number(capituloE.porcentaje) > valor2
        ) {
            tipificacion = "SOLIDA";
            textoTipificacion =
                "Una empresa es Sólida cuando tiene la capacidad de manejar el quehacer diario sin contratiempos significativos. Son empresas estables y financieramente seguras, con fundamentos sólidos y procesos eficientes. Su estabilidad y consistencia las hacen confiables en su mercado.<br>En el contexto del Sistema HexaRCi una empresa es tipificada como Sólida cuando muestra un manejo relevante de los Riesgos de Gobierno Corporativo y de los Riesgos de los Procesos. Asimismo y su Situación Financiera es sólida.";
            return { tipificacion, textoTipificacion };
        }

        if (Number(capituloE.porcentaje) > valor3) {
            tipificacion = "INESTABLE";
            textoTipificacion =
                "Una empresa es Inestable cuando se enfrenta con problemas de significación, como pérdidas recurrentes, modelos de negocio obsoletos o mala gestión. Su viabilidad está en riesgo si no implementan cambios significativos.<br><br>En el contexto del Sistema HexaRCi una empresa será tipificada como Inestable cuando muestra una Situación Financiera endeble con un manejo de los Riesgos de Gobierno Corporativo que requiere mejoras.  La necesidad de mejoras en el manejo de los riesgos del Gobierno Corporativo es relevante porque éste representa el conjunto de procesos, principios y valores que rigen la forma en que una organización es estrategizada, administrada, controlada y transparentada. Las fallas en el sistema de Gobierno pueden conducir a la disfuncionalidad de los procesos. El sistema de gobierno corporativo impacta en el Apetito de Riesgo y su calidad operativa-funcional determina el manejo de los riesgos de mercado y de los procesos. Ello sumado a la endeblez de la situación financiera puede llevar a la empresa a una debilidad considerable.";
            return { tipificacion, textoTipificacion };
        }

        tipificacion = "INESTABLE";
        textoTipificacion =
            "Una empresa es Inestable cuando se enfrenta con problemas de significación, como pérdidas recurrentes, modelos de negocio obsoletos o mala gestión. Su viabilidad está en riesgo si no implementan cambios significativos.<br>En el contexto del Sistema HexaRCi una empresa es tipificada como Inestable cuando presenta una Situación Financiera delicada, pero que puede recuperarse debido a un manejo destacado de los Riesgos de Gobierno Corporativo, al ser ésta la fortaleza que permitirá su recuperación.  La necesidad de mejoras en el manejo de los riesgos del Gobierno Corporativo es relevante porque éste representa el conjunto de procesos, principios y valores que rigen la forma en que una organización es estrategizada, administrada, controlada y transparentada. Las fallas en el sistema de Gobierno pueden conducir a la disfuncionalidad de los procesos. El sistema de gobierno corporativo impacta en el Apetito de Riesgo y su calidad operativa-funcional determina el manejo de los riesgos de mercado y de los procesos. Ello sumado a la endeblez de la situación financiera puede llevar a la empresa a una debilidad considerable.";
        return { tipificacion, textoTipificacion };
    }

    //  MRG BAJO
    if (Number(capituloA.porcentaje) > valor3) {
        // console.log ("entro en bajo");
        if (Number(capituloE.porcentaje) > valor1) {
            tipificacion = "VULNERABLE";
            textoTipificacion =
                "En el sistema HexaRCi, una empresa se clasifica como Vulnerable cuando, a pesar de contar con una situación financiera sólida, presenta deficiencias significativas en la gestión de los riesgos de Gobierno Corporativo.<br><br> Esta clasificación no implica un problema inmediato en su estabilidad financiera, pero sí una exposición considerable a riesgos que podrían comprometer su sostenibilidad a largo plazo.<br>El Gobierno Corporativo es un pilar fundamental en la estructura de cualquier organización, ya que define el conjunto de procesos, principios y valores que regulan su dirección, administración, control y transparencia. Un sistema de gobierno corporativo eficiente no solo fortalece la confianza de los inversionistas y otras partes interesadas, sino que también permite una gestión más eficaz de los riesgos y oportunidades estratégicas.<br><br>Cuando el Gobierno Corporativo presenta fallas, la organización puede enfrentar disfuncionalidades en sus procesos internos, afectando su capacidad para responder a los desafíos del entorno. Estas debilidades impactan directamente en el Apetito de Riesgo, es decir, en la cantidad y el tipo de riesgo que la empresa está dispuesta a asumir para alcanzar sus objetivos estratégicos.<br><br>Como consecuencia, una gestión inadecuada de los riesgos de mercado y operacionales puede deteriorar progresivamente su situación financiera, poniendo en riesgo su estabilidad y competitividad en el futuro.  Por ello, la mejora en el manejo de los riesgos de Gobierno Corporativo es un aspecto crítico para garantizar la resiliencia y sostenibilidad de la empresa, incluso cuando su situación financiera actual sea favorable.";
            return { tipificacion, textoTipificacion };
        }

        if (Number(capituloE.porcentaje) > valor2) {
            tipificacion = "VULNERABLE";
            textoTipificacion =
                "Una empresa es vulnerable cuando enfrenta desafíos significativos, tales como competencia creciente, presión en los márgenes o falta de diferenciación en el mercado. Aunque todavía opera con normalidad, su posición no es segura a mediano o largo plazo.<br><br>En el contexto del Sistema HexaRCi una empresa es tipificada como Vulnerable cuando muestra una Situación Financiera sólida necesitando mejoras significativas en su manejo de los Riesgos de Gobierno Corporativo.<br><br>La necesidad de mejoras significativas en el manejo de los riesgos del Gobierno Corporativo es relevante porque éste representa el conjunto de procesos, principios y valores que rigen la forma en que una organización es estrategizada, administrada, controlada y transparentada.  Las fallas en el sistema de Gobierno pueden conducir a la disfuncionalidad de los procesos. El sistema de gobierno corporativo impacta en el Apetito de Riesgo y su calidad operativa-funcional determina el manejo de los riesgos de mercado y de los procesos; y como consecuencia a un deterioro de la situación financiera futura.";
            return { tipificacion, textoTipificacion };
        }

        if (Number(capituloE.porcentaje) > valor3) {
            tipificacion = "INESTABLE";
            textoTipificacion =
                "En el sistema HexaRCi, una empresa se clasifica como Vulnerable cuando, a pesar de contar con una situación financiera sólida, presenta deficiencias significativas en la gestión de los riesgos de Gobierno Corporativo.<br><br> Esta clasificación no implica un problema inmediato en su estabilidad financiera, pero sí una exposición considerable a riesgos que podrían comprometer su sostenibilidad a largo plazo.<br>El Gobierno Corporativo es un pilar fundamental en la estructura de cualquier organización, ya que define el conjunto de procesos, principios y valores que regulan su dirección, administración, control y transparencia. Un sistema de gobierno corporativo eficiente no solo fortalece la confianza de los inversionistas y otras partes interesadas, sino que también permite una gestión más eficaz de los riesgos y oportunidades estratégicas.<br><br>Cuando el Gobierno Corporativo presenta fallas, la organización puede enfrentar disfuncionalidades en sus procesos internos, afectando su capacidad para responder a los desafíos del entorno. Estas debilidades impactan directamente en el Apetito de Riesgo, es decir, en la cantidad y el tipo de riesgo que la empresa está dispuesta a asumir para alcanzar sus objetivos estratégicos.<br><br>Como consecuencia, una gestión inadecuada de los riesgos de mercado y operacionales puede deteriorar progresivamente su situación financiera, poniendo en riesgo su estabilidad y competitividad en el futuro.  Por ello, la mejora en el manejo de los riesgos de Gobierno Corporativo es un aspecto crítico para garantizar la resiliencia y sostenibilidad de la empresa, incluso cuando su situación financiera actual sea favorable..";
            return { tipificacion, textoTipificacion };
        }

        tipificacion = "DEBIL";
        textoTipificacion =
            "Empresas con riesgo serio de colapso, tales como problemas financieros graves, pérdida de confianza de clientes, proveedores y empleados y con poca capacidad para operar eficientemente.<br>En el contexto del Sistema HexaRCi una empresa es tipificada como Débil cuando muestra un manejo con deficiencias serias en el manejo de los Riesgos de Gobierno Corporativo.  El presentar deficiencias serias en el manejo de los riesgos del Gobierno Corporativo es crítica porque éste representa el conjunto de procesos, principios y valores que rigen la forma en que una organización es estrategizada, administrada, controlada y transparentada. Las fallas serias en el sistema de Gobierno pueden conducir a la disfuncionalidad de los procesos y con ello un deterioro generalizado que pone en riesgo la sostenibilidad de la empresa.";
        return { tipificacion, textoTipificacion };
    }

    //  MRG INFERIOR

    if (Number(capituloE.porcentaje) > valor1) {
        tipificacion = "DEBIL";
        textoTipificacion =
            "Empresas con riesgo serio de colapso, tales como problemas financieros graves, pérdida de confianza de clientes, proveedores y empleados y con poca capacidad para operar eficientemente.<br>En el contexto del Sistema HexaRCi una empresa es tipificada como Débil cuando muestra un manejo con deficiencias serias en el manejo de los Riesgos de Gobierno Corporativo.  El presentar deficiencias serias en el manejo de los riesgos del Gobierno Corporativo es crítica porque éste representa el conjunto de procesos, principios y valores que rigen la forma en que una organización es estrategizada, administrada, controlada y transparentada. Las fallas serias en el sistema de Gobierno pueden conducir a la disfuncionalidad de los procesos y con ello un deterioro generalizado que pone en riesgo la sostenibilidad de la empresa.";
        return { tipificacion, textoTipificacion };
    }

    tipificacion = "DEBIL";
    textoTipificacion =
        "Empresas con riesgo serio de colapso, tales como problemas financieros graves, pérdida de confianza de clientes, proveedores y empleados y con poca capacidad para operar eficientemente.<br>En el contexto del Sistema HexaRCi una empresa es tipificada como Débil cuando muestra un manejo con deficiencias serias en el manejo de los Riesgos de Gobierno Corporativo.  El presentar deficiencias serias en el manejo de los riesgos del Gobierno Corporativo es crítica porque éste representa el conjunto de procesos, principios y valores que rigen la forma en que una organización es estrategizada, administrada, controlada y transparentada. Las fallas serias en el sistema de Gobierno pueden conducir a la disfuncionalidad de los procesos y con ello un deterioro generalizado que pone en riesgo la sostenibilidad de la empresa.";
    return { tipificacion, textoTipificacion };
}

/* ----------------------------------------- ::::::::::::  ANULADO ::::::::::::::::::::::::::
buscaPrintResultados      
------------------------------------------>  :::::::::::::::::::::::::::::::::::::::::::::::*/
// async function buscaPrintResultados(CUIT, capitulo) {
//     try {
//         const { exists, respuestas } = await buscaRespuesta(CUIT, capitulo); // Espera a que la promesa de buscaRespuesta se resuelva
//         if (exists && respuestas.length > 0) {
//             actualizarHTML(respuestas); // Imprime el resultado de los registros obtenidos
//         } else {
//             console.log("No se encontraron registros.");
//         }
//     } catch (error) {
//         console.error("Error al ejecutar la búsqueda:", error);
//     }
// }





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
