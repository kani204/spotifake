class Visualizer {
    constructor() {
        this.fft = new p5.FFT();
        this.bars = [];
        this.setup();
    }

    setup() {
        const canvas = createCanvas(300, 100);
        canvas.parent('visualizer');
        colorMode(HSB, 360, 100, 100);
        
        // Inicializar barras
        for (let i = 0; i < CONFIG.VISUALIZER.BAR_COUNT; i++) {
            this.bars.push({
                height: 0,
                targetHeight: 0
            });
        }
    }

    draw() {
        background(0, 0, 0, 0.1);
        
        // Obtener espectro de audio
        const spectrum = this.fft.analyze();
        
        // Actualizar altura de las barras
        const barWidth = CONFIG.VISUALIZER.BAR_WIDTH;
        const barGap = CONFIG.VISUALIZER.BAR_GAP;
        const totalWidth = (barWidth + barGap) * CONFIG.VISUALIZER.BAR_COUNT;
        const startX = (width - totalWidth) / 2;
        
        for (let i = 0; i < CONFIG.VISUALIZER.BAR_COUNT; i++) {
            const index = Math.floor(i * spectrum.length / CONFIG.VISUALIZER.BAR_COUNT);
            const value = spectrum[index];
            
            // Suavizar la transición de altura
            this.bars[i].targetHeight = map(value, 0, 255, 0, height - 20);
            this.bars[i].height += (this.bars[i].targetHeight - this.bars[i].height) * 0.3;
            
            // Dibujar barra
            const x = startX + i * (barWidth + barGap);
            const y = height - this.bars[i].height;
            
            // Color basado en la altura
            const hue = map(i, 0, CONFIG.VISUALIZER.BAR_COUNT, 120, 360);
            const brightness = map(this.bars[i].height, 0, height, 50, 100);
            
            fill(hue, 80, brightness);
            noStroke();
            rect(x, y, barWidth, this.bars[i].height);
        }
    }

    // Método para conectar con el reproductor
    connectToPlayer(player) {
        this.fft.setInput(player.audio);
    }
}

// Inicializar visualizador
let visualizer;
function setup() {
    visualizer = new Visualizer();
}

function draw() {
    visualizer.draw();
} 