/**
 * Módulo generador de planes de comidas para NutriChat
 * Proporciona funciones para crear planes de comidas personalizados
 */

/**
 * Genera un plan de comidas basado en calorías y macros
 * @param {Object} macros - Objetivos de macronutrientes
 * @param {number} calories - Total de calorías diarias
 * @param {string} goal - Objetivo del usuario
 * @returns {Object} - Plan de comidas dividido por tiempo
 */
function generateMealPlan(macros, calories, goal) {
    // Distribución de comidas según el objetivo
    let mealDistribution = {};
    
    if (goal === 'perder peso') {
        // Para pérdida de peso: desayuno y comida más fuertes, cena ligera
        mealDistribution = {
            breakfast: { cals: 0.25, protein: 0.3, carbs: 0.3, fat: 0.25 },
            morningSnack: { cals: 0.1, protein: 0.1, carbs: 0.1, fat: 0.1 },
            lunch: { cals: 0.35, protein: 0.35, carbs: 0.35, fat: 0.35 },
            afternoonSnack: { cals: 0.1, protein: 0.1, carbs: 0.1, fat: 0.1 },
            dinner: { cals: 0.2, protein: 0.15, carbs: 0.15, fat: 0.2 }
        };
    } else if (goal === 'ganar peso') {
        // Para aumento de peso: comidas más frecuentes y substanciales
        mealDistribution = {
            breakfast: { cals: 0.2, protein: 0.2, carbs: 0.25, fat: 0.2 },
            morningSnack: { cals: 0.15, protein: 0.15, carbs: 0.15, fat: 0.15 },
            lunch: { cals: 0.3, protein: 0.3, carbs: 0.3, fat: 0.3 },
            afternoonSnack: { cals: 0.15, protein: 0.15, carbs: 0.15, fat: 0.15 },
            dinner: { cals: 0.2, protein: 0.2, carbs: 0.15, fat: 0.2 }
        };
    } else {
        // Para mantenimiento: distribución equilibrada
        mealDistribution = {
            breakfast: { cals: 0.25, protein: 0.25, carbs: 0.3, fat: 0.25 },
            morningSnack: { cals: 0.1, protein: 0.1, carbs: 0.1, fat: 0.1 },
            lunch: { cals: 0.35, protein: 0.35, carbs: 0.35, fat: 0.35 },
            afternoonSnack: { cals: 0.1, protein: 0.1, carbs: 0.1, fat: 0.1 },
            dinner: { cals: 0.2, protein: 0.2, carbs: 0.15, fat: 0.2 }
        };
    }
    
    // Construir el plan de comidas con calorías y macros para cada comida
    const mealPlan = {};
    
    // Procesar cada comida
    Object.keys(mealDistribution).forEach(meal => {
        const dist = mealDistribution[meal];
        mealPlan[meal] = {
            carbs: Math.round(macros.carbs * dist.carbs),
            protein: Math.round(macros.protein * dist.protein),
            fat: Math.round(macros.fat * dist.fat),
            calories: Math.round(calories * dist.cals),
            suggestions: getSuggestedFoods(meal, goal)
        };
    });
    
    return mealPlan;
}

/**
 * Obtiene sugerencias de alimentos para una comida específica
 * @param {string} mealType - Tipo de comida (breakfast, morningSnack, lunch, afternoonSnack, dinner)
 * @param {string} goal - Objetivo del usuario
 * @returns {Array} - Lista de alimentos sugeridos
 */
