// ==========================================
// LÓGICA CORE (MANTIDA INTEGRALMENTE)
// ========================================== 

// Estado global
let showPoints = true;
let showTangents = false;
let showEquations = false;
let currentLetter = 'A';
let zoomLevel = 1;

// Hero Animation
const heroCanvas = document.getElementById('heroCanvas');
const heroCtx = heroCanvas.getContext('2d');
heroCanvas.width = window.innerWidth;
heroCanvas.height = window.innerHeight;

function animateHero() {
    heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    const time = Date.now() * 0.001;
    
    heroCtx.strokeStyle = 'rgba(255,255,255,0.5)';
    heroCtx.lineWidth = 3;
    heroCtx.beginPath();
    
    for (let i = 0; i < heroCanvas.width; i += 5) {
        const t = i / heroCanvas.width;
        const x = i;
        const y = heroCanvas.height / 2 + Math.sin(t * 10 + time) * 100 * Math.sin(time * 0.5);
        
        if (i === 0) heroCtx.moveTo(x, y);
        else heroCtx.lineTo(x, y);
    }
    
    heroCtx.stroke();
    requestAnimationFrame(animateHero);
}
animateHero();

// Transformações Tipográficas
const paramCanvas = document.getElementById('parametricCanvas');
const paramCtx = paramCanvas.getContext('2d');

let widthScale = 1.0;
let weightScale = 1.0;
let slant = 0;

// Event listeners para os sliders
const widthSlider = document.getElementById('widthSlider');
const weightSlider = document.getElementById('weightSlider');
const slantSlider = document.getElementById('slantSlider');

widthSlider.addEventListener('input', (e) => {
    widthScale = e.target.value / 100;
    document.getElementById('widthValue').textContent = e.target.value;
    document.getElementById('widthFactor').textContent = widthScale.toFixed(2);
    updateEquation();
    drawTypography();
});

weightSlider.addEventListener('input', (e) => {
    weightScale = e.target.value / 100;
    document.getElementById('weightValue').textContent = e.target.value;
    document.getElementById('weightFactor').textContent = weightScale.toFixed(2);
    updateEquation();
    drawTypography();
});

slantSlider.addEventListener('input', (e) => {
    slant = parseFloat(e.target.value);
    document.getElementById('slantValue').textContent = e.target.value;
    document.getElementById('slantAngle').textContent = e.target.value + '°';
    updateEquation();
    drawTypography();
});

