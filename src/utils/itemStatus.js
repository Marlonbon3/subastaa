export const itemStatus = (item) => {
  const bidsArray = Object.entries(item.bids ?? {}).map(([key, value]) => ({
    bidId: key,
    ...value,
  }));

  const sortedBids = bidsArray.sort((a, b) => b.amount - a.amount);
  const topBidders = sortedBids.slice(0, 3);

  const bids = sortedBids.length;
  const amount = bids ? sortedBids[0].amount : item.startingPrice ?? 0;
  const winner = bids ? sortedBids[0].uid : "";

  return { bids, amount, winner, topBidders };
};