/**
 * NutriChat AI Engine - Módulo central para procesamiento de mensajes
 * Integra detección de intenciones, análisis de palabras clave y gestor de conversación
 */

/**
 * Procesa el mensaje del usuario y determina la mejor respuesta
 * @param {string} message - Mensaje del usuario
 * @param {Object} userData - Datos del usuario
 * @param {string} currentQuestion - Estado actual de la conversación
 * @returns {Object} - Respuesta y siguiente estado de conversación
 */
function processMessage(message, userData, currentQuestion) {
    // Paso 1: Intentar detectar una intención específica
    const detectedIntent = detectUserIntent(message);
    
    if (detectedIntent && detectedIntent.score > 2) {
        // Si la intención es clara, usar el manejador correspondiente
        const intentResponse = detectedIntent.handler(userData, message);
        
        // Determinar el siguiente estado de conversación basado en la intención
        let nextQuestion = currentQuestion;
        
        // Cambiar estado si la intención implica actualización de datos
        if (detectedIntent.intent === 'actualizarDatos') {
            if (message.toLowerCase().includes('peso')) {
                nextQuestion = 'update_weight';
            } else if (message.toLowerCase().includes('altura')) {
                nextQuestion = 'update_height';
            } else if (message.toLowerCase().includes('objetivo')) {
                nextQuestion = 'update_goal';
            } else if (message.toLowerCase().includes('actividad')) {
                nextQuestion = 'update_activity';
            } else if (message.toLowerCase().includes('edad')) {
                nextQuestion = 'update_age';
            } else if (message.toLowerCase().includes('género')) {
                nextQuestion = 'update_gender';
            }
        } 
        // Cambiar estado si es reinicio
        else if (detectedIntent.intent === 'reiniciarChat') {
            nextQuestion = 'confirm_reset';
        }
        
        return {
            response: intentResponse,
            nextQuestion: nextQuestion,
            source: 'intent'
        };
    }
    
    // Paso 2: Si no hay intención clara, analizar palabras clave
    const keywordAnalysis = analyzeKeywords(message);
    const dominantCategory = getDominantCategory(keywordAnalysis);
    
    if (dominantCategory.dominant) {
        const keywordResponse = generateKeywordResponse(dominantCategory, userData);
        
        if (keywordResponse) {
            // Determinar si cambiar el estado basado en el análisis de palabras clave
            let nextQuestion = currentQuestion;
            
            // Si las palabras clave sugieren actualización de datos
            if (dominantCategory.dominant === 'personalData' && message.toLowerCase().match(/actualizar|cambiar|modificar/)) {
                if (dominantCategory.dominantSub === 'peso') {
                    nextQuestion = 'update_weight';
                } else if (dominantCategory.dominantSub === 'altura') {
                    nextQuestion = 'update_height';
                }
            }
            
            return {
                response: keywordResponse,
                nextQuestion: nextQuestion,
                source: 'keywords'
            };
        }
    }
    
    // Paso 3: Verificar si es una pregunta de conocimiento (base de conocimientos generales)
    const knowledgeResponse = checkForKnowledgeQuestion(message);
    
    if (knowledgeResponse) {
        return {
            response: knowledgeResponse,
            nextQuestion: currentQuestion, // Mantener el estado actual
            source: 'knowledge'
        };
    }
    
    // Paso 4: Si estamos en un flujo de conversación específico, continuar con él
    if (currentQuestion !== 'initial' && currentQuestion !== 'follow_up') {
        // Dejar que el flujo de conversación existente maneje la respuesta
        return {
            response: null,
            nextQuestion: currentQuestion,
            source: 'conversation_flow'
        };
    }
    
    // Paso 5: Respuesta por defecto si no podemos determinar la intención
    const defaultResponses = [
        "¡Hola! Soy NutriChat, tu asistente nutricional. ¿En qué puedo ayudarte hoy? Puedo ofrecerte planes nutricionales personalizados, responder preguntas sobre alimentación o ayudarte a alcanzar tus objetivos de salud.",
        
        "¡Saludos! Como tu asistente nutricional, puedo ayudarte con planes alimenticios, información sobre nutrientes, o consejos para tus objetivos. ¿Qué te gustaría saber hoy?",
        
        "¡Bienvenido/a a NutriChat! Estoy aquí para ayudarte con cualquier consulta sobre nutrición, desde planes personalizados hasta información sobre alimentos específicos. ¿Con qué puedo asistirte?",
        
        "¿En qué puedo orientarte sobre nutrición hoy? Puedo crear planes personalizados, analizar tus necesidades calóricas, o responder preguntas sobre alimentación saludable."
    ];
    
    // Seleccionar una respuesta aleatoria para variedad
    const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    
    return {
        response: randomResponse,
        nextQuestion: 'initial',
        source: 'default'
    };
}

