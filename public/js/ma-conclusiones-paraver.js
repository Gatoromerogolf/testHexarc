async function actualizarHTML(respuestas) {

    async function procesarCategoria(rango, elementoID) {
      let tablaMenuA = respuestas.filter(respuesta => 
        respuesta.porcentaje > rango.min && respuesta.porcentaje <= rango.max
      );
  
      let lineaDatosFd = document.getElementById(elementoID);
  
      if (tablaMenuA.length > 0) {
        await llenaUnaParte(tablaMenuA, lineaDatosFd);
      } else {
        let fila = document.createElement('tr');
        let celdaNombre = document.createElement('td');
        celdaNombre.style.width = '500px';
        celdaNombre.textContent = '*** No hay elementos en esta categoría ***';
        celdaNombre.style.textAlign = 'center';
        fila.appendChild(celdaNombre);
        lineaDatosFd.appendChild(fila);
      }
    }
  
    const rangos = [
      { min: 0, max: 50, id: 'questionsTableBody' }, // NO EFECTIVAS
      { min: 50, max: 70, id: 'questions5170' },     // POCO EFECTIVAS
      { min: 70, max: 90, id: 'questions7190' },     // EFECTIVAS
      { min: 90, max: 100, id: 'questions90100' }    // MUY EFECTIVAS
    ];
  
    for (const rango of rangos) {
      await procesarCategoria(rango, rango.id);
    }
  
    // Actualiza los puntajes generales
    const puntajeTotal = respuestas.reduce((sum, item) => sum + item.valor_maximo, 0);
    const puntajeObtenido = respuestas.reduce((sum, item) => sum + item.valor_obtenido, 0);
    const porcentajeObtenido = ((puntajeObtenido / puntajeTotal) * 100).toFixed(2);
  
    document.getElementById('puntajeTotal').textContent = puntajeTotal;
    document.getElementById('puntajeObtenido').textContent = puntajeObtenido;
    document.getElementById('porcentajeObtenido').textContent = porcentajeObtenido;
  }
  
  // Aquí es donde debes asegurarte de que la función `llenaUnaParte` esté bien definida
  async function llenaUnaParte(tablaMenuA, lineaDatosFd) {
    tablaMenuA.forEach(respuesta => {
      let fila = document.createElement('tr');
      let celdaNombre = document.createElement('td');
      celdaNombre.style.width = '500px';
      celdaNombre.textContent = respuesta.nombre_seccion;
      fila.appendChild(celdaNombre);
  
      let celdaIdeal = document.createElement('td');
      celdaIdeal.textContent = respuesta.valor_maximo;
      fila.appendChild(celdaIdeal);
  
      let celdaObtenida = document.createElement('td');
      celdaObtenida.textContent = respuesta.valor_obtenido;
      fila.appendChild(celdaObtenida);
  
      let celdaPorcentaje = document.createElement('td');
      celdaPorcentaje.textContent = `${respuesta.porcentaje}%`;
      fila.appendChild(celdaPorcentaje);
  
      let celdaVer = document.createElement('td');
      let linkVer = document.createElement('a');
      linkVer.href = `#detalles-${respuesta.id_seccion}`;
      linkVer.textContent = 'Ver';
      celdaVer.appendChild(linkVer);
      fila.appendChild(celdaVer);
  
      lineaDatosFd.appendChild(fila);
    });
  }
  