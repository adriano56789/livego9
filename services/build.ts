import { exec } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

console.log('Iniciando o build dos serviços...');

// Verifica se a pasta dist existe, se não, cria
const distPath = join(__dirname, 'dist');
if (!existsSync(distPath)) {
    mkdirSync(distPath, { recursive: true });
    console.log('Pasta dist criada com sucesso!');
}

// Executa o TypeScript Compiler
const tsc = exec('npx tsc -p tsconfig.build.json');

if (!tsc.stdout || !tsc.stderr) {
    throw new Error('Falha ao executar o TypeScript Compiler');
}

tsc.stdout.on('data', (data: string) => {
    console.log(data);
});

tsc.stderr.on('data', (data: string) => {
    console.error(`Erro: ${data}`);
});

tsc.on('close', (code: number | null) => {
    if (code === 0) {
        console.log('Build concluído com sucesso!');
        console.log(`Arquivos compilados em: ${resolve(distPath)}`);
    } else {
        console.error(`Erro durante o build. Código de saída: ${code}`);
        process.exit(code || 1);
    }
});