/**
 * Analiza profundamente un mensaje para extraer posibles valores numéricos
 * Útil para detectar actualizaciones de datos como peso o altura
 * @param {string} message - Mensaje del usuario
 * @returns {Object|null} - Datos extraídos o null si no se encuentran
 */
function extractNumericData(message) {
    const result = {};
    
    // Buscar patrones de peso
    const weightPatterns = [
        /peso\s*:?\s*(\d+[.,]?\d*)\s*(kg|kilos|kilogramos)?/i,
        /(\d+[.,]?\d*)\s*(kg|kilos|kilogramos)/i,
        /tengo\s*(\d+[.,]?\d*)\s*(kg|kilos|kilogramos)/i,
        /peso\s*(\d+[.,]?\d*)\s*(kg|kilos|kilogramos)?/i
    ];
    
    for (const pattern of weightPatterns) {
        const match = message.match(pattern);
        if (match) {
            result.weight = parseFloat(match[1].replace(',', '.'));
            break;
        }
    }
    
    // Buscar patrones de altura
    const heightPatterns = [
        /altura\s*:?\s*(\d+[.,]?\d*)\s*(cm|metros|m)?/i,
        /mido\s*(\d+[.,]?\d*)\s*(cm|metros|m)/i,
        /(\d+[.,]?\d*)\s*(cm|centímetros)/i,
        /(\d)[.,](\d{1,2})\s*(metros|m)/i,  // Para formato 1.75 metros
        /altura\s*(\d)[.,](\d{1,2})\s*(metros|m)?/i,  // Para altura 1.75 metros
        /estatura\s*:?\s*(\d+[.,]?\d*)\s*(cm|metros|m)?/i,
        /estatura\s*(\d)[.,](\d{1,2})\s*(metros|m)?/i  // Para estatura 1.75 metros
    ];
    
    for (const pattern of heightPatterns) {
        const match = message.match(pattern);
        if (match) {
            // Convertir metros a cm si es necesario
            if (match[2] && (match[2].toLowerCase() === 'metros' || match[2].toLowerCase() === 'm')) {
                result.height = parseFloat(match[1].replace(',', '.')) * 100;
            }
            // Caso especial para formato 1.75 metros
            else if (pattern.toString().includes('[.,]')) {
                result.height = parseFloat(`${match[1]}.${match[2]}`) * 100;
            }
            else {
                result.height = parseFloat(match[1].replace(',', '.'));
            }
            break;
        }
    }
    
    // Buscar patrones de edad
    const agePatterns = [
        /edad\s*:?\s*(\d+)/i,
        /tengo\s*(\d+)\s*años/i,
        /(\d+)\s*años/i,
        /edad\s*(\d+)\s*años?/i
    ];
    
    for (const pattern of agePatterns) {
        const match = message.match(pattern);
        if (match) {
            result.age = parseInt(match[1]);
            break;
        }
    }
    
    // Buscar objetivo
    if (message.match(/perder\s*peso/i)) {
        result.goal = 'perder peso';
    } else if (message.match(/ganar\s*peso|aumentar\s*peso|subir\s*peso/i)) {
        result.goal = 'ganar peso';
    } else if (message.match(/mantener\s*peso/i)) {
        result.goal = 'mantener peso';
    }
    
    // Buscar nivel de actividad
    if (message.match(/sedentari[oa]/i)) {
        result.activityLevel = 'sedentario';
    } else if (message.match(/actividad\s*ligera|ligeramente\s*activ[oa]/i)) {
        result.activityLevel = 'ligera';
    } else if (message.match(/moderadamente\s*activ[oa]|actividad\s*moderada/i)) {
        result.activityLevel = 'moderada';
    } else if (message.match(/muy\s*activ[oa]|actividad\s*alta/i)) {
        result.activityLevel = 'muy activa';
    } else if (message.match(/activ[oa]/i)) {
        result.activityLevel = 'activa';
    }
    
    // Buscar género
    if (message.match(/masculino|hombre|varón/i)) {
        result.gender = 'masculino';
    } else if (message.match(/femenino|mujer/i)) {
        result.gender = 'femenino';
    }
    
    return Object.keys(result).length > 0 ? result : null;
}

/**
 * Verifica si un mensaje contiene datos para múltiples campos
 * Útil para detectar si el usuario está proporcionando varios datos a la vez
 * @param {string} message - Mensaje del usuario
 * @param {Object} userData - Datos actuales del usuario
 * @returns {Object} - Datos actualizados y mensaje para el usuario
 */
