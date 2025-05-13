// Inicialización al cargar la página
$(document).ready(function() {
    // Establecer el año actual en el footer
    $('#current-year').text(new Date().getFullYear());
    
    // Iniciar chat
    initChat();
    
    // Configurar navegación
    setupNavigation();
    
    // Configurar eventos
    setupEventListeners();
});

// Variables globales
let currentQuestion = 'initial';
let userData = {
    gender: '',
    age: '',
    weight: '',
    height: '',
    activityLevel: '',
    goal: '',
    currentCalories: '',
    foodPreferences: [],
    restrictions: [],
    lastInteraction: null
};

// Preferencias de usuario para respuestas
let userPreferences = {
    tone: 'balanced',  // formal, balanced, casual
    detail: 'balanced'  // concise, balanced, detailed
};

// Base de conocimientos sobre nutrición
const nutritionKnowledge = {
    // Preguntas generales sobre nutrición
    general: [
        {
            keywords: ['qué', 'es', 'nutrición', 'definición'],
            answer: "La nutrición es el proceso biológico en el que los organismos asimilan y utilizan los alimentos y líquidos para el funcionamiento, el crecimiento y el mantenimiento de sus funciones vitales. Una buena nutrición implica obtener los nutrientes adecuados para mantener el cuerpo funcionando en su nivel óptimo y prevenir enfermedades relacionadas con la alimentación."
        },
        {
            keywords: ['por qué', 'importante', 'nutrición', 'alimentación', 'saludable'],
            answer: "Una buena nutrición es fundamental por múltiples razones: 1) Proporciona energía y nutrientes esenciales para el funcionamiento óptimo del cuerpo, 2) Fortalece el sistema inmunológico para proteger contra enfermedades, 3) Reduce el riesgo de enfermedades crónicas como diabetes, hipertensión y problemas cardiovasculares, 4) Mejora la salud mental y el estado de ánimo, 5) Contribuye a una mayor longevidad y calidad de vida, 6) Optimiza el rendimiento físico y cognitivo, y 7) Favorece un peso corporal saludable y una buena composición corporal."
        },
        {
            keywords: ['qué', 'son', 'nutrientes', 'esenciales', 'tipos'],
            answer: "Los nutrientes esenciales son compuestos que el cuerpo necesita pero no puede sintetizar en cantidades suficientes, por lo que deben obtenerse a través de la alimentación. Se dividen en: 1) Macronutrientes (necesarios en grandes cantidades): proteínas, carbohidratos y grasas; 2) Micronutrientes (necesarios en pequeñas cantidades): vitaminas y minerales; 3) Ácidos grasos esenciales: omega-3 y omega-6; 4) Aminoácidos esenciales: 9 de los 20 aminoácidos; 5) Agua: fundamental para todas las funciones corporales. Cada uno cumple funciones específicas e insustituibles en el organismo."
        }
    ],
    
    // Macronutrientes
    macronutrientes: [
        {
            keywords: ['qué', 'son', 'macronutrientes', 'tipos'],
            answer: "Los macronutrientes son nutrientes que el cuerpo necesita en grandes cantidades y proporcionan energía (calorías). Los tres principales macronutrientes son: 1) Proteínas (4 calorías por gramo): fundamentales para construir y reparar tejidos, producir enzimas y hormonas, y fortalecer el sistema inmunológico; 2) Carbohidratos (4 calorías por gramo): principal fuente de energía para el cuerpo y especialmente para el cerebro; 3) Grasas (9 calorías por gramo): importantes para la absorción de vitaminas liposolubles, protección de órganos, producción hormonal y funcionamiento celular."
        },
        {
            keywords: ['proteínas', 'función', 'fuentes', 'alimentos'],
            answer: "Las proteínas son esenciales para construir y reparar tejidos, producir enzimas y hormonas, y mantener el sistema inmunológico. Están compuestas por aminoácidos, 9 de los cuales son esenciales (deben obtenerse de la dieta). Fuentes saludables incluyen: carnes magras (pollo, pavo, cortes magros de res), pescado (atún, salmón, bacalao), huevos, legumbres (frijoles, lentejas, garbanzos), productos lácteos (yogur griego, queso cottage), tofu, tempeh, edamame, quinoa, y frutos secos. Para una dieta equilibrada, se recomienda consumir proteínas de diversas fuentes, tanto animales como vegetales, para obtener un perfil completo de aminoácidos."
        },
        {
            keywords: ['carbohidratos', 'carbos', 'función', 'fuentes', 'alimentos'],
            answer: "Los carbohidratos son la principal fuente de energía del cuerpo. Se dividen en: 1) Carbohidratos simples: azúcares de absorción rápida como fructosa (frutas), lactosa (lácteos) y glucosa. 2) Carbohidratos complejos: cadenas largas de moléculas de azúcar que proporcionan energía sostenida y fibra. Fuentes saludables incluyen granos enteros (avena, arroz integral, quinoa), legumbres, vegetales ricos en almidón (patatas, boniatos), y frutas. Es preferible limitar los carbohidratos refinados (azúcares añadidos, harinas blancas) y optar por fuentes integrales ricas en fibra para mejor control glucémico, mayor saciedad y mejor salud digestiva."
        },
        {
            keywords: ['grasas', 'función', 'fuentes', 'alimentos', 'saludables'],
            answer: "Las grasas son esenciales para la absorción de vitaminas liposolubles (A, D, E, K), protección de órganos, regulación de hormonas y salud cerebral. Tipos principales: 1) Monoinsaturadas: aguacate, aceite de oliva, frutos secos; 2) Poliinsaturadas: aceites vegetales, pescados grasos (omega-3), semillas; 3) Saturadas: carnes, lácteos enteros, aceite de coco (consumo moderado); 4) Trans: alimentos procesados, algunas margarinas (evitar). Fuentes saludables incluyen: aguacates, aceite de oliva extra virgen, nueces y semillas, pescados grasos (salmón, sardinas), huevos y aceite de coco en moderación. Es recomendable limitar las grasas trans (alimentos procesados) y moderar las grasas saturadas."
        },
        {
            keywords: ['proteína', 'cuánta', 'necesito', 'cantidad', 'recomendada'],
            answer: "La cantidad de proteína recomendada varía según varios factores: 1) Sedentarios o actividad ligera: 0.8-1.0g por kg de peso corporal; 2) Actividad moderada: 1.1-1.4g/kg; 3) Entrenamiento intenso/atletas: 1.4-2.0g/kg; 4) Construcción muscular: 1.6-2.2g/kg; 5) Pérdida de peso: 1.8-2.2g/kg para preservar masa muscular en déficit calórico; 6) Adultos mayores: 1.2-1.5g/kg para contrarrestar pérdida muscular. Para mayor beneficio, distribuye la proteína uniformemente en 3-5 comidas (20-30g por comida). La calidad también importa: prioriza fuentes completas que proporcionen todos los aminoácidos esenciales (carnes magras, pescado, huevos, lácteos, combinaciones adecuadas de proteínas vegetales)."
        }
    ],
    
    // Micronutrientes
    micronutrientes: [
        {
            keywords: ['qué', 'son', 'micronutrientes', 'tipos'],
            answer: "Los micronutrientes son nutrientes que el cuerpo necesita en pequeñas cantidades pero que son vitales para el desarrollo, la prevención de enfermedades y el bienestar general. Los principales tipos son: 1) Vitaminas: compuestos orgánicos esenciales para procesos metabólicos, divididas en hidrosolubles (C y complejo B) y liposolubles (A, D, E, K); 2) Minerales: elementos inorgánicos que actúan como cofactores enzimáticos y componentes estructurales, incluyendo macrominerales (calcio, magnesio, potasio) y oligoelementos (hierro, zinc, selenio). A diferencia de los macronutrientes, no proporcionan energía directamente, pero son indispensables para que el cuerpo funcione correctamente."
        },
        {
            keywords: ['vitaminas', 'función', 'fuentes', 'importantes'],
            answer: "Las vitaminas son compuestos orgánicos esenciales para muchas funciones corporales. Se dividen en dos grupos: 1) Hidrosolubles (C y complejo B): no se almacenan significativamente, requieren consumo regular, se encuentran en frutas, verduras, granos enteros y proteínas; 2) Liposolubles (A, D, E, K): se almacenan en tejidos grasos, se encuentran en grasas alimentarias, vegetales de hoja verde, lácteos y pescados grasos. Funciones principales: Vitamina A (visión, inmunidad), B (metabolismo energético), C (inmunidad, colágeno), D (huesos, inmunidad), E (antioxidante), K (coagulación). Es importante consumir una variedad de alimentos para obtener todas las vitaminas necesarias."
        },
        {
            keywords: ['minerales', 'función', 'fuentes', 'importantes'],
            answer: "Los minerales son elementos inorgánicos esenciales para muchas funciones corporales. Los principales incluyen: 1) Calcio (lácteos, vegetales de hoja verde): fortalece huesos y dientes, función muscular y nerviosa; 2) Hierro (carnes rojas, legumbres, espinacas): transporta oxígeno en la sangre; 3) Potasio (plátanos, patatas, legumbres): equilibrio hídrico y función muscular; 4) Magnesio (nueces, granos enteros, vegetales verdes): función muscular y nerviosa, metabolismo energético; 5) Zinc (carnes, mariscos, legumbres): sistema inmunológico, cicatrización; 6) Sodio (sal): balance de fluidos y función nerviosa (necesario pero generalmente consumido en exceso). Otros importantes: yodo (tiroides), selenio (antioxidante), fósforo (huesos), cobre (formación de glóbulos rojos)."
        },
        {
            keywords: ['hierro', 'anemia', 'deficiencia', 'absorción'],
            answer: "El hierro es un mineral esencial para transportar oxígeno en la sangre. Existen dos tipos: 1) Hierro hemo (animal): más fácilmente absorbible (15-35%), presente en carnes rojas, hígado, mariscos; 2) Hierro no-hemo (vegetal): menor absorción (2-20%), presente en legumbres, vegetales verdes, frutos secos. Para mejorar la absorción del hierro vegetal: consume alimentos ricos en vitamina C simultáneamente (cítricos, pimientos), evita café/té con comidas, usa utensilios de hierro para cocinar. Factores que reducen absorción: fitatos (cereales), taninos (té, café), calcio, algunas medicaciones. La deficiencia es común en mujeres en edad fértil, vegetarianos/veganos y deportistas, causando fatiga, debilidad y deterioro cognitivo."
        }
    ],
    
    // Agua e hidratación
    hidratacion: [
        {
            keywords: ['agua', 'cuánta', 'beber', 'hidratación', 'importancia'],
            answer: "El agua es esencial para todas las funciones corporales, representando 60-70% del peso corporal. Se recomienda beber aproximadamente 2-3 litros diarios (8-10 vasos), aunque las necesidades varían según el peso corporal (30-35ml/kg/día), nivel de actividad, clima y estado de salud. Funciones: regula temperatura corporal, lubrica articulaciones, elimina desechos, facilita digestión y absorción de nutrientes, mantiene presión sanguínea. La deshidratación, incluso leve (1-2%), puede causar fatiga, deterioro cognitivo, dolor de cabeza y bajo rendimiento físico. Señales de buena hidratación: orina color amarillo claro, buen nivel de energía, piel elástica. Fuentes adicionales: frutas y verduras con alto contenido de agua (pepino, sandía, apio)."
        },
        {
            keywords: ['electrolitos', 'sodio', 'potasio', 'bebidas', 'deportivas'],
            answer: "Los electrolitos son minerales con carga eléctrica esenciales para funciones nerviosas, musculares e hidratación celular. Los principales son: 1) Sodio: regulación de fluidos, función nerviosa; 2) Potasio: contracción muscular, presión arterial; 3) Magnesio: función muscular y nerviosa; 4) Calcio: contracción muscular, coagulación. Son especialmente importantes durante: ejercicio intenso con sudoración profusa (>60 min), climas cálidos, enfermedades con vómitos/diarrea. Fuentes naturales: frutas (plátanos, cítricos), verduras, lácteos, sal (con moderación). Las bebidas deportivas pueden ser útiles en ejercicio prolongado (>60-90 min) o intensa sudoración, pero contienen azúcares y calorías, innecesarias para actividad moderada donde el agua suele ser suficiente."
        }
    ],
    
    perdidaPeso: [
        {
            keywords: ['perder', 'peso', 'adelgazar', 'cómo', 'consejos'],
            answer: "Para perder peso de forma saludable y sostenible: 1) Crea un déficit calórico moderado (300-500 calorías menos al día para perder 0.3-0.5kg/semana), evitando restricciones severas que pueden reducir metabolismo y masa muscular; 2) Prioriza proteínas (1.6-2.2g/kg) para preservar músculo y aumentar saciedad; 3) Enfócate en alimentos integrales, ricos en fibra y nutrientes: verduras, frutas, proteínas magras, granos enteros y grasas saludables; 4) Limita alimentos ultraprocesados, azúcares añadidos y grasas de baja calidad; 5) Combina entrenamiento cardiovascular (3-5 sesiones/semana) con ejercicios de fuerza (2-3 sesiones/semana); 6) Prioriza calidad del sueño (7-9h) y manejo del estrés; 7) Mantén hidratación adecuada. Los cambios graduales y sostenibles llevan a resultados duraderos, evitando el efecto rebote de dietas restrictivas."
        },
        {
            keywords: ['déficit', 'calórico', 'qué', 'es', 'cómo', 'calcular'],
            answer: "Un déficit calórico ocurre cuando consumes menos calorías de las que gastas, lo que lleva a la pérdida de peso. Para calcularlo: 1) Determina tu gasto energético total diario (TDEE) usando calculadoras online o fórmulas como Mifflin-St Jeor: para mujeres, 10×peso(kg) + 6.25×altura(cm) - 5×edad(años) - 161; para hombres, 10×peso(kg) + 6.25×altura(cm) - 5×edad(años) + 5. Este resultado se multiplica por un factor de actividad: sedentario (1.2), ligera (1.375), moderada (1.55), activa (1.725), muy activa (1.9); 2) Resta 300-500 calorías para déficit moderado y sostenible (0.3-0.5kg/semana); 3) Monitorea resultados y ajusta según necesidades individuales. Déficits mayores al 25% pueden reducir metabolismo, masa muscular e inducir adaptaciones hormonales contraproducentes."
        },
        {
            keywords: ['meseta', 'estancamiento', 'no', 'pierdo', 'peso'],
            answer: "Las mesetas de peso son normales en procesos de adelgazamiento y pueden ocurrir por varias razones: 1) Adaptación metabólica: el cuerpo reduce su gasto energético tras pérdida de peso; 2) Menor efecto térmico: menos masa requiere menos calorías para mantenimiento; 3) Mayor eficiencia: el cuerpo se vuelve más eficiente en ejercicios repetitivos; 4) Inexactitud en cálculo calórico: sobreestimación de gasto o subestimación de ingesta; 5) Retención de líquidos temporal (especialmente en mujeres por ciclo hormonal). Estrategias para superar mesetas: A) Recalcular necesidades calóricas con el peso actual; B) Incorporar entrenamiento HIIT o de fuerza; C) Considerar pausas dietéticas estratégicas de 1-2 semanas en mantenimiento calórico; D) Rotar alimentos y cambiar rutinas de ejercicio; E) Revisar ingesta de sodio y asegurar adecuada hidratación; F) Considerar aspectos como estrés y sueño que afectan peso."
        },
        {
            keywords: ['dieta', 'cetogénica', 'keto', 'cetosis', 'baja', 'carbohidratos'],
            answer: "La dieta cetogénica es un régimen bajo en carbohidratos (20-50g/día), moderado en proteínas (15-20%) y alto en grasas (70-80%). Induce un estado de cetosis donde el cuerpo utiliza cetonas derivadas de grasas como energía principal en lugar de glucosa. Potenciales beneficios: pérdida de peso inicial rápida (principalmente agua al principio), mejor control de apetito, estabilidad de insulina. Consideraciones importantes: 1) Restricción significativa de muchos alimentos (frutas, granos, legumbres), lo que puede limitar adherencia a largo plazo; 2) Síndrome de adaptación inicial con síntomas como fatiga, dolores de cabeza y malestar; 3) Posibles efectos en lípidos sanguíneos (variables según persona); 4) Controversia sobre efectos a largo plazo; 5) No recomendada para atletas de alta intensidad, embarazadas, personas con ciertas condiciones metabólicas o renales. Antes de iniciarla, consulta con profesionales sanitarios."
        }
    ],
    
  
    aumentoPeso: [
        {
            keywords: ['ganar', 'peso', 'aumentar', 'masa', 'muscular', 'cómo'],
            answer: "Para ganar peso saludablemente, enfocándote en masa muscular sobre grasa: 1) Crea un superávit calórico moderado (300-500 calorías extra al día para ganar 0.25-0.5kg/semana); 2) Consume proteínas suficientes (1.6-2.2g por kg de peso) distribuidas en 4-5 comidas (25-40g por comida); 3) Incluye carbohidratos adecuados (5-8g/kg) para energía y recuperación, priorizando fuentes complejas; 4) No descuides grasas saludables (0.8-1g/kg) necesarias para hormonas anabólicas; 5) Realiza entrenamiento de fuerza progresivo 3-5 veces por semana, enfocado en ejercicios compuestos; 6) Prioriza recuperación adecuada: 7-9 horas de sueño, al menos 48h entre entrenamientos del mismo grupo muscular; 7) Considera batidos de proteína con carbohidratos post-entrenamiento y entre comidas si te cuesta alcanzar calorías con comida sólida. La consistencia y paciencia son clave para resultados de calidad."
        },
// Corrección de la respuesta sobre ganar peso
{
    keywords: ['ganar', 'peso', 'delgado', 'comer', 'más'],
    answer: "Para personas con dificultad para ganar peso (ectomorfos o \"hardgainers\"): 1) Aumenta densidad calórica sin aumentar excesivamente volumen: añade aceites saludables, frutos secos, mantequillas de frutos secos, aguacate a comidas habituales; 2) Establece 5-6 comidas diarias con horarios fijos y alarmas si es necesario; 3) Bebe calorías: batidos con proteína, avena, plátano, mantequilla de maní, leche; son menos saciantes que alimentos sólidos; 4) Come primero los alimentos más calóricos del plato cuando tienes más apetito; 5) Reduce fibra excesiva que aumenta saciedad; 6) Limita volumen de líquidos durante comidas; 7) Incorpora entrenamiento de fuerza para estimular apetito y asegurar que el peso ganado sea principalmente músculo; 8) Monitoriza peso e ingesta calórica para asegurar consistencia; 9) Considera la nutrición post-entrenamiento: consume proteínas y carbohidratos dentro de 1-2 horas después de entrenar para optimizar recuperación; 10) Paciencia: para muchos ectomorfos, ganar peso requiere esfuerzo consciente y constante."
},
        {
            keywords: ['ectomorfo', 'hardgainer', 'metabolismo', 'rápido', 'delgado'],
            answer: "Los ectomorfos o \"hardgainers\" tienen características físicas y metabólicas que dificultan el aumento de peso: cuerpo naturalmente delgado, metabolismo acelerado, menor apetito, mayor NEAT (actividad no ejercicio), posible malabsorción de nutrientes o diferencias en microbiota intestinal. Estrategias específicas para ectomorfos: 1) Superávit calórico mayor (500-700 kcal sobre mantenimiento); 2) Mayor proporción de carbohidratos (5-8g/kg); 3) Entrenamiento de fuerza enfocado en movimientos compuestos con menos volumen y más intensidad; 4) Cardio limitado (1-2 sesiones cortas/semana); 5) Priorizar ejercicios que estimulen mayor liberación de testosterona y hormona de crecimiento (sentadillas, peso muerto); 6) Técnicas de alimentación consciente: comer sin distracciones, platos más grandes, asegurar suficiente sueño para regular hormonas del apetito. Recuerda que algunos factores son genéticos, pero todos pueden lograr cambios significativos con el enfoque adecuado."
        }
    ],
    
    // Dietas específicas
    dietas: [
        {
            keywords: ['dieta', 'vegetariana', 'vegetarianismo', 'cómo', 'proteínas'],
            answer: "La dieta vegetariana excluye carnes pero puede incluir productos animales como huevos y lácteos. Para una dieta vegetariana equilibrada: 1) Asegura proteínas completas combinando fuentes complementarias (legumbres+granos) o incluyendo lácteos y huevos; una persona vegetariana debería consumir 1.2-1.4g proteína/kg para compensar menor biodisponibilidad proteica; 2) Vigila hierro (mejora absorción con vitamina C, usa utensilios de hierro), calcio (lácteos o alternativas fortificadas, tofu, almendras), zinc (legumbres, frutos secos), omega-3 (semillas de lino/chía, nueces, suplementos de algas); 3) Suplementa B12 si la ingesta de lácteos y huevos es limitada; 4) Incluye proteínas en cada comida: legumbres, tofu, tempeh, seitan, lácteos, huevos; 5) Asegura variedad de colores y grupos alimentarios para cubrir micronutrientes; 6) Si practicas deporte, ajusta proteínas y calorías según necesidades específicas."
        },
        {
            keywords: ['dieta', 'vegana', 'veganismo', 'cómo', 'proteínas'],
            answer: "La dieta vegana excluye todos los productos de origen animal. Para seguirla de forma nutricionalmente adecuada: 1) Asegura suficiente proteína (1.3-1.5g/kg) combinando diferentes fuentes vegetales para obtener todos los aminoácidos esenciales: legumbres, tofu, tempeh, seitan, pseudocereales como quinoa; 2) Suplementa vitamina B12 (esencial, no negociable); 3) Incluye fuentes de hierro como legumbres, tofu, espinacas, semillas, combinadas con vitamina C para mejor absorción; 4) Considera fuentes de omega-3 como semillas de lino, chía, nueces o suplementos de algas; 5) Asegura calcio mediante vegetales de hoja verde, tofu preparado con calcio, bebidas vegetales fortificadas; 6) Otros nutrientes a vigilar: yodo (sal yodada, algas con moderación), zinc (legumbres, frutos secos, semillas), vitamina D (exposición solar o suplementos). Utiliza aplicaciones de seguimiento nutricional inicialmente para identificar posibles carencias específicas."
        },
        {
            keywords: ['dieta', 'keto', 'cetogénica', 'cómo', 'funciona'],
            answer: "La dieta cetogénica es alta en grasas (70-80%), moderada en proteínas (15-20%) y muy baja en carbohidratos (20-50g diarios, 5-10% de calorías). Funciona induciendo cetosis, un estado metabólico donde el cuerpo, al carecer de glucosa suficiente, utiliza cetonas derivadas de grasas como combustible principal. Alimentos permitidos: carnes, pescados, huevos, quesos, aguacate, aceites saludables, frutos secos, mantequillas, verduras bajas en carbos. Limitados/excluidos: granos, azúcares, frutas (excepto bayas en pequeñas cantidades), tubérculos, legumbres. Posibles beneficios: pérdida rápida de peso inicial, sensación de saciedad, estabilidad glucémica. Consideraciones: puede causar \"keto flu\" inicial (fatiga, dolores de cabeza), limita muchos alimentos nutritivos, puede afectar rendimiento en ejercicio de alta intensidad, controversia sobre efectos a largo plazo. Consulta a un profesional antes de iniciarla, especialmente si tienes condiciones metabólicas, renales o hepáticas."
        },
        {
            keywords: ['ayuno', 'intermitente', 'qué', 'es', 'tipos', 'beneficios'],
            answer: "El ayuno intermitente es un patrón alimentario que alterna períodos de alimentación con períodos de ayuno. Tipos principales: 1) 16/8: 16 horas de ayuno, 8 horas de alimentación (ej: comer solo de 12pm a 8pm); 2) 5:2: 5 días de alimentación normal, 2 días no consecutivos de restricción severa (500-600 calorías); 3) Ayuno en días alternos: un día normal, un día de ayuno parcial; 4) OMAD: Una comida al día. Posibles beneficios: facilita déficit calórico para algunas personas, puede mejorar sensibilidad a insulina, promueve autofagia (reciclado celular), simplifica planificación alimentaria. Consideraciones importantes: no es superior a otras estrategias si las calorías totales son iguales, puede dificultar consumo adecuado de proteínas y micronutrientes, no recomendado para embarazadas, adolescentes, personas con historial de trastornos alimentarios, puede afectar rendimiento en entrenamientos intensos. Los efectos varían significativamente entre individuos."
        },
        {
            keywords: ['dieta', 'mediterránea', 'beneficios', 'alimentos'],
            answer: "La dieta mediterránea está basada en los patrones alimentarios tradicionales de países mediterráneos y es reconocida por sus beneficios para la salud cardiovascular y longevidad. Características principales: 1) Abundancia de alimentos vegetales: frutas, verduras, legumbres, frutos secos, semillas, hierbas y especias; 2) Aceite de oliva como principal fuente de grasa; 3) Consumo moderado de pescado (especialmente azul), aves, huevos y lácteos; 4) Consumo limitado de carnes rojas; 5) Vino tinto con moderación (opcional, generalmente con comidas). Beneficios respaldados por evidencia: reducción de riesgo cardiovascular, mejor control glucémico, propiedades antiinflamatorias, asociación con menor riesgo de deterioro cognitivo y algunos tipos de cáncer. A diferencia de otras \"dietas\", es un patrón alimentario completo y sostenible a largo plazo, no restrictivo, que enfatiza alimentos frescos, de temporada y mínimamente procesados, junto con comensalidad (aspecto social de comer)."
        }
    ],
    
    // Suplementos
    suplementos: [
        {
            keywords: ['suplementos', 'nutricionales', 'necesarios', 'cuáles', 'tomar'],
            answer: "Los suplementos nutricionales generalmente no son necesarios si sigues una dieta equilibrada, pero pueden ser útiles en casos específicos: 1) Vitamina D (1000-2000 UI) para personas con poca exposición solar o en invierno; 2) B12 (250-500mcg) para veganos y algunos vegetarianos; 3) Hierro para mujeres con menstruación abundante, atletas (verificar niveles primero); 4) Calcio (500-600mg x 2 dosis) para quienes no consumen lácteos; 5) Omega-3 (1-3g EPA/DHA combinados) si no consumes pescado regularmente; 6) Proteína en polvo como conveniencia para deportistas con altas necesidades proteicas; 7) Creatina (3-5g) para mejorar rendimiento en fuerza. Factores a considerar: necesidades individuales (análisis sanguíneos), calidad (terceros verificadores, sellos GMP), posibles interacciones con medicamentos. Siempre consulta con un profesional antes de comenzar un régimen de suplementación."
        },


{
    keywords: ['proteína', 'polvo', 'suplemento', 'cuándo', 'tomar'],
    answer: 'La proteína en polvo es principalmente una conveniencia, no una necesidad. Puede ser útil cuando: 1) Tienes altas necesidades proteicas (deportistas, fisioculturistas); 2) Sigues dieta vegetariana/vegana con dificultad para alcanzar requerimientos; 3) Estás en déficit calórico significativo buscando preservar masa muscular; 4) Tienes poco apetito o poco tiempo para preparar comidas completas; 5) Estás en recuperación de lesiones o cirugías. Cuándo tomarla: no hay un momento "mágico", aunque post-entrenamiento (dentro de las 2 horas) puede ser beneficioso para recuperación. Lo importante es alcanzar tu ingesta proteica total diaria (distribuida en múltiples comidas). Tipos principales: suero (whey) para rápida absorción, caseína para liberación lenta, mezclas vegetales (guisante, arroz, cáñamo) para veganos. Criterios de calidad: terceros verificadores, lista de ingredientes clara, contenido proteico por porción (>20g), mínimos aditivos.'
},

        {
            keywords: ['creatina', 'cómo', 'tomar', 'dosis', 'efectos'],
            answer: "La creatina monohidrato es uno de los suplementos más estudiados y efectivos para rendimiento. Beneficios respaldados: 1) Aumenta fuerza y potencia en ejercicios de alta intensidad; 2) Mejora capacidad de entrenamiento, permitiendo más volumen; 3) Favorece ganancia de masa muscular; 4) Aumenta almacenamiento de glucógeno; 5) Posibles beneficios cognitivos. Dosificación: 3-5g diarios, todos los días (no es necesaria fase de carga); tomar en cualquier momento del día, consistentemente. Consideraciones: 1) Aumento inicial de peso (1-2kg) debido a retención de agua intramuscular; 2) Hidratación adecuada importante; 3) Es segura a largo plazo según estudios; 4) No todos responden igual (10-15% no responden significativamente); 5) Formas más caras (etil éster, HCL) no muestran ventajas consistentes sobre monohidrato. Efectos secundarios son raros y leves, siendo la creatina segura para la mayoría de individuos sanos."
        },

        {
            keywords: ['omega', '3', 'epa', 'dha', 'beneficios'],
            answer: "Los omega-3 (EPA y DHA) son ácidos grasos esenciales con importantes beneficios para la salud: 1) Propiedades antiinflamatorias; 2) Salud cardiovascular (reducción de triglicéridos, presión arterial, mejora en marcadores inflamatorios); 3) Función cerebral y posible protección neurológica; 4) Potencial reducción de dolor muscular post-ejercicio. Fuentes alimentarias: pescados grasos (salmón, sardinas, caballa), algas marinas. Fuentes de ALA (precursor menos eficiente): semillas de lino, chía, nueces. Suplementación recomendada si no consumes pescado regularmente: 1-3g combinados de EPA+DHA diarios. Consideraciones importantes: 1) Calidad variable entre marcas (verificar pureza, concentración, oxidación); 2) Preferible fórmulas con antioxidantes naturales (vitamina E); 3) Tomar con comidas grasas para mejor absorción; 4) Puede interactuar con anticoagulantes; 5) Sostenibilidad: preferir fuentes certificadas. Efectos secundarios leves pueden incluir sabor a pescado, eructos o malestar gastrointestinal."
        }
    ],
    
    // Ejercicio y nutrición
    ejercicio: [
        {
            keywords: ['nutrición', 'deportistas', 'atletas', 'rendimiento'],
            answer: "La nutrición deportiva debe adaptarse al tipo de actividad, duración, intensidad y objetivos. Principios fundamentales: 1) Energía adecuada: evitar déficit crónico que comprometa rendimiento y recuperación (especialmente importante en mujeres para prevenir tríada de la atleta); 2) Carbohidratos estratégicos: 3-5g/kg para entrenamiento general, 5-7g/kg para entrenamiento moderado/intenso, 7-10g/kg para alto volumen (>3h/día); 3) Proteínas suficientes: 1.4-2.0g/kg distribuidas cada 3-4h (20-40g por comida); 4) Grasas saludables: mínimo 20% de calorías para función hormonal; 5) Micronutrientes críticos: hierro, calcio, vitamina D, magnesio, antioxidantes; 6) Hidratación personalizada: 5-10ml/kg 2-4h antes, 3-5ml/kg durante (cada 15-20min), reposición 125-150% de pérdida post-ejercicio. Consideraciones específicas: periodizar nutrición según fases de entrenamiento, coordinar nutrientes con momento de entrenamientos, estrategias de recuperación post-entrenamiento, posible suplementación específica (creatina, cafeína, beta-alanina según deporte)."
        },
        {
            keywords: ['qué', 'comer', 'antes', 'ejercicio', 'entrenamiento'],
            answer: "La alimentación pre-entrenamiento varía según objetivos, tipo de ejercicio, duración y tolerancia individual. Pautas generales: 1) Timing: comida completa 2-3 horas antes, o snack ligero 30-60 minutos antes; 2) Contenido: carbohidratos de fácil digestión para energía (0.5-1.5g/kg dependiendo de duración), proteína moderada (15-20g), grasa limitada para evitar digestión lenta; 3) Hidratación: 5-7ml/kg 2-4 horas antes, 3-5ml/kg 15-30min antes. Ejemplos de comidas pre-entrenamiento: plátano con mantequilla de maní; avena con frutas y proteína; tostada integral con huevo; yogur con frutas; batido de proteínas con plátano. Para entrenamientos matutinos en ayunas: puede funcionar para sesiones cortas (<60min) y baja-moderada intensidad, especialmente si buscas mejorar adaptación a utilización de grasas; para sesiones intensas, considera un pequeño snack (dátiles, plátano) o incluso solo cafeína (100-200mg). Experimenta para encontrar lo que tu sistema digestivo tolera mejor."
        },
        {
            keywords: ['qué', 'comer', 'después', 'ejercicio', 'entrenamiento', 'recuperación'],
            answer: "La nutrición post-entrenamiento es crucial para recuperación, adaptación y rendimiento futuro. Pautas clave: 1) Timing: idealmente dentro de los 30-60 minutos post-ejercicio (ventana anabólica), pero lo más importante es la ingesta total diaria; 2) Proteínas: 20-40g de alta calidad (0.25-0.3g/kg) para estimular síntesis proteica muscular; 3) Carbohidratos: 0.5-1.0g/kg para reponer glucógeno (más importante tras ejercicio prolongado o de alta intensidad); ratio carbos:proteína de 3:1 para entrenamientos de resistencia; 4) Fluidos: 125-150% del peso perdido durante ejercicio. Ejemplos de recuperación: batido de proteína con plátano y leche; yogur griego con frutas y granola; wrap de pavo con vegetales; huevos revueltos con tostadas integrales; salmón con batata y verduras. La consistencia en la nutrición diaria total sigue siendo más importante que el timing exacto, especialmente para no profesionales. Para optimizar adaptaciones específicas, considera nutrición periodizada según fase de entrenamiento."
        },
        {
            keywords: ['proteína', 'músculo', 'desarrollo', 'recuperación'],
            answer: "La proteína es fundamental para desarrollo y recuperación muscular. Consideraciones clave: 1) Cantidad diaria: para desarrollo muscular óptimo, 1.6-2.2g/kg/día (atletas experimentados en el rango superior); 2) Distribución: más efectivo consumir 4-5 comidas con 0.3-0.4g/kg de proteína (típicamente 20-40g), espaciadas cada 3-4h; 3) Pre-entrenamiento: 0.25g/kg puede reducir daño muscular; 4) Post-entrenamiento: similar cantidad para estimular síntesis proteica (MPS); 5) Nocturna: 30-40g de proteína de absorción lenta (caseína) antes de dormir puede mejorar recuperación durante sueño. Factores que afectan necesidades: déficit calórico (aumenta requerimientos), edad avanzada (resistencia anabólica), nivel de entrenamiento (principiantes responden bien a menor ingesta). Calidad proteica importa: fuentes con perfil completo de aminoácidos y alta leucina (3-4g) maximizan MPS. Aunque suplementos como whey son convenientes, dieta variada con carnes magras, huevos, lácteos, pescado, y combinaciones adecuadas de proteínas vegetales es igualmente efectiva."
        },
        {
            keywords: ['carbohidratos', 'ejercicio', 'energía', 'glucógeno'],
            answer: "Los carbohidratos son el combustible principal para ejercicio de moderada-alta intensidad. Recomendaciones según nivel de actividad: 1) Actividad general/recreativa (30-60min/día): 3-5g/kg/día; 2) Entrenamiento moderado (1-2h/día): 5-7g/kg/día; 3) Alto volumen (2-4h/día): 7-10g/kg/día; 4) Extremo (4-5h/día): 10-12g/kg/día. Estrategias importantes: A) Timing: mayor concentración alrededor del entrenamiento (pre, durante, post) para sesiones intensas; B) Durante ejercicio >60min: 30-60g/h para mantener rendimiento, hasta 90g/h para eventos ultraresistencia usando múltiples transportadores (glucosa + fructosa); C) Reposición post-ejercicio: 1-1.2g/kg/h durante 4-6h para máxima resíntesis de glucógeno tras entrenamientos agotadores. Calidad: aunque índice glucémico es menos relevante en general, carbohidratos rápidos son preferibles durante/inmediatamente post-ejercicio, mientras que fuentes complejas y fibra benefician salud general y microbiota. La periodización de carbohidratos (train low, compete high) puede potenciar adaptaciones específicas en atletas avanzados."
        }
    ],
    
    // Alimentos específicos
    alimentos: [
        {
            keywords: ['leer', 'etiquetas', 'nutricionales', 'cómo', 'interpretar'],
            answer: "Leer etiquetas nutricionales efectivamente implica: 1) Revisar primero el tamaño de la porción y compararlo con lo que realmente consumes; todos los valores se basan en esta cantidad; 2) Evaluar calorías solo en contexto de tu dieta total; 3) Limitar nutrientes críticos: grasas saturadas (<10% de calorías), grasas trans (evitar), sodio (<2300mg/día), azúcares añadidos (<10% de calorías diarias); 4) Buscar más de estos nutrientes: fibra (25-30g/día), vitaminas y minerales; 5) Revisar la lista de ingredientes: están ordenados por peso descendente, busca listas cortas con ingredientes reconocibles; 6) Ser escéptico con claims de marketing ('natural', 'saludable'); 7) Comparar productos similares usando valores por 100g; 8) Identificar azúcares ocultos con terminaciones -osa (maltosa, dextrosa) o jarabes; 9) Verificar proteínas completas o incompletas (importante en productos vegetales); 10) No obsesionarse: las etiquetas son herramientas, no determinantes absolutos de salud. Actualizaciones recientes en muchos países enfatizan azúcares añadidos vs totales y porciones más realistas."
        },

        {
            keywords: ['procesados', 'ultraprocesados', 'evitar', 'por qué'],
            answer: "Los alimentos ultraprocesados son formulaciones industriales con ingredientes mayoritariamente de uso industrial, pocos alimentos enteros, y múltiples aditivos para mejorar palatabilidad y extender vida útil. Características: 1) Larga lista de ingredientes, muchos no reconocibles o utilizables en cocina casera; 2) Alto contenido de azúcares añadidos, grasas de baja calidad y sodio; 3) Bajo contenido de proteína, fibra y micronutrientes; 4) Alta densidad calórica y bajo poder saciante; 5) Diseñados para ser hiperpalatables y potencialmente adictivos. El consumo habitual se asocia con mayor riesgo de obesidad, diabetes tipo 2, enfermedades cardiovasculares, síndrome metabólico, depresión y algunos tipos de cáncer. Estudios muestran que representan hasta 60% de las calorías en dietas occidentales. Ejemplos: refrescos, snacks empaquetados, cereales azucarados, comidas precocinadas, galletas comerciales, embutidos. Recomendación: basar dieta en alimentos enteros o mínimamente procesados, usar ingredientes culinarios procesados (aceite, sal) con moderación, incorporar alimentos procesados de forma limitada."
        },
        {
            keywords: ['leer', 'etiquetas', 'nutricionales', 'cómo', 'interpretar'],
            answer: "Leer etiquetas nutricionales efectivamente implica: 1) Revisar primero el tamaño de la porción y compararlo con lo que realmente consumes; todos los valores se basan en esta cantidad; 2) Evaluar calorías solo en contexto de tu dieta total; 3) Limitar nutrientes críticos: grasas saturadas (<10% de calorías), grasas trans (evitar), sodio (<2300mg/día), azúcares añadidos (<10% de calorías diarias); 4) Buscar más de estos nutrientes: fibra (25-30g/día), vitaminas y minerales; 5) Revisar la lista de ingredientes: están ordenados por peso descendente, busca listas cortas con ingredientes reconocibles; 6) Ser escéptico con claims de marketing ('natural', 'saludable'); 7) Comparar productos similares usando valores por 100g; 8) Identificar azúcares ocultos con terminaciones -osa (maltosa, dextrosa) o jarabes; 9) Verificar proteínas completas o incompletas (importante en productos vegetales); 10) No obsesionarse: las etiquetas son herramientas, no determinantes absolutos de salud. Actualizaciones recientes en muchos países enfatizan azúcares añadidos vs totales y porciones más realistas."
        },
        {
            keywords: ['inflamación', 'alimentos', 'antiinflamatorios', 'proinflamatorios'],
            answer: "La inflamación crónica de bajo grado está vinculada a múltiples enfermedades como cardiovasculares, diabetes, artritis y deterioro cognitivo. Alimentos con propiedades antiinflamatorias: 1) Frutas ricas en antioxidantes (bayas, cerezas); 2) Vegetales coloridos, especialmente verduras de hoja verde y crucíferas; 3) Grasas saludables como omega-3 (pescados grasos, nueces, semillas de lino/chía); 4) Especias: cúrcuma (curcumina), jengibre, canela; 5) Té verde, café y cacao rico en flavonoides; 6) Alimentos fermentados que favorecen microbiota intestinal saludable. Alimentos proinflamatorios a limitar: 1) Carbohidratos refinados y azúcares añadidos; 2) Grasas trans (parcialmente hidrogenadas); 3) Exceso de omega-6 de aceites vegetales refinados; 4) Carnes procesadas (embutidos, bacon); 5) Alcohol en exceso. Patrón alimentario general más importante que alimentos aislados: dietas mediterránea y DASH muestran evidencia sólida en reducción de marcadores inflamatorios. Otros factores importantes: actividad física regular, control de estrés y sueño adecuado, que complementan beneficios de alimentación antiinflamatoria."
        }
    ],
    
    // Preguntas sobre el sueño y la nutrición
    sueño: [
        {
            keywords: ['sueño', 'nutrición', 'relación', 'afecta'],
            answer: "El sueño y la nutrición tienen una relación bidireccional crítica: 1) Efecto del sueño sobre alimentación: La privación de sueño (<7h) altera el balance hormonal, aumentando grelina (hambre) y reduciendo leptina (saciedad), incrementa antojos por alimentos densos en calorías, reduce el control sobre decisiones alimentarias, altera metabolismo de glucosa, disminuye sensibilidad a insulina, y reduce energía para actividad física. 2) Efecto de alimentación sobre sueño: Comidas muy copiosas o grasas cerca de acostarse perturban digestión y sueño, cafeína (incluso 6h antes) puede interferir con el inicio del sueño, alcohol puede facilitar quedarse dormido pero fragmenta sueño REM, déficit de nutrientes como magnesio, zinc, vitaminas D y B puede alterar calidad del sueño. Alimentos que promueven buen descanso: kiwi, cerezas (melatonina natural), pescados grasos (omega-3, vitamina D), nueces, semillas de calabaza (magnesio, zinc), productos lácteos (triptófano, calcio), plátanos (magnesio, potasio), avena (melatonina, magnesio). Estrategia: comida ligera 2-3h antes de dormir con carbohidratos complejos y proteína moderada."
        }
    ],
    
    // Nutrición para condiciones específicas
    condiciones: [
        {
            keywords: ['diabetes', 'nutrición', 'alimentación', 'consejos'],
            answer: "La nutrición juega un papel fundamental en el manejo de la diabetes (siempre bajo supervisión médica). Principios clave: 1) Control de carbohidratos: monitorizar cantidad y tipo, priorizando complejos y de bajo índice glucémico (legumbres, granos enteros, verduras); 2) Consistencia en horarios y tamaños de porciones para mantener niveles de glucosa estables; 3) Distribución equilibrada: 3 comidas principales y 2-3 snacks pequeños si es necesario; 4) Proteínas magras en cada comida para mejorar saciedad y moderar respuesta glucémica; 5) Grasas saludables (aguacate, aceite de oliva, nueces) para control de apetito sin impacto inmediato en glucosa; 6) Fibra: objetivo 25-30g diarios para mejor control glicémico y saciedad; 7) Limitar significativamente azúcares añadidos, alimentos refinados y ultraprocesados; 8) Alcohol con moderación y siempre con alimentos (no en ayunas); 9) Estrategias de planificación: preparación de comidas, lista de compras, educación sobre lectura de etiquetas. Patrones alimentarios con evidencia: mediterráneo, DASH, vegetariano bien planificado. Herramientas útiles: conteo de carbohidratos, monitoreo continuo de glucosa para identificar respuestas individuales a alimentos."
        },
        {
            keywords: ['hipertensión', 'presión', 'alta', 'alimentación', 'consejos'],
            answer: "La alimentación para hipertensión debe enfocarse en controlar presión arterial naturalmente (siempre complementando tratamiento médico). Estrategias con evidencia científica: 1) Dieta DASH (Dietary Approaches to Stop Hypertension): rica en frutas, verduras, lácteos bajos en grasa, granos enteros, limitando carnes rojas y procesadas; 2) Reducir sodio: objetivo <2300mg/día, idealmente <1500mg para hipertensos (revisar alimentos procesados, conservas, embutidos); 3) Aumentar potasio: plátanos, patatas, aguacates, legumbres, vegetales de hoja verde (contraindicado en enfermedad renal); 4) Moderar alcohol: máximo 1 bebida/día mujeres, 2 bebidas/día hombres; 5) Incluir alimentos específicos beneficiosos: chocolate negro >70% (flavonoides), semillas de lino, arándanos, remolacha (nitratos), ajo, yogur; 6) Mantener peso saludable: pérdida del 5-10% en personas con sobrepeso puede reducir significativamente presión arterial; 7) Considerar patrón mediterráneo (efecto similar a DASH). Técnicas culinarias: priorizar hierbas y especias sobre sal, adobar con ajo, cebolla, limón; preferir alimentos frescos sobre procesados; evitar condimentos, salsas y mezclas con alto sodio; lavar conservas si es posible."
        }
    ],
    
    // Metabolismo y digestión
    metabolismo: [
        {
            keywords: ['metabolismo', 'lento', 'acelerar', 'aumentar'],
            answer: "El \"metabolismo lento\" rara vez es la causa principal de dificultades para perder peso. Estrategias efectivas para optimizar metabolismo: 1) Preservar/aumentar masa muscular: entrenamiento de fuerza 2-3 veces/semana, proteína adecuada (1.6-2.2g/kg); 2) Evitar déficits calóricos extremos (<70% de mantenimiento) que reducen tasa metabólica; 3) Actividad física regular: tanto planificada como no estructurada (NEAT: usar escaleras, caminar más); 4) Comidas regulares con proteína (efecto térmico mayor que otros macronutrientes); 5) Adecuado descanso: privación de sueño afecta hormonas metabólicas y hambre; 6) Gestión del estrés: cortisol elevado crónicamente favorece almacenamiento graso abdominal; 7) Hidratación: 30-35ml/kg peso corporal. Mitos sobre metabolismo: té verde, chile, comidas pequeñas frecuentes y comidas específicas tienen efectos mínimos o transitorios. Condiciones médicas que afectan metabolismo (hipotiroidismo, Cushing) son relativamente raras y diagnosticables. Enfoque realista: cambios pequeños pero sostenibles en ingesta y gasto energético generan resultados significativos a largo plazo."
        },
        {
            keywords: ['digestión', 'problemas', 'mejorar', 'gases', 'hinchazón'],
            answer: "Para mejorar la digestión y reducir problemas como hinchazón y gases: 1) Masticar lentamente y comer sin distracciones; cada bocado 20-30 veces; 2) Aumentar gradualmente fibra (25-30g/día) con hidratación adecuada; incrementos bruscos causan malestar; 3) Identificar sensibilidades alimentarias: llevar diario para correlacionar síntomas con alimentos específicos; comunes: lácteos, gluten, FODMAPs, legumbres; 4) Incorporar alimentos fermentados con probióticos: yogur, kéfir, chucrut, kimchi; 5) Hierbas digestivas: menta, jengibre, hinojo, manzanilla antes o después de comidas; 6) Enzimas digestivas naturales: piña (bromelina), papaya (papaína); 7) Limitar irritantes: alcohol, café excesivo, picantes, frituras; 8) Mantener horarios regulares: el sistema digestivo funciona mejor con rutina; 9) Actividad física moderada: mejora tránsito intestinal; 10) Manejar estrés: conexión intestino-cerebro significa que ansiedad empeora síntomas digestivos. Signos de alerta que requieren atención médica: dolor intenso, sangre en heces, pérdida de peso inexplicable, dificultad para tragar, despertares nocturnos por síntomas."
        }
    ],
    
    // Nutrición según etapa de vida
    etapasVida: [
        {
            keywords: ['embarazo', 'embarazada', 'nutrición', 'alimentación'],
            answer: "La nutrición durante el embarazo es crucial para salud materna y desarrollo fetal. Necesidades específicas: 1) Calorías: +0 en 1er trimestre, +340 kcal en 2º, +450 kcal en 3º; no \"comer por dos\"; 2) Proteína: 1.1g/kg en 1er trimestre, 1.3g/kg en 2º y 3º; 3) Ácido fólico: 600mcg diarios (crucial en primeras 12 semanas para prevenir defectos del tubo neural); 4) Hierro: 27mg diarios (doble de lo habitual) para prevenir anemia; mejor absorción con vitamina C; 5) Calcio: 1000-1300mg para desarrollo óseo y dental; 6) Omega-3 (DHA): 300mg/día para desarrollo cerebral; 7) Yodo: 220mcg para función tiroidea. Alimentos recomendados: vegetales de hoja verde, legumbres, huevos, lácteos, pescados bajos en mercurio, carnes magras, granos enteros. Evitar: alcohol (completamente), cafeína (limitar a 200mg/día, ~1 taza café), pescados altos en mercurio (pez espada, tiburón, atún blanco), carnes/huevos crudos, quesos no pasteurizados, brotes crudos, suplementos herbales sin supervisión. Náuseas: comidas pequeñas frecuentes, snacks de proteína+carbohidrato, jengibre. Suplementación prenatal recomendada bajo supervisión."
        },
        {
            keywords: ['niños', 'infancia', 'nutrición', 'alimentación'],
            answer: "La nutrición infantil establece hábitos y salud a largo plazo. Principios clave: 1) Variedad de alimentos y colores para exposición temprana a diversos nutrientes y sabores; 2) Proteínas adecuadas para crecimiento: 1.0-1.2g/kg desde preescolar hasta adolescencia; carnes magras, pescado, huevos, lácteos, legumbres; 3) Grasas saludables (30-40% de calorías) esenciales para desarrollo cerebral, especialmente omega-3; 4) Limitar azúcares añadidos (<25g/día) y ultraprocesados; 5) Calcio y vitamina D prioritarios para desarrollo óseo; 6) Hierro crítico para desarrollo cognitivo (déficit común); 7) Zinc, yodo y vitamina A para crecimiento e inmunidad. Estrategias efectivas: modelo positivo (niños imitan comportamientos alimentarios); comidas familiares (beneficios sociales y nutricionales); involucrarlos en preparación; evitar usar comida como premio/castigo; respetar señales de hambre/saciedad; persistencia (puede tomar 15-20 exposiciones para aceptar nuevos alimentos). Preocupaciones comunes: fase selectiva normal (2-6 años); crecimiento ocurre en \"estiradores\"; hidratación primaria con agua, no jugos; minimizar distracciones durante comidas; equilibrar autonomía con guía; consultar curvas de crecimiento para evaluar progreso."
        },
        {
            keywords: ['adultos', 'mayores', 'ancianos', 'vejez', 'nutrición'],
            answer: "La nutrición en adultos mayores requiere adaptaciones para contrarrestar cambios fisiológicos: 1) Proteínas aumentadas (1.0-1.2g/kg, incluso 1.2-1.5g/kg en muy activos o enfermos) para combatir sarcopenia (pérdida muscular); distribuidas uniformemente durante el día; 2) Calorías ajustadas: metabolismo más lento pero no subnutrición; déficits severos aceleran pérdida muscular y ósea; 3) Calcio (1200mg) y vitamina D (800-1000UI) para salud ósea; exposición solar frecuentemente insuficiente; 4) Vitamina B12: absorción disminuida con edad y medicamentos comunes; suplementación frecuentemente necesaria; 5) Fibra (25-30g): previene estreñimiento común por reducción de motilidad; 6) Hidratación consciente: sensación de sed disminuida pero necesidades similares (1.5-2L); 7) Antioxidantes de fuentes naturales: frutas/verduras coloridas para función cognitiva y macular. Consideraciones prácticas: comidas más pequeñas y frecuentes; textura adecuada según capacidad masticatoria; alimentos nutricionalmente densos; socialización durante comidas mejora ingesta; estrategias para pérdida sensorial (sabor, olfato); suplementos nutricionales completos cuando sea necesario; vigilar interacciones medicamento-nutriente; atención a factores que afectan apetito (depresión, aislamiento, polifarmacia); adaptación de utensilios para mantener independencia."
        }
    ]
};

