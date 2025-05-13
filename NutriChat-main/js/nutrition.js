/**
 * Módulo de cálculos nutricionales para NutriChat
 * Contiene todas las funciones relacionadas con cálculos biométricos y nutricionales
 */

/**
 * Calcula el Índice de Masa Corporal (IMC)
 * @param {number} weight - Peso en kilogramos
 * @param {number} heightInCm - Altura en centímetros
 * @returns {number} - IMC calculado (redondeado a 1 decimal)
 */
function calculateBMI(weight, heightInCm) {
    // Convertir altura de cm a metros para el cálculo correcto
    const heightInMeters = heightInCm / 100;
    return (weight / Math.pow(heightInMeters, 2)).toFixed(1);
}

/**
 * Determina la categoría de IMC según el valor
 * @param {number} bmi - IMC calculado
 * @returns {string} - Categoría de IMC
 */
function getBMICategory(bmi) {
    // Asegurar que bmi sea un número
    bmi = parseFloat(bmi);
    
    if (bmi < 18.5) {
        return "Bajo peso";
    } else if (bmi >= 18.5 && bmi < 25) {
        return "Peso normal";
    } else if (bmi >= 25 && bmi < 30) {
        return "Sobrepeso";
    } else if (bmi >= 30 && bmi < 35) {
        return "Obesidad grado I";
    } else if (bmi >= 35 && bmi < 40) {
        return "Obesidad grado II";
    } else {
        return "Obesidad grado III";
    }
}

/**
 * Calcula el metabolismo basal (BMR) usando la fórmula de Mifflin-St Jeor
 * @param {Object} userData - Datos del usuario
 * @returns {number} - BMR en calorías
 */
