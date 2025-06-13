import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const chipId = req.query.chip;

  if (!chipId) {
    res.status(400).send("Missing chip ID.");
    return;
  }

  // Get next unused POAP link for this chip
  const { data: poapLinks, error } = await supabase
    .from('poap_links')
    .select('*')
    .eq('chip_id', chipId)
    .eq('used', false)
    .limit(1);

  if (error || !poapLinks || poapLinks.length === 0) {
    res.status(200).send("All POAPs have been claimed for this chip.");
    return;
  }

  const poap = poapLinks[0];

  // Mark the link as used
  await supabase
    .from('poap_links')
    .update({
      used: true,
      claimed_at: new Date().toISOString()
    })
    .eq('id', poap.id);

  // Redirect to the POAP mint link
  res.writeHead(302, { Location: poap.link });
  res.end();
}