function setFontStyle(style) {
    // Remove active de todos os botões
    document.querySelectorAll('.controls .control-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Adiciona active no botão clicado
    event.target.classList.add('active');
    
    document.getElementById('currentStyle').textContent = style.charAt(0).toUpperCase() + style.slice(1);
    
    switch(style) {
        case 'regular':
            widthScale = 1.0;
            weightScale = 1.0;
            slant = 0;
            widthSlider.value = 100;
            weightSlider.value = 100;
            slantSlider.value = 0;
            break;
        case 'bold':
            widthScale = 1.1;
            weightScale = 1.5;
            slant = 0;
            widthSlider.value = 110;
            weightSlider.value = 150;
            slantSlider.value = 0;
            break;
        case 'italic':
            widthScale = 1.0;
            weightScale = 1.0;
            slant = 15;
            widthSlider.value = 100;
            weightSlider.value = 100;
            slantSlider.value = 15;
            break;
        case 'condensed':
            widthScale = 0.7;
            weightScale = 1.0;
            slant = 0;
            widthSlider.value = 70;
            weightSlider.value = 100;
            slantSlider.value = 0;
            break;
        case 'expanded':
            widthScale = 1.3;
            weightScale = 1.0;
            slant = 0;
            widthSlider.value = 130;
            weightSlider.value = 100;
            slantSlider.value = 0;
            break;
    }
    
    document.getElementById('widthValue').textContent = Math.round(widthScale * 100);
    document.getElementById('weightValue').textContent = Math.round(weightScale * 100);
    document.getElementById('slantValue').textContent = slant;
    document.getElementById('widthFactor').textContent = widthScale.toFixed(2);
    document.getElementById('weightFactor').textContent = weightScale.toFixed(2);
    document.getElementById('slantAngle').textContent = slant + '°';
    
    updateEquation();
    drawTypography();
}

function updateEquation() {
    const slantInRad = slant * Math.PI / 180;
    const tanSlant = Math.tan(slantInRad).toFixed(2);

    const katexString = `x'(t) = x(t) \\cdot ${widthScale.toFixed(2)} + y(t) \\cdot ${tanSlant} \\quad | \\quad y'(t) = y(t) \\cdot ${weightScale.toFixed(2)}`;
    
    const element = document.getElementById('equationDisplay');

    // Render the new equation using KaTeX
    katex.render(katexString, element, {
        throwOnError: false
    });
}

function drawTypography() {
    paramCtx.clearRect(0, 0, paramCanvas.width, paramCanvas.height);
    
    paramCtx.save();
    
    // Centraliza
    paramCtx.translate(paramCanvas.width / 2, paramCanvas.height / 2);
    
    // Aplica transformações paramétricas
    paramCtx.transform(widthScale, 0, Math.tan(slant * Math.PI / 180), weightScale, 0, 0);
    
    // Desenha a letra 'A'
    paramCtx.fillStyle = '#667eea';
    paramCtx.strokeStyle = '#764ba2';
    paramCtx.lineWidth = 3 / Math.max(widthScale, weightScale);
    paramCtx.font = 'bold 200px Arial';
    paramCtx.textAlign = 'center';
    paramCtx.textBaseline = 'middle';
    
    // Outline
    paramCtx.strokeText('A', 0, 0);
    // Fill
    paramCtx.fillText('A', 0, 0);
    
    paramCtx.restore();
    
    // Desenha grid de referência
    paramCtx.strokeStyle = 'rgba(102,126,234,0.2)';
    paramCtx.lineWidth = 1;
    
    // Linha vertical central
    paramCtx.beginPath();
    paramCtx.moveTo(paramCanvas.width / 2, 0);
    paramCtx.lineTo(paramCanvas.width / 2, paramCanvas.height);
    paramCtx.stroke();
    
    // Linha horizontal central
    paramCtx.beginPath();
    paramCtx.moveTo(0, paramCanvas.height / 2);
    paramCtx.lineTo(paramCanvas.width, paramCanvas.height / 2);
    paramCtx.stroke();
}

drawTypography();
updateEquation();

// Vetor Tangente
const tangentCanvas = document.getElementById('tangentCanvas');
const tangentCtx = tangentCanvas.getContext('2d');
let tangentT = 0;

function drawTangent() {
    tangentCtx.clearRect(0, 0, tangentCanvas.width, tangentCanvas.height);
    
    const centerX = tangentCanvas.width / 2;
    const centerY = tangentCanvas.height / 2;
    const radius = 120;
    
    // Desenha a curva
    tangentCtx.strokeStyle = '#667eea';
    tangentCtx.lineWidth = 3;
    tangentCtx.beginPath();
    
    for (let t = 0; t <= 1; t += 0.01) {
        const angle = t * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.6;
        
        if (t === 0) tangentCtx.moveTo(x, y);
        else tangentCtx.lineTo(x, y);
    }
    tangentCtx.closePath();
    tangentCtx.stroke();
    
    // Ponto móvel
    const angle = tangentT * Math.PI * 2;
    const px = centerX + Math.cos(angle) * radius;
    const py = centerY + Math.sin(angle) * radius * 0.6;
    
    tangentCtx.fillStyle = '#764ba2';
    tangentCtx.beginPath();
    tangentCtx.arc(px, py, 8, 0, Math.PI * 2);
    tangentCtx.fill();
    
    // Vetor tangente
    const tx = -Math.sin(angle);
    const ty = Math.cos(angle) * 0.6;
    const length = 60;
    
    tangentCtx.strokeStyle = '#ff6b6b';
    tangentCtx.lineWidth = 3;
    tangentCtx.beginPath();
    tangentCtx.moveTo(px, py);
    tangentCtx.lineTo(px + tx * length, py + ty * length);
    tangentCtx.stroke();
    
    // Seta
    const arrowSize = 10;
    tangentCtx.fillStyle = '#ff6b6b';
    tangentCtx.beginPath();
    tangentCtx.moveTo(px + tx * length, py + ty * length);
    tangentCtx.lineTo(px + tx * (length - arrowSize) - ty * arrowSize * 0.5, 
                    py + ty * (length - arrowSize) + tx * arrowSize * 0.5);
    tangentCtx.lineTo(px + tx * (length - arrowSize) + ty * arrowSize * 0.5, 
                    py + ty * (length - arrowSize) - tx * arrowSize * 0.5);
    tangentCtx.closePath();
    tangentCtx.fill();
    
    // Atualiza displays
    document.getElementById('tangentT').textContent = tangentT.toFixed(2);
    document.getElementById('tangentAngle').textContent = Math.round(angle * 180 / Math.PI) + '°';
    document.getElementById('tangentX').textContent = Math.round(px);
    document.getElementById('tangentY').textContent = Math.round(py);
    
    tangentT += 0.003;
    if (tangentT > 1) tangentT = 0;
    
    requestAnimationFrame(drawTangent);
}
drawTangent();

// Letra com Bézier
const letterCanvas = document.getElementById('letterCanvas');
const letterCtx = letterCanvas.getContext('2d');

function drawBezierLetter() {
    letterCtx.clearRect(0, 0, letterCanvas.width, letterCanvas.height);
    
    const centerX = letterCanvas.width / 2;
    const centerY = letterCanvas.height / 2;
    
    // Letra A simplificada com curvas Bézier
    const curves = [
        {p0: [centerX-80, centerY+100], p1: [centerX-60, centerY-100], p2: [centerX-20, centerY-100], p3: [centerX, centerY+100]},
        {p0: [centerX, centerY+100], p1: [centerX+20, centerY-100], p2: [centerX+60, centerY-100], p3: [centerX+80, centerY+100]},
        {p0: [centerX-40, centerY+20], p1: [centerX-20, centerY+20], p2: [centerX+20, centerY+20], p3: [centerX+40, centerY+20]}
    ];
    
    // Atualiza parâmetros
    document.getElementById('numCurves').textContent = curves.length;
    document.getElementById('numPoints').textContent = curves.length * 4;
    if (showPoints || showTangents || showEquations) {
        document.getElementById('bezierParams').style.display = 'block';
    } else {
        document.getElementById('bezierParams').style.display = 'none';
    }
    
    curves.forEach(curve => {
        letterCtx.strokeStyle = '#667eea';
        letterCtx.lineWidth = 4;
        letterCtx.beginPath();
        letterCtx.moveTo(curve.p0[0], curve.p0[1]);
        letterCtx.bezierCurveTo(
            curve.p1[0], curve.p1[1],
            curve.p2[0], curve.p2[1],
            curve.p3[0], curve.p3[1]
        );
        letterCtx.stroke();
        
        if (showPoints) {
            [curve.p0, curve.p1, curve.p2, curve.p3].forEach((p, i) => {
                letterCtx.fillStyle = i === 0 || i === 3 ? '#764ba2' : '#ff6b6b';
                letterCtx.beginPath();
                letterCtx.arc(p[0], p[1], 6, 0, Math.PI * 2);
                letterCtx.fill();
            });
            
            letterCtx.strokeStyle = 'rgba(255,107,107,0.3)';
            letterCtx.lineWidth = 1;
            letterCtx.beginPath();
            letterCtx.moveTo(curve.p0[0], curve.p0[1]);
            letterCtx.lineTo(curve.p1[0], curve.p1[1]);
            letterCtx.lineTo(curve.p2[0], curve.p2[1]);
            letterCtx.lineTo(curve.p3[0], curve.p3[1]);
            letterCtx.stroke();
        }
        
        if (showTangents) {
            const t = 0.5;
            const x = Math.pow(1-t, 3)*curve.p0[0] + 3*Math.pow(1-t, 2)*t*curve.p1[0] + 
                     3*(1-t)*Math.pow(t, 2)*curve.p2[0] + Math.pow(t, 3)*curve.p3[0];
            const y = Math.pow(1-t, 3)*curve.p0[1] + 3*Math.pow(1-t, 2)*t*curve.p1[1] + 
                     3*(1-t)*Math.pow(t, 2)*curve.p2[1] + Math.pow(t, 3)*curve.p3[1];
            
            letterCtx.strokeStyle = '#4ecdc4';
            letterCtx.lineWidth = 2;
            letterCtx.beginPath();
            letterCtx.moveTo(x - 30, y);
            letterCtx.lineTo(x + 30, y);
            letterCtx.stroke();
        }
    });
    
    if (showEquations) {
        letterCtx.fillStyle = 'white';
        letterCtx.font = '14px monospace';
        letterCtx.fillText('B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃', 20, 30);
    }
}
drawBezierLetter();

// Galeria
const galleryCanvas = document.getElementById('galleryCanvas');
const galleryCtx = galleryCanvas.getContext('2d');

const letterData = {
    'A': {complexity: 'Média', size: '~2KB', render: '<1ms'},
    'B': {complexity: 'Alta', size: '~3KB', render: '<1ms'},
    'S': {complexity: 'Muito Alta', size: '~4KB', render: '1ms'},
    'g': {complexity: 'Alta', size: '~3.5KB', render: '<1ms'},
    'R': {complexity: 'Média', size: '~2.5KB', render: '<1ms'},
    'Q': {complexity: 'Alta', size: '~3KB', render: '<1ms'}
};

function selectLetter(letter, element) {
    currentLetter = letter;
    
    // Remove active de todos
    document.querySelectorAll('.letter-card').forEach(card => {
        card.classList.remove('active');
    });
    // Adiciona active no clicado
    element.classList.add('active');
    
    // Atualiza informações
    document.getElementById('selectedLetter').textContent = letter;
    document.getElementById('letterComplexity').textContent = letterData[letter].complexity;
    document.getElementById('letterSize').textContent = letterData[letter].size;
    document.getElementById('renderTime').textContent = letterData[letter].render;
    
    drawGalleryLetter();
}

function drawGalleryLetter() {
    galleryCtx.clearRect(0, 0, galleryCanvas.width, galleryCanvas.height);
    galleryCtx.fillStyle = '#667eea';
    galleryCtx.font = 'bold 300px Arial';
    galleryCtx.textAlign = 'center';
    galleryCtx.textBaseline = 'middle';
    galleryCtx.fillText(currentLetter, galleryCanvas.width/2, galleryCanvas.height/2);
}
drawGalleryLetter();

// Zoom
const zoomCanvas = document.getElementById('zoomCanvas');
const zoomCtx = zoomCanvas.getContext('2d');

zoomCanvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomLevel += e.deltaY * -0.001;
    zoomLevel = Math.max(1, Math.min(16, zoomLevel));
    
    const percent = Math.round(zoomLevel * 100);
    document.getElementById('zoomLevel').textContent = percent + '%';
    document.getElementById('zoomPercent').textContent = percent + '%';
    document.getElementById('zoomScale').textContent = zoomLevel.toFixed(1) + 'x';
    document.getElementById('pointsCalc').textContent = Math.round(100 * zoomLevel);
    
    drawZoom();
});

