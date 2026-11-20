const { connect, mongoose } = require('../backend/db/mongoose');

async function testDateConversion() {
  await connect();
  const db = mongoose.connection.db;

  const res = await db.collection('loans').aggregate([
    {
      $project: {
        raw_borrow: '$borrow_date',
        converted_borrow: { $toDate: '$borrow_date' },
        year: { $year: { $toDate: '$borrow_date' } },
        month: { $month: { $toDate: '$borrow_date' } },
        date_str: { $dateToString: { format: '%Y-%m-%d', date: { $toDate: '$borrow_date' } } }
      }
    },
    { $limit: 3 }
  ]).toArray();

  console.log('Loan Date conversion results:');
  console.log(JSON.stringify(res, null, 2));

  const userRes = await db.collection('users').aggregate([
    {
      $project: {
        raw_created: '$created_at',
        converted_created: { $toDate: '$created_at' },
        year: { $year: { $toDate: '$created_at' } },
        month: { $month: { $toDate: '$created_at' } },
        month_str: { $dateToString: { format: '%Y-%m', date: { $toDate: '$created_at' } } }
      }
    },
    { $limit: 3 }
  ]).toArray();

  console.log('User Date conversion results:');
  console.log(JSON.stringify(userRes, null, 2));

  await mongoose.disconnect();
  process.exit(0);
}

testDateConversion().catch(e => {
  console.error(e);
  process.exit(1);
});

