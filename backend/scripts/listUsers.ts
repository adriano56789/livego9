// scripts/listUsers.ts
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configuração do caminho do .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env') });

// Usa a mesma configuração do seu projeto
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:adriano123@localhost:27017/livego?authSource=admin';

async function listUsers() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔍 Conectando ao MongoDB...');
    await client.connect();
    console.log('✅ Conectado ao MongoDB!');
    
    const db = client.db();
    const users = await db.collection('users')
      .find({}, { projection: { _id: 1, username: 1, email: 1, name: 1 } })
      .toArray();
    
    console.log(`\n📋 Usuários encontrados (${users.length}):`);
    console.log(JSON.stringify(users, null, 2));
    
    if (users.length === 0) {
      console.log('\nℹ️  Nenhum usuário encontrado no banco de dados.');
      console.log('   Use o script de seed ou crie usuários pelo seu aplicativo primeiro.');
    }
    
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
  } finally {
    await client.close();
    console.log('\nConexão encerrada.');
  }
}

// Executa a listagem
listUsers().catch(console.error);