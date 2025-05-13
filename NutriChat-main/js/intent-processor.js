/**
 * Módulo mejorado para procesar intenciones de usuario en NutriChat
 * Este módulo identifica las intenciones específicas en mensajes del usuario y genera respuestas adecuadas
 */

// Definición de intenciones del usuario
const userIntents = {
    // Intenciones relacionadas con datos personales
    consultarPeso: {
        patterns: ['mi peso', 'peso actual', 'cuánto peso', 'saber mi peso', 'ver mi peso', 'registrado mi peso', 'peso registrado'],
        handler: handleWeightQuery
    },
    consultarIMC: {
        patterns: ['mi imc', 'índice de masa', 'masa corporal', 'ver mi imc', 'calcular imc', 'saber mi imc', 'conocer mi imc'],
        handler: handleBMIQuery
    },
    consultarCalorias: {
        patterns: ['mis calorías', 'cuántas calorías', 'necesidad calórica', 'ver calorías', 'saber calorías', 'gasto calórico', 'cuánto debo comer'],
        handler: handleCaloriesQuery
    },
    
    // Intenciones relacionadas con planes
    solicitarPlanNutricional: {
        patterns: ['plan nutricional', 'dieta', 'dame un plan', 'plan de comidas', 'crear plan', 'necesito un plan', 'quiero dieta', 'régimen alimenticio'],
        handler: handleNutritionPlanRequest
    },
    solicitarEjemplosComidas: {
        patterns: ['ejemplos de comidas', 'sugerencias', 'recetas', 'comidas saludables', 'opciones de comida', 'qué puedo comer', 'qué debo comer'],
        handler: handleMealExamplesRequest
    },
    solicitarPlanEjercicio: {
        patterns: ['plan de ejercicio', 'rutina', 'ejercicios', 'actividad física', 'entrenar', 'gimnasio', 'cardio', 'fuerza'],
        handler: handleExercisePlanRequest
    },
    
    // Intenciones de actualización de datos
    actualizarDatos: {
        patterns: ['actualizar datos', 'cambiar mi', 'modificar mi', 'nuevo peso', 'nueva altura', 'cambiar objetivo', 'modificar información'],
        handler: handleDataUpdateRequest
    },
    
    // Intenciones sobre intolerancias y alergias
    consultarIntolerancias: {
        patterns: ['intolerancia', 'alergia', 'celíaco', 'sin gluten', 'lactosa', 'alérgico', 'alérgica', 'no puedo comer'],
        handler: handleIntolerancesRequest
    },
    
    // Intenciones sobre macronutrientes
    consultarMacronutrientes: {
        patterns: ['macros', 'macronutrientes', 'distribución', 'proteínas', 'carbohidratos', 'grasas', 'distribución de macros'],
        handler: handleMacroRequest
    },
    
    // Intenciones sobre suplementos
    consultarSuplementos: {
        patterns: ['suplementos', 'proteína en polvo', 'creatina', 'bcaa', 'vitaminas', 'omega 3', 'magnesio', 'zinc'],
        handler: handleSupplementsRequest
    },
    
    // Intenciones sobre alimentos específicos
    consultarAlimento: {
        patterns: ['calorías de', 'propiedades de', 'beneficios de', 'es saludable', 'puedo comer', 'información sobre'],
        handler: handleFoodInfoRequest
    },
    
    // Meta-intenciones
    reiniciarChat: {
        patterns: ['reiniciar', 'comenzar de nuevo', 'empezar otra vez', 'borrar datos', 'reset', 'empezar de cero'],
        handler: handleResetRequest
    },
    solicitarAyuda: {
        patterns: ['ayuda', 'instrucciones', 'cómo funciona', 'qué puedes hacer', 'opciones', 'comandos'],
        handler: handleHelpRequest
    }
};

/**
 * Detecta la intención del usuario en base a su mensaje
 * @param {string} message - Mensaje del usuario
 * @returns {Object|null} - Objeto con la intención detectada o null si no se detecta
 */
function detectUserIntent(message) {
    const normalizedMessage = message.toLowerCase();
    let bestMatch = null;
    let highestScore = 0;
    
    // Revisar cada intención y sus patrones
    for (const intent in userIntents) {
        const intentObject = userIntents[intent];
        
        // Calcular puntuación para esta intención
        let score = 0;
        let matchedPatterns = [];
        
        for (const pattern of intentObject.patterns) {
            if (normalizedMessage.includes(pattern)) {
                // Aumentar puntuación basada en la longitud del patrón coincidente
                // Esto prioriza coincidencias de frases más largas sobre palabras sueltas
                const patternWords = pattern.split(' ').length;
                const patternScore = patternWords * 2;
                score += patternScore;
                matchedPatterns.push(pattern);
                
                // Bonificación si el patrón aparece al principio del mensaje
                if (normalizedMessage.indexOf(pattern) < normalizedMessage.length / 3) {
                    score += 1;
                }
            }
        }
        
        // Actualizar mejor coincidencia si esta tiene mayor puntuación
        if (score > highestScore && score > 1) { // Umbral mínimo
            highestScore = score;
            bestMatch = {
                intent: intent,
                handler: intentObject.handler,
                score: score,
                patterns: matchedPatterns
            };
        }
    }
    
    return bestMatch;
}

/**
 * Manejador para consultas sobre el peso
 * @param {Object} userData - Datos del usuario
 * @returns {string} - Respuesta generada
 */