function calculateBMR(userData) {
    const { gender, weight, height, age } = userData;
    
    if (gender === 'masculino') {
        return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
}

/**
 * Calcula el gasto energético total diario (TDEE)
 * @param {Object} userData - Datos del usuario
 * @returns {number} - TDEE en calorías
 */
function calculateTDEE(userData) {
    const bmr = calculateBMR(userData);
    const { activityLevel } = userData;
    
    const activityMultipliers = {
        sedentario: 1.2,      // Poco o ningún ejercicio
        ligera: 1.375,        // Ejercicio ligero 1-3 días por semana
        moderada: 1.55,       // Ejercicio moderado 3-5 días por semana
        activa: 1.725,        // Ejercicio intenso 6-7 días por semana
        'muy activa': 1.9     // Ejercicio muy intenso, trabajo físico
    };
    
    const multiplier = activityMultipliers[activityLevel] || 1.2;
    
    return Math.round(bmr * multiplier);
}

/**
 * Calcula las calorías recomendadas según el objetivo
 * @param {Object} userData - Datos del usuario
 * @returns {number} - Calorías recomendadas
 */
function calculateCalorieNeeds(userData) {
    const tdee = calculateTDEE(userData);
    const { goal } = userData;
    
    const goalMultipliers = {
        'perder peso': 0.85,     // Déficit del 15%
        'mantener peso': 1.0,   // Mantenimiento
        'ganar peso': 1.15      // Superávit del 15%
    };
    
    const multiplier = goalMultipliers[goal] || 1.0;
    
    return Math.round(tdee * multiplier);
}

/**
 * Calcula la distribución de macronutrientes recomendada
 * @param {Object} userData - Datos del usuario
 * @returns {Object} - Gramos de proteínas, carbohidratos y grasas
 */
function calculateMacroDistribution(userData) {
    const calories = calculateCalorieNeeds(userData);
    const { goal, weight } = userData;
    
    // Cálculo de proteína basado en peso corporal y objetivo
    let proteinPerKg;
    if (goal === 'perder peso') {
        proteinPerKg = 2.0; // Mayor proteína durante déficit
    } else if (goal === 'ganar peso') {
        proteinPerKg = 1.8; // Proteína moderada-alta para ganancia muscular
    } else {
        proteinPerKg = 1.6; // Proteína moderada para mantenimiento
    }
    
    const proteinGrams = Math.round(weight * proteinPerKg);
    const proteinCalories = proteinGrams * 4;
    
    // Distribución de macros según el objetivo
    let fatPercentage;
    if (goal === 'perder peso') {
        fatPercentage = 0.3; // 30% grasas
    } else if (goal === 'ganar peso') {
        fatPercentage = 0.25; // 25% grasas
    } else {
        fatPercentage = 0.3; // 30% grasas
    }
    
    const fatCalories = calories * fatPercentage;
    const fatGrams = Math.round(fatCalories / 9);
    
    // El resto de calorías se asignan a carbohidratos
    const carbsCalories = calories - proteinCalories - fatCalories;
    const carbsGrams = Math.round(carbsCalories / 4);
    
    return {
        protein: proteinGrams,
        carbs: carbsGrams,
        fat: fatGrams
    };
}

/**
 * Calcula requerimiento de agua diario aproximado
 * @param {number} weight - Peso en kilogramos
 * @param {string} activityLevel - Nivel de actividad
 * @returns {string} - Agua recomendada en litros (con 1 decimal)
 */
function calculateWaterNeeds(weight, activityLevel) {
    // Base: 30-35ml por kg de peso corporal
    const baseWater = weight * 0.033;
    
    // Ajuste por nivel de actividad
    const activityMultipliers = {
        sedentario: 1.0,
        ligera: 1.1,
        moderada: 1.2,
        activa: 1.3,
        'muy activa': 1.4
    };
    
    const multiplier = activityMultipliers[activityLevel] || 1.0;
    
    return (baseWater * multiplier).toFixed(1);
}

/**
 * Genera diagnóstico nutricional basado en datos del usuario
 * @param {Object} userData - Datos completos del usuario
 * @returns {string} - Diagnóstico nutricional
 */
function generateNutritionalDiagnosis(userData) {
    const { weight, height, currentCalories, goal } = userData;
    const recommendedCal = calculateCalorieNeeds(userData);
    const currentCal = parseInt(currentCalories) || 0;
    const diff = currentCal - recommendedCal;
    
    let diagnosis = '';
    
    // Análisis de ingesta calórica
    if (currentCal === 0) {
        diagnosis = "No has especificado tu ingesta calórica actual, por lo que te recomendaré en base a tus características y objetivos. ";
    } else if (Math.abs(diff) < 200) {
        diagnosis = "Tu ingesta calórica actual está cerca de lo recomendado para tus objetivos. ";
    } else if (diff > 200) {
        diagnosis = `Estás consumiendo aproximadamente ${diff} calorías más de lo recomendado para tus objetivos. Esto podría dificultar el progreso hacia tu meta de ${goal}. `;
    } else {
        diagnosis = `Estás consumiendo aproximadamente ${Math.abs(diff)} calorías menos de lo recomendado para tus objetivos. ${goal === 'ganar peso' ? 'Esto puede dificultar tu ganancia de peso y masa muscular.' : 'Si bien esto podría acelerar la pérdida de peso, un déficit demasiado pronunciado puede afectar tu energía y rendimiento.'} `;
    }
    
    // Análisis de IMC
    const bmi = calculateBMI(parseFloat(weight), parseFloat(height));
    const bmiCategory = getBMICategory(bmi);
    
    diagnosis += `Tu IMC es ${bmi}, lo que indica ${bmiCategory.toLowerCase()}. `;
    
    // Análisis de la relación entre IMC y objetivo
    if (bmiCategory === "Bajo peso" && goal === "perder peso") {
        diagnosis += "Tu IMC indica que estás por debajo del rango considerado saludable, pero tu objetivo es perder peso. Considera consultar con un profesional de la salud para establecer objetivos adecuados para tu composición corporal. ";
    } else if ((bmiCategory === "Obesidad grado I" || bmiCategory === "Obesidad grado II" || bmiCategory === "Obesidad grado III") && goal === "ganar peso") {
        diagnosis += "Tu IMC indica obesidad, pero tu objetivo es ganar peso. Si tu intención es aumentar masa muscular, considera enfocar tu plan en recomposición corporal en lugar de un aumento de peso general. ";
    }
    
    // Recomendaciones generales
    diagnosis += "Recomendaciones: ";
    
    if (goal === 'perder peso') {
        diagnosis += "Enfócate en alimentos ricos en proteínas y fibra que te ayuden a sentirte satisfecho. Limita los azúcares refinados y los alimentos procesados. El déficit calórico no debería superar el 20% de tu gasto energético para una pérdida de peso sostenible. ";
    } else if (goal === 'ganar peso') {
        diagnosis += "Aumenta el consumo de alimentos densos en nutrientes y calorías. Prioriza proteínas de alta calidad para favorecer el desarrollo muscular sobre la acumulación de grasa. Considera aumentar la frecuencia de comidas a 5-6 al día. ";
    } else {
        diagnosis += "Mantén una dieta equilibrada con variedad de alimentos enteros. Distribuye los macronutrientes según tu actividad diaria, aumentando carbohidratos en días de mayor actividad física y priorizando proteínas para la recuperación muscular. ";
    }
    
    return diagnosis;
}

/**
 * Calcula la tasa metabólica en reposo usando fórmula de Harris-Benedict 
 * (alternativa a Mifflin-St Jeor)
 * @param {Object} userData - Datos del usuario
 * @returns {number} - RMR en calorías
 */
function calculateHarrisBenedictRMR(userData) {
    const { gender, weight, height, age } = userData;
    
    if (gender === 'masculino') {
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
}

/**
 * Calcula el nivel de grasa corporal estimado usando la fórmula Navy
 * @param {Object} userData - Datos del usuario incluyendo circunferencias
 * @returns {number} - Porcentaje de grasa corporal estimado
 */
function estimateBodyFat(userData) {
    // Esta función requeriría datos adicionales como circunferencia de cintura, cuello, etc.
    // Se implementaría si se decidiera recolectar estos datos
    return "Para una estimación precisa de grasa corporal se necesitan medidas adicionales.";
}

/**
 * Calcula el índice cintura-altura, otro indicador de salud metabólica
 * @param {number} waistCircumference - Circunferencia de cintura en cm
 * @param {number} height - Altura en cm
 * @returns {number} - Índice cintura-altura
 */
function calculateWaistToHeightRatio(waistCircumference, height) {
    return (waistCircumference / height).toFixed(2);
}

/**
 * Calcula las necesidades de macro y micronutrientes según condiciones específicas
 * @param {Object} userData - Datos completos del usuario
 * @param {Array} conditions - Condiciones específicas (embarazo, deportista, etc)
 * @returns {Object} - Necesidades nutricionales específicas
 */
function calculateSpecificNutrientNeeds(userData, conditions = []) {
    // Esta función implementaría cálculos específicos para condiciones especiales
    const specificNeeds = {
        macronutrients: {},
        micronutrients: {}
    };
    
    // Ejemplo de implementación
    if (conditions.includes('embarazo')) {
        specificNeeds.macronutrients.protein = "Aumentar en 25g diarios";
        specificNeeds.micronutrients.folicAcid = "600mcg diarios";
        specificNeeds.micronutrients.iron = "27mg diarios";
    }
    
    return specificNeeds;
}