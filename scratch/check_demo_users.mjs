// scratch/check_demo_users.mjs
import { mongoose } from '../backend/db/mongoose.js';
import bcrypt from '../backend/node_modules/bcryptjs/index.js';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const users = await db.collection('users').find({}).toArray();
  console.log(`Found ${users.length} users in MongoDB:`);
  for (const u of users) {
    console.log(`- ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, Keys: ${Object.keys(u).join(', ')}`);
    console.log(`  password field: ${u.password ? 'has password' : 'no password'}, password_hash: ${u.password_hash ? 'has password_hash' : 'no password_hash'}`);
  }

  console.log("\nTesting demo passwords:");
  const testAccounts = [
    { email: 'student@libramind.edu', pass: 'Student@123' },
    { email: 'librarian@libramind.edu', pass: 'Librarian@123' },
    { email: 'admin@libramind.edu', pass: 'Admin@123' }
  ];

  for (const acc of testAccounts) {
    const user = await db.collection('users').findOne({ email: acc.email });
    if (!user) {
      console.log(`❌ User ${acc.email} NOT FOUND in MongoDB!`);
    } else {
      const hash = user.password || user.password_hash;
      console.log(`User ${acc.email} hash:`, hash);
      if (hash) {
        const match = await bcrypt.compare(acc.pass, hash);
        console.log(`${match ? '✅' : '❌'} User ${acc.email} found. Password match for "${acc.pass}": ${match}`);
      }
    }
  }

  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