function drawZoom() {
    zoomCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
    zoomCtx.save();
    zoomCtx.translate(zoomCanvas.width/2, zoomCanvas.height/2);
    zoomCtx.scale(zoomLevel, zoomLevel);
    zoomCtx.translate(-zoomCanvas.width/2, -zoomCanvas.height/2);
    
    const centerX = zoomCanvas.width / 2;
    const centerY = zoomCanvas.height / 2;
    
    zoomCtx.strokeStyle = '#667eea';
    zoomCtx.lineWidth = 3 / zoomLevel;
    zoomCtx.beginPath();
    zoomCtx.moveTo(centerX - 50, centerY - 50);
    zoomCtx.bezierCurveTo(centerX - 50, centerY - 100, centerX + 50, centerY - 100, centerX + 50, centerY - 50);
    zoomCtx.bezierCurveTo(centerX + 50, centerY, centerX - 50, centerY, centerX - 50, centerY + 50);
    zoomCtx.bezierCurveTo(centerX - 50, centerY + 100, centerX + 50, centerY + 100, centerX + 50, centerY + 50);
    zoomCtx.stroke();
    
    zoomCtx.restore();
}
drawZoom();

// Comparação
const rasterCanvas = document.getElementById('rasterCanvas');
const rasterCtx = rasterCanvas.getContext('2d');
const vectorCanvas = document.getElementById('vectorCanvas');
const vectorCtx = vectorCanvas.getContext('2d');
const rasterZoomSlider = document.getElementById('rasterZoomSlider');
const vectorZoomSlider = document.getElementById('vectorZoomSlider');
const rasterZoomValue = document.getElementById('rasterZoomValue');
const vectorZoomValue = document.getElementById('vectorZoomValue');

