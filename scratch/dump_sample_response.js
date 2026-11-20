const { computeAdminReports } = require('../backend/utils/analyticsEngine');
const { connect, mongoose } = require('../backend/db/mongoose');

async function dumpSampleResponse() {
  await connect();
  const data = await computeAdminReports();
  console.log(JSON.stringify(data, null, 2));
  await mongoose.disconnect();
  process.exit(0);
}

dumpSampleResponse().catch(e => {
  console.error(e);
  process.exit(1);
});

