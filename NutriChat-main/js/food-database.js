/**
 * Base de datos de alimentos para NutriChat
 * Contiene información nutricional básica de diversos alimentos
 */

/**
 * Obtiene la base de datos simplificada de alimentos
 * @returns {Object} - Base de datos de alimentos por categorías
 */
function getFoodDatabase() {
    return {
        proteinasSaludables: [
            { 
                nombre: 'Pechuga de pollo', 
                proteina: 31, 
                grasa: 3.6, 
                carbos: 0, 
                calorias: 165, 
                porcion: '100g',
                beneficios: ['Alto contenido proteico', 'Bajo en grasa', 'Versátil para cocinar'],
                sugerencias: ['Cocinar a la plancha con hierbas', 'Hornear con limón y especias', 'Añadir a ensaladas']
            },
            { 
                nombre: 'Pavo', 
                proteina: 29, 
                grasa: 2.0, 
                carbos: 0, 
                calorias: 135, 
                porcion: '100g',
                beneficios: ['Bajo en grasa', 'Rico en proteínas', 'Buena fuente de aminoácidos'],
                sugerencias: ['Filetear para sándwiches', 'Guisar con verduras', 'Hacer albóndigas caseras']
            },
            { 
                nombre: 'Atún', 
                proteina: 30, 
                grasa: 1.0, 
                carbos: 0, 
                calorias: 130, 
                porcion: '100g',
                beneficios: ['Rico en Omega-3', 'Alto contenido proteico', 'Bajo en grasa'],
                sugerencias: ['Ensalada con verduras', 'Tosta con aguacate', 'En conserva al natural']
            },
            { 
                nombre: 'Huevos', 
                proteina: 6, 
                grasa: 5, 
                carbos: 0.6, 
                calorias: 78, 
                porcion: '1 unidad',
                beneficios: ['Proteína completa', 'Contiene colina', 'Nutricionalmente denso'],
                sugerencias: ['Revueltos con espinacas', 'Tortilla con verduras', 'Cocidos en ensalada']
            },
            { 
                nombre: 'Yogur griego', 
                proteina: 10, 
                grasa: 0.4, 
                carbos: 3.6, 
                calorias: 59, 
                porcion: '100g',
                beneficios: ['Probióticos', 'Alto en proteínas', 'Bueno para la digestión'],
                sugerencias: ['Con frutas y canela', 'Base para aderezos', 'Batidos proteicos']
            },
            { 
                nombre: 'Pescado blanco', 
                proteina: 20, 
                grasa: 2.0, 
                carbos: 0, 
                calorias: 105, 
                porcion: '100g',
                beneficios: ['Proteína de alta calidad', 'Bajo en grasa', 'Fuente de yodo'],
                sugerencias: ['Al horno con limón', 'A la plancha con ajo', 'En papillote con verduras']
            },
            { 
                nombre: 'Tofu firme', 
                proteina: 15, 
                grasa: 8, 
                carbos: 2, 
                calorias: 144, 
                porcion: '100g',
                beneficios: ['Proteína vegetal completa', 'Fuente de calcio', 'Versátil en cocina'],
                sugerencias: ['Salteado con verduras', 'Marinado a la plancha', 'Revuelto con cúrcuma']
            },
            { 
                nombre: 'Lentejas cocidas', 
                proteina: 9, 
                grasa: 0.4, 
                carbos: 20, 
                calorias: 116, 
                porcion: '100g',
                beneficios: ['Rica en fibra', 'Proteína vegetal', 'Hierro y magnesio'],
                sugerencias: ['Ensalada con verduras', 'Guiso con especias', 'Hamburguesas vegetales']
            },
            { 
                nombre: 'Salmón', 
                proteina: 25, 
                grasa: 13, 
                carbos: 0, 
                calorias: 218, 
                porcion: '100g',
                beneficios: ['Omega-3 EPA y DHA', 'Proteína completa', 'Vitamina D'],
                sugerencias: ['Al horno con eneldo', 'En papillote', 'Tartar con aguacate']
            }
        ],
        carbohidratosSaludables: [
            { 
                nombre: 'Avena', 
                proteina: 13, 
                grasa: 7, 
                carbos: 65, 
                calorias: 380, 
                porcion: '100g seca',
                beneficios: ['Rica en fibra soluble', 'Beta-glucanos', 'Bajo índice glucémico'],
                sugerencias: ['Overnight oats', 'Porridge con frutas', 'Añadir a batidos']
            },
            { 
                nombre: 'Arroz integral', 
                proteina: 2.6, 
                grasa: 0.9, 
                carbos: 23, 
                calorias: 112, 
                porcion: '100g cocido',
                beneficios: ['Fibra intacta', 'Sin gluten', 'Energía sostenida'],
                sugerencias: ['Combinar con legumbres', 'Base para bowl de verduras', 'Con curry']
            },
            { 
                nombre: 'Quinoa', 
                proteina: 4.4, 
                grasa: 1.9, 
                carbos: 21, 
                calorias: 120, 
                porcion: '100g cocida',
                beneficios: ['Proteína completa', 'Sin gluten', 'Todos los aminoácidos esenciales'],
                sugerencias: ['Ensalada con vegetales', 'Sustituto del arroz', 'Con frutas como desayuno']
            },
            { 
                nombre: 'Pan integral', 
                proteina: 3.6, 
                grasa: 1.1, 
                carbos: 12, 
                calorias: 75, 
                porcion: '1 rebanada',
                beneficios: ['Fibra dietética', 'Nutrientes del grano entero', 'Más saciante'],
                sugerencias: ['Tostada con aguacate', 'Base para sandwich proteico', 'Con huevo y vegetales']
            },
            { 
                nombre: 'Batata/camote', 
                proteina: 1.6, 
                grasa: 0.1, 
                carbos: 20, 
                calorias: 86, 
                porcion: '100g',
                beneficios: ['Rica en fibra', 'Bajo índice glucémico', 'Antioxidantes'],
                sugerencias: ['Asada al horno', 'Puré con especias', 'En chips horneados']
            },
            { 
                nombre: 'Lentejas', 
                proteina: 9, 
                grasa: 0.4, 
                carbos: 20, 
                calorias: 116, 
                porcion: '100g cocidas',
                beneficios: ['Alto contenido en fibra', 'Hierro no hemo', 'Complejo proteína-carbohidrato'],
                sugerencias: ['Ensalada con verduras', 'Curry de lentejas', 'Sopa con verduras']
            },
            { 
                nombre: 'Garbanzos', 
                proteina: 8.9, 
                grasa: 2.6, 
                carbos: 27, 
                calorias: 164, 
                porcion: '100g cocidos',
                beneficios: ['Rica fuente de hierro', 'Fibra soluble e insoluble', 'Manganeso y folato'],
                sugerencias: ['Hummus casero', 'Ensalada completa', 'Curry vegetal']
            },
            { 
                nombre: 'Mijo', 
                proteina: 3.5, 
                grasa: 1, 
                carbos: 23, 
                calorias: 119, 
                porcion: '100g cocido',
                beneficios: ['Sin gluten', 'Alcalinizante', 'Rico en magnesio'],
                sugerencias: ['Sustituto del cuscús', 'Porridge dulce o salado', 'Base para ensaladas']
            }
        ],
        grasasSaludables: [
            { 
                nombre: 'Aguacate', 
                proteina: 2, 
                grasa: 15, 
                carbos: 9, 
                calorias: 160, 
                porcion: '1/2 unidad',
                beneficios: ['Grasas monoinsaturadas', 'Fibra', 'Nutricionalmente denso'],
                sugerencias: ['En tostadas', 'Guacamole', 'Añadir a ensaladas']
            },
            { 
                nombre: 'Aceite de oliva', 
                proteina: 0, 
                grasa: 14, 
                carbos: 0, 
                calorias: 119, 
                porcion: '1 cucharada',
                beneficios: ['Rico en ácido oleico', 'Antioxidantes', 'Antiinflamatorio'],
                sugerencias: ['Aliñar ensaladas', 'Cocinar a baja temperatura', 'En lugar de mantequilla']
            },
            { 
                nombre: 'Almendras', 
                proteina: 6, 
                grasa: 14, 
                carbos: 6, 
                calorias: 164, 
                porcion: '28g',
                beneficios: ['Grasas monoinsaturadas', 'Proteína vegetal', 'Fibra'],
                sugerencias: ['Snack natural', 'Mantequilla de almendras casera', 'En granola casera']
            },
            { 
                nombre: 'Semillas de chía', 
                proteina: 5, 
                grasa: 9, 
                carbos: 12, 
                calorias: 137, 
                porcion: '28g',
                beneficios: ['Omega-3 (ALA)', 'Fibra soluble', 'Antioxidantes'],
                sugerencias: ['Pudding con leche vegetal', 'Añadir a batidos', 'En yogur o avena']
            },
            { 
                nombre: 'Nueces', 
                proteina: 4.3, 
                grasa: 18.5, 
                carbos: 3.9, 
                calorias: 190, 
                porcion: '28g',
                beneficios: ['Omega-3 (ALA)', 'Antioxidantes', 'Salud cerebral'],
                sugerencias: ['Snack entre comidas', 'Topping para ensaladas', 'En pesto casero']
            },
            { 
                nombre: 'Semillas de lino', 
                proteina: 5.7, 
                grasa: 10, 
                carbos: 8, 
                calorias: 150, 
                porcion: '28g',
                beneficios: ['Omega-3 (ALA)', 'Lignanos', 'Fibra soluble e insoluble'],
                sugerencias: ['Añadir a yogur', 'En batidos (molidas)', 'Espolvorear en ensaladas']
            },
            { 
                nombre: 'Aceite de coco', 
                proteina: 0, 
                grasa: 14, 
                carbos: 0, 
                calorias: 120, 
                porcion: '1 cucharada',
                beneficios: ['Ácidos grasos de cadena media', 'Resistente a altas temperaturas', 'Sabor sutil'],
                sugerencias: ['Para saltear verduras', 'En repostería', 'Para freír a temperatura media']
            },
            { 
                nombre: 'Tahini', 
                proteina: 3, 
                grasa: 8, 
                carbos: 3, 
                calorias: 89, 
                porcion: '1 cucharada',
                beneficios: ['Calcio biodisponible', 'Ácidos grasos insaturados', 'Vitamina E'],
                sugerencias: ['Hummus casero', 'Aderezo para ensaladas', 'Salsa para verduras']
            }
        ],
        verduras: [
            { 
                nombre: 'Espinacas', 
                proteina: 2.9, 
                grasa: 0.4, 
                carbos: 3.6, 
                calorias: 23, 
                porcion: '100g',
                beneficios: ['Rica en hierro', 'Alta en antioxidantes', 'Antiinflamatoria'],
                sugerencias: ['Salteadas con ajo', 'Crudas en ensalada', 'En batidos verdes']
            },
            { 
                nombre: 'Brócoli', 
                proteina: 2.8, 
                grasa: 0.4, 
                carbos: 7, 
                calorias: 34, 
                porcion: '100g',
                beneficios: ['Compuestos anticancerígenos', 'Rico en fibra', 'Anti-inflamatorio'],
                sugerencias: ['Al vapor', 'Salteado con ajo', 'En cremas o purés']
            },
            { 
                nombre: 'Zanahorias', 
                proteina: 0.9, 
                grasa: 0.2, 
                carbos: 10, 
                calorias: 41, 
                porcion: '100g',
                beneficios: ['Betacaroteno', 'Salud ocular', 'Antioxidantes'],
                sugerencias: ['Crudas como snack', 'Asadas con miel', 'En crema de verduras']
            },
            { 
                nombre: 'Pimientos', 
                proteina: 1, 
                grasa: 0.3, 
                carbos: 6, 
                calorias: 31, 
                porcion: '100g',
                beneficios: ['Muy alto en vitamina C', 'Antioxidantes', 'Carotenoides'],
                sugerencias: ['Rellenos de quinoa', 'Asados en ensalada', 'En salteados']
            },
            { 
                nombre: 'Tomates', 
                proteina: 0.9, 
                grasa: 0.2, 
                carbos: 3.9, 
                calorias: 18, 
                porcion: '100g',
                beneficios: ['Licopeno', 'Antioxidantes', 'Salud cardiovascular'],
                sugerencias: ['Ensalada con aceite de oliva', 'Salsa casera', 'Rellenos de atún']
            },
            { 
                nombre: 'Kale', 
                proteina: 2.9, 
                grasa: 0.6, 
                carbos: 9, 
                calorias: 49, 
                porcion: '100g',
                beneficios: ['Vitaminas A, C y K', 'Calcio biodisponible', 'Antioxidantes'],
                sugerencias: ['Chips al horno', 'Salteado con ajo', 'En batidos verdes']
            },
            { 
                nombre: 'Coliflor', 
                proteina: 2, 
                grasa: 0.3, 
                carbos: 5, 
                calorias: 25, 
                porcion: '100g',
                beneficios: ['Baja en calorías', 'Rica en fibra', 'Compuestos antiinflamatorios'],
                sugerencias: ['"Arroz" de coliflor', 'Asada con especias', 'Puré bajo en carbos']
            },
            { 
                nombre: 'Remolacha', 
                proteina: 1.6, 
                grasa: 0.2, 
                carbos: 10, 
                calorias: 43, 
                porcion: '100g',
                beneficios: ['Nitratos naturales', 'Betaína', 'Rendimiento atlético'],
                sugerencias: ['Asada al horno', 'Rallada en ensaladas', 'En batidos pre-entreno']
            }
        ],
        frutas: [
            { 
                nombre: 'Manzanas', 
                proteina: 0.3, 
                grasa: 0.2, 
                carbos: 14, 
                calorias: 52, 
                porcion: '1 mediana',
                beneficios: ['Rica en fibra soluble', 'Antioxidantes', 'Salud digestiva'],
                sugerencias: ['Snack con mantequilla de almendras', 'Ensalada', 'Horneada con canela']
            },
            { 
                nombre: 'Fresas', 
                proteina: 0.7, 
                grasa: 0.3, 
                carbos: 7.7, 
                calorias: 32, 
                porcion: '100g',
                beneficios: ['Muy alta en vitamina C', 'Antioxidantes', 'Antiinflamatorias'],
                sugerencias: ['Con yogur griego', 'En batidos', 'Ensalada con espinacas']
            },
            { 
                nombre: 'Naranjas', 
                proteina: 0.9, 
                grasa: 0.1, 
                carbos: 12, 
                calorias: 47, 
                porcion: '1 mediana',
                beneficios: ['Alta en vitamina C', 'Flavonoides', 'Fibra soluble'],
                sugerencias: ['Zumo natural', 'En ensaladas', 'Combinar con frutas rojas']
            },
            { 
                nombre: 'Plátano', 
                proteina: 1.1, 
                grasa: 0.3, 
                carbos: 23, 
                calorias: 96, 
                porcion: '1 mediano',
                beneficios: ['Rico en potasio', 'Fibra soluble', 'Energía rápida'],
                sugerencias: ['Pre/post entreno', 'En batidos', 'Congelado como helado natural']
            },
            { 
                nombre: 'Arándanos', 
                proteina: 0.7, 
                grasa: 0.3, 
                carbos: 14, 
                calorias: 57, 
                porcion: '100g',
                beneficios: ['Muy ricos en antioxidantes', 'Protección neurológica', 'Antiinflamatorios'],
                sugerencias: ['Con yogur', 'En avena', 'Batidos antioxidantes']
            },
            { 
                nombre: 'Aguacate', 
                proteina: 2, 
                grasa: 15, 
                carbos: 9, 
                calorias: 160, 
                porcion: '1/2 unidad',
                beneficios: ['Grasas monoinsaturadas', 'Fibra', 'Potasio'],
                sugerencias: ['Guacamole', 'Tostadas', 'En batidos para cremosidad']
            },
            { 
                nombre: 'Kiwi', 
                proteina: 1.1, 
                grasa: 0.5, 
                carbos: 15, 
                calorias: 61, 
                porcion: '1 unidad (100g)',
                beneficios: ['Más vitamina C que una naranja', 'Enzimas digestivas', 'Fibra'],
                sugerencias: ['Con yogur', 'En ensaladas', 'Smoothie bowl']
            },
            { 
                nombre: 'Mango', 
                proteina: 0.8, 
                grasa: 0.4, 
                carbos: 15, 
                calorias: 60, 
                porcion: '100g',
                beneficios: ['Betacaroteno', 'Vitamina C', 'Enzimas digestivas'],
                sugerencias: ['Batidos tropicales', 'Ensalada con lima', 'Con yogur y granola']
            }
        ],
        granosSemillas: [
            { 
                nombre: 'Chía', 
                proteina: 17, 
                grasa: 31, 
                carbos: 42, 
                calorias: 486, 
                porcion: '100g',
                beneficios: ['Omega-3 ALA', 'Fibra soluble', 'Proteína completa vegetal'],
                sugerencias: ['Pudding con leche vegetal', 'En batidos', 'Como topping']
            },
            { 
                nombre: 'Quinoa', 
                proteina: 14, 
                grasa: 6, 
                carbos: 64, 
                calorias: 368, 
                porcion: '100g seca',
                beneficios: ['Proteína completa', 'Sin gluten', 'Rica en magnesio'],
                sugerencias: ['Como sustituto del arroz', 'En ensaladas', 'Porridge salado o dulce']
            },
            { 
                nombre: 'Amaranto', 
                proteina: 14, 
                grasa: 7, 
                carbos: 65, 
                calorias: 371, 
                porcion: '100g',
                beneficios: ['Alto en lisina', 'Sin gluten', 'Rico en hierro'],
                sugerencias: ['Inflado como cereal', 'En ensaladas', 'Mezclado con otros granos']
            }
        ],
        superalimentos: [
            { 
                nombre: 'Espirulina', 
                proteina: 57, 
                grasa: 8, 
                carbos: 24, 
                calorias: 290, 
                porcion: '100g',
                beneficios: ['Alta concentración proteica', 'Rica en hierro', 'Antioxidantes'],
                sugerencias: ['Añadir a batidos', 'En smoothie bowls', 'Combinar con frutas dulces']
            },
            { 
                nombre: 'Cacao puro', 
                proteina: 20, 
                grasa: 14, 
                carbos: 58, 
                calorias: 228, 
                porcion: '100g',
                beneficios: ['Flavanoles antioxidantes', 'Magnesio', 'Sensación de bienestar'],
                sugerencias: ['En batidos', 'Añadir a avena', 'En recetas con dátiles']
            },
            { 
                nombre: 'Cúrcuma', 
                proteina: 7.8, 
                grasa: 9.9, 
                carbos: 67, 
                calorias: 312, 
                porcion: '100g',
                beneficios: ['Curcumina antiinflamatoria', 'Absorción mejorada con pimienta', 'Antioxidante'],
                sugerencias: ['Golden milk', 'En curries', 'Añadir a batidos con grasa']
            }
        ]
    };
}