function getSuggestedFoods(mealType, goal) {
    const suggestions = {
        breakfast: {
            'perder peso': [
                'Yogur griego con frutas y canela',
                'Tortilla de claras con espinacas y tomate',
                'Avena con proteína en polvo y frutos rojos',
                'Tostada integral con aguacate y huevo',
                'Batido verde con proteína vegetal y espinacas'
            ],
            'mantener peso': [
                'Huevos revueltos con pan integral y aguacate',
                'Bowl de yogur con frutas, granola y miel',
                'Tostadas integrales con queso fresco y tomate',
                'Batido de proteínas con plátano y avena',
                'Panqueques de avena con frutas frescas'
            ],
            'ganar peso': [
                'Batido calórico con avena, plátano, mantequilla de maní y proteína',
                'Tostadas francesas con frutas, yogur y miel',
                'Huevos revueltos con aguacate, queso y pan integral',
                'Bowl de avena con plátano, nueces, semillas y mantequilla de almendras',
                'Wrap de tortilla integral con huevos, aguacate y queso'
            ]
        },
        morningSnack: {
            'perder peso': [
                'Manzana con una cucharada de mantequilla de almendras',
                'Yogur griego natural',
                'Puñado pequeño de frutos secos (10-12 unidades)',
                'Palitos de apio con hummus',
                'Huevo duro'
            ],
            'mantener peso': [
                'Fruta fresca con yogur',
                'Puñado de frutos secos mixtos',
                'Batido pequeño de proteínas',
                'Galletas de avena caseras',
                'Tostada integral con hummus'
            ],
            'ganar peso': [
                'Batido proteico con leche entera, plátano y avena',
                'Yogur griego con granola, nueces y miel',
                'Sándwich pequeño de pavo y aguacate',
                'Wrap de hummus con verduras y pavo',
                'Smoothie con proteína, frutas y mantequilla de maní'
            ]
        },
        lunch: {
            'perder peso': [
                'Pechuga de pollo a la plancha con ensalada verde y quinoa',
                'Ensalada de atún con huevo duro, verduras y aceite de oliva',
                'Bowl de quinoa con verduras, tofu y semillas',
                'Sopa de verduras con pechuga de pollo desmenuzada',
                'Wrap de lechuga con proteína magra y verduras'
            ],
            'mantener peso': [
                'Ensalada completa de pollo con aderezo ligero',
                'Wrap integral de pavo con verduras y hummus',
                'Bowl de arroz integral con salmón y vegetales salteados',
                'Pasta integral con pesto de albahaca y pollo',
                'Tacos de pescado con tortillas de maíz y ensalada'
            ],
            'ganar peso': [
                'Pasta integral con salsa de carne magra y queso',
                'Wrap de pollo con aguacate, queso y mayonesa',
                'Bowl de frijoles, arroz y carne con guacamole',
                'Lasaña de carne con pan de ajo',
                'Burrito completo con tortilla integral, carne, arroz, frijoles y aguacate'
            ]
        },
        afternoonSnack: {
            'perder peso': [
                'Batido de proteínas con agua o leche vegetal',
                'Palitos de zanahoria con hummus',
                'Fruta fresca de temporada',
                'Gelatina sin azúcar con frutas',
                'Rollitos de pavo y pepino'
            ],
            'mantener peso': [
                'Yogur con frutas',
                'Tostada con aguacate',
                'Batido de proteínas con frutas',
                'Puñado de frutos secos y frutas deshidratadas',
                'Mini sándwich de huevo'
            ],
            'ganar peso': [
                'Batido de proteínas con leche, plátano y mantequilla de maní',
                'Tostadas con aguacate y huevo',
                'Trail mix con frutos secos, semillas y chocolate negro',
                'Yogur griego con granola y miel',
                'Galletas de avena con proteína y mantequilla de almendras'
            ]
        },
        dinner: {
            'perder peso': [
                'Pescado al horno con verduras asadas',
                'Ensalada proteica con pollo o atún y aderezo ligero',
                'Tofu salteado con vegetales y salsa de soja baja en sodio',
                'Tortilla de claras con espinacas y champiñones',
                'Crema de verduras con pechuga de pollo a la plancha'
            ],
            'mantener peso': [
                'Pescado a la plancha con batata asada y verduras',
                'Pollo asado con arroz y vegetales',
                'Tofu con verduras salteadas y quinoa',
                'Hamburguesa casera con pan integral y ensalada',
                'Curry de garbanzos con arroz integral'
            ],
            'ganar peso': [
                'Salmón con puré de patatas y verduras',
                'Pollo al horno con arroz y salsa',
                'Pasta integral con albóndigas de pavo y queso',
                'Burrito completo con carne, frijoles, arroz y aguacate',
                'Pizza casera con masa integral, pollo y verduras'
            ]
        }
    };
    
    // Devolver sugerencias si existen para este tipo de comida y objetivo
    if (suggestions[mealType] && suggestions[mealType][goal]) {
        return suggestions[mealType][goal];
    }
    
    // Sugerencias genéricas si no hay específicas
    return [
        'Opción saludable balanceada en proteínas y fibra',
        'Combinación de carbohidratos complejos y proteínas',
        'Alimentos integrales con grasas saludables',
        'Opción rica en nutrientes y adaptada a tu objetivo'
    ];
}

