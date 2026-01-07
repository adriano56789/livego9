import { MongoClient } from 'mongodb';

const url = 'mongodb://admin:adriano123@72.60.249.175:27017/livego?authSource=admin';

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

const gifts = [
  { id: 'rose', name: 'Rosa', price: 1, icon: 'rose', category: 'classic' },
  { id: 'diamond', name: 'Diamante', price: 10, icon: 'diamond', category: 'classic' },
  { id: 'heart', name: 'Coração', price: 5, icon: 'heart', category: 'classic' },
  { id: 'car', name: 'Carro Luxo', price: 1000, icon: 'car', category: 'premium' },
  { id: 'yacht', name: 'Iate', price: 5000, icon: 'yacht', category: 'premium' },
  { id: 'castle', name: 'Castelo', price: 10000, icon: 'castle', category: 'premium' }
];

const frames = [
  { id: 'gold_frame', name: 'Moldura de Ouro', price: 500, category: 'avatar', active: true },
  { id: 'silver_frame', name: 'Moldura de Prata', price: 200, category: 'avatar', active: true },
  { id: 'vip_frame', name: 'Moldura VIP', price: 1000, category: 'avatar', active: true }
];

const packages = [
  { id: 'pkg_100', diamonds: 100, price: 10.00, label: 'Iniciante', active: true },
  { id: 'pkg_500', diamonds: 500, price: 45.00, label: 'Popular', active: true },
  { id: 'pkg_1000', diamonds: 1000, price: 85.00, label: 'Melhor Valor', active: true },
  { id: 'pkg_5000', diamonds: 5000, price: 400.00, label: 'VIP', active: true }
];

async function seedDatabase() {
  const client = new MongoClient(url);
  
  try {
    console.log('🔍 Conectando ao MongoDB...');
    await client.connect();
    console.log('✅ Conectado ao MongoDB!');
    
    const db = client.db('livego');
    
    // Coleções
    const collections = {
      categories: categories,
      gifts: gifts,
      frames: frames,
      packages: packages
    };

    for (const [name, data] of Object.entries(collections)) {
      console.log(`\n🌱 Processando coleção: ${name}`);
      const collection = db.collection(name);
      
      // Limpar
      const deleteResult = await collection.deleteMany({});
      console.log(`🗑️  ${deleteResult.deletedCount} documentos antigos removidos`);
      
      // Inserir
      const result = await collection.insertMany(data);
      console.log(`✅ ${result.insertedCount} documentos inseridos com sucesso!`);
    }

    console.log('\n🚀 Banco de dados populado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    await client.close();
    console.log('\nConexão encerrada.');
  }
}

seedDatabase().catch(console.error);
