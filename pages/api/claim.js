const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  const chipId = req.query.chip;

  if (!chipId) {
    res.status(400).send("Missing chip ID.");
    return;
  }

  // Log the incoming chip ID for debug
  console.log("Incoming chip ID:", chipId);

  const { data: poapLinks, error } = await supabase
    .from('poap_links')
    .select('*')
    .eq('chip_id', chipId)
    .eq('used', false)
    .limit(1);

  if (error) {
    console.error("Supabase error:", error);
    res.status(500).send("Error querying Supabase.");
    return;
  }

  if (!poapLinks || poapLinks.length === 0) {
  res.status(200).send(`
    <html>
      <head>
        <title>POAP Claimed</title>
        <style>
  body {
    text-align: center;
    font-family: sans-serif;
    background: #f5f5f5;
    padding: 2rem;
    margin: 0;
  }
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  p {
    font-size: 1rem;
    margin-top: 0;
  }
  img {
    width: 60%;
    max-width: 300px;
    margin-top: 1.5rem;
  }
</style>
      </head>
      <body>
        <h2>Oh no! This POAP is all out 😢</h2>
        <p>Thanks for tapping — but this one’s already been fully claimed.</p>
        <img src="/pomo-sad.png" alt="All POAPs claimed">
      </body>
    </html>
  `);
  return;
}


  const poap = poapLinks[0];
  console.log("Serving POAP link:", poap.link);

  await supabase
    .from('poap_links')
    .update({
      used: true,
      claimed_at: new Date().toISOString()
    })
    .eq('id', poap.id);

  res.writeHead(302, { Location: poap.link });
  res.end();
};