function handleWeightQuery(userData) {
    if (!userData.weight) {
        return "Aún no tengo registrado tu peso. ¿Te gustaría decirme cuál es tu peso actual en kilogramos?";
    }
    
    // Si tenemos altura, podemos ofrecer información de IMC
    if (userData.height) {
        const bmi = calculateBMI(userData.weight, userData.height);
        const category = getBMICategory(bmi);
        
        return `Tu peso registrado actualmente es de ${userData.weight} kg, lo que con tu altura de ${(userData.height/100).toFixed(2)} metros resulta en un IMC de ${bmi} (${category.toLowerCase()}).
        
¿Quieres actualizarlo o necesitas alguna recomendación relacionada con tu peso?`;
    }
    
    return `Tu peso registrado actualmente es de ${userData.weight} kg. ¿Quieres actualizarlo o necesitas alguna recomendación relacionada con tu peso?`;
}

/**
 * Manejador para consultas sobre el IMC
 * @param {Object} userData - Datos del usuario
 * @returns {string} - Respuesta generada
 */
function handleBMIQuery(userData) {
    if (!userData.weight || !userData.height) {
        return "Para calcular tu IMC necesito conocer tu peso y altura. ¿Quieres proporcionarme esos datos?";
    }
    
    const bmi = calculateBMI(userData.weight, userData.height);
    const category = getBMICategory(bmi);
    
    let response = `📊 TU ÍNDICE DE MASA CORPORAL (IMC)
    
Tu IMC actual es de ${bmi}, lo que corresponde a la categoría: "${category}".

Un IMC saludable generalmente se encuentra entre 18.5 y 25. ${getBMIRecommendation(category)}

Recuerda que el IMC es solo un indicador y tiene limitaciones importantes:
- No distingue entre masa muscular y grasa
- No considera la distribución de grasa (abdominal vs. periférica)
- No toma en cuenta factores como composición corporal, edad o etnia

¿Te gustaría información sobre otras medidas como circunferencia de cintura o porcentaje de grasa corporal, que complementan al IMC?`;
    
    return response;
}

/**
 * Manejador para consultas sobre calorías
 * @param {Object} userData - Datos del usuario
 * @returns {string} - Respuesta generada
 */
function handleCaloriesQuery(userData) {
    if (!userData.weight || !userData.height || !userData.age || !userData.gender || !userData.activityLevel) {
        return "Para calcular tus necesidades calóricas necesito más información. ¿Te gustaría completar tu perfil respondiendo algunas preguntas?";
    }
    
    const calories = calculateCalorieNeeds(userData);
    const tdee = calculateTDEE(userData);
    const bmr = calculateBMR(userData);
    
    let response = `📊 TUS NECESIDADES CALÓRICAS DIARIAS
    
Basado en tus datos personales, tus requerimientos energéticos son:

- Metabolismo Basal (BMR): ${Math.round(bmr)} calorías
  Energía mínima que tu cuerpo necesita en reposo completo para funciones vitales.

- Gasto Energético Total (TDEE): ${tdee} calorías
  Tu consumo total considerando tu nivel de actividad "${userData.activityLevel}".

- Calorías Recomendadas para "${userData.goal}": ${calories} calorías
  Ajustadas según tu objetivo específico.`;

    // Añadir información específica según el objetivo
    if (userData.goal === 'perder peso') {
        response += `
        
Esta recomendación representa un déficit moderado del 15% sobre tu mantenimiento, para una pérdida gradual y sostenible de 0.3-0.5 kg por semana. Para resultados saludables, no se recomienda bajar de ${Math.max(1200, Math.round(tdee * 0.7))} calorías diarias sin supervisión profesional.`;
    } else if (userData.goal === 'ganar peso') {
        response += `
        
Esta recomendación representa un superávit moderado del 15% sobre tu mantenimiento, para una ganancia gradual y de calidad de 0.25-0.5 kg por semana. Un superávit mayor podría resultar en mayor acumulación de grasa que de músculo.`;
    }

    response += `
    
¿Te gustaría ver una distribución recomendada de macronutrientes (proteínas, carbohidratos y grasas) para estas calorías?`;
    
    return response;
}

/**
 * Manejador para solicitudes de plan nutricional
 * @param {Object} userData - Datos del usuario
 * @returns {string} - Respuesta generada
 */
function handleNutritionPlanRequest(userData) {
    const dataMissing = !userData.weight || !userData.height || !userData.age || 
                       !userData.gender || !userData.activityLevel || !userData.goal;
                       
    if (dataMissing) {
        return "Para crear un plan nutricional personalizado necesito más información sobre ti. ¿Te gustaría responder algunas preguntas para completar tu perfil?";
    }
    
    const calories = calculateCalorieNeeds(userData);
    const macros = calculateMacroDistribution(userData);
    
    let response = `📋 PLAN NUTRICIONAL PERSONALIZADO 📋
    
Basado en tus datos y tu objetivo de "${userData.goal}", he creado estas recomendaciones nutricionales:

📊 RESUMEN DIARIO:
- Calorías totales: ${calories} kcal/día
- Proteínas: ${macros.protein}g (${Math.round(macros.protein * 4)} kcal - ${Math.round((macros.protein * 4 / calories) * 100)}%)
- Carbohidratos: ${macros.carbs}g (${Math.round(macros.carbs * 4)} kcal - ${Math.round((macros.carbs * 4 / calories) * 100)}%)
- Grasas: ${macros.fat}g (${Math.round(macros.fat * 9)} kcal - ${Math.round((macros.fat * 9 / calories) * 100)}%)
- Agua: ${calculateWaterNeeds(userData.weight, userData.activityLevel)} litros`;

    // Añadir recomendaciones específicas según el objetivo
    if (userData.goal === 'perder peso') {
        response += `

🔑 RECOMENDACIONES CLAVE:
- Distribuye proteínas en todas las comidas (20-30g/comida) para maximizar saciedad
- Prioriza carbohidratos complejos y ricos en fibra
- Controla tamaños de porción usando la mano como referencia
- Considera ayuno intermitente 16/8 si se adapta a tu estilo de vida
- Programa comidas con antelación para evitar decisiones impulsivas`;
    } else if (userData.goal === 'ganar peso') {
        response += `

🔑 RECOMENDACIONES CLAVE:
- Divide tu alimentación en 5-6 comidas para facilitar el consumo calórico
- Prioriza alimentos densos en nutrientes y calorías
- Programa una comida sustancial post-entrenamiento
- Considera batidos altos en calorías como complemento (no sustituto)
- Mantén seguimiento para asegurar consistencia en el superávit`;
    } else {
        response += `

🔑 RECOMENDACIONES CLAVE:
- Enfoca tu alimentación en alimentos integrales y mínimamente procesados
- Distribuye calorías según tu actividad diaria
- Mantén consistencia en horarios de comidas
- Practica alimentación consciente y disfruta tu comida
- Permite flexibilidad ocasional manteniendo balance general`;
    }

    response += `

¿Te gustaría ver un ejemplo de distribución de comidas para este plan o prefieres recibir recomendaciones de alimentos específicos?`;
    
    return response;
}