/**
 * Busca alimentos que coincidan con un término de búsqueda
 * @param {string} termino - Término de búsqueda
 * @returns {Array} - Resultados de la búsqueda
 */
function buscarAlimentos(termino) {
    const baseDeDatos = getFoodDatabase();
    const resultados = [];
    
    // Convertir término a minúsculas para búsqueda insensible a mayúsculas
    const terminoMinuscula = termino.toLowerCase();
    
    // Buscar en todas las categorías
    Object.keys(baseDeDatos).forEach(categoria => {
        baseDeDatos[categoria].forEach(alimento => {
            if (alimento.nombre.toLowerCase().includes(terminoMinuscula) || 
                alimento.beneficios.some(b => b.toLowerCase().includes(terminoMinuscula))) {
                resultados.push({
                    ...alimento,
                    categoria
                });
            }
        });
    });
    
    return resultados;
}

/**
 * Filtra alimentos según criterios específicos
 * @param {string} categoria - Categoría de alimentos
 * @param {Object} criterios - Criterios de filtrado 
 * @returns {Array} - Alimentos filtrados
 */
function filtrarAlimentos(categoria, criterios = {}) {
    const alimentos = getFoodDatabase()[categoria] || [];
    
    if (Object.keys(criterios).length === 0) {
        return alimentos;
    }
    
    return alimentos.filter(alimento => {
        let cumpleCriterios = true;
        
        // Filtrar por máximo de calorías
        if (criterios.maxCalorias && alimento.calorias > criterios.maxCalorias) {
            cumpleCriterios = false;
        }
        
        // Filtrar por mínimo de proteínas
        if (criterios.minProteina && alimento.proteina < criterios.minProteina) {
            cumpleCriterios = false;
        }
        
        // Filtrar por máximo de grasas
        if (criterios.maxGrasa && alimento.grasa > criterios.maxGrasa) {
            cumpleCriterios = false;
        }
        
        // Filtrar por máximo de carbohidratos
        if (criterios.maxCarbos && alimento.carbos > criterios.maxCarbos) {
            cumpleCriterios = false;
        }
        
        // Filtrar por beneficios específicos
        if (criterios.beneficio && !alimento.beneficios.some(b => 
            b.toLowerCase().includes(criterios.beneficio.toLowerCase()))) {
            cumpleCriterios = false;
        }
        
        return cumpleCriterios;
    });
}

