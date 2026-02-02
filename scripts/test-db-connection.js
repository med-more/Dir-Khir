// Script de test pour vérifier la connexion à la base de données
require('dotenv').config({ path: '.env.local' });

const postgres = require('postgres');

async function testConnection() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL is set');
  console.log('Testing connection...');

  const sql = postgres(process.env.DATABASE_URL);

  try {
    // Test 1: Vérifier que la table user existe
    const userTable = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'user'
      ORDER BY ordinal_position;
    `;
    
    console.log('\n📋 Table "user" columns:');
    console.table(userTable);

    // Test 2: Vérifier que toutes les tables existent
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('user', 'session', 'account', 'verification', 'need', 'participation')
      ORDER BY table_name;
    `;
    
    console.log('\n📋 Existing tables:');
    console.table(tables);

    // Test 3: Vérifier la structure de la table user
    const userStructure = await sql`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'user'
      ORDER BY ordinal_position;
    `;
    
    console.log('\n📋 User table structure:');
    console.table(userStructure);

    // Test 4: Essayer d'insérer un utilisateur de test (puis le supprimer)
    console.log('\n🧪 Testing insert...');
    const testId = 'test-' + Date.now();
    const testEmail = `test-${Date.now()}@example.com`;
    
    try {
      await sql`
        INSERT INTO "user" (id, name, email, "emailVerified")
        VALUES (${testId}, 'Test User', ${testEmail}, false)
      `;
      
      console.log('✅ Insert successful');
      
      // Récupérer l'utilisateur
      const insertedUser = await sql`
        SELECT * FROM "user" WHERE id = ${testId}
      `;
      
      console.log('✅ User retrieved:', insertedUser[0]);
      
      // Supprimer l'utilisateur de test
      await sql`DELETE FROM "user" WHERE id = ${testId}`;
      console.log('✅ Test user deleted');
      
    } catch (insertError) {
      console.error('❌ Insert failed:', insertError.message);
      console.error('Error details:', insertError);
    }

    await sql.end();
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error details:', error);
    await sql.end();
    process.exit(1);
  }
}

testConnection();