/**
 * Manejador para solicitudes de ejemplos de comidas
 * @param {Object} userData - Datos del usuario
 * @returns {string} - Respuesta generada
 */
function handleMealExamplesRequest(userData) {
    if (!userData.goal) {
        return "Para ofrecerte ejemplos de comidas adaptadas a tus necesidades, necesito saber cuál es tu objetivo (perder peso, mantener peso o ganar peso). ¿Cuál es tu objetivo actual?";
    }
    
    const calories = userData.weight && userData.height && userData.age && userData.gender && userData.activityLevel ? 
                     calculateCalorieNeeds(userData) : 
                     (userData.goal === 'perder peso' ? 1500 : userData.goal === 'ganar peso' ? 2500 : 2000);
    
    // Obtener ejemplos de comidas adecuadas según el objetivo
    const breakfastSuggestions = getSuggestedFoods('breakfast', userData.goal);
    const morningSnackSuggestions = getSuggestedFoods('morningSnack', userData.goal);
    const lunchSuggestions = getSuggestedFoods('lunch', userData.goal);
    const afternoonSnackSuggestions = getSuggestedFoods('afternoonSnack', userData.goal);
    const dinnerSuggestions = getSuggestedFoods('dinner', userData.goal);
    
    let response = `🍽️ EJEMPLOS DE COMIDAS PARA ${userData.goal.toUpperCase()} 🍽️

Este plan está diseñado para aproximadamente ${calories} calorías diarias, adaptado a tu objetivo de ${userData.goal}.

⏰ DESAYUNO (7:00-8:30) - ~${Math.round(calories * 0.25)} kcal
${breakfastSuggestions.slice(0, 3).map(item => `• ${item}`).join('\n')}

🥪 MEDIA MAÑANA (10:30-11:00) - ~${Math.round(calories * 0.1)} kcal
${morningSnackSuggestions.slice(0, 2).map(item => `• ${item}`).join('\n')}

🥗 COMIDA (13:00-14:30) - ~${Math.round(calories * 0.35)} kcal
${lunchSuggestions.slice(0, 3).map(item => `• ${item}`).join('\n')}

🍎 MERIENDA (16:30-17:30) - ~${Math.round(calories * 0.1)} kcal
${afternoonSnackSuggestions.slice(0, 2).map(item => `• ${item}`).join('\n')}

🍲 CENA (20:00-21:00) - ~${Math.round(calories * 0.2)} kcal
${dinnerSuggestions.slice(0, 3).map(item => `• ${item}`).join('\n')}`;

    // Añadir consejos específicos según el objetivo
    if (userData.goal === 'perder peso') {
        response += `

💡 CONSEJOS PARA PÉRDIDA DE PESO:
- Asegura proteína en cada comida para mayor saciedad
- Prioriza verduras en comida y cena (llenar la mitad del plato)
- Considera cenar más temprano (3h antes de dormir)
- Bebe agua antes de las comidas
- Si sientes hambre entre horas, añade proteína magra o verduras`;
    } else if (userData.goal === 'ganar peso') {
        response += `

💡 CONSEJOS PARA GANANCIA DE PESO:
- Aumenta tamaños de porción gradualmente
- Añade calorías "líquidas" (batidos, smoothies) entre comidas
- Incluye grasas saludables como aderezo (aceites, frutos secos)
- Programa recordatorios para no saltarte comidas
- Prioriza calidad y densidad nutricional sobre volumen`;
} else {
    response += `

💡 CONSEJOS PARA MANTENIMIENTO:
- Varía tus fuentes de proteína, carbohidratos y grasas
- Practica alimentación intuitiva (escucha señales de hambre/saciedad)
- Ajusta cantidades según nivel de actividad diario
- Equilibra nutrición y disfrute en celebraciones sociales
- Prepara comidas caseras la mayoría del tiempo`;
}

response += `

¿Te gustaría recetas más detalladas para alguna de estas comidas o información sobre cómo preparar alguna en particular?`;

return response;
}

/**
* Manejador para solicitudes de plan de ejercicio
* @param {Object} userData - Datos del usuario
* @returns {string} - Respuesta generada
*/
function handleExercisePlanRequest(userData) {
if (!userData.goal) {
    return "Para recomendarte un plan de ejercicios adecuado, necesito saber cuál es tu objetivo. ¿Estás buscando perder peso, mantener tu peso actual o ganar masa muscular?";
}

// Utilizamos la función que genera planes de ejercicio basados en el objetivo
return getExercisePlanByGoal(userData.goal);
}