// Inicialización al cargar la página
function initChat() {
    // Cargar datos de usuario si existen
    loadUserData();
    
    // Mensaje de bienvenida
    setTimeout(() => {
        const welcomeResponses = [
            "¡Hola! Soy NutriChat, tu asistente nutricional personal. Puedo ayudarte a crear un plan nutricional personalizado, responder preguntas sobre alimentación o darte consejos para alcanzar tus objetivos. ¿En qué puedo ayudarte hoy?",
            
            "¡Bienvenido/a a NutriChat! Estoy aquí para brindarte información nutricional basada en evidencia científica, crear planes alimenticios personalizados o responder tus dudas sobre nutrición. ¿Qué te gustaría saber?",
            
            "¡Saludos! Soy NutriChat, tu nutricionista virtual. Puedo calcularte un plan nutricional adaptado a tus objetivos, explicarte conceptos sobre alimentación o recomendarte estrategias para mejorar tu nutrición. ¿Cómo puedo ayudarte?",
            
            "¡Hola! Soy tu asistente nutricional NutriChat. Estoy aquí para ayudarte con planes personalizados de alimentación, información sobre nutrientes y alimentos, o consejos para alcanzar tus metas de salud. ¿Qué necesitas hoy?"
        ];
        
        const randomWelcome = welcomeResponses[Math.floor(Math.random() * welcomeResponses.length)];
        addBotMessage(randomWelcome);
    }, 500);
}

