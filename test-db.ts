// test-db.js
import { MongoClient } from 'mongodb';

// URL de conexão com autenticação
const url = 'mongodb://admin:adriano123@localhost:27017/livego?authSource=admin';

async function testConnection() {
  const client = new MongoClient(url);
  
  try {
    console.log('🔍 Conectando ao MongoDB...');
    await client.connect();
    console.log('✅ Conectado ao MongoDB com sucesso!');
    
    const db = client.db('livego');
    console.log('📊 Banco de dados:', db.databaseName);
    
    // Listar coleções
    const collections = await db.listCollections().toArray();
    console.log('\n📚 Coleções disponíveis:');
    collections.forEach(col => console.log(`- ${col.name}`));
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    } else {
      console.error('❌ Ocorreu um erro desconhecido:', error);
    }
  } finally {
    await client.close();
    console.log('\nConexão encerrada.');
  }
}

// Executa o teste
testConnection();