/**
* Manejador para solicitudes de actualización de datos
* @param {Object} userData - Datos del usuario
* @param {string} message - Mensaje original del usuario
* @returns {string} - Respuesta generada
*/
function handleDataUpdateRequest(userData, message) {
// Identificar qué dato desea actualizar el usuario
const messageLower = message.toLowerCase();

if (messageLower.includes('peso')) {
    return "Entendido, quieres actualizar tu peso. ¿Cuál es tu peso actual en kilogramos?";
} else if (messageLower.includes('altura') || messageLower.includes('estatura')) {
    return "Claro, vamos a actualizar tu altura. ¿Cuál es tu altura actual en metros? (por ejemplo: 1.75)";
} else if (messageLower.includes('objetivo') || messageLower.includes('meta')) {
    return "Vamos a actualizar tu objetivo. ¿Cuál es tu objetivo actual: perder peso, mantener peso o ganar peso?";
} else if (messageLower.includes('actividad') || messageLower.includes('ejercicio')) {
    return "Actualicemos tu nivel de actividad física. ¿Cómo describirías tu nivel actual:\n• Sedentario (poco o ningún ejercicio)\n• Ligera (ejercicio 1-3 días/semana)\n• Moderada (ejercicio 3-5 días/semana)\n• Activa (ejercicio intenso 6-7 días/semana)\n• Muy activa (atleta o trabajo físico diario)?";
} else if (messageLower.includes('edad') || messageLower.includes('años')) {
    return "Vamos a actualizar tu edad. ¿Cuántos años tienes actualmente?";
} else if (messageLower.includes('género') || messageLower.includes('sexo')) {
    return "Entendido, actualizaremos tu género. ¿Es masculino o femenino?";
} else {
    return "¿Qué datos te gustaría actualizar? Puedo ayudarte a modificar tu peso, altura, edad, género, nivel de actividad u objetivo.";
}
}

/**
* Manejador para consultas sobre intolerancias y alergias
* @param {Object} userData - Datos del usuario
* @param {string} message - Mensaje original del usuario
* @returns {string} - Respuesta generada
*/
function handleIntolerancesRequest(userData, message) {
const messageLower = message.toLowerCase();

// Detectar intolerancias específicas mencionadas
if (messageLower.includes('gluten') || messageLower.includes('celiac') || messageLower.includes('celíac')) {
    return `
📋 RECOMENDACIONES PARA INTOLERANCIA AL GLUTEN/ENFERMEDAD CELÍACA

La intolerancia al gluten o enfermedad celíaca requiere eliminar completamente el gluten de la dieta.

❌ ALIMENTOS A EVITAR:
- Trigo, cebada, centeno y sus derivados
- Pan, pasta, cereales y bollería convencionales
- Cerveza tradicional y algunas bebidas de malta
- Salsas y aderezos espesados con harina (gravy, bechamel)
- Productos procesados que puedan contener gluten como aditivo

✅ ALTERNATIVAS SEGURAS:
- Arroz, maíz, quinoa, mijo, amaranto, trigo sarraceno, teff
- Todas las frutas y verduras frescas
- Carnes no procesadas, pescados, huevos
- Legumbres (lentejas, garbanzos, frijoles)
- Lácteos naturales (verificar ingredientes en los procesados)
- Frutos secos y semillas naturales (no condimentados)

💡 CONSEJOS PRÁCTICOS:
- Busca etiquetas certificadas "sin gluten"
- Cuidado con la contaminación cruzada en cocina
- Aprende a leer etiquetas (gluten puede aparecer como "almidón modificado", "proteína vegetal hidrolizada", "malta")
- Utiliza harinas alternativas: maíz, arroz, almendra, coco, garbanzo
- Complementa con vitamina B y fibra, a menudo deficientes en dietas sin gluten

¿Te gustaría recomendaciones de productos específicos sin gluten o ejemplos de menús semanales adaptados?`;
} 
else if (messageLower.includes('lactosa') || messageLower.includes('lácteos')) {
    return `
📋 RECOMENDACIONES PARA INTOLERANCIA A LA LACTOSA

La intolerancia a la lactosa es la incapacidad de digerir la lactosa (azúcar de la leche) debido a la deficiencia de la enzima lactasa.

❌ ALIMENTOS QUE CONTIENEN LACTOSA:
- Leche de vaca, cabra, oveja (cualquier mamífero)
- Nata/crema, mantequilla (en menor medida)
- Yogur tradicional, helados cremosos
- Quesos frescos (ricotta, cottage, queso crema)
- Cremas, salsas cremosas, algunos aderezos
- Muchos alimentos procesados (revisa etiquetas)

✅ ALTERNATIVAS SEGURAS:
- Bebidas vegetales: almendra, soja, avena, coco, arroz
- Yogures sin lactosa o vegetales
- Quesos muy curados (tienen lactosa mínima: parmesano, manchego añejo)
- Leche tratada con lactasa (Lactaid, deslactosada)
- Helados y postres sin lactosa o a base de plantas
- Ghee (mantequilla clarificada, con lactosa eliminada)

💡 CONSEJOS PRÁCTICOS:
- Suplementos de lactasa antes de consumir lácteos en eventos sociales
- La tolerancia es individual: prueba pequeñas cantidades para determinar tu umbral
- El yogur fermentado y kéfir son mejor tolerados por muchas personas
- Asegura suficiente calcio de fuentes alternativas: almendras, tofu, sardinas, verduras de hoja verde
- No toda intolerancia a lácteos es intolerancia a lactosa (podría ser alergia a proteínas)

¿Te interesa saber más sobre cómo mantener una nutrición equilibrada sin lácteos o alternativas específicas para productos como queso o yogur?`;
} 
else if (messageLower.includes('frutos secos') || messageLower.includes('nueces') || messageLower.includes('alergia')) {
    return `
📋 RECOMENDACIONES PARA ALERGIA A FRUTOS SECOS

La alergia a frutos secos puede ser grave y potencialmente mortal, requiriendo evitación estricta.

❌ FRUTOS SECOS A EVITAR:
- Almendras, nueces, avellanas, pistachos, anacardos
- Nuez de Brasil, nuez de macadamia, piñones, pacanas
- Mantequillas y pastas de frutos secos
- Aceites derivados de frutos secos
- Mazapán, turrón, nougat y algunos dulces

⚠️ POSIBLES FUENTES OCULTAS:
- Salsas asiáticas (satay, curry)
- Productos de panadería y repostería
- Cereales y granolas
- Helados y postres
- Pesto y otras salsas
- Algunos embutidos y carnes procesadas

✅ ALTERNATIVAS SEGURAS PARA NUTRIENTES SIMILARES:
- Semillas (chía, lino, calabaza, girasol) para grasas saludables
- Aguacate para grasas monoinsaturadas
- Legumbres para proteínas vegetales
- Aceite de oliva y de coco para grasas de cocina
- Mantequillas de semillas (girasol, calabaza) en lugar de mantequillas de frutos secos

💡 CONSEJOS PRÁCTICOS:
- Lleva siempre medicación de emergencia (autoinyector de adrenalina) si la alergia es grave
- Lee TODAS las etiquetas, cada vez (las formulaciones cambian)
- Avisa en restaurantes de tu alergia, incluso en platos que no parecen contener frutos secos
- Cuidado con la contaminación cruzada en heladerías, panaderías y restaurantes
- Ten especial cuidado con productos importados o artesanales

¿Quieres más información sobre cómo leer etiquetas efectivamente o cómo comunicar tu alergia en restaurantes?`;
} 
else {
    return `Para darte recomendaciones específicas sobre intolerancias o alergias alimentarias, necesito saber cuál es tu situación particular.

¿Podrías indicarme a qué alimento o componente tienes intolerancia o alergia? Por ejemplo:
- Gluten (enfermedad celíaca)
- Lactosa
- Frutos secos
- Mariscos
- FODMAP (síndrome de intestino irritable)
- Huevo
- Soja
- Histamina
- Fructosa

Una vez que sepa tu caso específico, podré ofrecerte alternativas alimentarias, consejos para evitar alimentos problemáticos y recomendaciones para mantener una nutrición equilibrada adaptada a tus necesidades.`;
}
}

