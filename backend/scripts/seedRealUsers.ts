// scripts/seedRealUsers.ts
import { MongoClient, ObjectId } from 'mongodb';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

// Configuração do caminho do .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:adriano123@localhost:27017/livego?authSource=admin';

// Gera um ID de 24 caracteres
function generateMongoId() {
  return new ObjectId().toString();
}

// Gera um número aleatório de 6 dígitos para o ID
function generateRandomId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function seedRealUsers() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔍 Conectando ao MongoDB...');
    await client.connect();
    console.log('✅ Conectado ao MongoDB!');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Dados dos usuários reais
    const realUsers = [
      {
        id: generateRandomId(),
        name: 'João Silva',
        email: 'joao.silva@email.com',
        password: await bcrypt.hash('senha123', 10),
        diamonds: 1000,
        earnings: 0,
        xp: 0,
        level: 1,
        avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
        coverUrl: 'https://picsum.photos/1200/400',
        fans: 0,
        following: 0,
        followingIds: [],
        isOnline: false,
        activeFrameId: null,
        ownedFrames: [],
        fcmTokens: [],
        isStreamer: true,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: generateRandomId(),
        name: 'Maria Oliveira',
        email: 'maria.oliveira@email.com',
        password: await bcrypt.hash('senha123', 10),
        diamonds: 0,
        earnings: 0,
        xp: 0,
        level: 1,
        avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
        coverUrl: 'https://picsum.photos/1200/400?random=2',
        fans: 0,
        following: 0,
        followingIds: [],
        isOnline: false,
        activeFrameId: null,
        ownedFrames: [],
        fcmTokens: [],
        isStreamer: true,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: generateRandomId(),
        name: 'Admin',
        email: 'admin@livego.com',
        password: await bcrypt.hash('admin123', 10),
        diamonds: 0,
        earnings: 0,
        xp: 0,
        level: 1,
        avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
        coverUrl: 'https://picsum.photos/1200/400?random=3',
        fans: 0,
        following: 0,
        followingIds: [],
        isOnline: false,
        activeFrameId: null,
        ownedFrames: [],
        fcmTokens: [],
        isStreamer: true,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Remove usuários existentes (opcional)
    await usersCollection.deleteMany({});
    console.log('🗑️  Usuários antigos removidos');
    
    // Insere os novos usuários
    const result = await usersCollection.insertMany(realUsers);
    console.log(`\n✅ ${result.insertedCount} usuários adicionados com sucesso!`);
    
    // Lista os usuários inseridos
    const insertedUsers = await usersCollection.find({}, { 
      projection: { 
        _id: 0,
        id: 1, 
        name: 1, 
        email: 1,
        isAdmin: 1,
        isStreamer: 1
      } 
    }).toArray();
    
    console.log('\n📋 Usuários criados:');
    console.log(JSON.stringify(insertedUsers, null, 2));
    
    console.log('\n🔑 Credenciais de acesso:');
    insertedUsers.forEach(user => {
      console.log(`\n👤 ${user.name} (${user.isAdmin ? 'Admin' : 'Usuário'})`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔑 Senha: ${user.email.includes('admin') ? 'admin123' : 'senha123'}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao adicionar usuários:', error);
  } finally {
    await client.close();
    console.log('\nConexão encerrada.');
  }
}

// Executa o seed
seedRealUsers().catch(console.error);