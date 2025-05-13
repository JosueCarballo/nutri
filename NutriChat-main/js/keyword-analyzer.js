/**
 * Módulo de análisis de palabras clave para mejorar la detección de intenciones en NutriChat
 */

// Categorías de palabras clave y sus términos asociados
const keywordCategories = {
    // Términos relacionados con consulta de datos personales
    personalData: {
        peso: ['peso', 'kilos', 'kg', 'cuánto peso', 'sobrepeso', 'perder peso', 'obesidad', 'delgado', 'balanza'],
        altura: ['altura', 'estatura', 'metros', 'm', 'cm', 'alto', 'cuánto mido', 'medir'],
        imc: ['imc', 'índice', 'masa corporal', 'índice de masa', 'bmi', 'composición corporal'],
        calorias: ['calorías', 'kcal', 'necesidad calórica', 'consumo diario', 'balance calórico', 'déficit', 'superávit'],
        agua: ['agua', 'hidratación', 'líquidos', 'cuánta agua', 'beber', 'litros', 'sed']
    },
    
    // Términos relacionados con planes de alimentación
    nutritionPlans: {
        planGeneral: ['plan', 'dieta', 'régimen', 'alimentación', 'nutricional', 'comidas', 'comer', 'menú'],
        perderPeso: ['adelgazar', 'bajar de peso', 'dieta para perder', 'déficit calórico', 'quemar grasa', 'reducir peso'],
        ganarPeso: ['aumentar peso', 'subir de peso', 'masa muscular', 'superávit calórico', 'volumen', 'engordar'],
        mantenerPeso: ['mantener peso', 'equilibrio', 'mantenimiento', 'estabilizar peso', 'no perder', 'no ganar']
    },
    
    // Términos relacionados con alimentos
    foods: {
        proteinas: ['proteínas', 'proteína', 'fuentes proteicas', 'alimentos proteicos', 'carnes', 'pescado', 'pollo', 'huevos', 'legumbres'],
        carbohidratos: ['carbohidratos', 'carbos', 'hidratos', 'cereales', 'granos', 'avena', 'pasta', 'arroz', 'patatas', 'pan'],
        grasas: ['grasas', 'ácidos grasos', 'omega', 'aceites', 'aguacate', 'frutos secos', 'semillas', 'aceitunas'],
        vegetales: ['vegetales', 'verduras', 'hortalizas', 'fibra', 'antioxidantes', 'ensalada', 'verdes'],
        frutas: ['frutas', 'fruta', 'azúcares naturales', 'fructosa', 'manzana', 'plátano', 'fresas']
    },
    
    // Términos relacionados con ejercicio
    exercise: {
        cardio: ['cardio', 'cardiovascular', 'aeróbico', 'correr', 'nadar', 'bicicleta', 'elíptica', 'quemar'],
        fuerza: ['fuerza', 'pesas', 'musculación', 'entrenar', 'gimnasio', 'músculo', 'tonificar', 'hipertrofia'],
        flexibilidad: ['flexibilidad', 'estiramientos', 'yoga', 'pilates', 'movilidad', 'elasticidad'],
        planEjercicio: ['rutina', 'plan de ejercicio', 'entrenamiento', 'actividad física', 'ejercitarse']
    },
    
    // Términos relacionados con salud general
    health: {
        descanso: ['dormir', 'sueño', 'descanso', 'recuperación', 'fatiga', 'insomnio', 'melatonina'],
        estres: ['estrés', 'ansiedad', 'cortisol', 'relax', 'meditación', 'nervios', 'tranquilidad'],
        suplementos: ['suplementos', 'vitaminas', 'minerales', 'proteína en polvo', 'omega', 'creatina', 'bcaa', 'complementos']
    },
    
    // Términos relacionados con metabolismo
    metabolism: {
        metabolismo: ['metabolismo', 'quemar calorías', 'termogénesis', 'aceleración metabólica', 'metabolismo basal', 'tasa metabólica'],
        digestión: ['digestión', 'digerir', 'enzimas', 'flora intestinal', 'microbiota', 'probióticos', 'tránsito intestinal', 'gases', 'hinchazón'],
        ayuno: ['ayuno intermitente', 'ayunar', 'ventana alimentaria', '16/8', 'saltarse comidas', 'omad', 'jejum']
    },
    
    // Términos relacionados con restricciones alimentarias
    restrictions: {
        alergias: ['alergia', 'alérgico', 'alérgica', 'reacción alérgica', 'anafilaxia', 'sensibilidad'],
        intolerancias: ['intolerancia', 'intolerante', 'sensibilidad', 'digestión difícil', 'malestar'],
        celiaquía: ['celíaco', 'celiaquía', 'gluten', 'sin gluten', 'trigo', 'cebada', 'centeno'],
        lactosa: ['lactosa', 'sin lactosa', 'intolerancia a la lactosa', 'lácteos', 'leche', 'queso'],
        vegetarianismo: ['vegetariano', 'vegetariana', 'no carne', 'sin carne', 'vegetarianismo'],
        veganismo: ['vegano', 'vegana', 'veganismo', 'no animal', 'sin productos animales', 'plant-based']
    },
    
    // Términos relacionados con ciclo de vida
    lifeStage: {
        embarazo: ['embarazo', 'embarazada', 'gestación', 'feto', 'bebé', 'nutrición prenatal'],
        lactancia: ['lactancia', 'amamantar', 'leche materna', 'posparto', 'postparto'],
        infancia: ['niño', 'niña', 'bebé', 'infantil', 'desarrollo infantil', 'crecimiento'],
        adolescencia: ['adolescente', 'pubertad', 'desarrollo', 'crecimiento', 'joven'],
        tercera_edad: ['mayor', 'tercera edad', 'anciano', 'anciana', 'envejecimiento', 'vejez', 'senior']
    }
};

/**
 * Analiza un mensaje para identificar categorías de palabras clave presentes
 * @param {string} message - Mensaje del usuario
 * @returns {Object} - Categorías detectadas con puntuaciones
 */
function analyzeKeywords(message) {
    const messageLower = message.toLowerCase();
    let results = {};
    
    // Analizar cada categoría principal
    for (const categoryName in keywordCategories) {
        const category = keywordCategories[categoryName];
        results[categoryName] = { score: 0, subcategories: {}, matchedTerms: [] };
        
        // Analizar subcategorías
        for (const subcategoryName in category) {
            const keywords = category[subcategoryName];
            let subcategoryScore = 0;
            let matched = [];
            
            // Verificar cada palabra clave en la subcategoría
            for (const keyword of keywords) {
                if (messageLower.includes(keyword)) {
                    subcategoryScore += 1;
                    matched.push(keyword);
                    
                    // Dar mayor peso a coincidencias exactas de frases más largas
                    if (keyword.split(' ').length > 1) {
                        subcategoryScore += 0.5;
                    }
                    
                    // Mayor peso a palabras clave que aparecen al principio del mensaje
                    if (messageLower.indexOf(keyword) < messageLower.length / 3) {
                        subcategoryScore += 0.3;
                    }
                }
            }
            
            // Almacenar resultados de la subcategoría
            if (subcategoryScore > 0) {
                results[categoryName].subcategories[subcategoryName] = {
                    score: subcategoryScore,
                    matchedTerms: matched
                };
                results[categoryName].score += subcategoryScore;
                results[categoryName].matchedTerms = results[categoryName].matchedTerms.concat(matched);
            }
        }
        
        // Eliminar categorías sin coincidencias
        if (results[categoryName].score === 0) {
            delete results[categoryName];
        }
    }
    
    return results;
}

/**
 * Determina la categoría principal y subcategoría con mayor puntuación
 * @param {Object} analysisResults - Resultados del análisis de palabras clave
 * @returns {Object} - Categoría y subcategoría dominantes
 */
function getDominantCategory(analysisResults) {
    let dominantCategory = null;
    let dominantScore = 0;
    
    // Encontrar categoría principal dominante
    for (const categoryName in analysisResults) {
        const category = analysisResults[categoryName];
        if (category.score > dominantScore) {
            dominantScore = category.score;
            dominantCategory = categoryName;
        }
    }
    
    // Si no hay coincidencias, devolver null
    if (!dominantCategory) {
        return { 
            dominant: null, 
            dominantSub: null,
            score: 0
        };
    }
    
    // Encontrar subcategoría dominante
    let dominantSubcategory = null;
    let dominantSubScore = 0;
    
    for (const subName in analysisResults[dominantCategory].subcategories) {
        const subScore = analysisResults[dominantCategory].subcategories[subName].score;
        if (subScore > dominantSubScore) {
            dominantSubScore = subScore;
            dominantSubcategory = subName;
        }
    }
    
    return {
        dominant: dominantCategory,
        dominantSub: dominantSubcategory,
        score: dominantScore,
        terms: analysisResults[dominantCategory].matchedTerms
    };
}

/**
 * Genera una respuesta basada en el análisis de palabras clave
 * @param {Object} analysisResult - Resultados del análisis de palabras clave
 * @param {Object} userData - Datos del usuario
 * @returns {string|null} - Respuesta generada o null si no hay suficiente contexto
 */