/**
* Manejador para consultas sobre macronutrientes
* @param {Object} userData - Datos del usuario
* @returns {string} - Respuesta generada
*/
function handleMacroRequest(userData) {
if (!userData.weight || !userData.height || !userData.age || !userData.gender || !userData.activityLevel || !userData.goal) {
    return "Para calcular tu distribución ideal de macronutrientes, necesito tener tu información completa. ¿Te gustaría completar tu perfil?";
}

const calories = calculateCalorieNeeds(userData);
const macros = calculateMacroDistribution(userData);

let response = `📊 DISTRIBUCIÓN DE MACRONUTRIENTES

Para tu objetivo de ${userData.goal} con ${calories} calorías diarias, la distribución recomendada es:

🥩 PROTEÍNAS: ${macros.protein}g (${Math.round(macros.protein * 4)} kcal - ${Math.round((macros.protein * 4 / calories) * 100)}%)
- Funciones: Construcción y reparación muscular, enzimas, inmunidad, saciedad
- Fuentes: Carnes magras, pescado, huevos, lácteos, legumbres, tofu
- Recomendación para ti: ${Math.round(macros.protein/userData.weight * 10) / 10}g por kg de peso corporal
- Distribución ideal: 20-30g por comida repartidas uniformemente

🍚 CARBOHIDRATOS: ${macros.carbs}g (${Math.round(macros.carbs * 4)} kcal - ${Math.round((macros.carbs * 4 / calories) * 100)}%)
- Funciones: Energía principal, combustible para cerebro y actividad física
- Fuentes: Granos enteros, tubérculos, frutas, legumbres
- Distribución: Mayor proporción en desayuno y alrededor del ejercicio
- Prioridad: Carbohidratos complejos ricos en fibra y micronutrientes

🥑 GRASAS: ${macros.fat}g (${Math.round(macros.fat * 9)} kcal - ${Math.round((macros.fat * 9 / calories) * 100)}%)
- Funciones: Hormonas, absorción de vitaminas, salud cerebral, saciedad
- Fuentes: Aceite de oliva, aguacate, frutos secos, semillas, pescados grasos
- Distribución: Regular a lo largo del día, limitar en pre-ejercicio
- Prioridad: Grasas monoinsaturadas y poliinsaturadas, limitar saturadas`;

// Añadir consejos específicos según el objetivo
if (userData.goal === 'perder peso') {
    response += `

💡 AJUSTES PARA PÉRDIDA DE PESO:
- Proteínas ligeramente más altas para preservar masa muscular
- Carbohidratos moderados con énfasis en fibra (mínimo 25g/día)
- Grasas saludables en cantidades controladas
- Distribución: Considerar mayor proporción de calorías en primera mitad del día`;
} else if (userData.goal === 'ganar peso') {
    response += `

💡 AJUSTES PARA GANANCIA DE PESO:
- Proteínas suficientes para síntesis muscular (distribución uniforme)
- Carbohidratos elevados, especialmente alrededor del entrenamiento
- Grasas moderadas como fuente calórica concentrada
- Distribución: 5-6 comidas para facilitar ingesta calórica total`;
} else {
    response += `

💡 AJUSTES PARA MANTENIMIENTO:
- Balance equilibrado adaptado a preferencias personales
- Flexibilidad en distribución según actividades diarias
- Énfasis en calidad de fuentes más que en cantidades exactas
- Variedad para asegurar perfil completo de aminoácidos y ácidos grasos`;
}

response += `

¿Te gustaría más información sobre algún macronutriente en particular o ayuda para planificar comidas que cumplan con esta distribución?`;

return response;
}