// Configurar navegación entre vistas
function setupNavigation() {
    // Chat tab
    $('#chat-tab').click(function(e) {
        e.preventDefault();
        showView('chat');
    });
    
    // Diagnosis tab
    $('#diagnosis-tab').click(function(e) {
        e.preventDefault();
        showView('diagnosis');
        updateDiagnosis();
    });
    
    // About tab
    $('#about-tab').click(function(e) {
        e.preventDefault();
        showView('about');
    });
    
    // Botón "Ir al chat" en diagnóstico
    $('#go-to-chat').click(function(e) {
        e.preventDefault();
        showView('chat');
    });
}

// Mostrar vista específica y ocultar las demás
function showView(viewName) {
    // Ocultar todas las vistas
    $('.view-section').addClass('d-none');
    
    // Quitar clase active de todos los tabs
    $('.nav-link').removeClass('active');
    
    // Mostrar vista seleccionada
    $(`#${viewName}-view`).removeClass('d-none');
    $(`#${viewName}-tab`).addClass('active');
    
    // Scroll al top al cambiar de vista
    window.scrollTo(0, 0);
}

// Configurar event listeners
function setupEventListeners() {
    // Enviar mensaje al hacer clic en el botón
    $('#send-button').click(function() {
        sendUserMessage();
    });
    
    // Enviar mensaje al presionar Enter
    $('#user-input').keypress(function(e) {
        if (e.which === 13) {
            sendUserMessage();
            e.preventDefault();
        }
    });
}

