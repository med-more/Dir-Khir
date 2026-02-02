// Script pour vérifier les besoins dans la base de données
require('dotenv').config({ path: '.env.local' });

const postgres = require('postgres');

async function checkNeeds() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL is set');
  console.log('Checking needs in database...\n');

  const sql = postgres(process.env.DATABASE_URL);

  try {
    // Récupérer les 10 derniers besoins
    const needs = await sql`
      SELECT 
        id, 
        title, 
        status, 
        city, 
        category, 
        "createdAt",
        "userId"
      FROM need 
      ORDER BY "createdAt" DESC 
      LIMIT 10
    `;
    
    console.log('📋 Needs in database:');
    console.table(needs);
    console.log(`\n✅ Total: ${needs.length} needs found`);

    // Compter par statut
    const statusCount = await sql`
      SELECT status, COUNT(*) as count
      FROM need
      GROUP BY status
    `;
    
    console.log('\n📊 Needs by status:');
    console.table(statusCount);

    await sql.end();
    console.log('\n✅ Check completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error details:', error);
    await sql.end();
    process.exit(1);
  }
}

checkNeeds();