/**
* Manejador para consultas sobre suplementos
* @param {Object} userData - Datos del usuario
* @returns {string} - Respuesta generada
*/
function handleSupplementsRequest(userData) {
let response = `📋 GUÍA DE SUPLEMENTOS NUTRICIONALES

⚠️ NOTA IMPORTANTE: Los suplementos deben complementar (no sustituir) una alimentación equilibrada. Esta información es educativa, no un consejo médico.

🔍 CONSIDERACIONES GENERALES:
- Prioriza alimentos reales sobre suplementos
- Evalúa necesidades individuales (análisis sanguíneos pueden ayudar)
- La calidad y pureza varían significativamente entre marcas
- No todos los cuerpos responden igual a los mismos suplementos
- Consulta con profesionales antes de suplementar`;

// Suplementos según objetivo
if (userData.goal === 'perder peso') {
    response += `

🎯 SUPLEMENTOS POTENCIALMENTE ÚTILES PARA PÉRDIDA DE PESO:

- Proteína en polvo
- Beneficio: Aumenta saciedad, preserva masa muscular durante déficit
- Dosis: 20-30g como refrigerio o complemento a comidas
- Consideraciones: Whey para rápida absorción, caseína para saciedad prolongada

- Fibra (psyllium, glucomanano)
- Beneficio: Aumenta volumen gástrico y saciedad, regula glucosa
- Dosis: 3-5g antes de comidas con abundante agua
- Consideraciones: Aumentar gradualmente para evitar molestias digestivas

- Cafeína
- Beneficio: Leve aumento metabólico, mejora energía para entrenamientos
- Dosis: 100-200mg, preferentemente antes de actividad física
- Consideraciones: Tolerancia variable, evitar después de media tarde

- Vitamina D
- Beneficio: Asociación con mejor composición corporal, función metabólica
- Dosis: 1000-2000 UI según niveles (verificar con análisis)
- Consideraciones: Importante con baja exposición solar`;
} else if (userData.goal === 'ganar peso') {
    response += `

🎯 SUPLEMENTOS POTENCIALMENTE ÚTILES PARA GANANCIA MUSCULAR:

- Proteína en polvo
- Beneficio: Facilita alcanzar requerimientos proteicos elevados
- Dosis: 20-40g post-entrenamiento y/o entre comidas
- Consideraciones: Mezclas de proteínas para absorción gradual

- Creatina monohidrato
- Beneficio: Aumenta fuerza, rendimiento y volumen celular muscular
- Dosis: 3-5g diarios (no requiere fase de carga)
- Consideraciones: Uno de los suplementos más estudiados y seguros

- Ganancias de peso (mass gainers)
- Beneficio: Facilita alcanzar superávit calórico si cuesta con comida sólida
- Dosis: Variable según necesidades calóricas
- Consideraciones: Muchos son altos en azúcares, considera hacer tus propios batidos

- ZMA (Zinc, Magnesio, Vitamina B6)
- Beneficio: Optimiza recuperación y niveles hormonales
- Dosis: ~30mg zinc, ~450mg magnesio, ~10mg B6
- Consideraciones: Tomar antes de dormir para mejor absorción`;
} else {
    response += `

🎯 SUPLEMENTOS PARA SALUD GENERAL Y MANTENIMIENTO:

- Multivitamínico de calidad
- Beneficio: "Seguro nutricional" para cubrir posibles deficiencias
- Dosis: Según etiqueta, generalmente 1 dosis diaria
- Consideraciones: No reemplaza alimentación variada, buscar fórmulas de alta biodisponibilidad

- Omega-3 (EPA/DHA)
- Beneficio: Antiinflamatorio, salud cardiovascular y cognitiva
- Dosis: 1-3g combinados EPA/DHA
- Consideraciones: Importante si consumo de pescado graso es bajo

- Vitamina D3
- Beneficio: Inmunidad, función hormonal, salud ósea
- Dosis: 1000-2000 UI/día según estación y exposición solar
- Consideraciones: Tomar con comida grasa para mejor absorción

- Probióticos
- Beneficio: Salud digestiva, inmunidad, menos inflamación
- Dosis: 1-10 mil millones UFC, múltiples cepas
- Consideraciones: Calidad muy variable, refrigerar muchas marcas`;
}

response += `

⚠️ SUPLEMENTOS SOBREVALORADOS CON DUDOSA EVIDENCIA:
- "Quemadores de grasa" milagrosos
- Muchos "potenciadores de testosterona" naturales
- BCAA si ya consumes suficiente proteína completa
- Detox o limpiezas (tu hígado y riñones ya hacen este trabajo)

¿Te gustaría información más detallada sobre algún suplemento específico?`;

return response;
}