/**
 * Genera recetas simples basadas en los alimentos sugeridos
 * @param {Array} foods - Lista de alimentos sugeridos
 * @param {string} mealType - Tipo de comida
 * @param {string} goal - Objetivo del usuario
 * @returns {string} - Receta simple
 */
function generateSimpleRecipe(foods, mealType, goal) {
    let recipe = '';
    
    if (mealType === 'breakfast') {
        recipe = `🍳 DESAYUNO NUTRITIVO:\n\n`;
        recipe += `Opción 1: ${foods[0]}\n`;
        recipe += `• Beneficios: Proporciona proteínas para mantenerte saciado durante la mañana y carbohidratos para energía inicial.\n`;
        recipe += `• Preparación: Combina los ingredientes en un bowl y disfruta. Puedes preparar la avena la noche anterior para ahorrar tiempo.\n\n`;
        
        recipe += `Opción 2: ${foods[1]}\n`;
        recipe += `• Beneficios: Excelente fuente de proteínas magras y verduras para empezar el día con nutrientes esenciales.\n`;
        recipe += `• Preparación: Cocina a fuego medio-bajo para mantener los nutrientes de las verduras.\n\n`;
        
        if (goal === 'perder peso') {
            recipe += `💡 Consejo para pérdida de peso: Incluye proteínas en el desayuno para reducir antojos durante el día y mantener niveles estables de glucosa en sangre.\n`;
        } else if (goal === 'ganar peso') {
            recipe += `💡 Consejo para ganancia de peso: Añade una cucharada extra de mantequilla de frutos secos o utiliza leche entera en lugar de desnatada para aumentar las calorías sin aumentar el volumen.\n`;
        }
        
        recipe += `🥤 Para beber: Agua, café o té sin azúcar, o un vaso pequeño de jugo natural.\n`;
    } else if (mealType === 'morningSnack' || mealType === 'afternoonSnack') {
        recipe = `🥪 MERIENDA/TENTEMPIÉ:\n\n`;
        recipe += `Opción 1: ${foods[0]}\n`;
        recipe += `• Ideal para: Mantener los niveles de energía entre comidas y controlar el apetito.\n`;
        recipe += `• Tamaño de porción: ${goal === 'perder peso' ? 'Pequeña (100-150 kcal)' : goal === 'ganar peso' ? 'Generosa (200-300 kcal)' : 'Moderada (150-200 kcal)'}.\n\n`;
        
        recipe += `Opción 2: ${foods[1]}\n`;
        recipe += `• Beneficios: Combina proteínas y nutrientes esenciales para mantener saciedad y estabilidad energética.\n`;
        recipe += `• Momento ideal: 2-3 horas después/antes de comidas principales.\n\n`;
        
        if (goal === 'perder peso') {
            recipe += `💡 Consejo para pérdida de peso: Prioriza tentempiés ricos en proteínas y fibra que te mantengan saciado con menos calorías.\n`;
        } else if (goal === 'ganar peso') {
            recipe += `💡 Consejo para ganancia de peso: Añade una fuente de grasa saludable como aguacate, frutos secos o aceite de oliva para aumentar las calorías de forma nutritiva.\n`;
        }
    } else if (mealType === 'lunch') {
        recipe = `🍲 COMIDA PRINCIPAL:\n\n`;
        recipe += `Opción 1: ${foods[0]}\n`;
        recipe += `• Composición: Proteína magra + carbohidratos complejos + verduras + grasas saludables.\n`;
        recipe += `• Beneficios: Plato completo con buen balance de macronutrientes para energía sostenida durante la tarde.\n`;
        recipe += `• Preparación: Cocina la proteína a la plancha o al horno, y los vegetales al vapor o salteados para preservar nutrientes.\n\n`;
        
        recipe += `Opción 2: ${foods[1]}\n`;
        recipe += `• Alternativa saciante y nutritiva con equilibrio de macronutrientes.\n`;
        recipe += `• Tip: Prepara porciones extras para tener comida lista los días siguientes.\n\n`;
        
        if (goal === 'perder peso') {
            recipe += `💡 Consejo para pérdida de peso: Llena la mitad de tu plato con verduras, un cuarto con proteínas magras y otro cuarto con carbohidratos complejos.\n`;
        } else if (goal === 'ganar peso') {
            recipe += `💡 Consejo para ganancia de peso: Aumenta las porciones de carbohidratos y proteínas, y asegúrate de incluir suficientes grasas saludables para incrementar las calorías.\n`;
        }
        
        recipe += `🥗 Complementos recomendados: Ensalada verde con vinagreta ligera de oliva y limón, sopa de verduras ligera como entrante.\n`;
        recipe += `🥛 Hidratación: Acompaña con agua, té o una bebida sin azúcar.\n`;
    } else if (mealType === 'dinner') {
        recipe = `🍽️ CENA BALANCEADA:\n\n`;
        recipe += `Opción 1: ${foods[0]}\n`;
        recipe += `• Características: Proteína de alta calidad con vegetales y carbohidratos moderados.\n`;
        recipe += `• Beneficios: Nutrientes esenciales para la recuperación nocturna sin sobrecargar la digestión.\n`;
        recipe += `• Preparación: Métodos ligeros como horneado, vapor o plancha. Evita frituras o salsas muy pesadas para la noche.\n\n`;
        
        recipe += `Opción 2: ${foods[1]}\n`;
        recipe += `• Alternativa equilibrada que favorece un buen descanso nocturno.\n`;
        recipe += `• Nota: Incluye verduras coloridas para maximizar micronutrientes.\n\n`;
        
        if (goal === 'perder peso') {
            recipe += `💡 Consejo para pérdida de peso: Cena al menos 2-3 horas antes de acostarte. Prioriza proteínas y verduras, reduciendo carbohidratos en esta comida.\n`;
        } else if (goal === 'ganar peso') {
            recipe += `💡 Consejo para ganancia de peso: Incluye un snack proteico antes de dormir como yogur griego con miel o una mezcla de frutos secos con queso cottage.\n`;
        } else {
            recipe += `💡 Consejo general: Cenar al menos 2 horas antes de acostarte mejora la digestión y la calidad del sueño.\n`;
        }
        
        recipe += `⚠️ Evita: Grandes cantidades de carbohidratos refinados, azúcares, alimentos muy grasos o picantes que puedan interferir con tu descanso.\n`;
    }
    
    return recipe;
}