/**
 * Obtiene información nutricional detallada de un alimento específico
 * @param {string} nombreAlimento - Nombre del alimento
 * @returns {Object|null} - Información del alimento o null si no se encuentra
 */
function getDetalleAlimento(nombreAlimento) {
    const baseDeDatos = getFoodDatabase();
    let alimentoEncontrado = null;
    
    // Buscar el alimento en todas las categorías
    Object.keys(baseDeDatos).forEach(categoria => {
        const alimento = baseDeDatos[categoria].find(a => 
            a.nombre.toLowerCase() === nombreAlimento.toLowerCase()
        );
        
        if (alimento) {
            alimentoEncontrado = {
                ...alimento,
                categoria
            };
        }
    });
    
    return alimentoEncontrado;
}

/**
 * Obtiene alimentos recomendados según el objetivo nutricional
 * @param {string} objetivo - Objetivo (perder peso, mantener peso, ganar peso)
 * @param {string} categoria - Categoría opcional para filtrar
 * @returns {Array} - Alimentos recomendados
 */
function getAlimentosRecomendados(objetivo, categoria = null) {
    const baseDeDatos = getFoodDatabase();
    let alimentosRecomendados = [];
    
    const categoriasABuscar = categoria ? [categoria] : Object.keys(baseDeDatos);
    
    categoriasABuscar.forEach(cat => {
        if (!baseDeDatos[cat]) return;
        
        const alimentos = baseDeDatos[cat];
        
        // Filtrar según el objetivo
        if (objetivo === 'perder peso') {
            // Para pérdida de peso, priorizar alimentos con alta proteína, baja densidad calórica
            let filtrados = [];
            
            if (cat === 'proteinasSaludables') {
                filtrados = alimentos.filter(a => a.grasa < 8 && a.proteina > 15);
            } else if (cat === 'verduras') {
                filtrados = alimentos; // Todas las verduras son buenas para pérdida de peso
            } else if (cat === 'frutas') {
                filtrados = alimentos.filter(a => a.carbos < 15);
            } else if (cat === 'carbohidratosSaludables') {
                filtrados = alimentos.filter(a => a.proteina > 3 || a.carbos < 30);
            } else if (cat === 'grasasSaludables') {
                filtrados = alimentos.filter(a => a.beneficios.some(b => 
                    b.toLowerCase().includes('saciante') || 
                    b.toLowerCase().includes('omega') ||
                    b.toLowerCase().includes('monoinsaturada')
                ));
            }
            
            alimentosRecomendados = [...alimentosRecomendados, ...filtrados];
        } else if (objetivo === 'ganar peso') {
            // Para aumento de peso, priorizar alimentos calóricamente densos
            let filtrados = [];
            
            if (cat === 'proteinasSaludables') {
                filtrados = alimentos.filter(a => a.proteina > 20);
            } else if (cat === 'verduras') {
                filtrados = alimentos.filter(a => a.carbos > 5); // Verduras con más carbohidratos
            } else if (cat === 'frutas') {
                filtrados = alimentos.filter(a => a.calorias > 70 || a.carbos > 15);
            } else if (cat === 'carbohidratosSaludables') {
                filtrados = alimentos; // Todos los carbohidratos son útiles para ganar peso
            } else if (cat === 'grasasSaludables') {
                filtrados = alimentos; // Todas las grasas saludables son útiles para ganar peso
            } else if (cat === 'superalimentos') {
                filtrados = alimentos; // Superalimentos densos en nutrientes
            }
            
            alimentosRecomendados = [...alimentosRecomendados, ...filtrados];
        } else {
            // Para mantenimiento, incluir una mezcla equilibrada
            // Seleccionar algunos alimentos de cada categoría para una alimentación variada
            const aleatorios = alimentos.sort(() => 0.5 - Math.random()).slice(0, Math.min(3, alimentos.length));
            alimentosRecomendados = [...alimentosRecomendados, ...aleatorios];
        }
    });
    
    // Ordenar por relevancia según el objetivo
    if (objetivo === 'perder peso') {
        alimentosRecomendados.sort((a, b) => (b.proteina / b.calorias) - (a.proteina / a.calorias));
    } else if (objetivo === 'ganar peso') {
        alimentosRecomendados.sort((a, b) => b.calorias - a.calorias);
    }
    
    // Limitar el número de resultados para no abrumar
    return alimentosRecomendados.slice(0, 12);
}