/**
* Manejador para consultas sobre alimentos específicos
* @param {Object} userData - Datos del usuario
* @param {string} message - Mensaje original del usuario
* @returns {string} - Respuesta generada
*/
function handleFoodInfoRequest(userData, message) {
// Identificar qué alimento está consultando el usuario
const messageLower = message.toLowerCase();
let foodName = null;

// Patrones para identificar el alimento
const patterns = [
    /propiedades de( la| el| los| las)? (.+)$/i,
    /beneficios de( la| el| los| las)? (.+)$/i,
    /información sobre( el| la| los| las)? (.+)$/i,
    /calorías de( la| el| los| las)? (.+)$/i,
    /nutrientes de( la| el| los| las)? (.+)$/i,
    /es saludable( el| la| los| las)? (.+)\??$/i
];

// Buscar coincidencias con los patrones
for (const pattern of patterns) {
    const match = messageLower.match(pattern);
    if (match && match[2]) {
        foodName = match[2].trim();
        break;
    }
}

if (!foodName) {
    // Si no se identificó un alimento específico
    return "¿Sobre qué alimento específico te gustaría obtener información? Puedes preguntarme sobre propiedades nutricionales, beneficios para la salud, o cómo incorporarlo en tu alimentación.";
}

// Buscar el alimento en la base de datos
const searchResults = buscarAlimentos(foodName);

if (searchResults.length === 0) {
    // No se encontró el alimento en la base de datos
    return `No tengo información específica sobre "${foodName}" en mi base de datos. ¿Te gustaría información sobre algún otro alimento o categoría de alimentos?`;
}

// Tomar el primer resultado como el más relevante
const food = searchResults[0];

// Generar respuesta con información del alimento
let response = `🍎 INFORMACIÓN NUTRICIONAL: ${food.nombre.toUpperCase()}

📊 PERFIL NUTRICIONAL (por ${food.porcion}):
- Calorías: ${food.calorias} kcal
- Proteínas: ${food.proteina}g
- Carbohidratos: ${food.carbos}g
- Grasas: ${food.grasa}g

✅ BENEFICIOS PRINCIPALES:
${food.beneficios.map(beneficio => `• ${beneficio}`).join('\n')}

🍽️ SUGERENCIAS CULINARIAS:
${food.sugerencias ? food.sugerencias.map(sugerencia => `• ${sugerencia}`).join('\n') : '• Información no disponible'}

${userData.goal ? `💡 CONSIDERACIONES PARA TU OBJETIVO (${userData.goal.toUpperCase()}):
${getUserGoalFoodRecommendation(food, userData.goal)}` : ''}

¿Te gustaría saber cómo incorporar este alimento en tu plan alimenticio o compararlo con otras alternativas?`;

return response;
}

/**
* Genera recomendaciones para un alimento según el objetivo del usuario
* @param {Object} food - Información del alimento
* @param {string} goal - Objetivo del usuario
* @returns {string} - Recomendación personalizada
*/
function getUserGoalFoodRecommendation(food, goal) {
// Categorizar el alimento
let foodCategory = '';
if (food.proteina > 15 && food.proteina/food.calorias > 0.1) {
    foodCategory = 'proteína';
} else if (food.carbos > 15 && food.carbos/food.calorias > 0.15) {
    foodCategory = 'carbohidrato';
} else if (food.grasa > 10 && food.grasa/food.calorias > 0.2) {
    foodCategory = 'grasa';
} else if (food.calorias < 50 && food.carbos < 10) {
    foodCategory = 'bajo en calorías';
} else {
    foodCategory = 'mixto';
}

// Generar recomendación según categoría y objetivo
if (goal === 'perder peso') {
    switch(foodCategory) {
        case 'proteína':
            return `• Excelente opción por su alto contenido proteico y poder saciante\n• Incluir en comidas principales para controlar el apetito\n• Combinar con verduras para comidas completas y bajas en calorías`;
        case 'carbohidrato':
            return `• Controlar tamaños de porción debido a densidad calórica\n• Preferir en primera mitad del día o alrededor de entrenamiento\n• Combinar con proteínas para mejorar saciedad y respuesta glucémica`;
        case 'grasa':
            return `• Consumir con moderación debido a alta densidad calórica\n• Porciones controladas: ${food.nombre === 'Aceite de oliva' ? '1 cucharada' : 'pequeño puñado o 1-2 cucharadas'}\n• Incluir estratégicamente para mejorar saciedad y absorción de vitaminas`;
        case 'bajo en calorías':
            return `• Excelente para añadir volumen a comidas con pocas calorías\n• Usar libremente para aumentar saciedad\n• Ideal para snacks o acompañamientos`;
        default:
            return `• Considerar el balance calórico total del día\n• Combinar con proteínas o fibra para mayor saciedad\n• Monitorear tamaños de porción`;
    }
} else if (goal === 'ganar peso') {
    switch(foodCategory) {
        case 'proteína':
            return `• Importante para desarrollo muscular en superávit calórico\n• Aumentar porciones para alcanzar objetivos proteicos\n• Combinar con carbohidratos y grasas para aumentar calorías totales`;
        case 'carbohidrato':
            return `• Excelente para aumentar calorías y energía para entrenamientos\n• Priorizar después del ejercicio para recuperación y recarga de glucógeno\n• Porciones generosas para alcanzar superávit calórico`;
        case 'grasa':
            return `• Útil para añadir calorías de forma concentrada\n• Usar generosamente como condimento para aumentar calorías sin volumen\n• Combinar con otros alimentos para aumentar palatabilidad y densidad calórica`;
        case 'bajo en calorías':
            return `• Incluir por valor nutricional pero no como base de la alimentación\n• Combinar con fuentes calóricas para no llenar con bajo aporte energético\n• Priorizar vitaminas y minerales para optimizar ganancias musculares`;
        default:
            return `• Incorporar regularmente como parte de dieta variada\n• Aumentar tamaños de porción según necesidades calóricas\n• Combinarlo con otras fuentes de calorías para superávit efectivo`;
    }
} else { // mantener peso
    switch(foodCategory) {
        case 'proteína':
            return `• Excelente para mantenimiento de masa muscular y composición corporal\n• Distribuir a lo largo del día para síntesis proteica óptima\n• Base ideal para comidas equilibradas`;
        case 'carbohidrato':
            return `• Ajustar porciones según nivel de actividad diario\n• Preferir versiones integrales o mínimamente procesadas\n• Combinar con proteínas y grasas saludables para comidas balanceadas`;
        case 'grasa':
            return `• Incluir regularmente para funciones hormonales y saciedad\n• Priorizar grasas de calidad sobre procesadas\n• Porciones moderadas ajustadas a necesidades energéticas diarias`;
        case 'bajo en calorías':
            return `• Base excelente para asegurar adecuada ingesta de micronutrientes\n• Usar libremente para agregar volumen y saciedad\n• Mantener variedad de colores para espectro completo de fitoquímicos`;
        default:
            return `• Incorporar en contexto de alimentación variada y balanceada\n• Ajustar porciones según necesidades energéticas específicas\n• Priorizar disfrute y sostenibilidad a largo plazo`;
    }
}
}

