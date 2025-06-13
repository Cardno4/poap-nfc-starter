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
    console.log("No unused POAP links found for chip:", chipId);
    res.status(200).send("All POAPs have been claimed for this chip.");
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