/**
 * Obtiene sugerencias de alimentos para reemplazar alimentos procesados
 * @param {string} tipoAlimento - Tipo de alimento a reemplazar (snack, dulce, etc)
 * @returns {Array} - Alternativas saludables
 */
function getAlternativasSaludables(tipoAlimento) {
    const alternativas = {
        snack: [
            { nombre: 'Palitos de zanahoria con hummus', beneficios: ['Fibra', 'Proteína vegetal', 'Bajo en calorías'] },
            { nombre: 'Yogur griego con frutas', beneficios: ['Proteína', 'Probióticos', 'Controla azúcar en sangre'] },
            { nombre: 'Puñado de frutos secos', beneficios: ['Grasas saludables', 'Fibra', 'Proteína vegetal'] }
        ],
        dulce: [
            { nombre: 'Dátiles con mantequilla de almendras', beneficios: ['Dulzor natural', 'Fibra', 'Grasas saludables'] },
            { nombre: 'Chocolate negro >70%', beneficios: ['Antioxidantes', 'Bajo en azúcar', 'Magnesio'] },
            { nombre: 'Frutas congeladas', beneficios: ['Vitaminas', 'Fibra', 'Sin azúcares añadidos'] }
        ],
        bebidaAzucarada: [
            { nombre: 'Agua con rodajas de fruta', beneficios: ['Hidratación', 'Sin calorías', 'Sabor natural'] },
            { nombre: 'Té helado sin azúcar', beneficios: ['Antioxidantes', 'Sin calorías', 'Variedad de sabores'] },
            { nombre: 'Agua de coco natural', beneficios: ['Electrolitos', 'Bajo en calorías', 'Sabor dulce natural'] }
        ],
        frituras: [
            { nombre: 'Vegetales horneados', beneficios: ['Fibra', 'Vitaminas', 'Bajo en grasas'] },
            { nombre: 'Palomitas de maíz caseras', beneficios: ['Granos enteros', 'Fibra', 'Bajo en calorías'] },
            { nombre: 'Chips de kale al horno', beneficios: ['Calcio', 'Vitamina K', 'Crujientes'] }
        ],
        panBlanco: [
            { nombre: 'Pan integral 100%', beneficios: ['Fibra', 'Micronutrientes', 'Menor índice glucémico'] },
            { nombre: 'Pan de centeno', beneficios: ['Rico en fibra', 'Fermentación más lenta', 'Mayor saciedad'] },
            { nombre: 'Wraps de lechuga', beneficios: ['Sin carbohidratos', 'Mínimas calorías', 'Alta hidratación'] }
        ]
    };
    
    return alternativas[tipoAlimento] || [];
}