/**
 * Genera un plan semanal de comidas
 * @param {Object} userData - Datos del usuario
 * @returns {Object} - Plan semanal de comidas
 */
function generateWeeklyMealPlan(userData) {
    const weeklyPlan = {
        lunes: {},
        martes: {},
        miercoles: {},
        jueves: {},
        viernes: {},
        sabado: {},
        domingo: {}
    };
    
    const calories = calculateCalorieNeeds(userData);
    const macros = calculateMacroDistribution(userData);
    
    // Ajustar calorías según el día de la semana (más en días de entrenamiento, menos en días de descanso)
    const calorieAdjustments = {
        lunes: 1.0,      // Normal
        martes: 1.05,    // Día de entrenamiento
        miercoles: 1.0,  // Normal
        jueves: 1.05,    // Día de entrenamiento
        viernes: 1.0,    // Normal
        sabado: 0.95,    // Reducción ligera
        domingo: 0.95    // Reducción ligera
    };
    
    // Generar plan para cada día
    Object.keys(weeklyPlan).forEach(day => {
        const dailyCalories = Math.round(calories * calorieAdjustments[day]);
        const dailyMacros = {
            protein: Math.round(macros.protein * calorieAdjustments[day]),
            carbs: Math.round(macros.carbs * calorieAdjustments[day]),
            fat: Math.round(macros.fat * calorieAdjustments[day])
        };
        
        weeklyPlan[day] = generateMealPlan(dailyMacros, dailyCalories, userData.goal);
    });
    
    return weeklyPlan;
}

/**
 * Genera recetas detalladas para una comida específica
 * @param {string} mealType - Tipo de comida
 * @param {string} goal - Objetivo del usuario
 * @returns {Array} - Lista de recetas detalladas
 */