let rasterZoom = 2;
let vectorZoom = 2;

function drawComparison() {
    // Raster
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = rasterCanvas.width;
    tempCanvas.height = rasterCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.fillStyle = '#667eea';
    tempCtx.font = 'bold 60px Arial';
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    tempCtx.fillText('A', tempCanvas.width / 2, tempCanvas.height / 2);

    rasterCtx.clearRect(0, 0, rasterCanvas.width, rasterCanvas.height);
    rasterCtx.imageSmoothingEnabled = false;
    rasterCtx.drawImage(tempCanvas, 
        (rasterCanvas.width - rasterCanvas.width * rasterZoom) / 2, 
        (rasterCanvas.height - rasterCanvas.height * rasterZoom) / 2, 
        rasterCanvas.width * rasterZoom, 
        rasterCanvas.height * rasterZoom
    );

    // Vetor
    vectorCtx.clearRect(0, 0, vectorCanvas.width, vectorCanvas.height);
    vectorCtx.save();
    vectorCtx.translate(vectorCanvas.width / 2, vectorCanvas.height / 2);
    vectorCtx.scale(vectorZoom, vectorZoom);
    vectorCtx.fillStyle = '#667eea';
    vectorCtx.font = 'bold 60px Arial';
    vectorCtx.textAlign = 'center';
    vectorCtx.textBaseline = 'middle';
    vectorCtx.fillText('A', 0, 0);
    vectorCtx.restore();
}

