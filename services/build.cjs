const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Iniciando o build dos serviços...');

// Verifica se a pasta dist existe, se não, cria
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
    console.log('Pasta dist criada com sucesso!');
}

// Executa o TypeScript Compiler
const tsc = exec('npx tsc -p tsconfig.json');

tsc.stdout.on('data', (data) => {
    console.log(data);
});

tsc.stderr.on('data', (data) => {
    console.error(`Erro: ${data}`);
});

tsc.on('close', (code) => {
    if (code === 0) {
        console.log('Build concluído com sucesso!');
        console.log(`Arquivos compilados em: ${path.resolve(distPath)}`);
    } else {
        console.error(`Erro durante o build. Código de saída: ${code}`);
    }
});
