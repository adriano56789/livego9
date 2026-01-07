// backend/scripts/seedFrames.ts
import { MongoClient, ObjectId } from 'mongodb';
import { FrameModels } from '../../models/frame-models/FrameModels';

const url = 'mongodb://admin:adriano123@72.60.249.175:27017/livego?authSource=admin';

async function seedFrames() {
  const client = new MongoClient(url);
  
  try {
    console.log('🔍 Conectando ao MongoDB...');
    await client.connect();
    console.log('✅ Conectado ao MongoDB!');
    
    const db = client.db('livego');
    const framesCollection = db.collection('frames');
    
    // Remove frames existentes
    const deleteResult = await framesCollection.deleteMany({});
    console.log(`🗑️  ${deleteResult.deletedCount} frames antigos removidos`);
    
    // Converte os frames para o formato do banco
    const frames = Object.entries(FrameModels).map(([id, frame]) => ({
      ...frame,
      _id: new ObjectId(), // Gera um novo ObjectId
      colors: frame.colors,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Insere os novos frames
    const insertResult = await framesCollection.insertMany(frames);
    console.log(`✅ ${insertResult.insertedCount} frames inseridos com sucesso!`);
    
  } catch (error) { 
    console.error('❌ Erro ao popular os frames:', error);
  } finally {
    await client.close();
    console.log('Conexão com o MongoDB encerrada');
  }
}

// Executa o script
seedFrames();