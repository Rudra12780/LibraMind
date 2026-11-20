const { connect, mongoose } = require('../backend/db/mongoose');

async function checkDistribution() {
  await connect();
  const db = mongoose.connection.db;

  const loanTypes = await db.collection('loans').aggregate([
    {
      $project: {
        borrow_date_type: { $type: '$borrow_date' },
        return_date_type: { $type: '$return_date' },
        book_id_type: { $type: '$book_id' },
        user_id_type: { $type: '$user_id' }
      }
    },
    {
      $group: {
        _id: {
          borrow_date: '$borrow_date_type',
          return_date: '$return_date_type',
          book_id: '$book_id_type',
          user_id: '$user_id_type'
        },
        count: { $sum: 1 }
      }
    }
  ]).toArray();

  console.log('Loan types distribution in Atlas:');
  console.log(JSON.stringify(loanTypes, null, 2));

  const userTypes = await db.collection('users').aggregate([
    {
      $project: {
        created_at_type: { $type: '$created_at' },
        role: '$role'
      }
    },
    {
      $group: {
        _id: { created_at: '$created_at_type', role: '$role' },
        count: { $sum: 1 }
      }
    }
  ]).toArray();

  console.log('User types distribution in Atlas:');
  console.log(JSON.stringify(userTypes, null, 2));

  const resvTypes = await db.collection('reservations').aggregate([
    {
      $project: {
        book_id_type: { $type: '$book_id' },
        status: '$status'
      }
    },
    {
      $group: {
        _id: { book_id: '$book_id_type', status: '$status' },
        count: { $sum: 1 }
      }
    }
  ]).toArray();

  console.log('Reservation types and status distribution:');
  console.log(JSON.stringify(resvTypes, null, 2));

  await mongoose.disconnect();
  process.exit(0);
}

checkDistribution().catch(e => {
  console.error(e);
  process.exit(1);
});

