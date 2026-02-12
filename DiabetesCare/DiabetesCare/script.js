// === MODO OSCURO ===
(function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (darkModeToggle) darkModeToggle.textContent = '☀️';
    } else {
        if (darkModeToggle) darkModeToggle.textContent = '🌙';
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            let theme = 'light';
            if (document.body.classList.contains('dark-theme')) {
                theme = 'dark';
                darkModeToggle.textContent = '☀️';
            } else {
                darkModeToggle.textContent = '🌙';
            }
            localStorage.setItem('theme', theme);
        });
    }
})();

// === EVALUACIÓN COMPLETA + RECOMENDACIONES ===
document.addEventListener("DOMContentLoaded", function() {
    const btnEvaluar = document.getElementById("btnEvaluar");
    if (btnEvaluar) {
        btnEvaluar.addEventListener("click", evaluarCompleto);
    }

    // Historial
    const STORAGE_KEY = 'diabetescare_historial';
    const btnBorrar = document.getElementById('borrar-historial');
    if (btnBorrar) {
        btnBorrar.addEventListener('click', function() {
            localStorage.removeItem(STORAGE_KEY);
            mostrarHistorial();
        });
    }
    mostrarHistorial();
});

function evaluarCompleto() {
    const nombre = document.getElementById("nombre")?.value.trim() || "Usuario";
    
    // --- 1. Evaluar síntomas (12 preguntas) ---
    const sintomas = [
        { id: 'sed', nombre: 'mucha sed' },
        { id: 'orina', nombre: 'orinar con frecuencia' },
        { id: 'vision', nombre: 'visión borrosa' },
        { id: 'cansancio', nombre: 'cansancio extremo' },
        { id: 'hormigueo', nombre: 'hormigueo en pies/manos' },
        { id: 'heridas', nombre: 'heridas que tardan en sanar' },
        { id: 'peso', nombre: 'pérdida de peso sin razón' },
        { id: 'infecciones', nombre: 'infecciones frecuentes' },
        { id: 'piel', nombre: 'piel seca o picazón' },
        { id: 'humor', nombre: 'cambios de humor' },
        { id: 'boca_seca', nombre: 'boca seca' },
        { id: 'cabeza', nombre: 'dolor de cabeza frecuente' }
    ];
    
    let contador = 0;
    let sintomasPositivos = [];
    
    sintomas.forEach(s => {
        const valor = document.querySelector(`input[name="${s.id}"]:checked`)?.value;
        if (valor === "si") {
            contador++;
            sintomasPositivos.push(s.nombre);
        }
    });

    // --- 2. Evaluar presión arterial ---
    let alertaPresion = '';
    let recomendacionPresion = '';
    const presionSis = document.getElementById('presion_sis')?.value;
    const presionDias = document.getElementById('presion_dias')?.value;
    let presionClasificacion = '';
    
    if (presionSis && presionDias) {
        const sis = parseInt(presionSis);
        const dias = parseInt(presionDias);
        if (!isNaN(sis) && !isNaN(dias)) {
            if (sis >= 180 || dias >= 120) {
                alertaPresion = '🚨 CRISIS HIPERTENSIVA';
                recomendacionPresion = 'Acude a URGENCIAS de inmediato. No esperes.';
                presionClasificacion = 'crisis hipertensiva';
            } else if (sis >= 140 || dias >= 90) {
                alertaPresion = '⚠️ HIPERTENSIÓN GRADO 2';
                recomendacionPresion = 'Consulta a tu médico en los próximos días. Mide tu presión diariamente.';
                presionClasificacion = 'hipertensión grado 2';
            } else if (sis >= 130 || dias >= 80) {
                alertaPresion = '⚠️ HIPERTENSIÓN GRADO 1';
                recomendacionPresion = 'Haz seguimiento con tu médico. Reduce el consumo de sal y haz ejercicio.';
                presionClasificacion = 'hipertensión grado 1';
            } else if (sis >= 120 && dias < 80) {
                alertaPresion = '⚡ PRESIÓN ELEVADA';
                recomendacionPresion = 'Vigila tus niveles. Mejora tu alimentación y evita el estrés.';
                presionClasificacion = 'presión elevada';
            } else if (sis < 90 || dias < 60) {
                alertaPresion = '⚠️ PRESIÓN BAJA';
                recomendacionPresion = 'Mantente hidratado. Si sientes mareos, siéntate o acuéstate.';
                presionClasificacion = 'presión baja';
            } else {
                alertaPresion = '✅ PRESIÓN NORMAL';
                recomendacionPresion = 'Sigue así. Mantén hábitos saludables.';
                presionClasificacion = 'normal';
            }
        }
    }

    // --- 3. Evaluar glucosa ---
    let alertaGlucosa = '';
    let recomendacionGlucosa = '';
    const glucosa = document.getElementById('glucosa')?.value;
    let glucosaClasificacion = '';
    
    if (glucosa) {
        const glu = parseInt(glucosa);
        if (!isNaN(glu)) {
            if (glu >= 200) {
                alertaGlucosa = '🚨 GLUCOSA MUY ALTA';
                recomendacionGlucosa = 'Podría ser diabetes descompensada. Acude a atención médica hoy mismo.';
                glucosaClasificacion = 'muy alta (≥200)';
            } else if (glu >= 126) {
                alertaGlucosa = '⚠️ DIABETES';
                recomendacionGlucosa = 'Consulta a tu médico para confirmar y recibir tratamiento.';
                glucosaClasificacion = 'diabetes (126-199)';
            } else if (glu >= 100) {
                alertaGlucosa = '⚠️ PREDIABETES';
                recomendacionGlucosa = 'Revisa tu alimentación, haz ejercicio y controla tu peso. Puedes revertirlo.';
                glucosaClasificacion = 'prediabetes (100-125)';
            } else if (glu < 70) {
                alertaGlucosa = '⚠️ GLUCOSA BAJA';
                recomendacionGlucosa = 'Toma jugo, fruta o algo dulce. Si es recurrente, consulta a tu médico.';
                glucosaClasificacion = 'baja (<70)';
            } else {
                alertaGlucosa = '✅ GLUCOSA NORMAL';
                recomendacionGlucosa = 'Buen control. Sigue con tus hábitos saludables.';
                glucosaClasificacion = 'normal';
            }
        }
    }

    // --- 4. Nivel de riesgo por síntomas ---
    let nivel = "";
    let mensaje = "";

    if (contador === 0) {
        nivel = "bajo";
        mensaje = `${nombre}, no reportas síntomas de alerta.`;
    } else if (contador <= 3) {
        nivel = "leve";
        mensaje = `${nombre}, reportas ${contador} síntoma(s) leve(s).`;
    } else if (contador <= 6) {
        nivel = "moderado";
        mensaje = `${nombre}, reportas ${contador} síntomas.`;
    } else {
        nivel = "alto";
        mensaje = `${nombre}, reportas múltiples síntomas (${contador}).`;
    }

    // --- 5. GENERAR RECOMENDACIONES PERSONALIZADAS ---
    let recomendaciones = [];

    // Recomendaciones por síntomas específicos
    if (sintomasPositivos.includes('mucha sed') || sintomasPositivos.includes('orinar con frecuencia')) {
        recomendaciones.push('💧 La sed intensa y orinar mucho son señales de glucosa alta. Bebe agua y evita bebidas azucaradas.');
    }
    if (sintomasPositivos.includes('visión borrosa')) {
        recomendaciones.push('👓 La visión borrosa puede indicar glucosa alta o baja. No manejes si no ves bien.');
    }
    if (sintomasPositivos.includes('cansancio extremo')) {
        recomendaciones.push('😴 El cansancio extremo puede deberse a descontrol de glucosa. Descansa y mide tus niveles.');
    }
    if (sintomasPositivos.includes('hormigueo en pies/manos')) {
        recomendaciones.push('🦶 El hormigueo puede ser señal de neuropatía. Revisa tus pies diariamente y usa calzado cómodo.');
    }
    if (sintomasPositivos.includes('heridas que tardan en sanar')) {
        recomendaciones.push('🩹 Las heridas que no sanan requieren atención. Limpia bien cualquier corte y vigila signos de infección.');
    }
    if (sintomasPositivos.includes('pérdida de peso sin razón')) {
        recomendaciones.push('⚖️ Perder peso sin intentarlo puede ser señal de glucosa muy alta. Consulta a tu médico.');
    }
    if (sintomasPositivos.includes('piel seca o picazón')) {
        recomendaciones.push('🧴 La piel seca es común en diabetes. Usa crema hidratante y evita baños muy calientes.');
    }
    if (sintomasPositivos.includes('cambios de humor')) {
        recomendaciones.push('😤 Los cambios de humor pueden relacionarse con altibajos de glucosa. Monitorea tus niveles.');
    }
    if (sintomasPositivos.includes('boca seca')) {
        recomendaciones.push('💧 La boca seca aumenta el riesgo de caries. Bebe agua y evita el tabaco.');
    }
    if (sintomasPositivos.includes('dolor de cabeza frecuente')) {
        recomendaciones.push('🤕 El dolor de cabeza puede ser por glucosa alta o baja. Mide tus niveles.');
    }

    // Recomendaciones por presión arterial
    if (recomendacionPresion) {
        recomendaciones.push(`❤️ ${recomendacionPresion}`);
    }

    // Recomendaciones por glucosa
    if (recomendacionGlucosa) {
        recomendaciones.push(`🩸 ${recomendacionGlucosa}`);
    }

    // Recomendación general según nivel de riesgo
    if (nivel === "alto") {
        recomendaciones.push('🆘 Tu evaluación muestra múltiples signos de alerta. No demores en buscar atención médica.');
    } else if (nivel === "moderado") {
        recomendaciones.push('📅 Programa una cita con tu médico en los próximos días para revisar tus síntomas.');
    } else if (nivel === "leve" && contador > 0) {
        recomendaciones.push('👨‍⚕️ Si los síntomas persisten, consulta a tu médico.');
    }

    // Si no hay recomendaciones específicas, una genérica positiva
    if (recomendaciones.length === 0) {
        recomendaciones.push('🌟 Sigue con tus hábitos saludables y realiza tus chequeos periódicos.');
    }

    // Limitar a 5 recomendaciones máximas para no abrumar
    if (recomendaciones.length > 5) {
        recomendaciones = recomendaciones.slice(0, 5);
    }

    // --- 6. Construir resultado completo ---
    let alertasVitales = '';
    if (alertaPresion || alertaGlucosa) {
        alertasVitales = '<br><br><strong>📊 Tus mediciones:</strong><br>';
        if (alertaPresion) alertasVitales += `${alertaPresion}<br>`;
        if (alertaGlucosa) alertasVitales += `${alertaGlucosa}<br>`;
    }

    // Convertir recomendaciones a HTML
    let recomendacionesHTML = '';
    if (recomendaciones.length > 0) {
        recomendacionesHTML = '<br><br><strong>💡 Recomendaciones para ti:</strong><br>';
        recomendaciones.forEach(rec => {
            recomendacionesHTML += `• ${rec}<br>`;
        });
    }

    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.style.display = "block";
    resultadoDiv.innerHTML = `
        <strong style="font-size:1.2rem;">Nivel de riesgo: ${nivel.toUpperCase()}</strong><br>
        <span style="display:block; margin-top:0.8rem;">${mensaje}</span>
        <span style="display:block; margin-top:1rem; font-size:0.9rem;">(Síntomas reportados: ${contador} de 12)</span>
        ${alertasVitales}
        ${recomendacionesHTML}
    `;

    // --- 7. Guardar en historial ---
    const consulta = {
        fecha: new Date().toLocaleDateString('es-ES'),
        nombre: nombre,
        nivel: nivel,
        sintomas: contador,
        presion: (presionSis && presionDias) ? `${presionSis}/${presionDias} (${presionClasificacion})` : '—',
        glucosa: glucosa ? `${glucosa} mg/dL (${glucosaClasificacion})` : '—'
    };
    guardarEnHistorial(consulta);
}

// === HISTORIAL ===
const STORAGE_KEY = 'diabetescare_historial';

function guardarEnHistorial(consulta) {
    let historial = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    historial.unshift(consulta);
    if (historial.length > 5) historial.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(historial));
    mostrarHistorial();
}

function mostrarHistorial() {
    const contenedor = document.getElementById('historial-lista');
    if (!contenedor) return;
    
    const historial = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    if (historial.length === 0) {
        contenedor.innerHTML = '<p style="color: var(--text-color);">No hay consultas guardadas.</p>';
        return;
    }
    
    let html = '';
    historial.forEach(item => {
        html += `
            <div class="historial-item">
                <strong>${item.fecha}</strong><br>
                ${item.nombre} · Riesgo: ${item.nivel} · Síntomas: ${item.sintomas} de 12<br>
                <span style="font-size:0.85rem;">🩺 Presión: ${item.presion}</span><br>
                <span style="font-size:0.85rem;">🩸 Glucosa: ${item.glucosa}</span>
            </div>
        `;
    });
    contenedor.innerHTML = html;
}