// Enviar mensaje del usuario
function sendUserMessage() {
    const userInput = $('#user-input').val().trim();
    
    if (userInput === '') return;
    
    // Añadir mensaje al chat
    addUserMessage(userInput);
    
    // Limpiar input
    $('#user-input').val('');
    
    // Procesar mensaje y obtener respuesta
    processUserInput(userInput);
    
    // Actualizar timestamp de última interacción
    userData.lastInteraction = new Date();
    saveUserData();
}

// Añadir mensaje del usuario al chat
function addUserMessage(message) {
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const messageHtml = `
        <div class="message message-user">
            <div class="message-content">${message}</div>
            <div class="message-timestamp">${currentTime}</div>
        </div>
    `;
    
    $('#chat-messages').append(messageHtml);
    scrollToBottom();
}

// Añadir mensaje del bot al chat
function addBotMessage(message) {
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const messageHtml = `
        <div class="message message-bot">
            <div class="message-content">${message}</div>
            <div class="message-timestamp">${currentTime}</div>
        </div>
    `;
    
    $('#chat-messages').append(messageHtml);
    scrollToBottom();
}

// Mostrar indicador de escritura
function showTypingIndicator() {
    const indicatorHtml = `
        <div class="typing-indicator message-bot p-3" id="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    $('#chat-messages').append(indicatorHtml);
    scrollToBottom();
}

// Ocultar indicador de escritura
function hideTypingIndicator() {
    $('#typing-indicator').remove();
}

// Desplazar al final del chat
function scrollToBottom() {
    const chatBody = document.getElementById('chat-messages');
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Verificar si la entrada del usuario coincide con alguna pregunta de la base de conocimientos
function checkForKnowledgeQuestion(userInput) {
    const inputLower = userInput.toLowerCase();
    let bestMatch = null;
    let bestMatchScore = 0;
    
    // Función para calcular el puntaje de coincidencia
    function calculateMatchScore(keywords, input) {
        let score = 0;
        
        // Dividir la entrada en palabras
        const inputWords = input.split(/\s+/);
        
        // Verificar cada palabra clave
        for (const keyword of keywords) {
            if (input.includes(keyword)) {
                // Dar más peso a palabras clave completas
                score += 2;
                
// Bono adicional para frases de múltiples palabras
if (keyword.split(/\s+/).length > 1) {
    score += keyword.split(/\s+/).length;
}
} else {
// Verificar coincidencias parciales en palabras
for (const inputWord of inputWords) {
    if (inputWord.includes(keyword) || keyword.includes(inputWord)) {
        score += 0.5;
    }
}
}
}

// Normalizar el puntaje según la cantidad de palabras clave
return score / keywords.length;
}

// Buscar la mejor coincidencia en todas las categorías
for (const category in nutritionKnowledge) {
for (const item of nutritionKnowledge[category]) {
const score = calculateMatchScore(item.keywords, inputLower);

// Actualizar mejor coincidencia si el puntaje es mayor
if (score > bestMatchScore && score > 0.5) { // Umbral mínimo para considerar una coincidencia
bestMatchScore = score;
bestMatch = item.answer;
}
}
}

return bestMatch;
}

// Procesar el mensaje del usuario y generar respuesta
function processUserInput(text) {
// Mostrar indicador de escritura
showTypingIndicator();

// Simular tiempo de procesamiento variable para naturalidad
const processingTime = Math.floor(Math.random() * 500) + 800; // Entre 800ms y 1300ms

setTimeout(() => {
// Ocultar indicador
hideTypingIndicator();

// Paso 1: Verificar si el usuario está proporcionando múltiples datos a la vez
const multiFieldResult = processMultiFieldInput(text, userData);

if (multiFieldResult.userDataUpdated) {
// Actualizar datos de usuario
userData = multiFieldResult.userData;
saveUserData();

// Mostrar mensaje de confirmación
addBotMessage(multiFieldResult.message);

// Actualizar el estado de la conversación basado en si hay suficientes datos
if (userData.weight && userData.height && userData.age && 
userData.gender && userData.activityLevel && userData.goal) {
currentQuestion = 'show_updated_plan';
} else {
currentQuestion = 'follow_up';
}

return;
}

// Paso 2: Intentar procesar usando la detección de intenciones
const intentResponse = processIntentMessage(text, userData);

// Si se detectó una intención específica, mostrar la respuesta y terminar
if (intentResponse) {
addBotMessage(intentResponse);

// Determinar si debemos cambiar el estado de la conversación
if (text.toLowerCase().includes('actualizar') || text.toLowerCase().includes('cambiar')) {
if (text.toLowerCase().includes('peso')) {
    currentQuestion = 'update_weight';
} else if (text.toLowerCase().includes('altura')) {
    currentQuestion = 'update_height';
} else if (text.toLowerCase().includes('objetivo')) {
    currentQuestion = 'update_goal';
} else if (text.toLowerCase().includes('actividad')) {
    currentQuestion = 'update_activity';
} else if (text.toLowerCase().includes('edad')) {
    currentQuestion = 'update_age';
} else if (text.toLowerCase().includes('género')) {
    currentQuestion = 'update_gender';
}
} else if (text.toLowerCase().includes('reiniciar')) {
currentQuestion = 'confirm_reset';
} else {
// Para otras intenciones, ir a follow_up
currentQuestion = 'follow_up';
}

return;
}

// Paso 3: Si no hay intención clara, analizar palabras clave
const keywordAnalysis = analyzeKeywords(text);
const dominantCategory = getDominantCategory(keywordAnalysis);

if (dominantCategory.dominant) {
const keywordResponse = generateKeywordResponse(dominantCategory, userData);

if (keywordResponse) {
addBotMessage(keywordResponse);

// Determinar si cambiar el estado basado en el análisis de palabras clave
if (dominantCategory.dominant === 'personalData' && text.toLowerCase().match(/actualizar|cambiar|modificar/)) {
    if (dominantCategory.dominantSub === 'peso') {
        currentQuestion = 'update_weight';
    } else if (dominantCategory.dominantSub === 'altura') {
        currentQuestion = 'update_height';
    }
} else {
    currentQuestion = 'follow_up';
}

return;
}
}

// Paso 4: Verificar si es una pregunta de la base de conocimientos
const knowledgeResponse = checkForKnowledgeQuestion(text);

if (knowledgeResponse) {
// Si encontramos una respuesta de la base de conocimientos, la devolvemos
addBotMessage(knowledgeResponse);
currentQuestion = 'follow_up';
return;
}

// Paso 5: Verificar si el mensaje contiene saludos o despedidas simples
const greetingPatterns = ['hola', 'hi', 'hey', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos'];
const farewellPatterns = ['adiós', 'chao', 'hasta luego', 'bye', 'nos vemos', 'hasta pronto', 'me voy'];
const thanksPatterns = ['gracias', 'thank', 'thanks', 'te agradezco', 'agradecido'];

// Comprobar si es un saludo simple
if (greetingPatterns.some(pattern => text.toLowerCase().includes(pattern))) {
const greetings = [
"¡Hola! ¿En qué puedo ayudarte hoy con tu nutrición?",
"¡Saludos! ¿Cómo puedo asistirte con tu alimentación hoy?",
"¡Hola! Estoy aquí para responder tus dudas sobre nutrición. ¿Qué necesitas?",
"¡Buen día! ¿Tienes alguna consulta sobre alimentación o nutrición?"
];
addBotMessage(greetings[Math.floor(Math.random() * greetings.length)]);
return;
}

// Comprobar si es una despedida
if (farewellPatterns.some(pattern => text.toLowerCase().includes(pattern))) {
const farewells = [
"¡Hasta pronto! No dudes en volver cuando tengas más preguntas sobre nutrición.",
"¡Adiós! Recuerda que estoy aquí para ayudarte con tus objetivos nutricionales cuando lo necesites.",
"¡Que tengas un excelente día! Estoy disponible cuando necesites más información sobre alimentación saludable."
];
addBotMessage(farewells[Math.floor(Math.random() * farewells.length)]);
return;
}

// Comprobar si es un agradecimiento
if (thanksPatterns.some(pattern => text.toLowerCase().includes(pattern))) {
const responses = [
"¡De nada! Estoy aquí para ayudarte con tus objetivos nutricionales. ¿Hay algo más en lo que pueda asistirte?",
"¡Es un placer! Si tienes más preguntas sobre nutrición o alimentación, no dudes en consultar.",
"¡Encantado de ayudar! ¿Necesitas alguna otra información nutricional?"
];
addBotMessage(responses[Math.floor(Math.random() * responses.length)]);
currentQuestion = 'follow_up';
return;
}

// Paso 6: Si no es ninguno de los casos anteriores, continuamos con el flujo normal
let botResponse = '';
let nextQuestion = currentQuestion;

// Si el usuario pide ayuda o reiniciar
if (text.toLowerCase().includes('ayuda') || text.toLowerCase().includes('reiniciar')) {
resetUserData();
botResponse = "Puedo ayudarte a crear un plan nutricional personalizado. Te haré algunas preguntas sobre tu peso, altura, edad, nivel de actividad y objetivos. También puedo responder a tus preguntas sobre nutrición. ¿Quieres comenzar con el plan personalizado?";
nextQuestion = 'initial';
} else {
switch(currentQuestion) {
case 'initial':
    // Detectar si el mensaje parece una pregunta de nutrición directa
    if (text.toLowerCase().includes('qué') || text.toLowerCase().includes('cómo') || 
        text.toLowerCase().includes('por qué') || text.toLowerCase().includes('cuál') ||
        text.toLowerCase().includes('cuánto') || text.toLowerCase().includes('dónde')) {
        
        botResponse = "Parece que tienes una pregunta específica sobre nutrición. Para darte información más personalizada, me ayudaría conocer algunos datos básicos sobre ti. ¿Te gustaría crear un perfil rápido, o prefieres que responda directamente a tu consulta sin personalización?";
        nextQuestion = 'ask_profile_or_direct';
    } else {
        botResponse = "Para comenzar a personalizar mis recomendaciones, necesito algunos datos básicos. ¿Cuál es tu género (masculino/femenino)?";
        nextQuestion = 'gender';
    }
    break;
    
case 'ask_profile_or_direct':
    if (text.toLowerCase().includes('perfil') || text.toLowerCase().includes('crear') || 
        text.toLowerCase().includes('personaliza') || text.toLowerCase().includes('datos') || 
        text.toLowerCase().includes('sí')) {
        
        botResponse = "¡Excelente! Vamos a crear un perfil básico para personalizar mis recomendaciones. ¿Cuál es tu género (masculino/femenino)?";
        nextQuestion = 'gender';
    } else {
        botResponse = "Entendido, responderé directamente sin datos personalizados. ¿Cuál es tu consulta específica sobre nutrición?";
        nextQuestion = 'follow_up';
    }
    break;
    
case 'gender':
    if (text.toLowerCase().includes('masculino') || text.toLowerCase().includes('hombre') || 
        text.toLowerCase().includes('varón') || text.toLowerCase() === 'm') {
        userData.gender = 'masculino';
        saveUserData();
        botResponse = "Gracias. ¿Cuál es tu edad en años?";
        nextQuestion = 'age';
    } else if (text.toLowerCase().includes('femenino') || text.toLowerCase().includes('mujer') || 
             text.toLowerCase() === 'f') {
        userData.gender = 'femenino';
        saveUserData();
        botResponse = "Gracias. ¿Cuál es tu edad en años?";
        nextQuestion = 'age';
    } else {
        botResponse = "Por favor, indica si tu género es masculino o femenino para poder hacer cálculos nutricionales más precisos.";
    }
    break;
    
case 'age':
    const age = parseInt(text);
    if (isNaN(age) || age <= 0 || age > 120) {
        botResponse = "Por favor, ingresa una edad válida en números (por ejemplo: 35).";
    } else {
        userData.age = age;
        saveUserData();
        botResponse = "Perfecto. ¿Cuál es tu peso actual en kilogramos?";
        nextQuestion = 'weight';
    }
    break;
    
case 'weight':
    const weight = parseFloat(text.replace(',', '.'));
    if (isNaN(weight) || weight <= 0 || weight > 300) {
        botResponse = "Por favor, ingresa un peso válido en kilogramos (por ejemplo: 70.5).";
    } else {
        userData.weight = weight;
        saveUserData();
        botResponse = "Gracias. ¿Cuál es tu altura en metros? (por ejemplo: 1.75)";
        nextQuestion = 'height';
    }
    break;
    
case 'height':
    let height;
    // Comprobar si están usando formato con punto o coma (1.75 o 1,75)
    if (text.includes('.') || text.includes(',')) {
        height = parseFloat(text.replace(',', '.')) * 100; // Convertir de metros a cm
    } else {
        // Si pusieron la altura en cm directamente
        height = parseFloat(text);
    }
    
    if (isNaN(height) || height <= 0) {
        botResponse = "Por favor, ingresa una altura válida en metros (por ejemplo: 1.75) o en centímetros.";
    } else {
        // Si parece que ingresaron en metros pero olvidaron el punto/coma (175 en lugar de 1.75)
        if (height > 3 && height <= 300) {
            // Probablemente es en cm, dejar como está
        } else if (height < 3) {
            // Está en metros, convertir a cm
            height = height * 100;
        }
        
        userData.height = height;
        saveUserData();
        
        botResponse = `Gracias. ¿Cuál es tu nivel de actividad física?
        
1) Sedentario (poco o ningún ejercicio)
2) Ligera (ejercicio 1-3 días a la semana)
3) Moderada (ejercicio 3-5 días a la semana)
4) Activa (ejercicio intenso 6-7 días a la semana)
5) Muy activa (ejercicio intenso diario o trabajo físico)`;
        nextQuestion = 'activity';
    }
    break;
    
case 'activity':
    let activity = '';
    
    if (text.includes('1') || text.toLowerCase().includes('sedentario')) {
        activity = 'sedentario';
    } else if (text.includes('2') || text.toLowerCase().includes('ligera')) {
        activity = 'ligera';
    } else if (text.includes('3') || text.toLowerCase().includes('moderada')) {
        activity = 'moderada';
    } else if (text.includes('4') || text.toLowerCase().includes('activa')) {
        activity = 'activa';
    } else if (text.includes('5') || text.toLowerCase().includes('muy activa')) {
        activity = 'muy activa';
    }
    
    if (activity === '') {
        botResponse = "Por favor, selecciona uno de los niveles de actividad mencionados del 1 al 5, o indica si es sedentario, ligera, moderada, activa o muy activa.";
    } else {
        userData.activityLevel = activity;
        saveUserData();
        
        botResponse = `Excelente. Por último, ¿cuál es tu objetivo principal?
        