/**
 * Genera combinaciones de alimentos nutricionalmente complementarios
 * @param {string} categoriaBase - Categoría del alimento base
 * @param {string} nombreAlimento - Nombre del alimento base
 * @returns {Array} - Combinaciones recomendadas
 */
function getCombinacionesNutricionales(categoriaBase, nombreAlimento) {
    const combinaciones = [];
    const alimento = getDetalleAlimento(nombreAlimento);
    
    if (!alimento) return combinaciones;
    
    // Definir reglas de combinación según la categoría base
    if (categoriaBase === 'proteinasSaludables') {
        // Proteínas combinan bien con verduras y carbohidratos complejos
        const verduras = filtrarAlimentos('verduras').slice(0, 3);
        const carbos = filtrarAlimentos('carbohidratosSaludables').slice(0, 2);
        
        verduras.forEach(v => {
            combinaciones.push({
                nombre: `${alimento.nombre} con ${v.nombre}`,
                beneficio: 'Proteína completa con fibra y micronutrientes',
                ejemplo: `${alimento.sugerencias[0]} y ${v.nombre} ${v.sugerencias ? v.sugerencias[0] : ''}`
            });
        });
        
        carbos.forEach(c => {
            combinaciones.push({
                nombre: `${alimento.nombre} con ${c.nombre}`,
                beneficio: 'Proteína con energía sostenida y fibra',
                ejemplo: `${alimento.nombre} a la plancha con ${c.nombre}`
            });
        });
    } else if (categoriaBase === 'verduras') {
        // Verduras combinan bien con proteínas y grasas saludables
        const proteinas = filtrarAlimentos('proteinasSaludables').slice(0, 2);
        const grasas = filtrarAlimentos('grasasSaludables').slice(0, 2);
        
        proteinas.forEach(p => {
            combinaciones.push({
                nombre: `${alimento.nombre} con ${p.nombre}`,
                beneficio: 'Fibra y micronutrientes con proteína saciante',
                ejemplo: `Ensalada de ${alimento.nombre} con ${p.nombre}`
            });
        });
        
        grasas.forEach(g => {
            combinaciones.push({
                nombre: `${alimento.nombre} con ${g.nombre}`,
                beneficio: 'Mejora la absorción de vitaminas liposolubles',
                ejemplo: `${alimento.nombre} con ${g.nombre}`
            });
        });
    }
    
    return combinaciones;
}