function processMultiFieldInput(message, userData) {
    const extractedData = extractNumericData(message);
    
    if (!extractedData) {
        return {
            userDataUpdated: false,
            userData: userData,
            message: null
        };
    }
    
    // Copia de datos de usuario para actualizar
    const updatedUserData = {...userData};
    let fieldsUpdated = [];
    
    // Actualizar campos según datos extraídos
    if (extractedData.weight) {
        updatedUserData.weight = extractedData.weight;
        fieldsUpdated.push(`peso (${extractedData.weight} kg)`);
    }
    
    if (extractedData.height) {
        updatedUserData.height = extractedData.height;
        fieldsUpdated.push(`altura (${(extractedData.height/100).toFixed(2)} metros)`);
    }
    
    if (extractedData.age) {
        updatedUserData.age = extractedData.age;
        fieldsUpdated.push(`edad (${extractedData.age} años)`);
    }
    
    if (extractedData.activityLevel) {
        updatedUserData.activityLevel = extractedData.activityLevel;
        fieldsUpdated.push(`nivel de actividad (${extractedData.activityLevel})`);
    }
    
    if (extractedData.goal) {
        updatedUserData.goal = extractedData.goal;
        fieldsUpdated.push(`objetivo (${extractedData.goal})`);
    }
    
    if (extractedData.gender) {
        updatedUserData.gender = extractedData.gender;
        fieldsUpdated.push(`género (${extractedData.gender})`);
    }
    
    // Generar mensaje de confirmación si se actualizaron campos
    let responseMessage = null;
    
    if (fieldsUpdated.length > 0) {
        responseMessage = `¡Perfecto! He actualizado los siguientes datos: ${fieldsUpdated.join(', ')}. `;
        
        // Verificar si hay suficientes datos para generar recomendaciones
        const hasEnoughData = updatedUserData.weight && updatedUserData.height && 
                            updatedUserData.age && updatedUserData.gender && 
                            updatedUserData.activityLevel && updatedUserData.goal;
                            
        if (hasEnoughData) {
            responseMessage += "Ahora tengo suficiente información para generar recomendaciones personalizadas. ¿Te gustaría ver tu plan nutricional?";
        } else {
            // Identificar qué falta
            const missingFields = [];
            if (!updatedUserData.weight) missingFields.push("peso");
            if (!updatedUserData.height) missingFields.push("altura");
            if (!updatedUserData.age) missingFields.push("edad");
            if (!updatedUserData.gender) missingFields.push("género");
            if (!updatedUserData.activityLevel) missingFields.push("nivel de actividad");
            if (!updatedUserData.goal) missingFields.push("objetivo");
            
            responseMessage += `Para generar un plan nutricional completo, aún necesito la siguiente información: ${missingFields.join(', ')}. ¿Te gustaría proporcionarla ahora?`;
        }
    }
    
    return {
        userDataUpdated: fieldsUpdated.length > 0,
        userData: updatedUserData,
        message: responseMessage
    };
}

/**
 * Genera respuestas empáticas y variadas para mantener la conversación natural
 * @param {string} responseType - Tipo de respuesta requerida
 * @returns {string} - Frase empática o transicional
 */
function generateConversationalResponse(responseType) {
    const responses = {
        greeting: [
            "¡Hola! Soy NutriChat, tu asistente nutricional personalizado.",
            "¡Bienvenido/a a NutriChat! Estoy aquí para apoyarte en tus objetivos nutricionales.",
            "¡Saludos! Soy tu asistente virtual especializado en nutrición."
        ],
        confirmation: [
            "¡Perfecto! He registrado esa información.",
            "¡Excelente! Eso me ayuda a personalizar mejor mis recomendaciones.",
            "¡Entendido! He actualizado tus datos con esta información."
        ],
        transition: [
            "Ahora, continuemos con",
            "Sigamos con",
            "Avancemos hacia",
            "A continuación, necesito saber"
        ],
        encouragement: [
            "¡Vas por buen camino! Cada pequeño cambio suma en tu objetivo.",
            "¡Excelente progreso! La consistencia es clave para resultados duraderos.",
            "¡Sigue así! Los cambios sostenibles son los que marcan la diferencia."
        ],
        suggestion: [
            "Te sugiero considerar",
            "Una recomendación útil sería",
            "Podrías beneficiarte de",
            "Sería ideal que incorpores"
        ]
    };
    
    // Seleccionar una respuesta aleatoria del tipo solicitado
    const optionsArray = responses[responseType] || responses.transition;
    return optionsArray[Math.floor(Math.random() * optionsArray.length)];
}

/**
 * Verifica si la última interacción fue hace más de un día
 * Útil para saludos personalizados en conversaciones recurrentes
 * @param {Date} lastInteractionDate - Fecha de última interacción
 * @returns {boolean} - Verdadero si pasó más de un día
 */