1) Perder peso
2) Mantener peso
3) Ganar peso`;
        nextQuestion = 'goal';
    }
    break;
    
case 'goal':
    let goal = '';
    
    if (text.includes('1') || text.toLowerCase().includes('perder')) {
        goal = 'perder peso';
    } else if (text.includes('2') || text.toLowerCase().includes('mantener')) {
        goal = 'mantener peso';
    } else if (text.includes('3') || text.toLowerCase().includes('ganar')) {
        goal = 'ganar peso';
    }
    
    if (goal === '') {
        botResponse = "Por favor, selecciona uno de los objetivos mencionados: perder peso, mantener peso o ganar peso.";
    } else {
        userData.goal = goal;
        saveUserData();
        
        botResponse = "¡Perfecto! Ahora tengo toda la información necesaria para proporcionarte recomendaciones personalizadas.";
        nextQuestion = 'show_meal_plan';
        
        // Generar diagnóstico después de un breve retraso
        setTimeout(() => {
            const diagnosisMessage = generateDiagnosisMessage();
            addBotMessage(diagnosisMessage);
        }, 1000);
    }
    break;
    
case 'show_meal_plan':
    if (text.toLowerCase().includes('sí') || text.toLowerCase().includes('si') || 
        text.toLowerCase().includes('yes') || text.toLowerCase().includes('ver') || 
        text.toLowerCase().includes('plan') || text.toLowerCase().includes('claro')) {
        
        botResponse = "Generando plan de comidas personalizado basado en tus necesidades...";
        nextQuestion = 'show_recipes';
        
        // Generar plan de comidas después de un retraso
        setTimeout(() => {
            const mealPlanMessage = generateMealPlanMessage();
            addBotMessage(mealPlanMessage);
        }, 1500);
    } else {
        botResponse = "Entendido. ¿Hay algo específico sobre nutrición o alimentación en lo que pueda ayudarte? Puedes preguntarme sobre alimentos, nutrientes, o estrategias para tu objetivo.";
        nextQuestion = 'follow_up';
    }
    break;
    
case 'show_recipes':
    if (text.toLowerCase().includes('sí') || text.toLowerCase().includes('si') || 
        text.toLowerCase().includes('yes') || text.toLowerCase().includes('receta') || 
        text.toLowerCase().includes('claro')) {
        
        botResponse = "Generando recetas adaptadas a tus preferencias y objetivos...";
        nextQuestion = 'follow_up';
        
        // Generar recetas después de un retraso
        setTimeout(() => {
            const recipesMessage = generateRecipesMessage();
            addBotMessage(recipesMessage);
        }, 1500);
    } else {
        botResponse = "Entendido. ¿Hay algo más específico sobre nutrición o alimentación en lo que pueda ayudarte?";
        nextQuestion = 'follow_up';
    }
    break;
    
    case 'follow_up':
        // Verificar si es una pregunta de conocimiento en follow_up
        const followUpKnowledgeResponse = checkForKnowledgeQuestion(text);
        
        if (followUpKnowledgeResponse) {
            botResponse = followUpKnowledgeResponse;
        }
        // Si el usuario responde afirmativamente a una pregunta anterior
        else if (text.toLowerCase().match(/^(sí|si|yes|ok|okay|claro|por supuesto|adelante|continúa|continua)/)) {
            // Analizar el contexto de la conversación anterior para dar una respuesta apropiada
            const lastMessages = $('#chat-messages .message-bot').last().text().toLowerCase();
            
            if (lastMessages.includes('receta') || lastMessages.includes('plan')) {
                botResponse = "Generando recetas adaptadas a tus preferencias y objetivos...";
                
                // Generar recetas después de un retraso
                setTimeout(() => {
                    const recipesMessage = generateRecipesMessage();
                    addBotMessage(recipesMessage);
                }, 1500);
            } 
            else if (lastMessages.includes('ejercicio') || lastMessages.includes('entrenar')) {
                if (userData.goal) {
                    botResponse = `Perfecto, aquí tienes un plan de ejercicios más detallado para tu objetivo de ${userData.goal}:\n\n` + 
                                 getDetailedExercisePlan(userData.goal, userData.activityLevel);
                } else {
                    botResponse = "Estupendo. Aquí tienes un plan de ejercicios general que puedes adaptar a tu nivel de condición física actual. Recuerda comenzar gradualmente e ir aumentando intensidad a medida que progresas:\n\n" +
                                 getDetailedExercisePlan('general', userData.activityLevel || 'moderada');
                }
            }
            else if (lastMessages.includes('macronutrientes') || lastMessages.includes('macros')) {
                botResponse = `Genial. Aquí tienes información detallada sobre las mejores fuentes de cada macronutriente y cómo distribuirlos a lo largo del día:\n\n` + 
                             getDetailedMacroInfo(userData.goal || 'general');
            }
            else {
                // Respuesta más conversacional para continuar el diálogo
                botResponse = "Excelente. ¿Hay algún aspecto específico de la nutrición que te interese conocer más a fondo? Por ejemplo, podría hablarte sobre nutrientes específicos, estrategias para mejorar hábitos alimenticios o recetas adaptadas a tus objetivos.";
            }
        }
        // Manejar otras consultas de seguimiento comunes
        else if (text.toLowerCase().includes('no') || text.toLowerCase().includes('gracias')) {
            const closingResponses = [
                "¡Ha sido un placer ayudarte! Recuerda que aquí estoy para cualquier consulta sobre nutrición que tengas en el futuro.",
                "¡Gracias por utilizar NutriChat! Espero haberte ayudado con tus dudas nutricionales. No dudes en volver cuando necesites más información.",
                "¡Encantado de haber podido asistirte! Recuerda que pequeños cambios consistentes en tu alimentación pueden tener grandes resultados con el tiempo. ¡Hasta pronto!"
            ];
            botResponse = closingResponses[Math.floor(Math.random() * closingResponses.length)];
        }
        // Resto del código existente...
        // ...
        else {
            // En lugar de una respuesta genérica, intentar reconocer el tema general
            // y proporcionar información relevante
            const lowerText = text.toLowerCase();
            
            if (lowerText.includes('comida') || lowerText.includes('plato') || lowerText.includes('alimento')) {
                botResponse = "Veo que estás interesado en alimentos específicos. La calidad de los alimentos es tan importante como la cantidad. ¿Te gustaría recomendaciones de alimentos nutritivos para tu objetivo específico o información sobre cómo interpretar etiquetas de alimentos?";
            }
            else if (lowerText.includes('desayun')) {
                botResponse = "El desayuno es una comida importante para establecer hábitos alimenticios saludables. Un buen desayuno equilibrado debería incluir proteínas, grasas saludables y carbohidratos complejos. ¿Te gustaría algunas ideas de desayunos específicos para tu objetivo?";
            }
            else if (lowerText.includes('noche') || lowerText.includes('cena') || lowerText.includes('dormir')) {
                botResponse = "La alimentación nocturna puede influir significativamente en la calidad del sueño y la recuperación. Idealmente, la cena debería ser consumida 2-3 horas antes de dormir y contener proteínas de fácil digestión con carbohidratos moderados. ¿Te gustaría recomendaciones específicas para cenas?";
            }
            else {
                // Usar una variedad de respuestas abiertas en lugar de siempre la misma
                const conversationalResponses = [
                    "Cuéntame más sobre tus hábitos alimenticios actuales. Así podré darte recomendaciones más personalizadas.",
                    "¿Has notado algún patrón en tu alimentación que te gustaría cambiar o mejorar?",
                    "La nutrición es muy personal. ¿Hay algún aspecto específico de tu alimentación que te preocupe?",
                    "¿Cómo te sientes con tu alimentación actual? Identificar lo que funciona y lo que no es el primer paso para mejorar.",
                    "¿Has intentado algún enfoque nutricional particular en el pasado? ¿Qué resultados obtuviste?"
                ];
                botResponse = conversationalResponses[Math.floor(Math.random() * conversationalResponses.length)];
            }
        }
        break;
    
case 'update_age':
    const updatedAge = parseInt(text);
    if (isNaN(updatedAge) || updatedAge <= 0 || updatedAge > 120) {
        botResponse = "Por favor, ingresa una edad válida en años.";
    } else {
        userData.age = updatedAge;
        saveUserData();
        botResponse = `¡Perfecto! He actualizado tu edad a ${userData.age} años. Esto afectará a tus cálculos nutricionales. ¿Te gustaría ver tu plan nutricional actualizado?`;
        nextQuestion = 'show_updated_plan';
    }
    break;
    
case 'update_gender':
    if (text.toLowerCase().includes('masculino') || text.toLowerCase().includes('hombre') || 
        text.toLowerCase().includes('varón') || text.toLowerCase() === 'm') {
        userData.gender = 'masculino';
        saveUserData();
        botResponse = `¡Perfecto! He actualizado tu género a masculino. Esto afectará a tus cálculos nutricionales. ¿Te gustaría ver tu plan nutricional actualizado?`;
        nextQuestion = 'show_updated_plan';
    } else if (text.toLowerCase().includes('femenino') || text.toLowerCase().includes('mujer') || 
             text.toLowerCase() === 'f') {
        userData.gender = 'femenino';
        saveUserData();
        botResponse = `¡Perfecto! He actualizado tu género a femenino. Esto afectará a tus cálculos nutricionales. ¿Te gustaría ver tu plan nutricional actualizado?`;
        nextQuestion = 'show_updated_plan';
    } else {
        botResponse = "Por favor, indica si tu género es masculino o femenino para poder hacer cálculos nutricionales más precisos.";
    }
    break;
    
case 'update_goal':
    let updatedGoal = '';
    
    if (text.toLowerCase().includes('perder')) {
        updatedGoal = 'perder peso';
    } else if (text.toLowerCase().includes('mantener')) {
        updatedGoal = 'mantener peso';
    } else if (text.toLowerCase().includes('ganar')) {
        updatedGoal = 'ganar peso';
    } else if (text.includes('1')) {
        updatedGoal = 'perder peso';
    } else if (text.includes('2')) {
        updatedGoal = 'mantener peso';
    } else if (text.includes('3')) {
        updatedGoal = 'ganar peso';
    }
    
    if (updatedGoal === '') {
        botResponse = "Por favor, elige uno de los objetivos: perder peso, mantener peso o ganar peso.";
    } else {
        userData.goal = updatedGoal;
        saveUserData();
        botResponse = `He actualizado tu objetivo a "${userData.goal}". Esto modificará tus recomendaciones calóricas y nutricionales. ¿Te gustaría ver tu nuevo plan nutricional?`;
        nextQuestion = 'show_updated_plan';
    }
    break;
    
case 'update_activity':
    let updatedActivity = '';
    
    if (text.includes('1') || text.toLowerCase().includes('sedentario')) {
        updatedActivity = 'sedentario';
    } else if (text.includes('2') || text.toLowerCase().includes('ligera')) {
        updatedActivity = 'ligera';
    } else if (text.includes('3') || text.toLowerCase().includes('moderada')) {
        updatedActivity = 'moderada';
    } else if (text.includes('4') || text.toLowerCase().includes('activa')) {
        updatedActivity = 'activa';
    } else if (text.includes('5') || text.toLowerCase().includes('muy activa')) {
        updatedActivity = 'muy activa';
    }
    
    if (updatedActivity === '') {
        botResponse = "Por favor, elige uno de los niveles de actividad: sedentario, ligera, moderada, activa o muy activa.";
    } else {
        userData.activityLevel = updatedActivity;
        saveUserData();
        botResponse = `He actualizado tu nivel de actividad a "${userData.activityLevel}". Esto modificará tus recomendaciones calóricas y necesidades nutricionales. ¿Te gustaría ver tu nuevo plan nutricional?`;
        nextQuestion = 'show_updated_plan';
    }
    break;
    
case 'show_updated_plan':
    if (text.toLowerCase().includes('sí') || text.toLowerCase().includes('si') || 
        text.toLowerCase().includes('yes') || text.toLowerCase().includes('claro') || 
        text.toLowerCase().includes('ver')) {
        
        botResponse = "Actualizando tu plan nutricional con los nuevos datos proporcionados...";
        nextQuestion = 'follow_up';
        
        // Generar plan actualizado después de un retraso
        setTimeout(() => {
            const diagnosisMessage = generateDiagnosisMessage();
            addBotMessage(diagnosisMessage);
        }, 1500);
    } else {
        botResponse = "Entendido. Tus datos han sido actualizados y serán utilizados para futuras recomendaciones. ¿En qué más puedo ayudarte relacionado con nutrición?";
        nextQuestion = 'follow_up';
    }
    break;
    
case 'confirm_reset':
    if (text.toLowerCase().includes('sí') || text.toLowerCase().includes('si') || 
        text.toLowerCase().includes('yes') || text.toLowerCase().includes('confirmo')) {
        
        resetUserData();
        botResponse = "¡Listo! He reiniciado todos tus datos personales. ¿Te gustaría comenzar de nuevo con la configuración de tu plan nutricional?";
        nextQuestion = 'initial';
    } else {
        botResponse = "Entendido, no borraré tus datos. ¿Hay algo más en lo que pueda ayudarte relacionado con nutrición?";
        nextQuestion = 'follow_up';
    }
    break;
    
default:
    // Verificar si es una solicitud de actualización de datos
    if (text.toLowerCase().includes('actualizar') || text.toLowerCase().includes('cambiar') || 
        text.toLowerCase().includes('modificar')) {
        
        if (text.toLowerCase().includes('peso')) {
            botResponse = "Por favor, dime cuál es tu nuevo peso en kilogramos.";
            nextQuestion = 'update_weight';
        } else if (text.toLowerCase().includes('altura') || text.toLowerCase().includes('estatura')) {
            botResponse = "Por favor, dime cuál es tu nueva altura en metros (por ejemplo: 1.75).";
            nextQuestion = 'update_height';
        } else if (text.toLowerCase().includes('objetivo') || text.toLowerCase().includes('meta')) {
            botResponse = "¿Cuál es tu nuevo objetivo? Opciones: perder peso, mantener peso o ganar peso.";
            nextQuestion = 'update_goal';
        } else if (text.toLowerCase().includes('actividad') || text.toLowerCase().includes('ejercicio')) {
            botResponse = `¿Cuál es tu nuevo nivel de actividad?
            
