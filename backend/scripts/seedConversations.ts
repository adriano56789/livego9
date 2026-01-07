// scripts/seedConversations.ts
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configuração do caminho do .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:adriano123@localhost:27017/livego?authSource=admin';

async function seedConversations() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔍 Conectando ao MongoDB...');
    await client.connect();
    console.log('✅ Conectado ao MongoDB!');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    const conversationsCollection = db.collection('conversations');
    
    // Busca usuários existentes
    const users = await usersCollection.find({}, { projection: { _id: 1 } }).toArray();
    
    if (users.length < 2) {
      throw new Error('❌ É necessário ter pelo menos 2 usuários no banco de dados');
    }

    // Remove conversas existentes
    await conversationsCollection.deleteMany({});
    console.log('🗑️  Conversas antigas removidas');

    // Cria conversas entre os usuários
    const conversations = [
      {
        participants: [users[0]._id, users[1]._id],
        lastMessage: 'Olá, como você está?',
        unreadCount: new Map([
          [users[0]._id.toString(), 0],
          [users[1]._id.toString(), 1]
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        participants: [users[0]._id, users[2]._id],
        lastMessage: 'Reunião amanhã às 10h',
        unreadCount: new Map([
          [users[0]._id.toString(), 1],
          [users[2]._id.toString(), 0]
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insere as conversas
    const result = await conversationsCollection.insertMany(conversations);
    console.log(`\n✅ ${result.insertedCount} conversas adicionadas com sucesso!`);

    // Lista as conversas inseridas
    const insertedConversations = await conversationsCollection
      .find({})
      .toArray();
    
    console.log('\n📋 Conversas criadas:');
    console.log(JSON.stringify(insertedConversations, null, 2));
    
  } catch (error) {
    console.error('❌ Erro ao adicionar conversas:', error);
  } finally {
    await client.close();
    console.log('\nConexão encerrada.');
  }
}

// Executa o seed
seedConversations().catch(console.error);