export const calculateChoiceScore = (product) => {
  // Product Rating (25%)
  const ratingScore = (product.rating / 5.0) * 25;

  // Verified Orders (20%) - Max points at 5000 orders
  const ordersScore = Math.min(product.soldCount / 5000, 1) * 20;

  // Return Rate (15%) - 0% = 15pts, >10% = 0pts
  const returnRateScore = Math.max((10 - product.returnRate) / 10, 0) * 15;

  // Seller Performance (10%) - out of 100
  const sellerScore = (product.sellerPerformance / 100) * 10;

  // Shipping Speed (10%) - 1 day = 10pts, >10 days = 0pts
  const shippingScore = Math.max((10 - product.shippingDays) / 10, 0) * 10;

  // Price Competitiveness (10%) - out of 100
  const priceScore = (product.priceCompetitiveness / 100) * 10;

  // Product Quality Score (5%) - out of 100
  const qualityScore = (product.qualityScore / 100) * 5;

  // Inventory Availability (5%) - Max points at 100 stock
  const inventoryScore = Math.min(product.stock / 100, 1) * 5;

  const totalScore = Math.round(
    ratingScore + ordersScore + returnRateScore + sellerScore + 
    shippingScore + priceScore + qualityScore + inventoryScore
  );

  return totalScore;
};

export const evaluateChoiceQualification = (product) => {
  const score = calculateChoiceScore(product);
  
  // Base check if already has badge
  const hadBadge = product.isChoice || false;

  let isChoice = false;
  let reason = '';

  if (!hadBadge) {
    // Grant Rules
    if (score >= 85 &&
        product.rating >= 4.6 &&
        product.soldCount >= 30 &&
        product.stock > 0 &&
        product.adminApproved &&
        product.sellerActive &&
        product.returnRate < 3 &&
        product.cancellationRate < 2 &&
        !product.adminRemovedChoice) {
      isChoice = true;
    } else {
      isChoice = false;
      if (score < 85) reason = 'Score below 85.';
      else if (product.rating < 4.6) reason = 'Rating below 4.6.';
      else if (product.soldCount < 30) reason = 'Not enough orders.';
      else if (product.stock <= 0) reason = 'Out of stock.';
      else if (product.returnRate >= 3) reason = 'Return rate too high.';
      else if (product.cancellationRate >= 2) reason = 'Cancellation rate too high.';
    }
  } else {
    // Remove Rules (more lenient to keep it, but strict thresholds)
    if (product.rating < 4.5 ||
        product.stock === 0 ||
        !product.sellerActive ||
        product.returnRate > 5 ||
        product.cancellationRate > 4 ||
        product.adminRemovedChoice) {
      isChoice = false;
      reason = 'Lost qualification due to dropped metrics or admin removal.';
    } else {
      isChoice = true;
    }
  }

  return { isChoice, score, reason };
};