1) Sedentario (poco o ningún ejercicio)
2) Ligera (ejercicio 1-3 días a la semana)
3) Moderada (ejercicio 3-5 días a la semana)
4) Activa (ejercicio intenso 6-7 días a la semana)
5) Muy activa (ejercicio intenso diario o trabajo físico)`;
            nextQuestion = 'update_activity';
        } else if (text.toLowerCase().includes('edad') || text.toLowerCase().includes('años')) {
            botResponse = "Por favor, dime cuál es tu nueva edad en años.";
            nextQuestion = 'update_age';
        } else if (text.toLowerCase().includes('género') || text.toLowerCase().includes('sexo')) {
            botResponse = "Por favor, indica tu género (masculino o femenino).";
            nextQuestion = 'update_gender';
        } else {
            botResponse = "¿Qué datos te gustaría actualizar? Puedo ayudarte a modificar tu peso, altura, edad, género, nivel de actividad u objetivo.";
        }
    }
    // Verificar si es una solicitud de reinicio
    else if (text.toLowerCase().includes('reiniciar') || text.toLowerCase().includes('comenzar de nuevo') || 
             text.toLowerCase().includes('borrar')) {
        
        botResponse = "¿Estás seguro de que quieres reiniciar tus datos? Esto borrará toda la información que has proporcionado hasta ahora. Por favor, confirma con 'sí' o 'no'.";
        nextQuestion = 'confirm_reset';
    }
    // Si parece que están preguntando por nutrición pero no tenemos suficiente contexto
    else if (text.toLowerCase().includes('proteína') || text.toLowerCase().includes('carbohidrato') || 
             text.toLowerCase().includes('grasa') || text.toLowerCase().includes('nutriente') || 
             text.toLowerCase().includes('caloría') || text.toLowerCase().includes('dieta')) {
        
        // Intentar dar una respuesta general sobre nutrición
        botResponse = "Parece que tienes una consulta sobre nutrición. Para darte información más personalizada, me ayudaría conocer más sobre ti. ¿Te gustaría compartir algunos datos básicos o prefieres una respuesta general?";
        
        // Añadir oferta de completar perfil si hay datos incompletos
        const hasCompleteProfile = userData.weight && userData.height && 
                                userData.age && userData.gender && 
                                userData.activityLevel && userData.goal;
                                
        if (!hasCompleteProfile && Object.values(userData).some(value => value)) {
            botResponse += "\n\nVeo que ya has compartido algunos datos conmigo, pero aún faltan algunos para poder darte recomendaciones completamente personalizadas.";
        }
        
        nextQuestion = 'ask_profile_or_direct';
    }
    // Respuesta por defecto si nada más coincide
    else {
        const defaultResponses = [
            "Como asistente nutricional, puedo ayudarte con recomendaciones alimenticias, planes personalizados y respuestas a dudas sobre nutrición. ¿Hay algo específico sobre alimentación o nutrición en lo que pueda asistirte?",
            
            "Estoy especializado en nutrición y alimentación saludable. ¿Te gustaría información sobre algún nutriente, alimento específico o quizás un plan nutricional personalizado?",
            
            "Mi enfoque es en nutrición y bienestar alimentario. ¿Puedo ayudarte con alguna duda sobre dietas, nutrientes o recomendaciones alimenticias para tus objetivos de salud?"
        ];
        
        botResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        nextQuestion = 'follow_up';
    }
}
}
// Función para generar plan de ejercicios detallado según objetivo
function getDetailedExercisePlan(goal, activityLevel) {
    let plan = "";
    
    if (goal === 'perder peso') {
        plan = `PLAN DE EJERCICIOS PARA PÉRDIDA DE PESO - NIVEL: ${activityLevel.toUpperCase()}
        