function generateKeywordResponse(analysisResult, userData) {
    // Si no hay categoría dominante, no generar respuesta
    if (!analysisResult.dominant || analysisResult.score < 2) {
        return null;
    }
    
    const { dominant, dominantSub } = analysisResult;
    
    // Respuestas para datos personales
    if (dominant === 'personalData') {
        switch (dominantSub) {
            case 'peso':
                return userData.weight 
                    ? `Tu peso registrado es de ${userData.weight} kg. ${getPesoRecomendacion(userData)}`
                    : "Aún no tengo registrado tu peso. ¿Te gustaría decirme cuál es tu peso actual en kilogramos?";
                
            case 'altura':
                return userData.height
                    ? `Tu altura registrada es de ${(userData.height/100).toFixed(2)} metros (${userData.height} cm).`
                    : "Aún no tengo registrada tu altura. ¿Te gustaría decirme cuál es tu altura en metros? (por ejemplo: 1.75)";
                
            case 'imc':
                if (!userData.weight || !userData.height) {
                    return "Para calcular tu IMC necesito tanto tu peso como tu altura. ¿Te gustaría proporcionarme esos datos?";
                }
                const bmi = calculateBMI(userData.weight, userData.height);
                const category = getBMICategory(bmi);
                return `Tu IMC actual es de ${bmi}, lo que indica ${category.toLowerCase()}. ${getBMIRecommendation(category)}\n\nRecuerda que el IMC es solo un indicador general y no tiene en cuenta factores como la composición corporal, la distribución de grasa o la masa muscular. Un deportista con mucha masa muscular puede tener un IMC elevado sin tener exceso de grasa.`;
                
            case 'calorias':
                if (!userData.weight || !userData.height || !userData.age || !userData.gender || !userData.activityLevel) {
                    return "Para calcular tus calorías necesito más información sobre ti. ¿Quieres completar tu perfil?";
                }
                const calories = calculateCalorieNeeds(userData);
                const tdee = calculateTDEE(userData);
                const bmr = calculateBMR(userData);
                
                return `Basado en tus datos, tus necesidades calóricas son:\n\n• Metabolismo basal (BMR): ${Math.round(bmr)} calorías - Son las calorías que tu cuerpo necesita en reposo completo.\n\n• Gasto energético total (TDEE): ${tdee} calorías - Este es tu consumo diario total considerando tu nivel de actividad "${userData.activityLevel}".\n\n• Calorías recomendadas para tu objetivo de "${userData.goal}": ${calories} calorías diarias.\n\n¿Quieres ver cómo distribuir estas calorías en macronutrientes o en comidas a lo largo del día?`;
                
            case 'agua':
                if (!userData.weight) {
                    return "Para calcular tu consumo recomendado de agua necesito saber tu peso. ¿Podrías decirme cuánto pesas?";
                }
                const water = calculateWaterNeeds(userData.weight, userData.activityLevel || 'moderada');
                return `Te recomiendo consumir aproximadamente ${water} litros de agua al día, basado en tu peso de ${userData.weight} kg y nivel de actividad "${userData.activityLevel || 'moderada'}".\n\nEsta cantidad puede variar según el clima, intensidad del ejercicio y tu dieta. Recuerda que frutas y verduras también aportan agua. Una buena forma de verificar tu hidratación es observar el color de tu orina - debe ser amarillo claro, no oscuro ni demasiado concentrado.\n\n¿Te gustaría algunos consejos para mantenerte bien hidratado?`;
        }
    }
    
    // Respuestas para planes nutricionales
    else if (dominant === 'nutritionPlans') {
        if (!userData.weight || !userData.height || !userData.age || !userData.gender || !userData.activityLevel || !userData.goal) {
            return "Para darte un plan nutricional personalizado, necesito más información sobre ti. ¿Te gustaría completar tu perfil respondiendo algunas preguntas básicas como peso, altura, edad, género, nivel de actividad y objetivo?";
        }
        
        switch (dominantSub) {
            case 'planGeneral':
                // Utilizar la función existente si ya tenemos datos completos
                return `Estoy preparando tu plan nutricional personalizado...\n\n${generateNutritionalDiagnosis(userData)}\n\n¿Te gustaría ver un plan detallado de comidas basado en estas recomendaciones?`;
                
            case 'perderPeso':
                if (userData.goal !== 'perder peso') {
                    return "Noto que estás interesado en perder peso, pero tu objetivo actual está configurado como \"" + userData.goal + "\". ¿Te gustaría cambiar tu objetivo a \"perder peso\"?";
                }
                
                const perosoRecomendaciones = `
Para perder peso de forma saludable y sostenible:

1️⃣ DÉFICIT CALÓRICO MODERADO
   • Apunta a un déficit de 300-500 kcal/día para perder 0.3-0.5 kg por semana
   • Evita déficits extremos que comprometan nutrientes y masa muscular
   
2️⃣ PRIORIZA PROTEÍNAS (${Math.round(userData.weight * 1.8)}-${Math.round(userData.weight * 2.2)}g diarios)
   • Distribuye la proteína en todas las comidas (20-30g por comida)
   • Fuentes recomendadas: carnes magras, pescado, huevos, lácteos bajos en grasa, legumbres
   
3️⃣ SELECCIÓN INTELIGENTE DE CARBOHIDRATOS
   • Prioriza fuentes ricas en fibra y de bajo índice glucémico
   • Ajusta según tu nivel de actividad: más en días de entrenamiento
   
4️⃣ INCLUYE GRASAS SALUDABLES
   • 0.8-1g por kg de peso corporal (${Math.round(userData.weight * 0.8)}-${userData.weight}g)
   • Fuentes: aguacate, aceite de oliva, frutos secos, pescados grasos
   
5️⃣ HIDRATACIÓN Y ESTRATEGIAS PRÁCTICAS
   • Bebe ${calculateWaterNeeds(userData.weight, userData.activityLevel)} litros de agua diarios
   • Consume alimentos saciantes con alto volumen y bajo aporte calórico
   • Planifica comidas con anticipación para evitar decisiones impulsivas

¿Te gustaría un plan de comidas más detallado basado en estas pautas?`;
                
                return perosoRecomendaciones;
                
            case 'ganarPeso':
                if (userData.goal !== 'ganar peso') {
                    return "Veo que estás interesado en ganar peso, pero tu objetivo actual está configurado como \"" + userData.goal + "\". ¿Te gustaría cambiar tu objetivo a \"ganar peso\"?";
                }
                
                const ganarPesoRecomendaciones = `
Para ganar peso de forma saludable y maximizar ganancia muscular:

1️⃣ SUPERÁVIT CALÓRICO ESTRATÉGICO
   • Aumenta 300-500 kcal/día sobre tu gasto energético total
   • Busca ganar 0.25-0.5 kg por semana (más podría significar más grasa)
   
2️⃣ OPTIMIZA INGESTA PROTEICA (${Math.round(userData.weight * 1.6)}-${Math.round(userData.weight * 2.0)}g diarios)
   • Mantén 1.6-2.0g por kg de peso corporal
   • Asegura 30-40g de proteína de alta calidad post-entrenamiento
   
3️⃣ INCREMENTA CARBOHIDRATOS ESTRATÉGICAMENTE
   • Prioriza días de entrenamiento para mayor ingesta de carbos
   • Fuentes: arroz, pasta, avena, patatas, frutas
   
4️⃣ NO DESCUIDES GRASAS SALUDABLES
   • Mantén 0.8-1g por kg para optimizar hormonas anabólicas
   
5️⃣ ESTRATEGIAS PRÁCTICAS
   • Incrementa densidad calórica: frutos secos, aceites saludables, aguacate
   • Considera 5-6 comidas en lugar de 3 si te cuesta consumir suficientes calorías
   • Batidos altos en calorías pueden complementar (no sustituir) comidas sólidas
   • Mantén progresión en entrenamiento de fuerza para optimizar ganancia muscular
   • Duerme 7-9 horas para maximizar recuperación y síntesis proteica

¿Te gustaría un plan detallado de comidas y las cantidades específicas para tu objetivo?`;
                
                return ganarPesoRecomendaciones;
                
            case 'mantenerPeso':
                if (userData.goal !== 'mantener peso') {
                    return "Noto que estás interesado en mantener tu peso, pero tu objetivo actual está configurado como \"" + userData.goal + "\". ¿Te gustaría cambiar tu objetivo a \"mantener peso\"?";
                }
                
                const mantenerPesoRecomendaciones = `
Para mantener tu peso y optimizar tu composición corporal:

1️⃣ EQUILIBRIO ENERGÉTICO
   • Consume aproximadamente ${calculateTDEE(userData)} calorías diarias
   • Ajusta según cambios en actividad física o composición corporal
   
2️⃣ DISTRIBUCIÓN BALANCEADA DE MACRONUTRIENTES
   • Proteínas: ${Math.round(userData.weight * 1.6)}-${Math.round(userData.weight * 1.8)}g (1.6-1.8g/kg)
   • Carbohidratos: ${Math.round(calculateTDEE(userData) * 0.45 / 4)}-${Math.round(calculateTDEE(userData) * 0.55 / 4)}g (45-55% de calorías)
   • Grasas: ${Math.round(calculateTDEE(userData) * 0.25 / 9)}-${Math.round(calculateTDEE(userData) * 0.35 / 9)}g (25-35% de calorías)
   
3️⃣ HORARIOS REGULARES DE COMIDAS
   • Establece patrones consistentes para regular el apetito
   • 3-5 comidas repartidas a lo largo del día
   
4️⃣ VARIEDAD NUTRICIONAL
   • Diversifica fuentes de alimentos para cubrir micronutrientes
   • 5+ porciones de frutas y verduras diarias
   
5️⃣ ALIMENTACIÓN INTUITIVA
   • Aprende a reconocer hambre y saciedad reales
   • Ajusta porciones según necesidades diarias
   • Encuentra equilibrio entre disciplina y flexibilidad social

¿Te gustaría un plan específico de comidas o más información sobre algún aspecto concreto?`;
                
                return mantenerPesoRecomendaciones;
        }
    }
    
    // Respuestas para alimentos
    else if (dominant === 'foods') {
        switch (dominantSub) {
            case 'proteinas':
                return `Las proteínas son fundamentales para la construcción y reparación muscular, función inmunológica y producción de enzimas y hormonas.

🥚 FUENTES PRINCIPALES:
- Animal: carnes magras, huevos, pescado, lácteos bajos en grasa
- Vegetal: legumbres, tofu, tempeh, seitan, quinoa
- Suplementos: proteína de suero, caseína, proteínas vegetales

📊 RECOMENDACIONES SEGÚN OBJETIVO:
- Para tu objetivo de ${userData.goal || "alimentación equilibrada"}: ${userData.goal === 'perder peso' ? '1.8-2.2g' : userData.goal === 'ganar peso' ? '1.6-2.0g' : '1.4-1.8g'} por kg de peso corporal
- Para ti, aproximadamente ${userData.weight ? Math.round(userData.weight * (userData.goal === 'perder peso' ? 2.0 : userData.goal === 'ganar peso' ? 1.8 : 1.6)) + '-' + Math.round(userData.weight * (userData.goal === 'perder peso' ? 2.2 : userData.goal === 'ganar peso' ? 2.0 : 1.8)) : '1.6-2.0g por kg de peso'} gramos diarios
- Distribución: 20-40g por comida distribuidos uniformemente

🔑 BENEFICIOS CLAVE:
- Mayor saciedad y preservación de masa muscular (vital para pérdida de peso)
- Mejora en recuperación post-ejercicio y desarrollo muscular
- Mayor termogénesis (gasto energético en digestión)

¿Te gustaría información más específica o recomendaciones prácticas para incorporar proteínas en tu dieta?`;
                
            case 'carbohidratos':
                return `Los carbohidratos son la principal fuente de energía para el cuerpo y el cerebro. Son esenciales para el rendimiento físico y mental.

🌾 TIPOS DE CARBOHIDRATOS:
- Simples: absorción rápida (frutas, miel, azúcares)
- Complejos: absorción lenta (granos enteros, legumbres, tubérculos)
- Fibra: no digerible, esencial para salud intestinal

📊 RECOMENDACIONES SEGÚN OBJETIVO:
- Para tu objetivo de ${userData.goal || "alimentación equilibrada"}: ${userData.goal === 'perder peso' ? '2-3g' : userData.goal === 'ganar peso' ? '4-6g' : '3-5g'} por kg de peso corporal
- Para ti, aproximadamente ${userData.weight ? Math.round(userData.weight * (userData.goal === 'perder peso' ? 2.5 : userData.goal === 'ganar peso' ? 5 : 4)) + '-' + Math.round(userData.weight * (userData.goal === 'perder peso' ? 3 : userData.goal === 'ganar peso' ? 6 : 5)) : '3-5g por kg de peso'} gramos diarios
- Distribución: Mayor proporción en desayuno y alrededor del ejercicio, menor en cena

🔰 FUENTES RECOMENDADAS:
- Prioridad alta: avena, quinoa, arroz integral, batata, legumbres, frutas
- Consumo moderado: pan integral, pasta integral, cereales mínimamente procesados
- Limitar: azúcares refinados, harinas blancas, dulces, bebidas azucaradas

¿Quieres saber cómo adaptar tu consumo de carbohidratos según tus entrenamientos o actividad diaria?`;
                
            case 'grasas':
                return `Las grasas saludables son esenciales para la absorción de vitaminas liposolubles, producción hormonal, salud cerebral y función celular.

🥑 TIPOS DE GRASAS:
- Monoinsaturadas: aceite de oliva, aguacate, frutos secos
- Poliinsaturadas: pescados grasos (omega-3), semillas de lino, chía
- Saturadas: coco, mantequilla, carnes (consumo moderado)
- Trans: alimentos ultraprocesados (evitar)

📊 RECOMENDACIONES:
- Para una dieta equilibrada: 0.8-1g por kg de peso corporal
- Para ti, aproximadamente ${userData.weight ? Math.round(userData.weight * 0.8) + '-' + Math.round(userData.weight * 1.0) : '0.8-1g por kg de peso'} gramos diarios
- Representan 25-35% de tus calorías totales

🔑 BENEFICIOS CLAVE:
- Mejoran la absorción de vitaminas A, D, E y K
- Promueven la saciedad y estabilizan niveles de glucosa
- Ácidos grasos esenciales para función cerebral
- Los omega-3 tienen propiedades antiinflamatorias

⚠️ CONSIDERACIONES:
- Son más calóricamente densas (9 kcal/g vs 4 kcal/g de proteínas y carbos)
- Prioriza grasas insaturadas sobre saturadas
- Evita grasas trans e hidrogenadas de alimentos procesados

¿Te gustaría saber cómo incorporar más grasas saludables a tu alimentación diaria?`;
                
            case 'vegetales':
                return `Las verduras son fundamentales en cualquier dieta saludable por su densidad nutricional, bajo aporte calórico y alto contenido en fibra, vitaminas y minerales.

🥬 BENEFICIOS PRINCIPALES:
- Alta concentración de micronutrientes (vitaminas, minerales, antioxidantes)
- Fibra para salud digestiva y microbiota intestinal
- Bajo índice glucémico para estabilidad energética
- Volumen que promueve saciedad con pocas calorías
- Propiedades antiinflamatorias y antioxidantes

🎯 RECOMENDACIONES:
- Consumo diario: 3-5 porciones (1 taza crudas o ½ taza cocidas)
- Variedad de colores: cada color aporta distintos fitoquímicos
- Métodos de cocción: al vapor, salteado, horneado (preserva más nutrientes)
- Especialmente importante para ${userData.goal === 'perder peso' ? 'pérdida de peso por su bajo aporte calórico y alto poder saciante' : userData.goal === 'ganar peso' ? 'ganancia de peso saludable, asegurando suficientes micronutrientes' : 'mantener óptima salud general'}

🔝 VERDURAS DESTACADAS:
- Crucíferas (brócoli, col rizada): compuestos anticancerígenos
- Vegetales de hoja verde: hierro, calcio, folatos
- Coloridas (pimientos, tomates): antioxidantes
- Raíces y tubérculos: prebióticos para salud intestinal

¿Te gustaría algunas ideas prácticas para incluir más vegetales en tu dieta diaria?`;
                
            case 'frutas':
                return `Las frutas son excelentes fuentes de vitaminas, minerales, antioxidantes y fibra, con el beneficio adicional de un sabor naturalmente dulce.

🍎 BENEFICIOS PRINCIPALES:
- Ricas en vitaminas (especialmente C, A, folatos)
- Antioxidantes que combaten estrés oxidativo
- Fibra soluble e insoluble para salud digestiva
- Hidratación por su alto contenido de agua
- Micronutrientes esenciales para función inmune

📊 RECOMENDACIONES:
- Consumo diario: 2-3 porciones (1 pieza mediana o 1 taza de fruta cortada)
- Variedad: diferentes frutas aportan distintos nutrientes
- Temporada: mayor valor nutricional y sabor
- Consideraciones según objetivo: ${userData.goal === 'perder peso' ? 'prioriza frutas con menor índice glucémico como bayas, manzana, pera' : userData.goal === 'ganar peso' ? 'incluye frutas más calóricas como plátano, mango, uvas' : 'equilibrio entre variedad de frutas para obtener amplio espectro nutricional'}

💡 ESTRATEGIAS PRÁCTICAS:
- Combínalas con proteínas o grasas saludables para reducir impacto glucémico
- Incluye fruta en desayunos o snacks (no solo como postre)
- Frutas congeladas: convenientes para batidos y duraderas
- La fruta entera es preferible a zumos (conserva fibra y aumenta saciedad)

¿Te gustaría recomendaciones específicas de frutas para tu objetivo de ${userData.goal || "alimentación saludable"}?`;
        }
    }
    
    // Respuestas para ejercicio
    else if (dominant === 'exercise') {
        switch (dominantSub) {
            case 'cardio':
                return `El ejercicio cardiovascular es excelente para la salud del corazón, sistema respiratorio y para ${userData.goal === 'perder peso' ? 'aumentar el gasto calórico diario' : userData.goal === 'ganar peso' ? 'mejorar la recuperación y salud general' : 'mantener un buen nivel de fitness'}.

🏃 RECOMENDACIONES PARA ${userData.goal.toUpperCase() || "BIENESTAR GENERAL"}:
${userData.goal === 'perder peso' ? 
'• Frecuencia: 3-5 sesiones semanales de 30-45 minutos\n• Combina intensidades: 2-3 sesiones moderadas (puedes mantener una conversación) y 1-2 sesiones de alta intensidad (HIIT)\n• Zona de quema de grasa: mantén frecuencia cardíaca entre 65-75% de tu FCM\n• Momento óptimo: preferiblemente en ayunas o 3+ horas después de comer para mayor oxidación de grasas' 
: userData.goal === 'ganar peso' ? 
'• Frecuencia: 2-3 sesiones semanales de 20-30 minutos\n• Intensidad: moderada, para mantener salud cardiovascular sin interferir con la recuperación muscular\n• Timing: separa sesiones de cardio y fuerza, idealmente en días diferentes\n• Tipo: prioriza cardio de bajo impacto como ciclismo o elíptica para preservar energía para entrenamiento de fuerza' 
: 
'• Frecuencia: 2-4 sesiones semanales de 30 minutos\n• Combina distintos tipos: caminar, correr, nadar, ciclismo\n• Incluye una sesión de intervalos para mejorar capacidad aeróbica\n• Busca actividades que disfrutes para mayor adherencia'}

🔄 BENEFICIOS ESPECÍFICOS:
- Mejora capacidad cardiovascular y respiratoria
- Aumenta metabolismo durante y después del ejercicio
- Reduce estrés y mejora calidad del sueño
- Mejora sensibilidad a la insulina
${userData.goal === 'perder peso' ? '• Aumenta el déficit calórico necesario para pérdida de peso\n• El HIIT puede maximizar la quema de calorías en menos tiempo' : userData.goal === 'ganar peso' ? '• Mejora recuperación muscular y circulación sanguínea\n• Aumenta capacidad de trabajo en entrenamientos de fuerza' : '• Mantiene un equilibrio entre diferentes sistemas energéticos\n• Versatilidad en intensidades y modalidades'}

💡 CONSEJO NUTRICIONAL:
Para optimizar el rendimiento en cardio, considera ${userData.goal === 'perder peso' ? 'ejercicio en ayunas para sesiones de baja intensidad o un pequeño snack (100-200 kcal) rico en carbohidratos simples antes de sesiones intensas' : userData.goal === 'ganar peso' ? 'mantener una ingesta adecuada de carbohidratos (5-7g/kg) para preservar glucógeno muscular' : 'adaptar carbohidratos según duración e intensidad del ejercicio'}

¿Te gustaría un plan más detallado de cardio adaptado específicamente a tu objetivo?`;
                
            case 'fuerza':
                return `El entrenamiento de fuerza es fundamental para ${userData.goal === 'perder peso' ? 'preservar la masa muscular durante el déficit calórico' : userData.goal === 'ganar peso' ? 'estimular el crecimiento muscular' : 'mantener una buena composición corporal'} y mejorar la salud metabólica.

🏋️ RECOMENDACIONES PARA ${userData.goal.toUpperCase() || "BIENESTAR GENERAL"}:
${userData.goal === 'perder peso' ? 
'• Frecuencia: 2-3 sesiones semanales enfocadas en ejercicios compuestos\n• Series y repeticiones: 3-4 series de 10-15 repeticiones por ejercicio\n• Descanso: 30-60 segundos entre series para mayor gasto calórico\n• Estructura: circuitos de cuerpo completo son ideales para maximizar quema calórica' 
: userData.goal === 'ganar peso' ? 
'• Frecuencia: 4-5 sesiones semanales con división por grupos musculares\n• Series y repeticiones: 3-5 series de 6-12 repeticiones por ejercicio\n• Descanso: 1.5-3 minutos entre series para maximizar rendimiento\n• Estructura: prioriza sobrecarga progresiva y ejercicios compuestos (sentadilla, peso muerto, press banca, dominadas)' 
: 
'• Frecuencia: 2-3 sesiones semanales alternando grupos musculares\n• Series y repeticiones: 2-4 series de 8-12 repeticiones\n• Combina ejercicios compuestos y aislados\n• Mantén progresión gradual para estimular adaptaciones continuas'}

🔍 BENEFICIOS ESPECÍFICOS:
- Aumenta o preserva masa muscular según tu objetivo
- Mejora metabolismo basal (más calorías quemadas en reposo)
- Fortalece huesos y previene pérdida de densidad ósea
- Mejora postura, equilibrio y capacidad funcional
${userData.goal === 'perder peso' ? '• Crucial para mantener tasa metabólica durante déficit calórico\n• Contribuye a mejor definición corporal al perder peso' : userData.goal === 'ganar peso' ? '• Hipertrofia muscular para aumento de peso saludable\n• Mejora capacidad de almacenar glucógeno' : '• Mantiene un perfil hormonal saludable\n• Previene sarcopenia asociada a la edad'}

🍽️ NUTRICIÓN PERIWORKOUT:
- ${userData.goal === 'perder peso' ? 'Proteína pre y post entrenamiento (20-25g) para preservación muscular' : userData.goal === 'ganar peso' ? 'Comida completa 2 horas antes (proteína + carbos) y snack post-entreno inmediato (proteína + carbos rápidos)' : 'Balance de proteínas y carbohidratos antes y después del entrenamiento'}
- Hidratación adecuada antes, durante y después

¿Te gustaría un programa específico de entrenamiento de fuerza adaptado a tu objetivo?`;
                
            case 'flexibilidad':
                return `Los ejercicios de flexibilidad y movilidad son importantes para prevenir lesiones, mejorar el rendimiento físico y mantener una buena funcionalidad corporal a largo plazo.

🧘 BENEFICIOS CLAVE:
- Aumenta rango de movimiento articular
- Reduce rigidez muscular y mejora circulación
- Previene lesiones durante otros tipos de ejercicio
- Mejora la postura y reduce dolores asociados
- Favorece la recuperación muscular
- Reduce estrés y promueve relajación

📋 RECOMENDACIONES GENERALES:
- Frecuencia: 2-3 sesiones semanales dedicadas o 5-10 minutos diarios
- Duración de estiramientos: 20-30 segundos por posición (estático)
- Temperatura: preferiblemente con músculos calientes (post-ejercicio)
- Respiración: lenta y controlada, profundizando con la exhalación

🔄 TIPOS DE TRABAJO:
- Estiramientos estáticos: mantener posición
- Estiramientos dinámicos: movimientos controlados (ideal pre-ejercicio)
- Yoga: combina fuerza, equilibrio y flexibilidad
- Pilates: énfasis en core y control postural
- Foam rolling: liberación miofascial para reducir tensión

💡 ADAPTACIÓN SEGÚN OBJETIVO:
${userData.goal === 'perder peso' ? '• Yoga dinámico o power yoga para combinar trabajo de flexibilidad con gasto calórico\n• Incorporar movimientos funcionales que preparen el cuerpo para otras actividades físicas' : userData.goal === 'ganar peso' ? '• Estiramientos específicos para grupos musculares trabajados en fuerza\n• Enfoque en movilidad articular para mejorar técnica en ejercicios compuestos' : '• Equilibrio entre todas las modalidades para un desarrollo integral\n• Adaptar según limitaciones o necesidades específicas'}

¿Te gustaría una rutina básica de flexibilidad o recomendaciones para mejorar áreas específicas?`;
                
            case 'planEjercicio':
                return getExercisePlanByGoal(userData.goal || "general");
        }
    }
    
    // Respuestas para salud general
    else if (dominant === 'health') {
        switch (dominantSub) {
            case 'descanso':
                return `El descanso adecuado es un pilar fundamental para cualquier objetivo de salud y nutrición, tan importante como la dieta y el ejercicio.

😴 IMPORTANCIA DEL SUEÑO PARA NUTRICIÓN:
- Regulación de hormonas del hambre (grelina y leptina)
- Optimización de recuperación muscular y síntesis proteica
- Control de cortisol (hormona del estrés) que afecta almacenamiento de grasa
- Estabilización de niveles de glucosa e insulina
- Influencia en decisiones alimentarias del día siguiente

📋 RECOMENDACIONES ESPECÍFICAS:
- Duración: 7-9 horas por noche para adultos
- Consistencia: mantener horarios regulares, incluso en fines de semana
- Ambiente: habitación oscura, fresca (18-20°C) y libre de dispositivos electrónicos
- Ritual nocturno: actividades relajantes 30-60 minutos antes de dormir

🔄 IMPACTO SEGÚN TU OBJETIVO:
${userData.goal === 'perder peso' ? 
'• La privación de sueño aumenta antojos por alimentos calóricos y procesados\n• Dormir menos de 7 horas se asocia con mayor dificultad para perder grasa\n• El descanso adecuado optimiza los niveles de leptina, hormona que señala saciedad' 
: userData.goal === 'ganar peso' ? 
'• Durante el sueño profundo se secreta hormona del crecimiento, esencial para desarrollo muscular\n• Recuperación entre sesiones de entrenamiento para permitir hipertrofia\n• Mayor capacidad de rendimiento para entrenamientos intensos' 
: 
'• Equilibrio hormonal para mantener composición corporal\n• Mejor recuperación para mantener consistencia en actividad física\n• Menor probabilidad de compensación con alimentos calóricos'}

🍽️ CONSIDERACIONES NUTRICIONALES PARA MEJORAR SUEÑO:
- Evitar comidas copiosas 2-3 horas antes de dormir
- Limitar cafeína después del mediodía
- Considerar alimentos ricos en triptófano, magnesio y melatonina (lácteos, plátanos, cerezas, nueces)
- Carbohidratos complejos en la cena pueden facilitar el sueño

¿Te gustaría consejos específicos para mejorar tu calidad de sueño o información sobre suplementos naturales que pueden ayudar?`;
                
            case 'estres':
                return `El estrés crónico puede afectar significativamente tus objetivos nutricionales a través de mecanismos hormonales, comportamentales y metabólicos.

⚠️ IMPACTO DEL ESTRÉS EN NUTRICIÓN:
- Aumento de cortisol, que puede promover almacenamiento de grasa abdominal
- Mayor tendencia a comer emocionalmente y buscar alimentos "reconfortantes"
- Alteración del apetito (aumento o disminución según el individuo)
- Empeoramiento de la digestión y absorción de nutrientes
- Perturbación del sueño, creando un ciclo negativo

📋 ESTRATEGIAS DE MANEJO:
- Técnicas de respiración: 5-10 minutos diarios de respiración profunda
- Meditación/mindfulness: práctica regular, incluso 5 minutos son beneficiosos
- Actividad física regular: caminar, yoga o ejercicio preferido
- Contacto social positivo: interacciones significativas con seres queridos
- Tiempo en naturaleza: exposición regular a entornos naturales
- Alimentación consciente: comer sin distracciones, prestando atención

🍽️ NUTRICIÓN ANTI-ESTRÉS:
- Evitar exceso de estimulantes (cafeína, alcohol)
- Mantener niveles estables de glucosa (comidas regulares, balanceadas)
- Alimentos ricos en magnesio: verdes oscuros, nueces, semillas
- Alimentos ricos en omega-3: pescados grasos, semillas de lino, nueces
- Prebióticos y probióticos para el eje intestino-cerebro

🔄 CONSIDERACIONES SEGÚN TU OBJETIVO:
${userData.goal === 'perder peso' ? 
'• El estrés crónico puede dificultar la pérdida de peso incluso en déficit calórico\n• Durante períodos de alto estrés, considera mantener calorías en lugar de reducirlas\n• Técnicas de gestión emocional para evitar alimentación por estrés' 
: userData.goal === 'ganar peso' ? 
'• El estrés puede limitar ganancias musculares incluso con entrenamiento óptimo\n• Los altos niveles de cortisol pueden ser catabólicos (destruyen músculo)\n• Prioriza recuperación y manejo de estrés entre sesiones intensas' 
: 
'• Equilibrio entre actividad y recuperación\n• Adaptación de intensidad de entrenamiento según niveles de estrés\n• Nutrición regular y balanceada para estabilidad energética'}

¿Te gustaría técnicas específicas para gestionar el estrés o recomendaciones sobre alimentos que pueden ayudar a regularlo?`;
                
            case 'suplementos':
                return `Los suplementos nutricionales pueden complementar (nunca sustituir) una alimentación balanceada. Su utilidad depende de tus necesidades individuales, deficiencias específicas y objetivos.

💊 CONSIDERACIONES GENERALES:
- Prioriza siempre alimentos reales sobre suplementos
- Consulta con profesionales antes de iniciar suplementación
- La calidad y pureza varían significativamente entre marcas
- Evalúa si realmente necesitas cada suplemento (análisis de sangre pueden ayudar)
- Lo que funciona para otros puede no funcionar para ti

🎯 SUPLEMENTOS SEGÚN OBJETIVO:
${userData.goal === 'perder peso' ? 
'• Proteína en polvo: ayuda a mantener saciedad y preservar masa muscular\n• Fibra: aumenta sensación de plenitud y mejora digestión\n• Cafeína (pre-entrenamiento): puede aumentar ligeramente metabolismo y rendimiento\n• L-carnitina: puede ayudar en transporte de ácidos grasos (evidencia mixta)\n• Té verde: leve efecto termogénico (impacto modesto)'
: userData.goal === 'ganar peso' ? 
'• Proteína en polvo: facilita alcanzar altos requerimientos proteicos\n• Creatina monohidrato: mejora rendimiento y volumización muscular (5g diarios)\n• Carbohidratos en polvo: para recuperación post-entreno\n• HMB: puede ayudar en recuperación muscular (más útil en principiantes)\n• Ganancias de peso (solo si cuesta aumentar calorías con comida sólida)'
: 
'• Multivitamínico: como seguro nutricional (no reemplaza alimentación variada)\n• Omega-3: si consumo de pescado es bajo\n• Vitamina D: si exposición solar es limitada\n• Magnesio: para recuperación muscular y calidad de sueño\n• Probióticos: para salud intestinal'}

⚠️ SUPLEMENTOS SOBREVALORADOS:
- "Quemadores de grasa" milagrosos
- BCAA si ya consumes suficiente proteína completa
- Multivitamínicos genéricos de baja calidad
- Detox o limpiezas (tu hígado y riñones ya hacen este trabajo)

💡 RECOMENDACIÓN PRÁCTICA:
Considera estos 3 pasos: 1) Optimiza tu alimentación primero, 2) Identifica deficiencias específicas (idealmente con análisis), 3) Suplementa de forma dirigida y reevalúa periódicamente.

¿Te gustaría información más detallada sobre algún suplemento específico para tu objetivo?`;
        }
    }
    
    // Respuestas para metabolismo
    else if (dominant === 'metabolism') {
        switch (dominantSub) {
            case 'metabolismo':
                return `El metabolismo es el conjunto de procesos bioquímicos que transforman los alimentos en energía y componentes celulares, y está influenciado por múltiples factores.

⚙️ COMPONENTES DEL GASTO ENERGÉTICO:
- Metabolismo basal (BMR): 60-70% del gasto (energía para funciones vitales en reposo)
- Actividad física: 15-30% (ejercicio + actividad diaria no estructurada)
- Efecto térmico de los alimentos: 10% (energía para digerir y procesar alimentos)

Para ti, según tus datos, tu metabolismo basal estimado es de aproximadamente ${userData.weight && userData.height && userData.age && userData.gender ? Math.round(calculateBMR(userData)) : '1400-1800'} calorías diarias.

🔍 FACTORES QUE INFLUYEN:
- Masa muscular (más músculo = mayor gasto energético)
- Edad (disminuye 2-3% por década después de los 30)
- Género (hombres tienden a tener mayor BMR que mujeres)
- Genética (hasta 10% de variabilidad)
- Hormonas (tiroides, insulina, leptina, etc.)
- Temperatura ambiente (frío moderado puede aumentar gasto)

🔄 ESTRATEGIAS PARA OPTIMIZAR:
- Entrenamiento de fuerza: 2-3 sesiones semanales aumentan masa muscular
- Proteína adecuada: ${userData.weight ? (Math.round(userData.weight * 1.6) + '-' + Math.round(userData.weight * 2.0)) : '1.6-2.0g por kg'} para preservar/aumentar músculo
- NEAT (actividad no estructurada): aumentar movimiento diario, evitar sedentarismo
- Comidas regulares: 3-5 comidas distribuidas evitando ayunos muy prolongados
- Descanso: 7-9 horas para optimizar hormonas metabólicas
- Manejo del estrés: cortisol elevado puede ralentizar metabolismo

⚠️ MITOS A EVITAR:
- "Metabolismo dañado" permanente por dietas restrictivas
- Alimentos o suplementos "aceleradores del metabolismo" milagrosos
- Comer muy frecuentemente (6+ veces) para "mantener el metabolismo activo"

${userData.goal === 'perder peso' ? 
'💡 Para pérdida de peso: evita déficits calóricos extremos (no más del 20-25%) que pueden disminuir tu metabolismo. Preserva masa muscular con proteína adecuada y entrenamiento de fuerza.' 
: userData.goal === 'ganar peso' ? 
'💡 Para ganancia de peso: aprovecha el efecto térmico de los alimentos consumiendo proteínas de calidad. El entrenamiento de fuerza optimizará qué tipo de peso ganas (músculo vs grasa).'
: 
'💡 Para mantenimiento: monitorea cambios en composición corporal más que en peso. La masa muscular es metabólicamente más activa que la grasa.'}

¿Te gustaría información más específica sobre cómo adaptar tu alimentación para optimizar tu metabolismo?`;
                
            case 'digestión':
                return `Una digestión saludable es fundamental para la absorción de nutrientes y el bienestar general, con impacto directo en tus objetivos nutricionales.

🔍 COMPONENTES CLAVE:
- Enzimas digestivas: descomponen alimentos en nutrientes utilizables
- Microbiota intestinal: trillones de microorganismos que afectan digestión e inmunidad
- Motilidad: movimientos que transportan alimentos a lo largo del tracto digestivo
- Ácidos estomacales: inician digestión de proteínas y eliminan patógenos
- Barrera intestinal: determina qué puede pasar del intestino al torrente sanguíneo

🍽️ ESTRATEGIAS PARA MEJORAR DIGESTIÓN:
- Masticar completamente (30+ veces por bocado ideal)
- Comer sin distracciones (mindfulness)
- Hidratación adecuada (1 vaso 30 min antes de comidas)
- Incluir fibra gradualmente (25-35g diarios)
- Fermentados naturales (yogur, kéfir, chucrut)
- Actividad física regular
- Gestión del estrés (sistema nervioso entérico)

🌱 ALIMENTOS PRO-DIGESTIÓN:
- Prebióticos: alimentan bacterias beneficiosas (alcachofas, cebollas, ajo, puerros, plátanos verdes)
- Probióticos: organismos vivos beneficiosos (yogur, kéfir, kombucha)
- Enzimáticos: piña (bromelina), papaya (papaína), jengibre, mango verde
- Antiinflamatorios: cúrcuma, frutas de bosque, té verde

⚠️ ALIMENTOS POTENCIALMENTE PROBLEMÁTICOS:
- Muy procesados o altos en grasas industriales
- Exceso de gluten para personas sensibles
- Lácteos en intolerantes a lactosa
- FODMAP en personas con síndrome de intestino irritable
- Alcohol y cafeína en exceso

${userData.goal === 'perder peso' ? 
'💡 Para pérdida de peso: una buena digestión reduce hinchazón y gases que pueden confundirse con estancamiento de peso. Prioriza proteínas y fibra que aumentan saciedad sin comprometer digestión.' 
: userData.goal === 'ganar peso' ? 
'💡 Para ganancia de peso: optimizar la digestión permite consumir más alimentos sin malestar. Considera enzimas digestivas como suplemento si tienes dificultad con comidas grandes.'
: 
'💡 Para mantenimiento: experimenta con un diario alimentario para identificar alimentos que te causan malestar. La sensibilidad a ciertos alimentos varía enormemente entre individuos.'}

¿Te gustaría recomendaciones más específicas para algún problema digestivo concreto o sobre alimentos que podrían beneficiar tu microbiota?`;
                
            case 'ayuno':
                return `El ayuno intermitente es un patrón alimentario que alterna períodos de alimentación con períodos de restricción calórica, y puede ser una herramienta para ciertos objetivos.

⏱️ PROTOCOLOS COMUNES:
- 16/8: 16 horas de ayuno, 8 horas de alimentación (p.ej. comer solo de 12pm a 8pm)
- 5:2: 5 días de alimentación normal, 2 días no consecutivos de restricción (500-600 kcal)
- Ayuno en días alternos: un día normal, un día de ayuno/restricción severa
- OMAD: Una comida al día (ventana alimentaria de 1-2 horas)

✅ POTENCIALES BENEFICIOS:
- Mejora en sensibilidad a la insulina
- Facilita adherencia a déficit calórico para algunas personas
- Potencial aumento en autofagia (reciclado celular)
- Simplificación de planificación de comidas
- Posibles efectos antiinflamatorios

⚠️ CONSIDERACIONES IMPORTANTES:
- No es superior a otras estrategias si las calorías totales son iguales
- Puede dificultar consumo adecuado de proteínas y micronutrientes
- No recomendado para embarazadas, adolescentes en crecimiento, personas con historial de trastornos alimentarios
- Puede afectar negativamente rendimiento en entrenamientos intensos
- Efectos varían significativamente entre individuos

${userData.goal === 'perder peso' ? 
'💡 Para pérdida de peso: puede ser una herramienta útil para crear déficit calórico al reducir el número de comidas, pero NO es mágico. Monitorea que consumas suficiente proteína (${userData.weight ? Math.round(userData.weight * 1.8) : "1.8g/kg"}/día) durante tu ventana alimentaria.' 
: userData.goal === 'ganar peso' ? 
'💡 Para ganancia de peso: generalmente NO recomendado, ya que dificulta alcanzar superávit calórico y frecuencia proteica óptima. Si deseas implementarlo, considera ventanas alimentarias más amplias (10+ horas).'
: 
'💡 Para mantenimiento: puede ser incorporado flexiblemente para comodidad o preferencia personal. Adapta tu protocolo según tu agenda y sensaciones personales.'}

🔄 IMPLEMENTACIÓN PRÁCTICA:
- Comienza gradualmente (12h → 14h → 16h)
- Mantén hidratación adecuada durante ayuno
- Escucha a tu cuerpo (mareos, fatiga extrema son señales de alerta)
- Considera suplementación durante ventana alimentaria si es reducida

¿Te gustaría más información sobre cómo adaptar el ayuno intermitente a tu estilo de vida o ejercicio?`;
        }
    }
    
    // Respuestas para restricciones alimentarias
    else if (dominant === 'restrictions') {
        switch (dominantSub) {
            case 'celiaquía':
                return `La enfermedad celíaca es un trastorno autoinmune desencadenado por el consumo de gluten que requiere una dieta estrictamente libre de esta proteína.

🌾 ¿QUÉ ES EL GLUTEN?
- Proteína presente en trigo, cebada, centeno y derivados
- Ocasionalmente en avena por contaminación cruzada
- Se encuentra en múltiples alimentos procesados como espesante o aditivo

⚠️ ALIMENTOS A EVITAR TOTALMENTE:
- Trigo en todas sus variedades (común, espelta, kamut, bulgur)
- Cebada y malta
- Centeno
- Triticale (híbrido de trigo y centeno)
- Productos derivados: pan, pasta, bollería, cerveza
- Alimentos procesados con gluten como ingrediente oculto

✅ ALIMENTOS SEGUROS:
- Arroz, maíz, quinoa, mijo, trigo sarraceno (alforfón), amaranto
- Legumbres puras
- Frutas y verduras frescas
- Carnes, pescados y huevos no procesados
- Lácteos naturales (leche, quesos sin aditivos)
- Frutos secos naturales

🔎 VIGILAR POSIBLE CONTAMINACIÓN CRUZADA:
- Avena (buscar certificada "sin gluten")
- Productos a granel
- Fritos en aceites compartidos
- Superficies de cocina compartidas
- Salsas y condimentos preparados

💡 CONSEJOS PRÁCTICOS:
- Buscar certificación "sin gluten" en etiquetas
- Cocinar desde cero con ingredientes naturales
- Mantener utensilios separados si hay convivencia con consumidores de gluten
- Informarse bien en restaurantes (comunicación clara)
- Considerar suplementación inicial de hierro, B12, vitamina D, calcio (bajo supervisión)

¿Te gustaría recibir más información sobre alternativas específicas para reemplazar alimentos con gluten o consejos para mantener una dieta equilibrada sin gluten?`;
                
            case 'lactosa':
                return `La intolerancia a la lactosa es la incapacidad parcial o completa para digerir la lactosa (azúcar de la leche) debido a la deficiencia de la enzima lactasa.

🥛 ALIMENTOS QUE CONTIENEN LACTOSA:
- Leche de vaca, cabra, oveja (cualquier mamífero)
- Yogur regular (los fermentados tienen menos)
- Helados y postres lácteos
- Quesos frescos (ricotta, cottage, queso crema)
- Salsas cremosas y bechamel
- Muchos productos procesados como ingrediente oculto

✅ ALTERNATIVAS SEGURAS:
- Bebidas vegetales: almendra, soja, avena, coco, arroz
- Yogures sin lactosa o vegetales
- Quesos muy curados (tienen lactosa mínima)
- Leche deslactosada (tratada con enzima lactasa)
- Mantequilla clarificada (ghee)
- Helados y postres vegetales

🔍 CONSIDERACIONES NUTRICIONALES:
- Asegurar suficiente calcio: verduras de hoja verde, semillas de sésamo, almendras, tofu
- Vitamina D: exposición solar adecuada o suplementación
- Vitamina B12: si se eliminan todos los lácteos
- Proteínas: compensar con otras fuentes animales o vegetales

💡 ESTRATEGIAS PRÁCTICAS:
- Enzimas lactasa como suplemento antes de comidas con lácteos
- Experimentar con tolerancia individual (varía enormemente)
- Introducir yogures fermentados y kéfir gradualmente (menos lactosa)
- Leer etiquetas (lactosa aparece en múltiples formas)
- Probar quesos duros curados (parmesano, manchego añejo)

${userData.goal === 'perder peso' ? 
'🎯 Para tu objetivo de pérdida de peso: las alternativas vegetales suelen ser menos calóricas que sus equivalentes lácteos. El yogur griego sin lactosa puede ser excelente opción proteica de baja densidad calórica.' 
: userData.goal === 'ganar peso' ? 
'🎯 Para tu objetivo de ganancia de peso: asegura que las alternativas vegetales sean fortificadas. Considera batidos proteicos con base de leche sin lactosa para mayor densidad calórica.'
: 
'🎯 Para mantenimiento de peso: equilibra tus alternativas asegurando similar aporte proteico y calcio que los lácteos tradicionales.'}

¿Te gustaría más información sobre productos específicos sin lactosa o recetas adaptadas?`;
                
            case 'vegetarianismo':
                return `La dieta vegetariana excluye carnes pero puede incluir otros productos de origen animal como huevos y lácteos, dependiendo del tipo específico de vegetarianismo.

🥦 TIPOS DE VEGETARIANISMO:
- Ovo-lacto-vegetariano: incluye huevos y lácteos (más común)
- Lacto-vegetariano: incluye lácteos pero no huevos
- Ovo-vegetariano: incluye huevos pero no lácteos
- Pescetariano: incluye pescado pero no otras carnes

🔍 NUTRIENTES A VIGILAR:
- Proteínas completas: combinar fuentes vegetales
- Hierro: menos biodisponible en plantas (consume con vitamina C)
- Vitamina B12: limitada en fuentes vegetales
- Omega-3: obtener de huevos enriquecidos, semillas de lino, chía, nueces
- Zinc: legumbres, frutos secos, semillas, lácteos
- Calcio: lácteos, vegetales de hoja verde, tofu

✅ FUENTES PROTEICAS VEGETARIANAS:
- Legumbres: lentejas, garbanzos, soja, frijoles (15-20g/100g cocidos)
- Productos de soja: tofu, tempeh, edamame (10-20g/100g)
- Lácteos: yogur griego, queso (6-25g/100g)
- Huevos: (13g/100g)
- Seitan (gluten de trigo): (25g/100g)
- Quinoa y otros pseudocereales (4-14g/100g)
- Frutos secos y semillas (15-25g/100g)

📊 RECOMENDACIONES ESPECÍFICAS:
- Proteínas: ligeramente más altas que omnívoros (1.2-1.4g/kg)
- Hierro: 1.8 veces mayor que recomendaciones estándar
- Combinar alimentos estratégicamente (lentejas + arroz = proteína completa)
- Considerar alimentos fortificados para micronutrientes clave
- B12: suplementación generalmente necesaria

${userData.goal === 'perder peso' ? 
'🎯 Para pérdida de peso: prioriza legumbres y proteínas vegetales con mayor saciedad. Controla porciones de frutos secos y aceites por su densidad calórica.' 
: userData.goal === 'ganar peso' ? 
'🎯 Para ganancia de peso: aprovecha la densidad calórica de frutos secos, mantequillas de frutos secos, aceites saludables y proteínas vegetales concentradas. Considera batidos con proteína vegetal.'
: 
'🎯 Para mantenimiento: busca el equilibrio entre variedad nutricional y satisfacción personal. Un enfoque flexible con planificación consciente asegura todos los nutrientes.'}

¿Te gustaría más información sobre planificación de comidas vegetarianas, recetas específicas o suplementación recomendada?`;
        }
    }
    
    // Respuestas para etapas de vida
    else if (dominant === 'lifeStage') {
        switch (dominantSub) {
            case 'embarazo':
                return `La nutrición durante el embarazo es crucial tanto para la salud de la madre como para el desarrollo óptimo del bebé. Las necesidades nutricionales cambian significativamente en este período.

⚠️ NOTA IMPORTANTE: Esta información es general. Siempre consulta con tu obstetra o nutricionista especializado para recomendaciones personalizadas.

🔄 CAMBIOS EN REQUERIMIENTOS:
- Calorías: +0 en 1er trimestre, +340 kcal en 2º, +450 kcal en 3º
- Proteínas: aumenta a 1.1g/kg en 1er trimestre, 1.2g/kg en 2º y 3º
- Hierro: duplica necesidades (27mg/día vs 18mg habitual)
- Ácido fólico: 600mcg diarios (vs 400mcg habitual)
- Calcio: 1000-1300mg para desarrollo óseo y dental
- Yodo: 220mcg para desarrollo neurológico

🔍 NUTRIENTES CRÍTICOS:
- Ácido fólico: previene defectos del tubo neural (cruciales las primeras 12 semanas)
- Hierro: previene anemia, favorece desarrollo del sistema circulatorio fetal
- DHA (omega-3): desarrollo cerebral y retina del feto
- Calcio y vitamina D: formación esquelética
- Yodo: función tiroidea y desarrollo cognitivo

✅ ALIMENTOS RECOMENDADOS:
- Proteínas magras: pollo, pescados bajos en mercurio, legumbres, lácteos
- Frutas y verduras variadas y coloridas
- Carbohidratos complejos: granos enteros, tubérculos
- Grasas saludables: aguacate, frutos secos, aceite de oliva, pescados grasos (pequeños)
- Lácteos fortificados o alternativas con calcio

⛔ ALIMENTOS/HÁBITOS A EVITAR:
- Alcohol (completamente)
- Pescados altos en mercurio (pez espada, tiburón, caballa, atún blanco)
- Lácteos sin pasteurizar y quesos blandos
- Carnes, huevos y pescados crudos o poco cocinados
- Cafeína (limitar a 200mg/día, ~1 taza café)
- Brotes crudos y verduras sin lavar

💡 CONSEJOS PRÁCTICOS:
- Fraccionar la alimentación (5-6 comidas más pequeñas)
- Suplementación prenatal supervisada por profesional
- Mantenerse bien hidratada (mínimo 2-2.5L)
- Actividad física moderada aprobada por médico
- Gestionar náuseas con comidas pequeñas y frecuentes

¿Te gustaría información más específica sobre algún trimestre en particular o sobre cómo manejar síntomas específicos del embarazo mediante la alimentación?`;
        }
    }
    
    // Si llegamos aquí, no tenemos una respuesta específica
    return null;
}

