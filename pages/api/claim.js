let poapLinks = [
  { link: "https://poap.xyz/mint/abc123", used: false },
  { link: "https://poap.xyz/mint/def456", used: false }
];

export default function handler(req, res) {
  const nextLink = poapLinks.find(l => !l.used);
  if (!nextLink) {
    res.status(200).send("All POAPs have been claimed.");
    return;
  }

  nextLink.used = true;
  res.writeHead(302, { Location: nextLink.link });
  res.end();
}