function lastInteractionWasMoreThanADayAgo(lastInteractionDate) {
    if (!lastInteractionDate) return true;
    
    const currentDate = new Date();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    return (currentDate - lastInteractionDate) > oneDayInMs;
}

/**
 * Genera preguntas de seguimiento para mantener la conversación
 * @param {Object} userData - Datos del usuario
 * @param {string} lastTopic - Último tema tratado
 * @returns {string} - Pregunta de seguimiento contextual
 */
function generateFollowUpQuestion(userData, lastTopic) {
    // Si no tenemos suficientes datos, priorizar completar el perfil
    const hasCompleteProfile = userData.weight && userData.height && 
                              userData.age && userData.gender && 
                              userData.activityLevel && userData.goal;
    
    if (!hasCompleteProfile) {
        return "Para ofrecerte recomendaciones más personalizadas, ¿te gustaría completar tu perfil con los datos que faltan?";
    }
    
    // Si tenemos perfil completo, hacer preguntas según el contexto
    const followUpQuestions = {
        nutrition: [
            "¿Hay algún tipo de alimento que prefieras evitar o que no te guste?",
            "¿Tienes alguna restricción alimentaria o alergia que deba considerar?",
            "¿Hay alguna duda específica sobre nutrición que te gustaría resolver?"
        ],
        exercise: [
            "¿Qué tipo de actividad física disfrutas más?",
            "¿Tienes acceso a un gimnasio o prefieres ejercicios en casa?",
            "¿Hay alguna lesión o limitación que debamos considerar en tus rutinas?"
        ],
        goals: [
            "¿Has intentado alcanzar este objetivo antes? ¿Qué funcionó y qué no?",
            "¿Tienes alguna fecha objetivo en mente para tus metas?",
            "¿Qué te motivó a buscar asesoramiento nutricional ahora?"
        ],
        default: [
            "¿En qué otro aspecto de tu alimentación puedo ayudarte?",
            "¿Hay algo específico sobre tu nutrición que te gustaría conocer?",
            "¿Tienes alguna otra pregunta o necesitas alguna aclaración?"
        ]
    };
    
    // Seleccionar categoría según último tema o usar default
    const questionCategory = followUpQuestions[lastTopic] || followUpQuestions.default;
    
    // Seleccionar pregunta aleatoria de la categoría
    return questionCategory[Math.floor(Math.random() * questionCategory.length)];
}

/**
 * Ajusta el tono y complejidad de las respuestas según preferencias del usuario
 * @param {string} message - Mensaje original para enviar
 * @param {Object} preferences - Preferencias del usuario (formal/casual, detallado/conciso)
 * @returns {string} - Mensaje ajustado según preferencias
 */
function adjustResponseToPreferences(message, preferences = { tone: 'balanced', detail: 'balanced' }) {
    let adjustedMessage = message;
    
    // Ajustar nivel de detalle
    if (preferences.detail === 'concise' && message.length > 300) {
        // Simplificar respuesta para hacerla más concisa
        adjustedMessage = adjustedMessage.replace(/\n\n/g, '\n');
        
        // Eliminar ejemplos detallados o explicaciones largas
        const bulletPointsPattern = /• [^•]+• /g;
        const simplifiedBullets = adjustedMessage.match(bulletPointsPattern);
        
        if (simplifiedBullets && simplifiedBullets.length > 4) {
            // Limitar a 3-4 puntos si hay demasiados
            const mainPoints = simplifiedBullets.slice(0, 3);
            const lastBulletIndex = adjustedMessage.lastIndexOf(mainPoints[mainPoints.length - 1]) + mainPoints[mainPoints.length - 1].length;
            adjustedMessage = adjustedMessage.substring(0, lastBulletIndex) + "\n\n• Y otros beneficios adicionales...";
        }
    } 
    else if (preferences.detail === 'detailed') {
        // No necesita ajustes, ya que las respuestas por defecto son detalladas
    }
    
    // Ajustar tono
    if (preferences.tone === 'formal') {
        // Reemplazar expresiones casuales con más formales
        adjustedMessage = adjustedMessage
            .replace(/¡/g, '')
            .replace(/!/g, '.')
            .replace(/Hola/g, 'Saludos')
            .replace(/Genial/g, 'Excelente')
            .replace(/Va bien/g, 'Progresa adecuadamente');
    } 
    else if (preferences.tone === 'casual') {
        // Añadir elementos conversacionales para tono más casual
        if (!adjustedMessage.includes('😊') && !adjustedMessage.includes('👍')) {
            adjustedMessage = adjustedMessage.replace(/\.$/, '! 👍');
        }
    }
    
    return adjustedMessage;
}