/**
 * Obtiene recomendaciones personalizadas sobre peso
 * @param {Object} userData - Datos del usuario
 * @returns {string} - Recomendación personalizada
 */
function getPesoRecomendacion(userData) {
    if (!userData.height) {
        return "Para darte recomendaciones más precisas sobre tu peso, también necesitaría conocer tu altura.";
    }
    
    const bmi = calculateBMI(parseFloat(userData.weight), parseFloat(userData.height));
    const category = getBMICategory(bmi);
    
    switch(category) {
        case 'Bajo peso':
            return "Tu IMC indica que estás por debajo del rango considerado saludable. Si tu objetivo es aumentar tu peso, enfócate en un superávit calórico moderado con alimentos densos en nutrientes y entrenamiento de fuerza para favorecer aumento de masa muscular sobre grasa.";
        case 'Peso normal':
            return "Tu peso se encuentra dentro del rango considerado saludable según tu IMC. Para mantenerlo, enfócate en una alimentación equilibrada, actividad física regular y hábitos sostenibles que puedas mantener a largo plazo.";
        case 'Sobrepeso':
            return "Tu IMC indica sobrepeso ligero. Si tu objetivo es mejorar tu composición corporal, pequeños cambios sostenibles en tu alimentación y un incremento gradual de tu actividad física pueden ayudarte a alcanzar un peso más saludable y mejorar marcadores metabólicos.";
        case 'Obesidad grado I':
        case 'Obesidad grado II':
        case 'Obesidad grado III':
            return "Tu IMC indica que podrías beneficiarte de reducir tu peso para mejorar tu salud general y reducir riesgos metabólicos. Te recomendaría trabajar con profesionales de la salud (médico y nutricionista) para desarrollar un plan personalizado enfocado en cambios graduales y sostenibles.";
        default:
            return "Recuerda que el peso es solo un indicador de salud y debe considerarse junto con otros factores como composición corporal, hábitos, historial médico y bienestar general.";
    }
}