🔄 ESTRUCTURA SEMANAL:
- 3-4 sesiones de entrenamiento cardiovascular (30-45 minutos)
- 2-3 sesiones de entrenamiento de fuerza (30-40 minutos)
- 1 día de actividad ligera (caminata, yoga)
- 1 día de descanso completo

💪 ENTRENAMIENTO DE FUERZA:
- Lunes: Tren inferior - Sentadillas, estocadas, elevaciones de talones, peso muerto (3-4 series de 12-15 repeticiones)
- Miércoles: Tren superior - Flexiones, remos, press hombro, tríceps (3-4 series de 12-15 repeticiones)
- Viernes: Cuerpo completo - Combinación de ejercicios anteriores (circuito de 3 rondas)

🏃 CARDIOVASCULAR:
- Intervalos de alta intensidad (HIIT): 30 segundos máximo esfuerzo + 90 segundos recuperación x 10 rondas
- Cardio constante de intensidad moderada: 30-45 minutos a 65-75% de frecuencia cardíaca máxima
- Combina ambos enfoques para resultados óptimos

PROGRESIÓN: Aumenta duración antes que intensidad las primeras 3 semanas`;
    } 
    else if (goal === 'ganar peso') {
        plan = `PLAN DE EJERCICIOS PARA GANANCIA DE MASA - NIVEL: ${activityLevel.toUpperCase()}
        
🔄 ESTRUCTURA SEMANAL:
- 4-5 sesiones de entrenamiento de fuerza (40-60 minutos)
- 1-2 sesiones de cardio ligero (20-30 minutos)
- 1-2 días de descanso completo

💪 ENTRENAMIENTO DE FUERZA:
- Lunes: Pecho/Tríceps - Press banca, fondos, aperturas, extensiones (4 series de 6-10 repeticiones)
- Martes: Espalda/Bíceps - Dominadas, remos, curl bíceps (4 series de 6-10 repeticiones)
- Jueves: Piernas - Sentadilla, peso muerto, prensa, extensiones (4 series de 6-10 repeticiones)
- Viernes: Hombros/Core - Press militar, elevaciones laterales, plancha (4 series de 6-10 repeticiones)

PRINCIPIOS CLAVE:
- Enfatiza ejercicios compuestos multiarticulates
- Usa pesos que te permitan completar las repeticiones con buena técnica pero que sean desafiantes
- Descansa 90-120 segundos entre series
- Aumenta peso cuando puedas completar repeticiones con facilidad
- Asegura consumo de proteínas post-entrenamiento`;
    }
    else {
        plan = `PLAN DE EJERCICIOS PARA MANTENIMIENTO Y SALUD GENERAL - NIVEL: ${activityLevel.toUpperCase()}
        
🔄 ESTRUCTURA SEMANAL:
- 2-3 sesiones de entrenamiento de fuerza (30-45 minutos)
- 2-3 sesiones de actividad cardiovascular (30 minutos)
- 1 sesión de flexibilidad/movilidad (yoga, estiramientos)
- 1 día de descanso activo (caminata, actividades recreativas)

EJERCICIOS RECOMENDADOS:
- Fuerza: Circuito de cuerpo completo con 8-10 ejercicios (sentadillas, flexiones, remos, plancha, etc.)
- Cardio: Combina actividades que disfrutes (caminar, nadar, bicicleta, baile)
- Flexibilidad: Rutina completa de estiramientos o clase de yoga

ENFOQUE:
- Consistencia sobre intensidad
- Variedad para evitar estancamiento y mantener motivación
- Combinar actividades que disfrutes para adherencia a largo plazo`;
    }
    
    return plan;
}

// Función para proporcionar información detallada sobre macronutrientes
function getDetailedMacroInfo(goal) {
    let info = `GUÍA DETALLADA DE MACRONUTRIENTES\n\n`;
    
    // Información sobre proteínas
    info += `🥩 PROTEÍNAS - 4 kcal/g\n
Funciones: Reparación y construcción de tejidos, producción de enzimas y hormonas, transporte de nutrientes, función inmunológica.

Mejores fuentes:
- Animal: Pechuga de pollo/pavo, carne magra, huevos, pescado, lácteos bajos en grasa
- Vegetal: Tofu, tempeh, legumbres, quinoa, semillas

Timing ideal: Distribuir en 4-5 comidas (0.25-0.4g/kg por comida) para maximizar síntesis proteica muscular. Priorizar comida post-entrenamiento y antes de dormir.

Recomendación:
- Para pérdida de peso: 1.8-2.2g/kg para preservar masa muscular
- Para ganancia: 1.6-2.0g/kg para construcción muscular
- Para mantenimiento: 1.2-1.6g/kg para salud general\n\n`;
    
    // Información sobre carbohidratos
    info += `🍚 CARBOHIDRATOS - 4 kcal/g\n
Funciones: Principal fuente de energía, preservación de proteínas, combustible del sistema nervioso central, regulación intestinal.

Mejores fuentes:
- Complejos: Granos enteros (avena, arroz integral, quinoa), patatas, legumbres
- Simples: Frutas, miel, lácteos (consumo estratégico)
- Fibra: Vegetales, frutas con piel, legumbres, semillas de chía/lino

Timing ideal: Concentrar mayor proporción alrededor del entrenamiento. Mayor cantidad en días de entrenamiento intenso vs. días de descanso.

Recomendación:
- Para pérdida de peso: 2-3g/kg enfocados en fuentes fibrosas y comidas pre/post entrenamiento
- Para ganancia: 4-7g/kg distribuidos a lo largo del día con énfasis post-entrenamiento
- Para mantenimiento: 3-5g/kg ajustados según nivel de actividad diario\n\n`;
    
    // Información sobre grasas
    info += `🥑 GRASAS - 9 kcal/g\n
Funciones: Absorción de vitaminas liposolubles, producción hormonal, protección de órganos, aislamiento térmico, reserva energética.

Mejores fuentes:
- Monoinsaturadas: Aceite de oliva, aguacate, almendras, avellanas
- Poliinsaturadas: Pescados grasos (salmón, sardinas), semillas de lino/chía, nueces
- Saturadas (con moderación): Huevos, carne, lácteos enteros, aceite de coco
- Evitar: Grasas trans (alimentos ultraprocesados)

Timing ideal: Distribuir a lo largo del día, limitar en comidas pre-entrenamiento (ralentizan digestión).

Recomendación:
- Para todos los objetivos: 0.8-1g/kg o 20-35% de calorías totales
- Pérdida de peso: Pueden aumentarse ligeramente para mejorar saciedad
- Priorizar variedad de fuentes para perfil completo de ácidos grasos\n\n`;
    
    // Información específica según objetivo
    if (goal === 'perder peso') {
        info += `ESTRATEGIA ESPECÍFICA PARA PÉRDIDA DE PESO:
- Déficit calórico principalmente de carbohidratos y grasas
- Proteínas elevadas (1.8-2.2g/kg) para preservar masa muscular
- Priorizar carbohidratos alrededor del entrenamiento
- Distribuir grasas alejadas del entrenamiento para optimizar rendimiento
- Considerar ayuno intermitente 16/8 si se adapta a tu estilo de vida
- Monitorizar progreso y ajustar macros cada 2-3 semanas según resultados`;
    } 
    else if (goal === 'ganar peso') {
        info += `ESTRATEGIA ESPECÍFICA PARA GANANCIA DE PESO:
- Superávit calórico principalmente de carbohidratos
- Proteínas moderadamente altas (1.6-2.0g/kg) para optimizar construcción muscular
- Carbohidratos elevados (5-8g/kg) para maximizar entrenamiento y recuperación
- Distribución en 5-6 comidas para facilitar mayor ingesta calórica total
- Aprovechar ventana post-entrenamiento para batido con 25g proteína + 50g carbos
- Evitar grasas de baja calidad aunque estés en fase de ganancia`;
    }
    else {
        info += `ESTRATEGIA ESPECÍFICA PARA MANTENIMIENTO:
- Equilibrio entre los tres macronutrientes según preferencias personales
- Flexibilidad en distribución manteniendo proteína consistente
- Periodizar carbohidratos según días de entrenamiento vs. descanso
- Priorizar grasas saludables para función hormonal óptima
- Considerar ciclos de mantenimiento entre fases de otros objetivos
- Practicar alimentación intuitiva y equilibrio flexible`;
    }
    
    return info;
}
// Actualizar pregunta actual
currentQuestion = nextQuestion;

// Añadir respuesta del bot
if (botResponse) {
addBotMessage(botResponse);
}
}, processingTime);
}

// Generar mensaje de diagnóstico nutricional
function generateDiagnosisMessage() {
const calories = calculateCalorieNeeds(userData);
const macros = calculateMacroDistribution(userData);
const diagnosis = generateNutritionalDiagnosis(userData);

return `
📊 DIAGNÓSTICO NUTRICIONAL PERSONALIZADO 📊

${diagnosis}

📈 RECOMENDACIONES DIARIAS:
- Calorías: ${calories} kcal
- Proteínas: ${macros.protein}g (${Math.round(macros.protein * 4)} kcal - ${Math.round((macros.protein * 4 / calories) * 100)}%)
- Carbohidratos: ${macros.carbs}g (${Math.round(macros.carbs * 4)} kcal - ${Math.round((macros.carbs * 4 / calories) * 100)}%)
- Grasas: ${macros.fat}g (${Math.round(macros.fat * 9)} kcal - ${Math.round((macros.fat * 9 / calories) * 100)}%)
- Agua: ${calculateWaterNeeds(userData.weight, userData.activityLevel)} litros

👉 PRÓXIMOS PASOS:
Esta es una evaluación general basada en la información proporcionada. ¿Te gustaría ver un ejemplo de plan de comidas basado en estas recomendaciones? También puedo ofrecerte consejos específicos para tu objetivo de ${userData.goal}.
`;
}

// Generar mensaje con plan de comidas
function generateMealPlanMessage() {
const calories = calculateCalorieNeeds(userData);
const macros = calculateMacroDistribution(userData);
const mealPlan = generateMealPlan(macros, calories, userData.goal);

let response = `
🍽️ PLAN DE COMIDAS PERSONALIZADO - ${userData.goal.toUpperCase()} 🍽️

Este plan está diseñado para proporcionar aproximadamente ${calories} calorías diarias, adaptado a tus características y objetivo de ${userData.goal}.

⏰ DESAYUNO (7:00-8:30) - ${mealPlan.breakfast.calories} kcal
- Proteínas: ${mealPlan.breakfast.protein}g | Carbohidratos: ${mealPlan.breakfast.carbs}g | Grasas: ${mealPlan.breakfast.fat}g
- Opciones recomendadas:
${mealPlan.breakfast.suggestions.slice(0, 3).map(item => `  ✓ ${item}`).join('\n')}

🥪 MEDIA MAÑANA (10:30-11:00) - ${mealPlan.morningSnack.calories} kcal
- Proteínas: ${mealPlan.morningSnack.protein}g | Carbohidratos: ${mealPlan.morningSnack.carbs}g | Grasas: ${mealPlan.morningSnack.fat}g
- Opciones recomendadas:
${mealPlan.morningSnack.suggestions.slice(0, 2).map(item => `  ✓ ${item}`).join('\n')}