function getDetailedRecipes(mealType, goal) {
    const recipes = {
        breakfast: {
            'perder peso': [
                {
                    nombre: 'Bowl de yogur griego proteico',
                    ingredientes: [
                        '200g de yogur griego 0% de grasa',
                        '100g de fresas frescas o congeladas',
                        '1 cucharada de semillas de chía',
                        '10g de nueces picadas',
                        'Canela al gusto'
                    ],
                    preparacion: 'Mezcla el yogur griego con la canela. Añade las fresas cortadas, las semillas de chía y las nueces picadas por encima.',
                    macros: 'Proteínas: 22g | Carbohidratos: 15g | Grasas: 8g | Calorías: 220',
                    beneficios: 'Alta en proteínas para promover saciedad, baja en carbohidratos, contiene grasas saludables y antioxidantes.'
                },
                {
                    nombre: 'Tostada de aguacate y huevo',
                    ingredientes: [
                        '1 rebanada de pan integral de centeno',
                        '1/4 de aguacate',
                        '1 huevo',
                        'Tomate cherry',
                        'Sal y pimienta al gusto',
                        'Hojuelas de chile (opcional)'
                    ],
                    preparacion: 'Tuesta el pan. Machaca el aguacate y extiéndelo sobre la tostada. Cocina el huevo a tu gusto (recomendado pochado o pasado por agua) y colócalo encima. Decora con tomate cherry cortado y especias.',
                    macros: 'Proteínas: 15g | Carbohidratos: 18g | Grasas: 13g | Calorías: 245',
                    beneficios: 'Combinación de proteínas y grasas saludables que promueven saciedad prolongada y estabilidad de glucosa en sangre.'
                }
            ],
            'mantener peso': [
                {
                    nombre: 'Batido completo de desayuno',
                    ingredientes: [
                        '1 plátano maduro',
                        '200ml de leche desnatada o bebida vegetal',
                        '1 scoop (30g) de proteína en polvo sabor vainilla',
                        '1 cucharada de avena integral',
                        '1 cucharada de mantequilla de almendras',
                        'Hielo al gusto'
                    ],
                    preparacion: 'Combina todos los ingredientes en una batidora y procesa hasta obtener una textura homogénea.',
                    macros: 'Proteínas: 28g | Carbohidratos: 40g | Grasas: 10g | Calorías: 360',
                    beneficios: 'Ofrece un balance perfecto de macronutrientes para mantenimiento, con proteínas, carbohidratos complejos y grasas saludables.'
                }
            ],
            'ganar peso': [
                {
                    nombre: 'Gachas de avena hipercalóricas',
                    ingredientes: [
                        '80g de avena integral',
                        '300ml de leche entera',
                        '1 plátano maduro',
                        '2 cucharadas de mantequilla de maní',
                        '1 scoop (30g) de proteína en polvo',
                        '1 cucharada de miel',
                        '15g de nueces picadas',
                        'Canela al gusto'
                    ],
                    preparacion: 'Cocina la avena con la leche a fuego medio-bajo. Cuando esté casi lista, añade la proteína en polvo, el plátano en rodajas y la mantequilla de maní. Sirve y decora con nueces y miel.',
                    macros: 'Proteínas: 35g | Carbohidratos: 85g | Grasas: 30g | Calorías: 740',
                    beneficios: 'Alta densidad calórica y nutricional ideal para ganancia de peso. Proporciona energía sostenida y proteínas para el desarrollo muscular.'
                }
            ]
        },
        lunch: {
            'perder peso': [
                {
                    nombre: 'Bowl de proteína con quinoa',
                    ingredientes: [
                        '120g de pechuga de pollo (o tofu para vegetarianos)',
                        '50g de quinoa en crudo (rinde ~150g cocida)',
                        'Mix de verduras: espinacas, tomate, pimiento, cebolla morada',
                        '1/4 de aguacate',
                        '1 cucharada de semillas mixtas',
                        'Aliño: limón, vinagre de manzana, mostaza, especias'
                    ],
                    preparacion: 'Cocina la quinoa según las instrucciones. Saltea el pollo cortado en cubos con especias. Prepara las verduras. Monta el bowl con la quinoa de base, luego las verduras, el pollo, el aguacate en cubos y las semillas. Aliña al gusto.',
                    macros: 'Proteínas: 35g | Carbohidratos: 30g | Grasas: 12g | Calorías: 368',
                    beneficios: 'Alto contenido proteico para preservar masa muscular durante el déficit calórico. Carbohidratos complejos para energía sostenida.'
                }
            ],
            'mantener peso': [
                {
                    nombre: 'Wrap mediterráneo completo',
                    ingredientes: [
                        '1 tortilla integral grande',
                        '120g de pollo o pavo a la plancha',
                        '2 cucharadas de hummus',
                        'Verduras variadas: lechuga, tomate, pepino, cebolla',
                        '30g de queso feta desmenuzado',
                        'Aceitunas negras picadas',
                        'Orégano y pimienta'
                    ],
                    preparacion: 'Extiende el hummus sobre la tortilla. Añade las verduras cortadas, la proteína en tiras, el queso y las aceitunas. Condimenta, enrolla firmemente y corta por la mitad.',
                    macros: 'Proteínas: 32g | Carbohidratos: 35g | Grasas: 15g | Calorías: 400',
                    beneficios: 'Balance de macronutrientes ideal para mantenimiento de peso, con grasas saludables mediterráneas.'
                }
            ]
        },
        dinner: {
            'perder peso': [
                {
                    nombre: 'Salmón al horno con verduras',
                    ingredientes: [
                        '150g de filete de salmón',
                        '200g de verduras variadas (brócoli, zanahoria, calabacín)',
                        '1 cucharada de aceite de oliva',
                        'Limón, eneldo, sal y pimienta',
                        '100g de batata (opcional, dependiendo de necesidades calóricas)'
                    ],
                    preparacion: 'Precalienta el horno a 180°C. Coloca el salmón en papel de aluminio, añade rodajas de limón, eneldo y condimentos. Cierra el papel y hornea 15-20 minutos junto con las verduras rociadas con aceite de oliva.',
                    macros: 'Proteínas: 29g | Carbohidratos: 10g (30g con batata) | Grasas: 15g | Calorías: 290 (390 con batata)',
                    beneficios: 'Rica en proteínas y omega-3, baja en carbohidratos para la noche. Perfecta para perder peso sin sacrificar nutrición.'
                }
            ]
        }
    };
    
    // Devolver recetas específicas para el tipo de comida y objetivo
    if (recipes[mealType] && recipes[mealType][goal]) {
        return recipes[mealType][goal];
    }
    
    // Si no hay recetas específicas, devolver array vacío
    return [];
}

