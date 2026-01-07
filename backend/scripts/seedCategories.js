// scripts/seedCategories.js
import { MongoClient } from 'mongodb';

const url = 'mongodb://admin:adriano123@localhost:27017/livego?authSource=admin';

const categories = [
  { name: 'popular', label: 'Popular', order: 0, isDefault: true, isActive: true },
  { name: 'followed', label: 'Seguido', order: 1, isDefault: true, isActive: true },
  { name: 'nearby', label: 'Perto', order: 2, isDefault: true, isActive: true },
  { name: 'pk', label: 'PK', order: 3, isDefault: true, isActive: true },
  { name: 'new', label: 'Novo', order: 4, isDefault: true, isActive: true },
  { name: 'music', label: 'Música', order: 5, isDefault: true, isActive: true },
  { name: 'dance', label: 'Dança', order: 6, isDefault: true, isActive: true },
  { name: 'game', label: 'Jogos', order: 7, isDefault: true, isActive: true },
  { name: 'voice', label: 'Voz', order: 8, isDefault: true, isActive: true },
  { name: 'party', label: 'Festa', order: 9, isDefault: true, isActive: true },
  { name: 'private', label: 'Privada', order: 10, isDefault: true, isActive: true }
];

async function seedCategories() {
  const client = new MongoClient(url);
  
  try {
    console.log('🔍 Conectando ao MongoDB...');
    await client.connect();
    console.log('✅ Conectado ao MongoDB!');
    
    const db = client.db('livego');
    const categoriesCollection = db.collection('categories');
    
    // Remove todas as categorias existentes
    const deleteResult = await categoriesCollection.deleteMany({});
    console.log(`🗑️  ${deleteResult.deletedCount} categorias antigas removidas`);
    
    // Insere as novas categorias
    const result = await categoriesCollection.insertMany(categories);
    console.log(`\n✅ ${result.insertedCount} categorias adicionadas com sucesso!`);
    
    // Lista as categorias inseridas
    const insertedCategories = await categoriesCollection
      .find()
      .sort({ order: 1 })
      .toArray();
    
    console.log('\n📋 Categorias disponíveis:');
    insertedCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.label} (${cat.name})${cat.isDefault ? ' [Padrão]' : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao adicionar categorias:', error);
  } finally {
    await client.close();
    console.log('\nConexão encerrada.');
  }
}

// Executa o seed
seedCategories().catch(console.error);