/**
 * Encuentra alimentos según restricciones dietéticas específicas
 * @param {Array} restricciones - Lista de restricciones (vegano, sin_gluten, etc)
 * @returns {Object} - Alimentos recomendados por categoría
 */
function getAlimentosParaRestricciones(restricciones) {
    const baseDeDatos = getFoodDatabase();
    const resultado = {};
    
    // Definir filtros por tipo de restricción
    const filtros = {
        vegano: (a) => !['Pechuga de pollo', 'Pavo', 'Atún', 'Huevos', 'Yogur griego', 'Pescado blanco', 'Salmón'].includes(a.nombre),
        sin_gluten: (a) => !['Pan integral'].includes(a.nombre) || a.beneficios.some(b => b.includes('Sin gluten')),
        sin_lactosa: (a) => !['Yogur griego'].includes(a.nombre)
    };
    
    // Aplicar filtros a cada categoría
    Object.keys(baseDeDatos).forEach(categoria => {
        const alimentos = baseDeDatos[categoria];
        
        // Filtrar alimentos que cumplan todas las restricciones
        const alimentosFiltrados = alimentos.filter(a => 
            restricciones.every(r => filtros[r] ? filtros[r](a) : true)
        );
        
        if (alimentosFiltrados.length > 0) {
            resultado[categoria] = alimentosFiltrados;
        }
    });
    
    return resultado;
}