/**
 * Genera recomendaciones para intolerancias o alergias alimentarias
 * @param {Array} intolerancias - Lista de intolerancias del usuario
 * @returns {Object} - Recomendaciones y alternativas por intolerancia
 */
function getRecomendacionesIntolerancias(intolerancias) {
    const recomendaciones = {
        gluten: {
            evitar: ['Trigo, cebada, centeno y sus derivados', 'Pan, pasta y cereales convencionales', 'Cerveza', 'Salsas y aderezos comerciales', 'Embutidos'],
            alternativas: ['Arroz, maíz, quinoa, mijo, amaranto, trigo sarraceno', 'Productos etiquetados "sin gluten"', 'Todas las frutas y verduras', 'Carnes, pescados y huevos no procesados', 'Lácteos naturales sin aditivos'],
            consejo: 'Lee siempre las etiquetas, ya que el gluten puede estar oculto en muchos alimentos procesados. Evita la contaminación cruzada en la cocina.'
        },
        lactosa: {
            evitar: ['Leche de vaca, oveja y cabra', 'Quesos frescos y crema', 'Helados convencionales', 'Yogures no específicos sin lactosa', 'Salsas cremosas'],
            alternativas: ['Bebidas vegetales (almendra, coco, avena)', 'Yogures y quesos sin lactosa', 'Leche deslactosada', 'Tofu y productos de soja', 'Helados veganos o sin lactosa'],
            consejo: 'Los quesos curados contienen menos lactosa y muchas personas con intolerancia pueden tolerarlos. Las enzimas lactasa como suplemento pueden ayudar en comidas ocasionales.'
        },
        frutos_secos: {
            evitar: ['Todos los frutos secos: almendras, nueces, avellanas, etc.', 'Mantequillas y aceites derivados', 'Productos de panadería con frutos secos', 'Algunos cereales y barritas energéticas', 'Salsas como pesto'],
            alternativas: ['Semillas (chía, lino, calabaza, girasol)', 'Aguacate como fuente de grasas saludables', 'Aceite de oliva y de coco', 'Cremas de semillas en lugar de mantequillas de frutos secos'],
            consejo: 'Las alergias a frutos secos pueden ser severas. Lee siempre las etiquetas y advierte en restaurantes. Lleva adrenalina autoinyectable si tu alergia es grave.'
        }
    };
    
    // Filtrar solo las intolerancias del usuario
    const resultado = {};
    intolerancias.forEach(intolerancia => {
        if (recomendaciones[intolerancia]) {
            resultado[intolerancia] = recomendaciones[intolerancia];
        }
    });
    
    return resultado;
}

