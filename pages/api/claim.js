let poapLinks = [
  { link: "http://POAP.xyz/mint/xcmrcn", used: false },
  { link: "http://POAP.xyz/mint/xcmrcn", used: false }
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