🍲 COMIDA (13:00-14:30) - ${mealPlan.lunch.calories} kcal
- Proteínas: ${mealPlan.lunch.protein}g | Carbohidratos: ${mealPlan.lunch.carbs}g | Grasas: ${mealPlan.lunch.fat}g
- Opciones recomendadas:
${mealPlan.lunch.suggestions.slice(0, 3).map(item => `  ✓ ${item}`).join('\n')}

🍎 MERIENDA (16:30-17:30) - ${mealPlan.afternoonSnack.calories} kcal
- Proteínas: ${mealPlan.afternoonSnack.protein}g | Carbohidratos: ${mealPlan.afternoonSnack.carbs}g | Grasas: ${mealPlan.afternoonSnack.fat}g
- Opciones recomendadas:
${mealPlan.afternoonSnack.suggestions.slice(0, 2).map(item => `  ✓ ${item}`).join('\n')}

🥗 CENA (20:00-21:00) - ${mealPlan.dinner.calories} kcal
- Proteínas: ${mealPlan.dinner.protein}g | Carbohidratos: ${mealPlan.dinner.carbs}g | Grasas: ${mealPlan.dinner.fat}g
- Opciones recomendadas:
${mealPlan.dinner.suggestions.slice(0, 3).map(item => `  ✓ ${item}`).join('\n')}`;

// Añadir consejos específicos según el objetivo
if (userData.goal === 'perder peso') {
response += `

💡 CONSEJOS ESPECÍFICOS PARA PÉRDIDA DE PESO:
- Mantén un registro de lo que comes para desarrollar conciencia alimentaria
- Bebe agua 30 minutos antes de las comidas para aumentar saciedad
- Prioriza alimentos con alto volumen y baja densidad calórica
- Crea un entorno que facilite decisiones alimentarias saludables
- El déficit calórico propuesto (15%) permite una pérdida gradual y sostenible`;
} else if (userData.goal === 'ganar peso') {
response += `

💡 CONSEJOS ESPECÍFICOS PARA GANANCIA DE PESO:
- Establece recordatorios para no saltarte comidas
- Aumenta densidad calórica añadiendo aceites saludables, frutos secos o aguacate
- Prioriza nutrientes de calidad sobre "calorías vacías"
- Consume comida post-entrenamiento dentro de 30-60 minutos
- Evalúa progreso semanalmente midiendo además del peso, fuerza y energía`;
} else {
response += `

💡 CONSEJOS PARA MANTENIMIENTO:
- Escucha señales naturales de hambre y saciedad
- Practica alimentación consciente, sin distracciones
- Permite flexibilidad y disfrute ocasional sin culpa
- Ajusta ingesta según niveles de actividad diarios
- Evalúa cambios en composición corporal más que en peso`;
}

response += `

¿Te gustaría recetas detalladas para este plan o información sobre cómo adaptar estas comidas a tus gustos y preferencias?`;

return response;
}

// Generar mensaje con recetas
function generateRecipesMessage() {
const calories = calculateCalorieNeeds(userData);
const macros = calculateMacroDistribution(userData);
const mealPlan = generateMealPlan(macros, calories, userData.goal);

const breakfastRecipe = generateSimpleRecipe(mealPlan.breakfast.suggestions, 'breakfast', userData.goal);
const snackRecipe = generateSimpleRecipe(mealPlan.morningSnack.suggestions, 'morningSnack', userData.goal);
const lunchRecipe = generateSimpleRecipe(mealPlan.lunch.suggestions, 'lunch', userData.goal);
const dinnerRecipe = generateSimpleRecipe(mealPlan.dinner.suggestions, 'dinner', userData.goal);

let response = `
👨‍🍳 RECETAS Y ORIENTACIÓN CULINARIA 👨‍🍳

Estas recetas están adaptadas a tu objetivo de ${userData.goal} y necesidades nutricionales.

${breakfastRecipe}

${snackRecipe}

${lunchRecipe}

${dinnerRecipe}

🔄 VARIABILIDAD Y ADAPTACIÓN:
- Estas son sugerencias - adapta según tus preferencias manteniendo valores nutricionales similares
- Rota alimentos para asegurar variedad de nutrientes
- Ajusta porciones según hambre y saciedad reales
- Usa hierbas y especias para añadir sabor sin calorías adicionales
- Técnicas de cocción saludables: horneado, vapor, plancha, salteado con mínimo aceite

¿Hay alguna receta específica sobre la que te gustaría más detalles o algún tipo de alimento por el que tengas preferencia o intolerancia?`;

return response;
}

// Obtener recomendaciones de ejercicio según objetivo
function getExerciseRecommendation(goal) {
switch(goal) {
case 'perder peso':
return "combinar entrenamiento cardiovascular (3-5 sesiones semanales de 30-45 minutos) con entrenamiento de fuerza (2-3 sesiones semanales). El cardio ayuda a aumentar el gasto calórico diario, mientras que la fuerza preserva y desarrolla masa muscular, fundamental para mantener un metabolismo activo durante el déficit calórico";
case 'ganar peso':
return "enfocarte prioritariamente en el entrenamiento de fuerza (3-5 sesiones semanales) con énfasis en ejercicios compuestos (sentadilla, peso muerto, press banca, dominadas) que estimulan mayor liberación hormonal anabólica. El cardio debería limitarse a 1-2 sesiones semanales de 20-30 minutos para mantener salud cardiovascular sin interferir con la ganancia muscular";
case 'mantener peso':
return "mantener un equilibrio entre entrenamiento de fuerza (2-3 sesiones semanales) y cardio (2-3 sesiones semanales de 30 minutos), incorporando actividades que disfrutes para mayor adherencia. Lo ideal es combinar estas modalidades con ejercicios de flexibilidad y movilidad para una condición física integral";
default:
return "establecer una rutina regular que incluya tanto ejercicio cardiovascular como de fuerza, adaptando la intensidad y volumen gradualmente según tu condición actual. Lo más importante es encontrar actividades que disfrutes y puedas mantener a largo plazo";
}
}

// Actualizar sección de diagnóstico
function updateDiagnosis() {
const hasCompleteData = userData.gender && userData.age && userData.weight && 
          userData.height && userData.activityLevel && userData.goal;

if (!hasCompleteData) {
// Mostrar mensaje de datos incompletos
$('#user-data-incomplete').removeClass('d-none');
$('#diagnosis-content').addClass('d-none');
return;
}

// Ocultar mensaje de datos incompletos y mostrar contenido
$('#user-data-incomplete').addClass('d-none');
$('#diagnosis-content').removeClass('d-none');

// Actualizar datos personales
updatePersonalData();

// Actualizar IMC
updateBMI();

// Actualizar necesidades energéticas
updateEnergyNeeds();

// Actualizar macronutrientes
updateMacronutrients();

// Actualizar recomendaciones
updateRecommendations();
}

// Actualizar sección de datos personales
function updatePersonalData() {
const personalDataHtml = `
<div class="col-md-4 mb-2">
<div class="fw-bold">Género:</div>
<div>${userData.gender === 'masculino' ? 'Masculino' : 'Femenino'}</div>
</div>
<div class="col-md-4 mb-2">
<div class="fw-bold">Edad:</div>
<div>${userData.age} años</div>
</div>
<div class="col-md-4 mb-2">
<div class="fw-bold">Peso:</div>
<div>${userData.weight} kg</div>
</div>
<div class="col-md-4 mb-2">
<div class="fw-bold">Altura:</div>
<div>${(userData.height/100).toFixed(2)} m (${userData.height} cm)</div>
</div>
<div class="col-md-4 mb-2">
<div class="fw-bold">Nivel de actividad:</div>
<div class="text-capitalize">${userData.activityLevel}</div>
</div>
<div class="col-md-4 mb-2">
<div class="fw-bold">Objetivo:</div>
<div class="text-capitalize">${userData.goal}</div>
</div>
`;

$('#personal-data').html(personalDataHtml);
}

// Actualizar sección de IMC
function updateBMI() {
const bmi = calculateBMI(userData.weight, userData.height);
const bmiCategory = getBMICategory(bmi);
const bmiColor = getBMIColor(bmi);

// Actualizar valor y categoría
$('#bmi-value').text(bmi);
$('#bmi-category').text(bmiCategory);

// Actualizar color del círculo
$('#bmi-circle').css('background-color', bmiColor);

// Actualizar posición del indicador
const position = Math.min(Math.max((bmi / 40) * 100, 0), 100);
$('#bmi-indicator').css('left', `${position}%`);
}

// Actualizar sección de necesidades energéticas
function updateEnergyNeeds() {
const calories = calculateCalorieNeeds(userData);
const waterNeeds = calculateWaterNeeds(userData.weight, userData.activityLevel);

$('#calories-value').text(calories);
$('#water-value').text(waterNeeds);
}

// Actualizar sección de macronutrientes
function updateMacronutrients() {
const calories = calculateCalorieNeeds(userData);
const macros = calculateMacroDistribution(userData);

// Actualizar valores
$('#protein-value').text(`${macros.protein}g`);
$('#carbs-value').text(`${macros.carbs}g`);
$('#fat-value').text(`${macros.fat}g`);

// Actualizar calorías
$('#protein-calories').text(`${Math.round(macros.protein * 4)} kcal`);
$('#carbs-calories').text(`${Math.round(macros.carbs * 4)} kcal`);
$('#fat-calories').text(`${Math.round(macros.fat * 9)} kcal`);

// Actualizar barras
const proteinPercent = (macros.protein * 4 / calories) * 100;
const carbsPercent = (macros.carbs * 4 / calories) * 100;
const fatPercent = (macros.fat * 9 / calories) * 100;

$('#protein-bar').css('width', `${proteinPercent}%`);
$('#carbs-bar').css('width', `${carbsPercent}%`);
$('#fat-bar').css('width', `${fatPercent}%`);
}

// Actualizar sección de recomendaciones
function updateRecommendations() {
const bmi = calculateBMI(userData.weight, userData.height);
const category = getBMICategory(bmi);
const recommendations = getRecommendations(userData.goal, category);

let recommendationsHtml = '';
recommendations.forEach(rec => {
recommendationsHtml += `<li>${rec}</li>`;
});

$('#recommendations-list').html(recommendationsHtml);
}

// Guardar datos del usuario en localStorage
function saveUserData() {
localStorage.setItem('nutrichat_user_data', JSON.stringify(userData));
}

// Cargar datos del usuario desde localStorage
function loadUserData() {
const savedData = localStorage.getItem('nutrichat_user_data');
if (savedData) {
userData = JSON.parse(savedData);
}
}

// Resetear datos del usuario
function resetUserData() {
userData = {
gender: '',
age: '',
weight: '',
height: '',
activityLevel: '',
goal: '',
currentCalories: '',
foodPreferences: [],
restrictions: [],
lastInteraction: null
};

saveUserData();
currentQuestion = 'initial';
}

// Obtener color del IMC según valor
function getBMIColor(bmi) {
if (bmi < 18.5) return '#17a2b8'; // Bajo peso
if (bmi >= 18.5 && bmi < 25) return '#28a745'; // Normal
if (bmi >= 25 && bmi < 30) return '#ffc107'; // Sobrepeso
if (bmi >= 30 && bmi < 35) return '#fd7e14'; // Obesidad grado I
if (bmi >= 35 && bmi < 40) return '#dc3545'; // Obesidad grado II
return '#6f42c1'; // Obesidad grado III
}

// Obtener recomendaciones según objetivo e IMC
function getRecommendations(goal, bmiCategory) {
const recommendations = [
'Mantén una hidratación adecuada bebiendo agua regularmente a lo largo del día (2-3 litros).',
'Prioriza alimentos integrales y mínimamente procesados sobre ultraprocesados.'
];

// Recomendaciones según el objetivo
if (goal === 'perder peso') {
recommendations.push(
'Crea un déficit calórico moderado (300-500 kcal/día) para una pérdida gradual y sostenible.',
'Aumenta la ingesta de proteínas (1.8-2.2g/kg) para preservar masa muscular durante el déficit.',
'Incluye fibra en cada comida (verduras, frutas, legumbres) para aumentar la saciedad.',
'Combina cardio regular con entrenamiento de fuerza para optimizar composición corporal.',
'Controla el tamaño de las porciones usando referencias visuales (puño, palma, pulgar).'
);
} else if (goal === 'ganar peso') {
recommendations.push(
'Asegura un superávit calórico consistente (300-500 kcal/día) para favorecer el aumento de peso.',
'Distribuye la ingesta en 5-6 comidas al día para facilitar el consumo de calorías totales.',
'Prioriza fuentes de proteína de alta calidad (1.6-2.0g/kg) para favorecer desarrollo muscular.',
'Realiza entrenamiento de fuerza progresivo 3-5 veces por semana.',
'Incluye carbohidratos complejos post-entrenamiento para optimizar recuperación y crecimiento.'
);
} else {
recommendations.push(
'Mantén un equilibrio energético estable, ajustando según cambios en nivel de actividad.',
'Distribuye macronutrientes de forma equilibrada, enfatizando calidad sobre cantidad.',
'Practica alimentación intuitiva, atendiendo a señales de hambre y saciedad.',
'Incorpora variedad de alimentos para asegurar perfil completo de nutrientes.',
'Equilibra actividad física regular con adecuada recuperación y descanso.'
);
}

// Recomendaciones según el IMC
if (bmiCategory === 'Bajo peso') {
recommendations.push(
'Enfócate en aumentar gradualmente la ingesta calórica con alimentos densos en nutrientes.',
'Prioriza proteínas y grasas saludables que aportan más calorías por volumen.',
'Considera consultar con profesionales para descartar problemas subyacentes.'
);
} else if (bmiCategory === 'Sobrepeso') {
recommendations.push(
'Incorpora actividad física regular, comenzando gradualmente si eres principiante.',
'Enfócate en alimentos de baja densidad calórica que proporcionan saciedad.',
'Practica comidas conscientes, sin distracciones, para reconocer señales de saciedad.'
);
} else if (bmiCategory.includes('Obesidad')) {
recommendations.push(
'Considera buscar apoyo profesional multidisciplinario (nutricionista, médico, psicólogo).',
'Establece metas pequeñas y progresivas tanto en alimentación como en actividad física.',
'Prioriza cambios de hábitos sostenibles sobre resultados rápidos.',
'Monitoriza otros indicadores de salud además del peso (energía, sueño, bienestar general).'
);
}

return recommendations;
}