/**
 * Calcula el tiempo óptimo para comer antes y después del ejercicio
 * @param {string} tipoEjercicio - Tipo de ejercicio (cardio, fuerza, etc.)
 * @param {string} intensidad - Intensidad del ejercicio
 * @param {string} objetivo - Objetivo del usuario
 * @returns {Object} - Recomendaciones de nutrición periworkout
 */
function getNutricionPeriworkout(tipoEjercicio, intensidad, objetivo) {
    // Recomendaciones básicas que se adaptarán
    let recomendaciones = {
        preEntreno: {
            tiempo: '1-2 horas antes',
            comida: 'Carbohidratos de digestión moderada con algo de proteína',
            ejemplos: ['Avena con proteína y plátano', 'Tostada de pan integral con huevo']
        },
        postEntreno: {
            tiempo: '30-60 minutos después',
            comida: 'Proteínas y carbohidratos para recuperación',
            ejemplos: ['Batido de proteínas con plátano', 'Yogur con frutas y granola']
        }
    };
    
    // Ajustar según tipo de ejercicio
    if (tipoEjercicio === 'fuerza') {
        recomendaciones.preEntreno.comida = 'Carbohidratos complejos y proteínas';
        recomendaciones.postEntreno.comida = 'Proteínas de alta calidad y carbohidratos para reponer glucógeno';
        recomendaciones.postEntreno.macros = 'Ratio 1:2 proteína:carbohidratos';
    } else if (tipoEjercicio === 'cardio') {
        recomendaciones.preEntreno.comida = 'Carbohidratos de fácil digestión';
        recomendaciones.preEntreno.tiempo = '30-60 minutos antes';
        recomendaciones.postEntreno.comida = 'Carbohidratos para reponer glucógeno y proteínas moderadas';
        recomendaciones.postEntreno.macros = 'Ratio 1:3 proteína:carbohidratos';
    }
    
    // Ajustar según intensidad
    if (intensidad === 'alta') {
        recomendaciones.preEntreno.tiempo = '2-3 horas antes (comida completa) o 30-45 min antes (snack ligero)';
        recomendaciones.hidratacion = 'Crítica: 500-600ml 2-3 horas antes, 200-300ml 15 min antes y 150-250ml cada 15-20 min durante';
    } else if (intensidad === 'baja') {
        recomendaciones.preEntreno.tiempo = 'No tan crítico. 30-60 min antes es suficiente';
        recomendaciones.hidratacion = 'Normal: 400-500ml 1 hora antes y según sed durante';
    }
    
    // Ajustar según objetivo
    if (objetivo === 'perder peso') {
        recomendaciones.estrategia = 'Considerar entrenamiento en ayunas para ejercicio de baja intensidad. Para alta intensidad, snack ligero previo.';
        recomendaciones.postEntreno.macros = 'Priorizar proteínas, moderar carbohidratos';
    } else if (objetivo === 'ganar peso') {
        recomendaciones.estrategia = 'Asegurar superávit calórico. No entrenar con estómago vacío.';
        recomendaciones.postEntreno.tiempo = 'Lo antes posible (ventana anabólica)';
        recomendaciones.postEntreno.macros = 'Proteínas (25-30g) y carbohidratos abundantes (60-80g)';
    }
    
    return recomendaciones;
}