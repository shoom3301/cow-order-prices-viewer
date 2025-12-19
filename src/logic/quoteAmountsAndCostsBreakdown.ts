import { getBigNumber, type QuoteAmountsAndCosts, type QuoteAmountsAndCostsParams } from "@cowprotocol/cow-sdk";
import { OrderKind } from "@cowprotocol/sdk-order-book";


const ONE_HUNDRED_BPS = BigInt(100 * 100)

/**
 * Generates a verbose breakdown of quote amounts and costs, showing how each parameter is calculated.
 * This function demonstrates step-by-step how the QuoteAmountsAndCosts values are derived from the input parameters.
 *
 * @param params - The input parameters used to calculate the quote
 * @param amountsAndCosts - The calculated amounts and costs from getQuoteAmountsAndCosts
 * @returns A detailed string showing all calculations and intermediate values
 *
 * @example
 * ```typescript
 * const params = {
 *   orderParams: { sellAmount: '100106590637', buyAmount: '100100000000000000000000', feeAmount: '2371069', kind: OrderKind.SELL },
 *   sellDecimals: 6,
 *   buyDecimals: 18,
 *   slippagePercentBps: 50,
 *   partnerFeeBps: 15,
 *   protocolFeeBps: 2
 * }
 * const amountsAndCosts = getQuoteAmountsAndCosts(params)
 * console.log(quoteAmountsAndCostsBreakdown(params, amountsAndCosts))
 * ```
 */