/**
* Manejador para solicitudes de reinicio
* @returns {string} - Respuesta generada
*/
function handleResetRequest() {
return "Voy a reiniciar tus datos. Esto borrará toda la información almacenada. ¿Estás seguro de que quieres comenzar de nuevo? (sí/no)";
}

/**
* Manejador para solicitudes de ayuda
* @returns {string} - Respuesta generada
*/
function handleHelpRequest() {
return `¡Estoy aquí para ayudarte! Con NutriChat puedes:

1️⃣ EVALUACIÓN Y CÁLCULOS PERSONALIZADOS
• Calcular tus necesidades calóricas diarias
• Determinar tu IMC y estado nutricional
• Crear distribución de macronutrientes adaptada a tus objetivos
• Establecer necesidades de hidratación

2️⃣ PLANES Y RECOMENDACIONES
• Obtener planes nutricionales personalizados
• Recibir ejemplos de comidas y recetas adaptadas
• Crear planes de ejercicio complementarios
• Consejos para casos específicos (intolerancias, embarazo, etc.)

3️⃣ INFORMACIÓN NUTRICIONAL
• Consultar información sobre alimentos específicos
• Conocer alternativas saludables a alimentos procesados
• Aprender sobre suplementos y su efectividad
• Resolver dudas sobre nutrición basada en evidencia

📝 COMANDOS ÚTILES:
- "Plan nutricional" - Obtener plan personalizado
- "Plan de ejercicios" - Rutina adaptada a tu objetivo
- "Actualizar peso/altura/objetivo" - Modificar datos
- "Calorías de [alimento]" - Información nutricional
- "Necesito ayuda con [tema]" - Asesoramiento específico

🔍 PARA EMPEZAR:
Para ofrecerte recomendaciones realmente personalizadas, necesito algunos datos básicos como edad, género, peso, altura, nivel de actividad y objetivo. ¿Te gustaría proporcionar esta información?`;
}

/**
 * Obtiene una recomendación basada en la categoría de IMC
 * @param {string} category - Categoría de IMC
 * @returns {string} - Recomendación personalizada
 */
function getBMIRecommendation(category) {
    switch(category) {
        case 'Bajo peso':
            return "Te recomendaría trabajar con un profesional para aumentar tu peso de forma saludable. Es importante enfocarte en ganar masa muscular y tejido, no solo aumentar el número en la báscula. Enfatiza alimentos densos en nutrientes, proteínas de calidad, y considera trabajo de fuerza para construir masa muscular.";
        case 'Peso normal':
            return "¡Excelente! Te recomendaría mantener tus hábitos actuales, equilibrando alimentación saludable y actividad física regular. Enfócate en la calidad de los alimentos y la variedad nutricional más que en restricciones o cambios drásticos.";
        case 'Sobrepeso':
            return "Podrías beneficiarte de algunos ajustes en tu alimentación y un incremento en tu actividad física. Pequeños cambios sostenidos (déficit de 300-500 calorías) y ejercicio regular pueden tener resultados significativos con el tiempo. Enfócate en hábitos que puedas mantener a largo plazo, no en dietas restrictivas temporales.";
        case 'Obesidad grado I':
        case 'Obesidad grado II':
        case 'Obesidad grado III':
            return "Te recomendaría consultar con profesionales de la salud (médico y nutricionista) para desarrollar un plan personalizado. Un enfoque multidisciplinario que combine alimentación, actividad física y posibles cambios de comportamiento suele ser más efectivo que centrarse solo en la dieta. Cambios graduales y sostenibles tienen mejores resultados a largo plazo.";
        default:
            return "Recuerda que el IMC es solo un indicador y no tiene en cuenta factores como la composición corporal, distribución muscular, edad o etnia. Lo importante es tener hábitos saludables que puedas mantener consistentemente.";
    }
}

/**
 * Procesa el mensaje del usuario utilizando detección de intenciones
 * @param {string} message - Mensaje del usuario
 * @param {Object} userData - Datos del usuario
 * @returns {string} - Respuesta generada o null si no se identifica intención
 */
function processIntentMessage(message, userData) {
    // Detectar intención
    const detectedIntent = detectUserIntent(message);
    
    if (detectedIntent) {
        // Ejecutar el manejador correspondiente
        return detectedIntent.handler(userData, message);
    }
    
    // Si no se detecta intención clara, devolver null para seguir con el flujo normal
    return null;
}