/**
 * Obtiene un plan de ejercicio según el objetivo
 * @param {string} goal - Objetivo del usuario
 * @returns {string} - Plan de ejercicio
 */
function getExercisePlanByGoal(goal) {
    switch(goal) {
        case 'perder peso':
            return `
📋 PLAN DE EJERCICIOS PARA PÉRDIDA DE PESO

El ejercicio óptimo para perder peso combina entrenamiento cardiovascular para aumentar gasto calórico, entrenamiento de fuerza para preservar masa muscular, y actividad diaria no estructurada.

🗓️ PLAN SEMANAL RECOMENDADO:

🔸 LUNES: Cardio moderado (30-40 min) + Circuito de cuerpo completo
   • Cardio: caminar rápido, ciclismo o elíptica a 65-75% FCM
   • Circuito: 3 rondas de 45 seg trabajo/15 seg descanso
      - Sentadillas con peso corporal
      - Flexiones (modificar según nivel)
      - Remo con mancuernas o banda
      - Estocadas alternadas
      - Plancha abdominal

🔸 MARTES: HIIT (20-25 min) o descanso activo
   • HIIT: 8-10 intervalos de 30 seg máximo esfuerzo/90 seg recuperación
   • Alternativa: Caminar 30-45 min a paso ligero

🔸 MIÉRCOLES: Entrenamiento de fuerza - Parte superior (30-40 min)
   • 3 series de 12-15 repeticiones por ejercicio
   • Press de banca o flexiones
   • Remo horizontal
   • Press de hombros
   • Curl de bíceps
   • Extensiones de tríceps

🔸 JUEVES: Cardio moderado (30-40 min)
   • Modalidad diferente a la del lunes
   • Mantener ritmo constante en zona de quema de grasa

🔸 VIERNES: Entrenamiento de fuerza - Parte inferior (30-40 min)
   • 3 series de 12-15 repeticiones por ejercicio
   • Sentadillas
   • Peso muerto rumano
   • Estocadas
   • Elevación de pantorrillas
   • Puentes de glúteos

🔸 SÁBADO: Actividad recreativa (45-60 min)
   • Senderismo, natación, ciclismo, baile
   • Enfoque en disfrutar mientras te mueves

🔸 DOMINGO: Descanso activo + Movilidad
   • Yoga o estiramientos (20-30 min)
   • Caminar suave (opcional)

💡 CONSEJOS CLAVE:
- Comienza gradualmente si eres principiante
- Prioriza consistencia sobre intensidad
- Aumenta NEAT (actividad no estructurada): aparcar lejos, usar escaleras
- La pérdida de peso es 70-80% nutrición, 20-30% ejercicio
- Mantén registro de progreso (no solo peso, también medidas y sensaciones)
- Encuentra actividades que disfrutes para mayor adherencia

¿Te gustaría adaptar este plan a tu nivel actual de condición física o tiempo disponible?`;
            
        case 'ganar peso':
            return `
📋 PLAN DE EJERCICIOS PARA GANANCIA DE PESO (MUSCULAR)

Para optimizar la ganancia de masa muscular, el entrenamiento de fuerza debe ser la prioridad, con cardio limitado principalmente para salud cardiovascular.

🗓️ PLAN SEMANAL RECOMENDADO:

🔸 LUNES: Entrenamiento de fuerza - Pecho y tríceps (45-60 min)
   • 4 series de 6-12 repeticiones por ejercicio
   • Press de banca (plano e inclinado)
   • Aperturas con mancuernas
   • Fondos en paralelas
   • Press francés con mancuerna
   • Extensiones de tríceps con polea

🔸 MARTES: Entrenamiento de fuerza - Espalda y bíceps (45-60 min)
   • 4 series de 6-12 repeticiones por ejercicio
   • Dominadas o jalones al pecho
   • Remo con barra
   • Remo con mancuerna unilateral
   • Curl de bíceps con barra
   • Curl martillo con mancuernas

🔸 MIÉRCOLES: Descanso o cardio ligero (15-20 min)
   • Opcional: Caminar, bicicleta estática a baja intensidad
   • Estiramientos y movilidad

🔸 JUEVES: Entrenamiento de fuerza - Piernas (45-60 min)
   • 4 series de 6-12 repeticiones por ejercicio
   • Sentadillas con barra
   • Peso muerto
   • Prensa de piernas
   • Extensiones de cuádriceps
   • Curl femoral
   • Elevaciones de pantorrillas

🔸 VIERNES: Entrenamiento de fuerza - Hombros y core (45-60 min)
   • 4 series de 6-12 repeticiones por ejercicio
   • Press militar
   • Elevaciones laterales
   • Elevaciones frontales
   • Face pulls
   • Planchas y antirotaciones

🔸 SÁBADO: Descanso activo o actividad recreativa ligera
   • Deportes recreativos no extenuantes
   • Movilidad articular y estiramientos

🔸 DOMINGO: Descanso completo
   • Priorizar recuperación
   • Asegurar 7-9 horas de sueño de calidad

💡 CONSEJOS CLAVE:
- Progresión de carga: aumenta peso gradualmente (principio de sobrecarga)
- Técnica sobre ego: prioriza ejecución correcta sobre peso levantado
- Nutrición periworkout: proteína y carbohidratos 1-2h antes y 30-60min después
- Calorías suficientes: asegura superávit calórico para construcción muscular
- Recuperación: mínimo 48h entre entrenamientos del mismo grupo muscular
- Suplementación básica a considerar: proteína en polvo, creatina monohidrato (5g/día)

¿Te gustaría información más detallada sobre técnica de ejercicios específicos o cómo adaptar este plan a tu experiencia?`;
            
        case 'mantener peso':
            return `
📋 PLAN DE EJERCICIOS PARA MANTENIMIENTO DE PESO

Un plan equilibrado para mantenimiento combina entrenamiento de fuerza, cardio y flexibilidad para optimizar composición corporal y salud general.

🗓️ PLAN SEMANAL RECOMENDADO:

🔸 LUNES: Entrenamiento de fuerza - Cuerpo completo (40-50 min)
   • 3 series de 8-12 repeticiones por ejercicio
   • Sentadillas o prensa de piernas
   • Press de banca o flexiones
   • Peso muerto o extensión de cadera
   • Remo con mancuerna o dominadas
   • Press de hombros
   • Ejercicios de core

🔸 MARTES: Cardio moderado (30 min) o clase de grupo
   • Modalidades recomendadas: spinning, zumba, natación
   • Intensidad: 65-75% de FCM (conversación ligeramente difícil)
   • Alternativa: 20 min de cardio + 10 min de movilidad articular

🔸 MIÉRCOLES: Descanso activo o yoga/pilates
   • Caminar 30 min o actividad de baja intensidad
   • Yoga o pilates para equilibrio, flexibilidad y control postural
   • Enfoque en recuperación activa y reducción de estrés

🔸 JUEVES: Entrenamiento de fuerza - Cuerpo completo (40-50 min)
   • Rutina similar a lunes pero variando ejercicios
   • Estocadas en lugar de sentadillas
   • Press inclinado en lugar de plano
   • Diferentes variantes que trabajen los mismos grupos musculares

🔸 VIERNES: HIIT o tabata (20-25 min)
   • Calentamiento: 5 min
   • 8 rondas de 20 seg esfuerzo máximo/10 seg descanso (4 min)
   • Descanso 1 min y repetir con diferentes ejercicios
   • Incluir variedad: ejercicios de piernas, brazos, core, pliométricos
   • Enfriamiento: 5 min

🔸 SÁBADO: Actividad recreativa o deportiva
   • Deportes: tenis, baloncesto, fútbol, etc.
   • Actividades al aire libre: senderismo, ciclismo, kayak
   • Priorizar diversión y socialización con beneficio añadido de movimiento

🔸 DOMINGO: Descanso completo o estiramiento/movilidad
   • Recuperación total o yoga restaurativo
   • Estiramientos pasivos
   • Preparación mental para la semana siguiente

💡 CONSEJOS CLAVE:
- Variedad: cambiar rutinas cada 4-6 semanas para evitar mesetas
- Escuchar al cuerpo: ajustar intensidad según energía y recuperación
- Equilibrio: balance entre desafío y disfrute para adherencia a largo plazo
- Flexibilidad: adaptar según compromisos sociales/laborales sin culpabilidad
- Monitorización: seguimiento de medidas, fuerza, resistencia y sensaciones más que peso

¿Te gustaría que adaptara este plan según tus preferencias de ejercicio o tiempo disponible?`;
            
        default:
            return `
📋 PLAN DE EJERCICIO GENERAL PARA MEJORAR SALUD Y CONDICIÓN FÍSICA

Este plan básico está diseñado para principiantes o personas que retoman actividad física, enfocándose en crear hábitos sostenibles y mejorar la condición general.

🗓️ PLAN SEMANAL RECOMENDADO:

🔸 LUNES: Caminata rápida o trote suave (30 min)
   • Intensidad: moderada - deberías poder mantener una conversación
   • Incluir 5 min de calentamiento y 5 de enfriamiento
   • Opcional: intervalos sencillos (1 min rápido, 2 min normal)

🔸 MARTES: Ejercicios básicos con peso corporal (20-30 min)
   • 2-3 series de 10-12 repeticiones:
      - Sentadillas
      - Flexiones modificadas (según nivel)
      - Plancha (mantener 20-30 segundos)
      - Estocadas
      - Superman (fortalecimiento lumbar)
   • Descanso 60 segundos entre ejercicios

🔸 MIÉRCOLES: Descanso o actividad ligera
   • Estiramiento suave (10-15 min)
   • Caminar (20 min a ritmo tranquilo)
   • Yoga para principiantes

🔸 JUEVES: Cardio de elección (30 min)
   • Elegir una actividad diferente a la del lunes
   • Opciones: natación, ciclismo, elíptica, baile
   • Mantener intensidad moderada, constante
   
🔸 VIERNES: Yoga o pilates (30 min)
   • Enfoque en flexibilidad y equilibrio
   • Fortalecer core y mejorar postura
   • Ideal: clase guiada (presencial o video)

🔸 SÁBADO: Actividad recreativa al aire libre
   • Senderismo, juegos en parque, jardinería
   • Enfocarse en disfrutar del movimiento
   • Ideal para incluir familia/amigos

🔸 DOMINGO: Descanso completo
   • Recuperación corporal
   • Planificar actividad de la semana siguiente
   • Reflexionar sobre progresos y sensaciones

💡 CONSEJOS CLAVE PARA PRINCIPIANTES:
- Consistencia sobre intensidad: mejor 20 min 4 veces/semana que 1 hora una vez
- Progresión gradual: aumentar 10% duración/intensidad cada 1-2 semanas
- Escuchar al cuerpo: diferenciar entre incomodidad normal y dolor (detener si hay dolor)
- Hidratación: antes, durante y después de actividad
- Calzado adecuado: especialmente importante para actividades de impacto
- Celebrar pequeñas victorias: reconocer mejoras en energía, sueño, estado anímico

Recuerda que este plan puede adaptarse según tus preferencias, limitaciones físicas o disponibilidad de tiempo. ¿Te gustaría personalizarlo más específicamente?`;
    }
}