export function quoteAmountsAndCostsBreakdown(
  params: QuoteAmountsAndCostsParams,
  amountsAndCosts: QuoteAmountsAndCosts,
): string {
  const { orderParams, sellDecimals, buyDecimals, slippagePercentBps } = params
  const partnerFeeBps = params.partnerFeeBps ?? 0
  const protocolFeeBps = params.protocolFeeBps ?? 0
  const isSell = orderParams.kind === OrderKind.SELL

  const lines: string[] = []
  const add = (line: string) => lines.push(line)

  // Input parameters
  add('INPUT PARAMETERS:')
  add('-'.repeat(80))
  add(`Order Kind: ${isSell ? 'SELL' : 'BUY'}`)
  add(`sellAmount (from quote): ${orderParams.sellAmount}`)
  add(`buyAmount (from quote): ${orderParams.buyAmount}`)
  add(`feeAmount (network fee in sell token): ${orderParams.feeAmount}`)
  add(`sellDecimals: ${sellDecimals}`)
  add(`buyDecimals: ${buyDecimals}`)
  add(`slippagePercentBps: ${slippagePercentBps}`)
  add(`partnerFeeBps: ${partnerFeeBps}`)
  add(`protocolFeeBps: ${protocolFeeBps}`)
  add('')

  // Step 1: Calculate protocol fee
  add('STEP 1: CALCULATE PROTOCOL FEE')
  add('-'.repeat(80))

  const sellAmount = BigInt(orderParams.sellAmount)
  const buyAmount = BigInt(orderParams.buyAmount)
  const feeAmount = BigInt(orderParams.feeAmount)

  const protocolFeeAmount = amountsAndCosts.costs.protocolFee.amount

  if (protocolFeeBps <= 0) {
    add('protocolFeeBps <= 0, so protocolFeeAmount = 0')
  } else if (isSell) {
    add('For SELL orders:')
    add('  Protocol fee is deducted from buyAmount by the API')
    add(`  Formula: protocolFeeAmount = (buyAmount * protocolFeeBps) / (ONE_HUNDRED_BPS - protocolFeeBps)`)
    const denominator = ONE_HUNDRED_BPS - BigInt(protocolFeeBps)
    const calculated = (buyAmount * BigInt(protocolFeeBps)) / denominator
    add(`  protocolFeeAmount = (${buyAmount} * ${protocolFeeBps}) / ${denominator}`)
    add(`  protocolFeeAmount = ${calculated}`)
  } else {
    add('For BUY orders:')
    add('  Protocol fee is added to sellAmount by the API')
    add(`  Formula: protocolFeeAmount = ((sellAmount + feeAmount) * protocolFeeBps) / (ONE_HUNDRED_BPS + protocolFeeBps)`)
    const denominator = ONE_HUNDRED_BPS + BigInt(protocolFeeBps)
    const calculated = ((sellAmount + feeAmount) * BigInt(protocolFeeBps)) / denominator
    add(`  protocolFeeAmount = ((${sellAmount} + ${feeAmount}) * ${protocolFeeBps}) / ${denominator}`)
    add(`  protocolFeeAmount = ${calculated}`)
  }
  add(`  => protocolFeeAmount = ${protocolFeeAmount}`)
  add('')

  // Step 2: Calculate amounts before and after network costs
  add('STEP 2: CALCULATE AMOUNTS BEFORE AND AFTER NETWORK COSTS')
  add('-'.repeat(80))

  const networkCostAmount = feeAmount
  const sellAmountBeforeNetworkCosts = sellAmount
  const buyAmountAfterNetworkCosts = buyAmount

  add(`networkCostAmount = feeAmount = ${networkCostAmount}`)
  add(`sellAmountBeforeNetworkCosts = sellAmount = ${sellAmountBeforeNetworkCosts}`)
  add(`buyAmountAfterNetworkCosts = buyAmount = ${buyAmountAfterNetworkCosts}`)
  add('')

  const sellAmountAfterNetworkCosts = sellAmountBeforeNetworkCosts + networkCostAmount
  add(`sellAmountAfterNetworkCosts = sellAmountBeforeNetworkCosts + networkCostAmount`)
  add(`sellAmountAfterNetworkCosts = ${sellAmountBeforeNetworkCosts} + ${networkCostAmount}`)
  add(`sellAmountAfterNetworkCosts = ${sellAmountAfterNetworkCosts}`)
  add(`  => ${amountsAndCosts.afterNetworkCosts.sellAmount} (from QuoteAmountsAndCosts)`)
  add('')

  // Step 3: Calculate quote price and buyAmountBeforeNetworkCosts
  add('STEP 3: CALCULATE QUOTE PRICE AND BUY AMOUNT BEFORE NETWORK COSTS')
  add('-'.repeat(80))

  const protocolFeeAmountDecimals = isSell ? buyDecimals : sellDecimals
  const protocolFeeAmountBigNumber = getBigNumber(protocolFeeAmount, protocolFeeAmountDecimals)
  const sellAmountBeforeNetworkCostsBigNumber = getBigNumber(sellAmountBeforeNetworkCosts, sellDecimals)
  const buyAmountAfterNetworkCostsBigNumber = getBigNumber(buyAmountAfterNetworkCosts, buyDecimals)
  const sellAmountAfterNetworkCostsBigNumber = getBigNumber(sellAmountAfterNetworkCosts, sellDecimals)

  let quotePrice: number

  if (isSell) {
    add('For SELL orders:')
    add('  Quote price needs protocol fee added back to buyAmount')
    add(`  quotePrice = (buyAmountAfterNetworkCosts + protocolFeeAmount) / sellAmountBeforeNetworkCosts`)
    quotePrice =
      (buyAmountAfterNetworkCostsBigNumber.num + protocolFeeAmountBigNumber.num) /
      sellAmountBeforeNetworkCostsBigNumber.num
    add(
      `  quotePrice = (${buyAmountAfterNetworkCostsBigNumber.num} + ${protocolFeeAmountBigNumber.num}) / ${sellAmountBeforeNetworkCostsBigNumber.num}`,
    )
  } else {
    add('For BUY orders:')
    add('  Quote price needs protocol fee subtracted from sellAmount')
    add(`  quotePrice = buyAmountAfterNetworkCosts / (sellAmountBeforeNetworkCosts - protocolFeeAmount)`)
    quotePrice =
      buyAmountAfterNetworkCostsBigNumber.num /
      (sellAmountBeforeNetworkCostsBigNumber.num - protocolFeeAmountBigNumber.num)
    add(
      `  quotePrice = ${buyAmountAfterNetworkCostsBigNumber.num} / (${sellAmountBeforeNetworkCostsBigNumber.num} - ${protocolFeeAmountBigNumber.num})`,
    )
  }
  add(`  quotePrice = ${quotePrice}`)
  add('')

  const buyAmountBeforeNetworkCosts = getBigNumber(quotePrice * sellAmountAfterNetworkCostsBigNumber.num, buyDecimals)
  add(`buyAmountBeforeNetworkCosts = quotePrice * sellAmountAfterNetworkCosts`)
  add(`buyAmountBeforeNetworkCosts = ${quotePrice} * ${sellAmountAfterNetworkCostsBigNumber.num}`)
  add(`buyAmountBeforeNetworkCosts = ${buyAmountBeforeNetworkCosts.big}`)
  add(`  => ${amountsAndCosts.beforeNetworkCosts.buyAmount} (from QuoteAmountsAndCosts)`)
  add('')

  const networkCostBigNumber = getBigNumber(networkCostAmount, sellDecimals)
  const networkFeeInBuyCurrency = getBigNumber(quotePrice * networkCostBigNumber.num, buyDecimals)
  add(`networkFeeInBuyCurrency = quotePrice * networkCostAmount`)
  add(`networkFeeInBuyCurrency = ${quotePrice} * ${networkCostBigNumber.num}`)
  add(`networkFeeInBuyCurrency = ${networkFeeInBuyCurrency.big}`)
  add(`  => ${amountsAndCosts.costs.networkFee.amountInBuyCurrency} (from QuoteAmountsAndCosts)`)
  add('')

  // Step 4: Restore amounts before protocol fee
  add('STEP 4: RESTORE AMOUNTS BEFORE PROTOCOL FEE (for partner fee calculation)')
  add('-'.repeat(80))

  let buyAmountBeforeProtocolFee: bigint
  let sellAmountBeforeProtocolFee: bigint

  if (isSell) {
    add('For SELL orders:')
    if (protocolFeeBps > 0) {
      add('  Protocol fee was deducted from buyAmount, so add it back')
      buyAmountBeforeProtocolFee = buyAmountAfterNetworkCosts + protocolFeeAmount
      add(`  buyAmountBeforeProtocolFee = buyAmountAfterNetworkCosts + protocolFeeAmount`)
      add(`  buyAmountBeforeProtocolFee = ${buyAmountAfterNetworkCosts} + ${protocolFeeAmount}`)
    } else {
      add('  No protocol fee, use buyAmountBeforeNetworkCosts')
      buyAmountBeforeProtocolFee = buyAmountBeforeNetworkCosts.big
    }
    add(`  buyAmountBeforeProtocolFee = ${buyAmountBeforeProtocolFee}`)
    sellAmountBeforeProtocolFee = sellAmountAfterNetworkCosts
    add(`  sellAmountBeforeProtocolFee = sellAmountAfterNetworkCosts = ${sellAmountBeforeProtocolFee}`)
  } else {
    add('For BUY orders:')
    buyAmountBeforeProtocolFee = buyAmountAfterNetworkCosts
    add(`  buyAmountBeforeProtocolFee = buyAmountAfterNetworkCosts = ${buyAmountBeforeProtocolFee}`)
    if (protocolFeeBps > 0) {
      add('  Protocol fee was added to sellAmount, so subtract it')
      sellAmountBeforeProtocolFee = sellAmountAfterNetworkCosts - protocolFeeAmount
      add(`  sellAmountBeforeProtocolFee = sellAmountAfterNetworkCosts - protocolFeeAmount`)
      add(`  sellAmountBeforeProtocolFee = ${sellAmountAfterNetworkCosts} - ${protocolFeeAmount}`)
    } else {
      add('  No protocol fee, use sellAmountBeforeNetworkCosts')
      sellAmountBeforeProtocolFee = sellAmountBeforeNetworkCosts
    }
    add(`  sellAmountBeforeProtocolFee = ${sellAmountBeforeProtocolFee}`)
  }
  add('')

  // Step 5: Calculate partner fee
  add('STEP 5: CALCULATE PARTNER FEE')
  add('-'.repeat(80))

  const surplusAmountForPartnerFee = isSell ? buyAmountBeforeProtocolFee : sellAmountBeforeProtocolFee
  add(
    `surplusAmountForPartnerFee = ${isSell ? 'buyAmountBeforeProtocolFee' : 'sellAmountBeforeProtocolFee'} = ${surplusAmountForPartnerFee}`,
  )

  const partnerFeeAmount = amountsAndCosts.costs.partnerFee.amount

  if (partnerFeeBps > 0) {
    add(`Formula: partnerFeeAmount = (surplusAmountForPartnerFee * partnerFeeBps) / ONE_HUNDRED_BPS`)
    const calculated = (surplusAmountForPartnerFee * BigInt(partnerFeeBps)) / ONE_HUNDRED_BPS
    add(`partnerFeeAmount = (${surplusAmountForPartnerFee} * ${partnerFeeBps}) / ${ONE_HUNDRED_BPS}`)
    add(`partnerFeeAmount = ${calculated}`)
  } else {
    add('partnerFeeBps = 0, so partnerFeeAmount = 0')
  }
  add(`  => partnerFeeAmount = ${partnerFeeAmount}`)
  add('')

  // Step 6: Calculate amounts after partner fees
  add('STEP 6: CALCULATE AMOUNTS AFTER PARTNER FEES')
  add('-'.repeat(80))

  if (isSell) {
    add('For SELL orders: partner fee is subtracted from buyAmount')
    const sellAmountAfterPartnerFees = sellAmountAfterNetworkCosts
    const buyAmountAfterPartnerFees = buyAmountAfterNetworkCosts - partnerFeeAmount
    add(`sellAmountAfterPartnerFees = sellAmountAfterNetworkCosts = ${sellAmountAfterPartnerFees}`)
    add(`buyAmountAfterPartnerFees = buyAmountAfterNetworkCosts - partnerFeeAmount`)
    add(`buyAmountAfterPartnerFees = ${buyAmountAfterNetworkCosts} - ${partnerFeeAmount}`)
    add(`buyAmountAfterPartnerFees = ${buyAmountAfterPartnerFees}`)
    add(`  => ${amountsAndCosts.afterPartnerFees.buyAmount} (from QuoteAmountsAndCosts)`)
  } else {
    add('For BUY orders: partner fee is added to sellAmount')
    const sellAmountAfterPartnerFees = sellAmountAfterNetworkCosts + partnerFeeAmount
    const buyAmountAfterPartnerFees = buyAmountAfterNetworkCosts
    add(`sellAmountAfterPartnerFees = sellAmountAfterNetworkCosts + partnerFeeAmount`)
    add(`sellAmountAfterPartnerFees = ${sellAmountAfterNetworkCosts} + ${partnerFeeAmount}`)
    add(`sellAmountAfterPartnerFees = ${sellAmountAfterPartnerFees}`)
    add(`  => ${amountsAndCosts.afterPartnerFees.sellAmount} (from QuoteAmountsAndCosts)`)
    add(`buyAmountAfterPartnerFees = buyAmountAfterNetworkCosts = ${buyAmountAfterPartnerFees}`)
  }
  add('')

  // Step 7: Calculate amounts after slippage
  add('STEP 7: CALCULATE AMOUNTS AFTER SLIPPAGE')
  add('-'.repeat(80))

  const sellAmountAfterPartnerFees = amountsAndCosts.afterPartnerFees.sellAmount
  const buyAmountAfterPartnerFees = amountsAndCosts.afterPartnerFees.buyAmount

  if (isSell) {
    add('For SELL orders: slippage is subtracted from buyAmount')
    const slippageAmount = (buyAmountAfterPartnerFees * BigInt(slippagePercentBps)) / ONE_HUNDRED_BPS
    add(`slippageAmount = (buyAmountAfterPartnerFees * slippagePercentBps) / ONE_HUNDRED_BPS`)
    add(`slippageAmount = (${buyAmountAfterPartnerFees} * ${slippagePercentBps}) / ${ONE_HUNDRED_BPS}`)
    add(`slippageAmount = ${slippageAmount}`)
    const sellAmountAfterSlippage = sellAmountAfterPartnerFees
    const buyAmountAfterSlippage = buyAmountAfterPartnerFees - slippageAmount
    add(`sellAmountAfterSlippage = sellAmountAfterPartnerFees = ${sellAmountAfterSlippage}`)
    add(`buyAmountAfterSlippage = buyAmountAfterPartnerFees - slippageAmount`)
    add(`buyAmountAfterSlippage = ${buyAmountAfterPartnerFees} - ${slippageAmount}`)
    add(`buyAmountAfterSlippage = ${buyAmountAfterSlippage}`)
    add(`  => ${amountsAndCosts.afterSlippage.buyAmount} (from QuoteAmountsAndCosts)`)
  } else {
    add('For BUY orders: slippage is added to sellAmount')
    const slippageAmount = (sellAmountAfterPartnerFees * BigInt(slippagePercentBps)) / ONE_HUNDRED_BPS
    add(`slippageAmount = (sellAmountAfterPartnerFees * slippagePercentBps) / ONE_HUNDRED_BPS`)
    add(`slippageAmount = (${sellAmountAfterPartnerFees} * ${slippagePercentBps}) / ${ONE_HUNDRED_BPS}`)
    add(`slippageAmount = ${slippageAmount}`)
    const sellAmountAfterSlippage = sellAmountAfterPartnerFees + slippageAmount
    const buyAmountAfterSlippage = buyAmountAfterPartnerFees
    add(`sellAmountAfterSlippage = sellAmountAfterPartnerFees + slippageAmount`)
    add(`sellAmountAfterSlippage = ${sellAmountAfterPartnerFees} + ${slippageAmount}`)
    add(`sellAmountAfterSlippage = ${sellAmountAfterSlippage}`)
    add(`  => ${amountsAndCosts.afterSlippage.sellAmount} (from QuoteAmountsAndCosts)`)
    add(`buyAmountAfterSlippage = buyAmountAfterPartnerFees = ${buyAmountAfterSlippage}`)
  }
  add('')

  // Step 8: Calculate beforeAllFees
  add('STEP 8: CALCULATE BEFORE ALL FEES')
  add('-'.repeat(80))

  if (isSell) {
    const sellAmountBeforeAllFees = sellAmountBeforeNetworkCosts
    const buyAmountBeforeAllFees = buyAmountBeforeNetworkCosts.big
    add(`sellAmountBeforeAllFees = sellAmountBeforeNetworkCosts = ${sellAmountBeforeAllFees}`)
    add(`  => ${amountsAndCosts.beforeAllFees.sellAmount} (from QuoteAmountsAndCosts)`)
    add(`buyAmountBeforeAllFees = buyAmountBeforeNetworkCosts = ${buyAmountBeforeAllFees}`)
    add(`  => ${amountsAndCosts.beforeAllFees.buyAmount} (from QuoteAmountsAndCosts)`)
  } else {
    const sellAmountBeforeAllFees = sellAmountBeforeNetworkCosts - protocolFeeAmount
    const buyAmountBeforeAllFees = buyAmountBeforeNetworkCosts.big
    add(`sellAmountBeforeAllFees = sellAmountBeforeNetworkCosts - protocolFeeAmount`)
    add(`sellAmountBeforeAllFees = ${sellAmountBeforeNetworkCosts} - ${protocolFeeAmount}`)
    add(`sellAmountBeforeAllFees = ${sellAmountBeforeAllFees}`)
    add(`  => ${amountsAndCosts.beforeAllFees.sellAmount} (from QuoteAmountsAndCosts)`)
    add(`buyAmountBeforeAllFees = buyAmountBeforeNetworkCosts = ${buyAmountBeforeAllFees}`)
    add(`  => ${amountsAndCosts.beforeAllFees.buyAmount} (from QuoteAmountsAndCosts)`)
  }
  add('')

  // Summary
  add('='.repeat(80))
  add('FINAL SUMMARY')
  add('='.repeat(80))
  add('')
  add('Costs:')
  add(`  networkFee.amountInSellCurrency: ${amountsAndCosts.costs.networkFee.amountInSellCurrency}`)
  add(`  networkFee.amountInBuyCurrency: ${amountsAndCosts.costs.networkFee.amountInBuyCurrency}`)
  add(`  partnerFee.amount: ${amountsAndCosts.costs.partnerFee.amount}`)
  add(`  partnerFee.bps: ${amountsAndCosts.costs.partnerFee.bps}`)
  add(`  protocolFee.amount: ${amountsAndCosts.costs.protocolFee.amount}`)
  add(`  protocolFee.bps: ${amountsAndCosts.costs.protocolFee.bps}`)
  add('')
  add('Amounts:')
  add(
    `  beforeAllFees: { sellAmount: ${amountsAndCosts.beforeAllFees.sellAmount}, buyAmount: ${amountsAndCosts.beforeAllFees.buyAmount} }`,
  )
  add(
    `  beforeNetworkCosts: { sellAmount: ${amountsAndCosts.beforeNetworkCosts.sellAmount}, buyAmount: ${amountsAndCosts.beforeNetworkCosts.buyAmount} }`,
  )
  add(
    `  afterNetworkCosts: { sellAmount: ${amountsAndCosts.afterNetworkCosts.sellAmount}, buyAmount: ${amountsAndCosts.afterNetworkCosts.buyAmount} }`,
  )
  add(
    `  afterPartnerFees: { sellAmount: ${amountsAndCosts.afterPartnerFees.sellAmount}, buyAmount: ${amountsAndCosts.afterPartnerFees.buyAmount} }`,
  )
  add(
    `  afterSlippage: { sellAmount: ${amountsAndCosts.afterSlippage.sellAmount}, buyAmount: ${amountsAndCosts.afterSlippage.buyAmount} }`,
  )
  add('')
  add('='.repeat(80))

  return lines.join('\n')
}
