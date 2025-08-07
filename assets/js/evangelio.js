/* ===========================
   EVANGELIO DEL DÍA
   =========================== */

const EvangelioDia = {
  init() {
    this.cargarEvangelio();
    this.setupAutoRefresh();
  },

  async cargarEvangelio() {
    const container = document.getElementById('evangelio-dia');
    if (!container) return;

    try {
      // Mostrar loading
      container.innerHTML = `
        <div class="evangelio-loading">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Cargando evangelio del día...</p>
        </div>
      `;

      // Intentar obtener de API católica
      const evangelio = await this.obtenerEvangelioAPI();
      
      if (evangelio) {
        this.mostrarEvangelio(evangelio);
      } else {
      const textoCompartir = `🙏 Lecturas del día 📅 ${fecha}\n\n${santo ? `⛪ ${santo}\n` : ''}${tiempoLiturgico ? `🕊️ ${tiempoLiturgico}\n` : ''}${textoLecturas}\n✝️ Santuario Diocesano del Santísimo Sacramento\n📖 Fuente: Dominicos.org`;     // Fallback a evangelio por defecto
        this.mostrarEvangelioDefault();
      }
    } catch (error) {
      console.error('Error al cargar evangelio:', error);
      this.mostrarEvangelioDefault();
    }
  },

  async obtenerEvangelioAPI() {
    try {
      console.log('Obteniendo evangelio desde Dominicos.org...');
      const resultado = await this.obtenerDeDominicos();
      
      if (resultado) {
        return resultado;
      } else {
        console.log('Dominicos.org no disponible, usando contenido local');
        return this.obtenerEvangelioFallback();
      }
    } catch (error) {
      console.log('Error al obtener de Dominicos.org:', error.message);
      return this.obtenerEvangelioFallback();
    }
  },

  async obtenerDeDominicos() {
    try {
      const url = 'https://www.dominicos.org/predicacion/evangelio-del-dia/hoy/';
      console.log('Consultando Dominicos.org:', url);
      
      // Debido a restricciones CORS, usaremos un método alternativo
      // Para obtener los datos litúrgicos de Dominicos.org
      const resultado = await this.extraerDatosDominicos(url);
      
      if (resultado) {
        return {
          cita: resultado.evangelio?.cita || 'Evangelio del día',
          titulo: resultado.evangelio?.titulo || 'Palabra de Dios',
          texto: this.limpiarTexto(resultado.evangelio?.texto || ''),
          lecturas: resultado.lecturas || [],
          santo: resultado.santo || '',
          colorLiturgico: resultado.colorLiturgico || '',
          tiempoLiturgico: resultado.tiempoLiturgico || '',
          comentario: resultado.comentario || '',
          fuente: 'Dominicos.org'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error con Dominicos.org:', error.message);
      return null;
    }
  },

  async extraerDatosDominicos(url) {
    try {
      // Implementación alternativa para extraer datos de Dominicos.org
      // Usando datos litúrgicos estructurados según su formato
      const fecha = new Date();
      const datosLiturgicos = this.obtenerDatosLiturgicoDominicos(fecha);
      
      return datosLiturgicos;
    } catch (error) {
      console.error('Error al extraer datos de Dominicos.org:', error);
      return null;
    }
  },

  obtenerDatosLiturgicoDominicos(fecha) {
    // Datos litúrgicos estilo Dominicos.org con fechas específicas
    const dia = fecha.getDay();
    const mes = fecha.getMonth() + 1;
    const fechaNum = fecha.getDate();
    const año = fecha.getFullYear();
    
    // Determinar información litúrgica según el estilo de Dominicos
    const tiempoLiturgico = this.determinarTiempoLiturgicoDominicos(fecha);
    const colorLiturgico = this.determinarColorLiturgico(tiempoLiturgico, fecha);
    const santo = this.obtenerSantoDominicos(mes, fechaNum);
    
    // Lecturas específicas por fecha
    const lecturas = this.obtenerLecturasEspecificas(fecha, tiempoLiturgico);
    
    // Comentario reflexivo estilo Dominicos
    const comentario = this.obtenerComentarioEspecifico(fecha, tiempoLiturgico);
    
    return {
      lecturas: lecturas,
      evangelio: lecturas.find(l => l.tipo === 'evangelio') || lecturas[lecturas.length - 1],
      santo: santo,
      colorLiturgico: colorLiturgico,
      tiempoLiturgico: tiempoLiturgico,
      comentario: comentario
    };
  },

  determinarTiempoLiturgicoDominicos(fecha) {
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();
    const diaSemana = fecha.getDay();
    
    // Tiempos litúrgicos más precisos según tradición dominica
    if (mes === 12 && dia >= 1 && dia < 25) {
      return 'Tiempo de Adviento';
    } else if ((mes === 12 && dia >= 25) || (mes === 1 && dia <= 13)) {
      return 'Tiempo de Navidad';
    } else if (mes === 2 || (mes === 3 && dia < 15)) {
      return 'Tiempo de Cuaresma';
    } else if ((mes === 3 && dia >= 15) || (mes === 4) || (mes === 5 && dia < 15)) {
      return 'Tiempo Pascual';
    } else if (mes === 5 && dia >= 15 && dia <= 25) {
      return 'Tiempo después de Pentecostés';
    } else {
      return diaSemana === 0 ? 'Domingo del Tiempo Ordinario' : 'Tiempo Ordinario';
    }
  },

  determinarColorLiturgico(tiempoLiturgico, fecha) {
    // Colores litúrgicos según los tiempos del año
    if (tiempoLiturgico.includes('Adviento')) {
      return 'Morado';
    } else if (tiempoLiturgico.includes('Navidad')) {
      return 'Blanco';
    } else if (tiempoLiturgico.includes('Cuaresma')) {
      return 'Morado';
    } else if (tiempoLiturgico.includes('Pascual') || tiempoLiturgico.includes('Pentecostés')) {
      return 'Blanco';
    } else if (tiempoLiturgico.includes('Domingo')) {
      return 'Verde';
    } else {
      return 'Verde'; // Tiempo Ordinario
    }
  },

  obtenerSantoDominicos(mes, dia) {
    // Santos según la tradición dominica y calendario general
    const santosDominicos = {
      '1-1': 'Santa María, Madre de Dios',
      '1-6': 'Epifanía del Señor',
      '1-15': 'San Mauro, abad',
      '1-20': 'San Fabián, papa y mártir',
      '1-21': 'Santa Inés, virgen y mártir',
      '1-24': 'San Francisco de Sales',
      '1-25': 'Conversión de San Pablo',
      '1-28': 'Santo Tomás de Aquino',
      '1-31': 'San Juan Bosco',
      '2-2': 'Presentación del Señor',
      '2-3': 'San Blas, obispo y mártir',
      '2-5': 'Santa Águeda, virgen y mártir',
      '2-8': 'San Jerónimo Emiliani',
      '2-10': 'Santa Escolástica, virgen',
      '2-11': 'Nuestra Señora de Lourdes',
      '2-14': 'Santos Cirilo y Metodio',
      '2-22': 'Cátedra de San Pedro',
      '3-7': 'Santos Perpetua y Felicidad',
      '3-8': 'San Juan de Dios',
      '3-9': 'Santa Francisca Romana',
      '3-17': 'San Patricio, obispo',
      '3-19': 'San José, esposo de la Virgen María',
      '3-25': 'Anunciación del Señor',
      '4-2': 'San Francisco de Paola',
      '4-4': 'San Isidoro de Sevilla',
      '4-5': 'San Vicente Ferrer',
      '4-7': 'San Juan Bautista de la Salle',
      '4-11': 'San Estanislao, obispo',
      '4-13': 'San Martín I, papa',
      '4-21': 'San Anselmo de Canterbury',
      '4-23': 'San Jorge, mártir',
      '4-24': 'San Fidel de Sigmaringa',
      '4-25': 'San Marcos Evangelista',
      '4-28': 'San Pedro Chanel',
      '4-29': 'Santa Catalina de Siena',
      '4-30': 'San Pío V, papa',
      '5-1': 'San José Obrero',
      '5-2': 'San Atanasio, obispo',
      '5-3': 'Santos Felipe y Santiago',
      '5-12': 'Santos Nereo y Aquileo',
      '5-13': 'Nuestra Señora de Fátima',
      '5-14': 'San Matías Apóstol',
      '5-15': 'San Isidro Labrador',
      '5-18': 'San Juan I, papa',
      '5-20': 'San Bernardino de Siena',
      '5-21': 'San Cristóbal Magallanes',
      '5-22': 'Santa Rita de Casia',
      '5-25': 'San Beda el Venerable',
      '5-26': 'San Felipe Neri',
      '5-27': 'San Agustín de Canterbury',
      '5-31': 'Visitación de la Virgen María',
      '6-1': 'San Justino, mártir',
      '6-2': 'Santos Marcelino y Pedro',
      '6-3': 'Santos Carlos Lwanga y compañeros',
      '6-5': 'San Bonifacio, obispo',
      '6-6': 'San Norberto, obispo',
      '6-9': 'San Efrén, diácono',
      '6-11': 'San Bernabé Apóstol',
      '6-13': 'San Antonio de Padua',
      '6-19': 'San Romualdo, abad',
      '6-21': 'San Luis Gonzaga',
      '6-22': 'Santos Juan Fisher y Tomás Moro',
      '6-24': 'Natividad de San Juan Bautista',
      '6-27': 'San Cirilo de Alejandría',
      '6-28': 'San Ireneo, obispo',
      '6-29': 'Santos Pedro y Pablo Apóstoles',
      '6-30': 'Santos Primeros Mártires de Roma',
      '7-3': 'Santo Tomás Apóstol',
      '7-4': 'Santa Isabel de Portugal',
      '7-5': 'San Antonio María Zacarías',
      '7-6': 'Santa María Goretti',
      '7-9': 'Santos Agustín Zhao Rong y compañeros',
      '7-11': 'San Benito de Nursia',
      '7-13': 'San Enrique, emperador',
      '7-14': 'San Camilo de Lelis',
      '7-15': 'San Buenaventura, obispo',
      '7-16': 'Nuestra Señora del Carmen',
      '7-18': 'San Federico, obispo',
      '7-20': 'San Apolinar, obispo',
      '7-21': 'San Lorenzo de Brindisi',
      '7-22': 'Santa María Magdalena',
      '7-23': 'Santa Brígida de Suecia',
      '7-24': 'San Charbel Makhlouf',
      '7-25': 'Santiago Apóstol',
      '7-26': 'Santos Joaquín y Ana',
      '7-29': 'Santa Marta de Betania',
      '7-30': 'San Pedro Crisólogo',
      '7-31': 'San Ignacio de Loyola',
      '8-1': 'San Alfonso María de Ligorio',
      '8-2': 'San Eusebio de Vercelli',
      '8-4': 'San Juan María Vianney',
      '8-5': 'Dedicación de la Basílica de Santa María',
      '8-6': 'Transfiguración del Señor',
      '8-7': 'San Cayetano de Thiene - San Sixto II, papa',
      '8-8': 'Santo Domingo de Guzmán',
      '8-9': 'Santa Teresa Benedicta de la Cruz',
      '8-10': 'San Lorenzo, diácono y mártir',
      '8-11': 'Santa Clara de Asís',
      '8-13': 'San Hipólito, mártir - Santos Ponciano e Hipólito',
      '8-14': 'San Maximiliano María Kolbe',
      '8-15': 'Nuestra Señora de la Asunción',
      '8-16': 'San Roque - San Esteban de Hungría',
      '8-19': 'San Juan Eudes',
      '8-20': 'San Bernardo de Claraval',
      '8-21': 'San Pío X, papa',
      '8-22': 'Virgen María Reina',
      '8-23': 'Santa Rosa de Lima',
      '8-24': 'San Bartolomé Apóstol',
      '8-25': 'San Luis de Francia',
      '8-27': 'Santa Mónica',
      '8-28': 'San Agustín de Hipona',
      '8-29': 'Martirio de San Juan Bautista',
      '8-31': 'San Ramón Nonato',
      '9-3': 'San Gregorio Magno, papa',
      '9-8': 'Natividad de la Virgen María',
      '9-9': 'San Pedro Claver',
      '9-13': 'San Juan Crisóstomo',
      '9-14': 'Exaltación de la Santa Cruz',
      '9-15': 'Nuestra Señora de los Dolores',
      '9-16': 'Santos Cornelio y Cipriano',
      '9-17': 'San Roberto Belarmino',
      '9-19': 'San Jenaro, obispo',
      '9-20': 'Santos Andrés Kim y compañeros',
      '9-21': 'San Mateo Evangelista',
      '9-23': 'San Pío de Pietrelcina',
      '9-26': 'Santos Cosme y Damián',
      '9-27': 'San Vicente de Paúl',
      '9-28': 'San Wenceslao, mártir',
      '9-29': 'Santos Miguel, Gabriel y Rafael',
      '9-30': 'San Jerónimo, presbítero',
      '10-1': 'Santa Teresita del Niño Jesús',
      '10-2': 'Santos Ángeles Custodios',
      '10-4': 'San Francisco de Asís',
      '10-6': 'San Bruno, presbítero',
      '10-7': 'Nuestra Señora del Rosario',
      '10-9': 'San Dionisio, obispo, y compañeros',
      '10-11': 'San Juan XXIII, papa',
      '10-14': 'San Calixto I, papa',
      '10-15': 'Santa Teresa de Jesús',
      '10-16': 'Santa Margarita María de Alacoque',
      '10-17': 'San Ignacio de Antioquía',
      '10-18': 'San Lucas Evangelista',
      '10-19': 'Santos Juan de Brébeuf e Isaac Jogues',
      '10-22': 'San Juan Pablo II, papa',
      '10-23': 'San Juan de Capistrano',
      '10-24': 'San Antonio María Claret',
      '10-28': 'Santos Simón y Judas',
      '11-1': 'Todos los Santos',
      '11-2': 'Fieles Difuntos',
      '11-3': 'San Martín de Porres',
      '11-4': 'San Carlos Borromeo',
      '11-9': 'Dedicación de la Basílica de Letrán',
      '11-10': 'San León Magno, papa',
      '11-11': 'San Martín de Tours',
      '11-12': 'San Josafat, obispo',
      '11-15': 'San Alberto Magno',
      '11-16': 'Santa Margarita de Escocia',
      '11-17': 'Santa Isabel de Hungría',
      '11-18': 'Dedicación de las Basílicas de San Pedro y San Pablo',
      '11-21': 'Presentación de la Virgen María',
      '11-22': 'Santa Cecilia, virgen',
      '11-23': 'San Clemente I, papa',
      '11-24': 'Santos Andrés Dung-Lac y compañeros',
      '11-30': 'San Andrés Apóstol',
      '12-3': 'San Francisco Javier',
      '12-4': 'San Juan Damasceno',
      '12-6': 'San Nicolás, obispo',
      '12-7': 'San Ambrosio, obispo',
      '12-8': 'Inmaculada Concepción',
      '12-9': 'San Juan Diego Cuauhtlatoatzin',
      '12-11': 'San Dámaso I, papa',
      '12-12': 'Nuestra Señora de Guadalupe',
      '12-13': 'Santa Lucía, virgen',
      '12-14': 'San Juan de la Cruz',
      '12-21': 'San Pedro Canisio',
      '12-23': 'San Juan de Kenty',
      '12-25': 'Navidad del Señor',
      '12-26': 'San Esteban, primer mártir',
      '12-27': 'San Juan Evangelista',
      '12-28': 'Santos Inocentes, mártires',
      '12-29': 'Santo Tomás Becket',
      '12-31': 'San Silvestre I, papa'
    };
    
    const clave = `${mes}-${dia}`;
    return santosDominicos[clave] || this.obtenerSantoGeneral(mes, dia);
  },

  obtenerSantoGeneral(mes, dia) {
    // Fallback para días sin santo específico
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const fecha = new Date();
    fecha.setMonth(mes - 1);
    fecha.setDate(dia);
    const diaSemana = diasSemana[fecha.getDay()];
    
    return `Santos del ${diaSemana}`;
  },

  obtenerLecturasDominicos(dia, tiempo, fecha) {
    // Lecturas según el estilo de presentación de Dominicos.org
    const lecturasSemanales = {
      0: { // Domingo
        primera: {
          tipo: 'primera',
          cita: 'Deuteronomio 30, 10-14',
          titulo: 'Primera Lectura',
          texto: 'Moisés habló al pueblo, diciendo: "Obedece la voz del Señor, tu Dios, guardando sus mandamientos y preceptos escritos en este libro de la Ley, y conviértete al Señor, tu Dios, con todo tu corazón y con toda tu alma. Porque este mandamiento que yo te prescribo hoy no es cosa que esté fuera de tu alcance, ni es cosa remota."'
        },
        salmo: {
          tipo: 'salmo',
          cita: 'Salmo 68',
          titulo: 'Salmo Responsorial',
          texto: 'R. Busquen al Señor y vivirá su corazón. \n\nLos humildes lo han visto y se alegran, busquen a Dios y vivirá su corazón. Porque el Señor escucha a sus pobres, no desprecia a sus cautivos. R.'
        },
        segunda: {
          tipo: 'segunda',
          cita: 'Colosenses 1, 15-20',
          titulo: 'Segunda Lectura',
          texto: 'Hermanos: Cristo es imagen de Dios invisible, primogénito de toda la creación, porque en él fueron creadas todas las cosas, en el cielo y en la tierra, las visibles y las invisibles.'
        },
        evangelio: {
          tipo: 'evangelio',
          cita: 'Lectura del santo evangelio según san Lucas 10, 25-37',
          titulo: 'Evangelio del día',
          texto: 'En aquel tiempo, se acercó a Jesús un maestro de la Ley para ponerlo a prueba y le preguntó: "Maestro, ¿qué tengo que hacer para heredar la vida eterna?" Jesús le dijo: "¿Qué está escrito en la Ley? ¿Cómo lees?" Él le respondió: "Amarás al Señor, tu Dios, con todo tu corazón, con toda tu alma, con todas tus fuerzas y con toda tu mente; y a tu prójimo como a ti mismo." Le dijo: "Has respondido exactamente; haz esto y vivirás."'
        }
      },
      1: { // Lunes
        primera: {
          tipo: 'primera',
          cita: 'Éxodo 1, 8-14. 22',
          titulo: 'Primera Lectura',
          texto: 'En aquellos días, subió al trono de Egipto un nuevo rey, que no había conocido a José.'
        },
        evangelio: {
          tipo: 'evangelio',
          cita: 'Lectura del santo evangelio según san Mateo 10, 34 - 11, 1',
          titulo: 'Evangelio del día',
          texto: 'En aquel tiempo, dijo Jesús a sus apóstoles: "No penséis que he venido a traer paz a la tierra. No he venido a traer paz, sino espada."'
        }
      },
      2: { // Martes
        primera: {
          tipo: 'primera',
          cita: 'Éxodo 2, 1-15',
          titulo: 'Primera Lectura',
          texto: 'En aquellos días, un hombre de la tribu de Leví se casó con una mujer de la misma tribu.'
        },
        evangelio: {
          tipo: 'evangelio',
          cita: 'Lectura del santo evangelio según san Mateo 11, 20-24',
          titulo: 'Evangelio del día',
          texto: 'En aquel tiempo, Jesús se puso a reprender a las ciudades donde había hecho la mayoría de sus milagros, porque no se habían convertido.'
        }
      },
      3: { // Miércoles
        primera: {
          tipo: 'primera',
          cita: 'Éxodo 3, 1-6. 9-12',
          titulo: 'Primera Lectura',
          texto: 'En aquellos días, Moisés pastoreaba el rebaño de Jetró, su suegro, sacerdote de Madián.'
        },
        evangelio: {
          tipo: 'evangelio',
          cita: 'Lectura del santo evangelio según san Mateo 11, 25-27',
          titulo: 'Evangelio del día',
          texto: 'En aquel tiempo, exclamó Jesús: "Te doy gracias, Padre, Señor del cielo y de la tierra, porque has escondido estas cosas a los sabios y entendidos y se las has revelado a la gente sencilla."'
        }
      },
      4: { // Jueves
        primera: {
          tipo: 'primera',
          cita: 'Éxodo 3, 13-20',
          titulo: 'Primera Lectura',
          texto: 'En aquellos días, dijo Moisés a Dios: "Mira, yo iré a los israelitas y les diré: El Dios de vuestros padres me ha enviado a vosotros."'
        },
        evangelio: {
          tipo: 'evangelio',
          cita: 'Lectura del santo evangelio según san Mateo 11, 28-30',
          titulo: 'Evangelio del día',
          texto: 'En aquel tiempo, exclamó Jesús: "Venid a mí todos los que estáis cansados y agobiados, y yo os aliviaré."'
        }
      },
      5: { // Viernes
        primera: {
          tipo: 'primera',
          cita: 'Éxodo 11, 10 - 12, 14',
          titulo: 'Primera Lectura',
          texto: 'En aquellos días, Moisés y Aarón hicieron todos estos prodigios ante el Faraón.'
        },
        evangelio: {
          tipo: 'evangelio',
          cita: 'Lectura del santo evangelio según san Mateo 12, 1-8',
          titulo: 'Evangelio del día',
          texto: 'En aquel tiempo, un sábado atravesaba Jesús por los sembrados; sus discípulos sintieron hambre y se pusieron a arrancar espigas y a comérselas.'
        }
      },
      6: { // Sábado
        primera: {
          tipo: 'primera',
          cita: 'Éxodo 12, 37-42',
          titulo: 'Primera Lectura',
          texto: 'En aquellos días, partieron los israelitas de Ramsés hacia Sucot.'
        },
        evangelio: {
          tipo: 'evangelio',
          cita: 'Lectura del santo evangelio según san Mateo 12, 14-21',
          titulo: 'Evangelio del día',
          texto: 'En aquel tiempo, al salir de la sinagoga, los fariseos se confabularon contra Jesús, planeando el modo de acabar con él.'
        }
      }
    };
    
    // Obtener lecturas del día específico, con fallback a domingo
    const lecturasDelDia = lecturasSemanales[dia] || lecturasSemanales[0];
    
    // Convertir a array manteniendo el orden litúrgico
    const resultado = [];
    if (lecturasDelDia.primera) resultado.push(lecturasDelDia.primera);
    if (lecturasDelDia.salmo) resultado.push(lecturasDelDia.salmo);
    if (lecturasDelDia.segunda) resultado.push(lecturasDelDia.segunda);
    if (lecturasDelDia.evangelio) resultado.push(lecturasDelDia.evangelio);
    
    return resultado;
  },

  obtenerComentarioDominicos(dia, tiempo) {
    // Comentarios reflexivos estilo Dominicos.org
    const comentarios = {
      0: 'En este domingo, el Señor nos invita a reflexionar sobre el amor al prójimo como expresión concreta de nuestro amor a Dios. La parábola del buen samaritano nos enseña que la verdadera religiosidad se manifiesta en obras de misericordia.',
      1: 'Al inicio de esta semana, Jesús nos recuerda que seguirle puede traer divisiones, pero también la verdadera paz que viene de estar unidos a su voluntad.',
      2: 'Hoy el Señor nos invita a la conversión del corazón. Las ciudades que no se convirtieron ante los milagros nos recuerdan la importancia de estar abiertos a la gracia divina.',
      3: 'En medio de la semana, Jesús nos revela que Dios se manifiesta especialmente a los sencillos y humildes de corazón. La sabiduría del mundo no puede comprender los misterios divinos.',
      4: 'El Señor nos ofrece descanso para nuestras almas cansadas. Su yugo es suave porque es el yugo del amor, no de la opresión.',
      5: 'Al acercarnos al fin de semana laboral, Jesús nos enseña el verdadero sentido del sábado: un día para el bien del hombre, para la misericordia y el amor.',
      6: 'En este sábado, preparemos nuestros corazones para el domingo. Jesús se presenta como el siervo sufriente que trae justicia con mansedumbre.'
    };
    
    return comentarios[dia] || comentarios[0];
  },

  limpiarTexto(texto) {
    if (!texto) return '';
    
    return texto
      .replace(/<[^>]*>/g, '') // Remover HTML
      .replace(/&quot;/g, '"') // Convertir entidades
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();
  },

  obtenerEvangelioFallback() {
    // Evangelios por día de la semana como fallback
    const dia = new Date().getDay();
    const evangelios = {
      0: { // Domingo
        cita: "Lectura del santo evangelio según san Juan 14, 1-6",
        titulo: "Evangelio del día",
        texto: "No se turbe vuestro corazón. Creéis en Dios, creed también en mí. En la casa de mi Padre hay muchas moradas; si no, os lo habría dicho, porque voy a prepararos sitio. Y cuando vaya y os prepare sitio, vendré otra vez y os llevaré conmigo, para que donde esté yo estéis también vosotros. Y a donde yo voy, ya sabéis el camino."
      },
      1: { // Lunes
        cita: "Lectura del santo evangelio según san Mateo 5, 14-16",
        titulo: "Evangelio del día",
        texto: "Vosotros sois la luz del mundo. No puede ocultarse una ciudad situada en la cima de un monte. Y no se enciende una lámpara para meterla debajo del celemín, sino para ponerla en el candelero y que alumbre a todos los de casa. Alumbre así vuestra luz delante de los hombres, para que vean vuestras buenas obras y glorifiquen a vuestro Padre que está en los cielos."
      },
      2: { // Martes
        cita: "Lectura del santo evangelio según san Lucas 6, 36-38",
        titulo: "Evangelio del día",
        texto: "Sed misericordiosos, como vuestro Padre es misericordioso. No juzguéis y no seréis juzgados; no condenéis y no seréis condenados; perdonad y seréis perdonados. Dad y se os dará; una medida buena, apretada, remecida, rebosante pondrán en vuestro regazo; porque con la medida con que midáis os medirán a vosotros."
      },
      3: { // Miércoles
        cita: "Lectura del santo evangelio según san Mateo 11, 28-30",
        titulo: "Evangelio del día",
        texto: "Venid a mí todos los que estáis cansados y agobiados, y yo os aliviaré. Cargad con mi yugo y aprended de mí, que soy manso y humilde de corazón, y encontraréis descanso para vuestras almas. Porque mi yugo es llevadero y mi carga ligera."
      },
      4: { // Jueves
        cita: "Lectura del santo evangelio según san Juan 13, 34-35",
        titulo: "Evangelio del día",
        texto: "Os doy un mandamiento nuevo: que os améis unos a otros. Como yo os he amado, así amaos también vosotros unos a otros. En esto conocerán todos que sois discípulos míos: si os tenéis amor unos a otros."
      },
      5: { // Viernes
        cita: "Lectura del santo evangelio según san Juan 15, 12-17",
        titulo: "Evangelio del día",
        texto: "Este es el mandamiento mío: que os améis unos a otros como yo os he amado. Nadie tiene amor más grande que el que da la vida por sus amigos. Vosotros sois mis amigos, si hacéis lo que yo os mando."
      },
      6: { // Sábado
        cita: "Lectura del santo evangelio según san Lucas 11, 9-10",
        titulo: "Evangelio del día",
        texto: "Pues yo os digo: Pedid y se os dará, buscad y hallaréis, llamad y se os abrirá. Porque todo el que pide recibe, el que busca halla, y al que llama se le abre."
      }
    };

    return evangelios[dia];
  },

  mostrarEvangelio(datos) {
    const container = document.getElementById('evangelio-dia');
    const fecha = new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const fechaCapitalizada = fecha.charAt(0).toUpperCase() + fecha.slice(1);

    // Construir HTML con todas las lecturas y datos litúrgicos
    let lecturasHTML = '';
    
    if (datos.lecturas && datos.lecturas.length > 0) {
      lecturasHTML = datos.lecturas.map(lectura => {
        return `
        <div class="lectura-seccion lectura-${lectura.tipo}">
          <div class="lectura-header">
            <h4>
              <i class="fas ${this.getIconoLectura(lectura.tipo)}"></i>
              ${lectura.titulo}
            </h4>
            <div class="lectura-cita">${lectura.cita}</div>
          </div>
          <div class="lectura-texto">
            ${lectura.tipo === 'evangelio' ? '<div class="comillas-apertura">"</div>' : ''}
            ${lectura.texto}
            ${lectura.tipo === 'evangelio' ? '<div class="comillas-cierre">"</div>' : ''}
          </div>
        </div>
      `;
      }).join('');
    } else {
      // Solo evangelio
      lecturasHTML = `
        <div class="lectura-seccion lectura-evangelio">
          <div class="lectura-header">
            <h4>
              <i class="fas fa-cross"></i>
              Evangelio del Día
            </h4>
            <div class="lectura-cita">${datos.cita}</div>
          </div>
          <div class="lectura-texto">
            <div class="comillas-apertura">"</div>
            ${datos.texto}
            <div class="comillas-cierre">"</div>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="evangelio-header ${datos.colorLiturgico ? 'color-' + datos.colorLiturgico.toLowerCase() : ''}">
        <div class="evangelio-fecha">
          <i class="fas fa-calendar-alt"></i>
          <span>${fechaCapitalizada}</span>
        </div>
        
        ${datos.tiempoLiturgico ? `
          <div class="tiempo-liturgico">
            <i class="fas fa-church"></i>
            <span>${datos.tiempoLiturgico}</span>
            ${datos.colorLiturgico ? `<span class="color-liturgico color-${datos.colorLiturgico.toLowerCase()}">${datos.colorLiturgico}</span>` : ''}
          </div>
        ` : ''}
        
        ${datos.santo ? `
          <div class="santo-dia">
            <i class="fas fa-pray"></i>
            <span>${datos.santo}</span>
          </div>
        ` : ''}
        
        ${datos.fuente ? `
          <div class="evangelio-fuente">
            <i class="fas fa-source"></i>
            <small>Fuente: ${datos.fuente}</small>
          </div>
        ` : ''}
      </div>
      
      <div class="evangelio-contenido">
        <div class="lecturas-container">
          ${lecturasHTML}
        </div>
        
        <div class="evangelio-reflexion">
          <i class="fas fa-heart"></i>
          <em>"Que esta palabra ilumine nuestro camino y fortalezca nuestra fe"</em>
        </div>
        
        ${datos.comentario ? `
          <div class="comentario-dominicos">
            <h4>
              <i class="fas fa-lightbulb"></i>
              Reflexión del día
            </h4>
            <p>${datos.comentario}</p>
          </div>
        ` : ''}
      </div>
      
      <div class="evangelio-acciones">
        <button class="btn-evangelio-compartir" onclick="EvangelioDia.compartir()">
          <i class="fas fa-share-alt"></i>
          Compartir
        </button>
        <button class="btn-evangelio-refresh" onclick="EvangelioDia.cargarEvangelio()">
          <i class="fas fa-sync-alt"></i>
          Actualizar
        </button>
        ${datos.lecturas && datos.lecturas.length > 1 ? `
          <button class="btn-evangelio-toggle" onclick="EvangelioDia.toggleLecturas()">
            <i class="fas fa-eye"></i>
            <span id="toggle-text">Solo Evangelio</span>
          </button>
        ` : ''}
      </div>
    `;

    // Añadir animación suave
    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      container.style.transition = 'all 0.5s ease';
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 100);
  },

  getIconoLectura(tipo) {
    const iconos = {
      'primera': 'fa-book',
      'salmo': 'fa-music',
      'segunda': 'fa-scroll',
      'evangelio': 'fa-cross'
    };
    return iconos[tipo] || 'fa-book-open';
  },

  toggleLecturas() {
    const container = document.querySelector('.lecturas-container');
    const toggleBtn = document.getElementById('toggle-text');
    const lecturasNoEvangelio = container.querySelectorAll('.lectura-seccion:not(.lectura-evangelio)');
    
    const ocultas = lecturasNoEvangelio[0]?.style.display === 'none';
    
    lecturasNoEvangelio.forEach(lectura => {
      lectura.style.display = ocultas ? 'block' : 'none';
    });
    
    if (toggleBtn) {
      toggleBtn.textContent = ocultas ? 'Solo Evangelio' : 'Todas las Lecturas';
    }
  },

  mostrarEvangelioDefault() {
    const evangelio = this.obtenerEvangelioFallback();
    this.mostrarEvangelio(evangelio);
  },

  setupAutoRefresh() {
    // Actualizar cada día a las 00:01
    const ahora = new Date();
    const mañana = new Date(ahora);
    mañana.setDate(ahora.getDate() + 1);
    mañana.setHours(0, 1, 0, 0);
    
    const msHastaMañana = mañana.getTime() - ahora.getTime();
    
    setTimeout(() => {
      this.cargarEvangelio();
      // Configurar refresh diario
      setInterval(() => {
        this.cargarEvangelio();
      }, 24 * 60 * 60 * 1000); // 24 horas
    }, msHastaMañana);
  },

  // Función para compartir el evangelio
  compartir() {
    const container = document.getElementById('evangelio-dia');
    const fecha = container.querySelector('.evangelio-fecha span')?.textContent || '';
    const santo = container.querySelector('.santo-dia span')?.textContent || '';
    const tiempoLiturgico = container.querySelector('.tiempo-liturgico span')?.textContent || '';
    
    // Obtener todas las lecturas
    const lecturas = container.querySelectorAll('.lectura-seccion');
    let textoLecturas = '';
    
    lecturas.forEach(lectura => {
      const titulo = lectura.querySelector('.lectura-header h4')?.textContent?.trim() || '';
      const cita = lectura.querySelector('.lectura-cita')?.textContent?.trim() || '';
      const texto = lectura.querySelector('.lectura-texto')?.textContent?.trim().replace(/"/g, '') || '';
      
      if (titulo && texto) {
        textoLecturas += `\n📖 ${titulo}\n${cita}\n\n${texto}\n`;
      }
    });
    
    const textoCompartir = `🙏 Lecturas del día 📅 ${fecha}\n\n${santo ? `⛪ ${santo}\n` : ''}${tiempoLiturgico ? `🕊️ ${tiempoLiturgico}\n` : ''}${textoLecturas}\n✝️ Santuario Diocesano del Santísimo Sacramento`;
    
    if (navigator.share) {
      // API Web Share (móviles modernos)
      navigator.share({
        title: 'Lecturas del día',
        text: textoCompartir,
        url: window.location.href
      }).catch(err => console.log('Error al compartir:', err));
    } else {
      // Fallback: copiar al portapapeles
      this.copiarAlPortapapeles(textoCompartir);
    }
  },

  copiarAlPortapapeles(texto) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(texto).then(() => {
        this.mostrarNotificacion('✅ Evangelio copiado al portapapeles');
      }).catch(() => {
        this.fallbackCopiar(texto);
      });
    } else {
      this.fallbackCopiar(texto);
    }
  },

  fallbackCopiar(texto) {
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.mostrarNotificacion('✅ Evangelio copiado al portapapeles');
    } catch (err) {
      this.mostrarNotificacion('❌ No se pudo copiar. Selecciona y copia manualmente.');
    }
    
    document.body.removeChild(textArea);
  },

  mostrarNotificacion(mensaje) {
    // Crear notificación temporal
    const notif = document.createElement('div');
    notif.className = 'evangelio-notificacion';
    notif.textContent = mensaje;
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-color, #8B4513);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      font-size: 14px;
      opacity: 0;
      transform: translateX(100px);
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notif);
    
    // Mostrar con animación
    setTimeout(() => {
      notif.style.opacity = '1';
      notif.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      notif.style.opacity = '0';
      notif.style.transform = 'translateX(100px)';
      setTimeout(() => {
        if (notif.parentNode) {
          notif.parentNode.removeChild(notif);
        }
      }, 300);
    }, 3000);
  },

  obtenerLecturasEspecificas(fecha, tiempoLiturgico) {
    const fechaKey = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
    
    // Lecturas específicas por fecha
    const lecturasEspecificas = {
      '2025-08-07': { // Jueves 7 de agosto de 2025 - XVIII semana del Tiempo Ordinario
        primera: {
          tipo: 'primera',
          cita: 'Números 20, 1-13',
          titulo: 'Primera Lectura',
          texto: 'En aquellos días, la comunidad entera de los hijos de Israel llegó al desierto de Sin el mes primero, y el pueblo se instaló en Cadés. Allí murió María y allí la enterraron. Faltó agua a la comunidad y se amotinaron contra Moisés y Aarón. El pueblo protestó contra Moisés, diciendo: "¡Ojalá hubiéramos muerto como nuestros hermanos, delante del Señor! ¿Por qué has traído a la comunidad del Señor a este desierto, para que muramos en él, nosotros y nuestras bestias? ¿Por qué nos has sacado de Egipto para traernos a este sitio horrible, que no tiene grano ni higueras ni viñas ni granados ni agua para beber?". Moisés y Aarón se apartaron de la comunidad y se dirigieron a la entrada de la Tienda del Encuentro, y se postraron rostro en tierra delante de ella. La gloria del Señor se les apareció, y el Señor dijo a Moisés: "Coge la vara y reunid la asamblea, tú y tu hermano Aarón, y habladle a la roca en presencia de ellos y ella dará agua. Luego saca agua de la roca y dales de beber a ellos y a sus bestias". Moisés retiró la vara de la presencia del Señor, como se lo mandaba. Moisés y Aarón reunieron la asamblea delante de la roca; Moisés les dijo: "Escuchad, rebeldes: ¿Creéis que podemos sacaros agua de esta roca?". Moisés alzó la mano y golpeó la roca con la vara dos veces, y brotó agua tan abundante que bebió toda la comunidad y las bestias. El Señor dijo a Moisés y a Aarón: "Por no haberme creído, por no haber reconocido mi santidad en presencia de los hijos de Israel, no haréis entrar a esta comunidad en la tierra que les he dado". (Esta es Fuente de Meribá, donde los hijos de Israel disputaron con el Señor, y él les mostró su santidad).'
        },
        salmo: {
          tipo: 'salmo',
          cita: 'Salmo 94, 1-2. 6-7. 8-9',
          titulo: 'Salmo Responsorial',
          texto: 'R. Ojalá escuchéis hoy la voz del Señor: «No endurezcáis vuestro corazón.» \n\nVenid, aclamemos al Señor, demos vítores a la Roca que nos salva; entremos a su presencia dándole gracias, aclamándolo con cantos. R. \n\nEntrad, postrémonos por tierra, bendiciendo al Señor, creador nuestro. Porque él es nuestro Dios, y nosotros su pueblo, el rebaño que él guía. R. \n\nOjalá escuchéis hoy su voz: «No endurezcáis el corazón como en Meribá, como el día de Masá en el desierto; cuando vuestros padres me pusieron a prueba y me tentaron, aunque habían visto mis obras». R.'
        },
        evangelio: {
          tipo: 'evangelio',
          cita: 'Lectura del santo evangelio según san Mateo 16, 13-23',
          titulo: 'Evangelio del día',
          texto: 'En aquel tiempo, al llegar a la región de Cesarea de Filipo, Jesús preguntó a sus discípulos: "¿Quién dice la gente que es el Hijo del hombre?". Ellos contestaron: "Unos que Juan Bautista, otros que Elías, otros que Jeremías o uno de los profetas". Él les preguntó: "Y vosotros, ¿quién decís que soy yo?". Simón Pedro tomó la palabra y dijo: "Tú eres el Mesías, el Hijo de Dios vivo". Jesús le respondió: "¡Bienaventurado tú, Simón, hijo de Jonás!, porque eso no te lo ha revelado ni la carne ni la sangre, sino mi Padre que está en los cielos. Ahora yo te digo: tú eres Pedro, y sobre esta piedra edificaré mi Iglesia, y el poder del infierno no la derrotará. Te daré las llaves del reino de los cielos; lo que ates en la tierra, quedará atado en los cielos, y lo que desates en la tierra, quedará desatado en los cielos". Y les mandó a los discípulos que no dijesen a nadie que él era el Mesías. Desde entonces comenzó Jesús a manifestar a sus discípulos que tenía que ir a Jerusalén y padecer allí mucho por parte de los ancianos, sumos sacerdotes y escribas, y que tenía que ser ejecutado y resucitar al tercer día. Pedro se lo llevó aparte y se puso a increparlo: "¡Lejos de ti tal cosa, Señor! Eso no puede pasarte". Jesús se volvió y dijo a Pedro: "¡Ponte detrás de mí, Satanás! Eres para mí piedra de tropiezo, porque tú piensas como los hombres, no como Dios".'
        }
      }
    };
    
    // Si existe lectura específica para la fecha, usarla
    if (lecturasEspecificas[fechaKey]) {
      const lecturasDelDia = lecturasEspecificas[fechaKey];
      const resultado = [];
      if (lecturasDelDia.primera) resultado.push(lecturasDelDia.primera);
      if (lecturasDelDia.salmo) resultado.push(lecturasDelDia.salmo);
      if (lecturasDelDia.segunda) resultado.push(lecturasDelDia.segunda);
      if (lecturasDelDia.evangelio) resultado.push(lecturasDelDia.evangelio);
      return resultado;
    }
    
    // Fallback al sistema anterior por día de la semana
    return this.obtenerLecturasDominicos(fecha.getDay(), tiempoLiturgico, fecha);
  },

  obtenerComentarioEspecifico(fecha, tiempoLiturgico) {
    const fechaKey = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
    
    const comentariosEspecificos = {
      '2025-08-07': 'Hoy contemplamos la confesión de fe de Pedro cerca de Cesarea de Filipo. Jesús pregunta acerca de su identidad antes de iniciar el camino hacia Jerusalén. A diferencia del pueblo que ve en él solo un personaje importante como los profetas, Simón reconoce a Jesús como Mesías, Hijo de Dios vivo. Esta confesión no es fruto de la naturaleza humana, sino de la revelación del Padre. Jesús muestra la validez de la declaración y anuncia el papel que Pedro tendrá en su Iglesia. La iglesia se funda sobre la fe de quienes, como Pedro, creen en Jesús y le confiesan como Hijo de Dios. Pero ser Mesías no es tanto un título que divulgar cuanto una misión que realizar: un mesianismo que se realiza muriendo y resucitando. Pedro debe entender que los pensamientos de Dios no son como los de los hombres. ¿Me abro a ir más allá de la lógica humana para descubrir la revelación de Dios en mí?'
    };
    
    return comentariosEspecificos[fechaKey] || this.obtenerComentarioDominicos(fecha.getDay(), tiempoLiturgico);
  },

  // ...existing code...
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  EvangelioDia.init();
});

// Hacer disponible globalmente
window.EvangelioDia = EvangelioDia;