rasterZoomSlider.addEventListener('input', (e) => {
    rasterZoom = e.target.value / 100;
    rasterZoomValue.textContent = e.target.value;
    drawComparison();
});

vectorZoomSlider.addEventListener('input', (e) => {
    vectorZoom = e.target.value / 100;
    vectorZoomValue.textContent = e.target.value;
    drawComparison();
});

function setComparisonZoom(percentage) {
    const zoom = percentage / 100;
    rasterZoom = zoom;
    vectorZoom = zoom;
    rasterZoomSlider.value = percentage;
    vectorZoomSlider.value = percentage;
    rasterZoomValue.textContent = percentage;
    vectorZoomValue.textContent = percentage;
    drawComparison();
}

drawComparison();


// Funções de controle
function togglePoints(event) {
    showPoints = !showPoints;
    event.target.classList.toggle('active');
    drawBezierLetter();
}

function toggleTangents(event) {
    showTangents = !showTangents;
    event.target.classList.toggle('active');
    drawBezierLetter();
}

function toggleEquations(event) {
    showEquations = !showEquations;
    event.target.classList.toggle('active');
    drawBezierLetter();
}

function toggleLayout(button) {
    const contentBox = button.closest('.content-box');
    const layoutContainer = contentBox.querySelector('.layout-container');
    layoutContainer.classList.toggle('single-column');
}

function scrollToNext() {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
}

// Responsivo
window.addEventListener('resize', () => {
    heroCanvas.width = window.innerWidth;
    heroCanvas.height = window.innerHeight;
});


// ========================================== 
// NOVA LÓGICA ESTÉTICA (Scroll Reveal)
// ========================================== 

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// renderMathInElement(document.body, {
//     delimiters: [
//         {left: '$$', right: '$$', display: true},
//         {left: '$', right: '$', display: false},
//         {left: '\(', right: '\)', display: false},
//         {left: '\[', right: '\]', display: true}
//     ],
//     throwOnError : false
// });

renderMathInElement(document.body, {
    delimiters: [
        {left: '$$', right: '$$', display: true}, // Usa $$ para blocos
        {left: '$', right: '$', display: false},   // Usa $ para inline
        {left: '\\[', right: '\\]', display: true} // Usa \[ para blocos (opcional)
    ],
    throwOnError : false
});
lucide.createIcons();
