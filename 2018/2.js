import { compose, juxt, map, reduce, always, countBy, identity, equals, apply,
zipWith, lt, multiply, join, filter, isNil, complement, useWith, not, split, curry } from 'ramda'
const input = [
  'dghfbsyiznoumojleevappwqtr', 'dghfbsyiznoumkjljevacpmqer', 'dghfbbyizioumkjlxevacpwdtr', 'dghfbsesznoumkjlxevacpwqkr', 'dghfbsynznoumkjlxziacpwqtr',
  'cghfbsyiznjumkjlxevacprqtr', 'dghfjsyizwoumkjlxevactwqtr', 'dghfdsyfinoumkjlxevacpwqtr', 'hghfbsyiznoumkjlxivacpwqtj', 'dgcfbsyiznoumkjlxevacbuqtr',
  'dghfbsyiznoymnjlxevacpwvtr', 'dfhfbsyiznoumkulxevacptqtr', 'dghfasyiznovmkjlxevacpwqnr', 'dghfbsyihnouikjlxevackwqtr', 'dghfbayiznolmkjlyevacpwqtr',
  'jghfbsyiznoumnjldevacpwqtr', 'dhhfbsyuznoumkjlxevakpwqtr', 'nehfrsyiznoumkjlxevacpwqtr', 'dghfbsyiznxdmkolxevacpwqtr', 'dgpfbsyizwlumkjlxevacpwqtr',
  'yghfbsyiznoumkjlsevacpwqtm', 'dghfssyiznoumkjlxevvcpwqjr', 'dahfbsyiznoumkjlfevacpwqto', 'duhfcsyiznouvkjlxevacpwqtr', 'dghfbvyiznoumkjlrevacpwvtr',
  'dghfgsyiznoumknlxgvacpwqtr', 'jghfbeyiznkumkjlxevacpwqtr', 'daofbsyiznoumkjlxevampwqtr', 'dghfbsyiznojmkjlxeracpcqtr', 'dghnbsyiznouokjlxevaclwqtr',
  'dgifbsyiznoumkjlxevnspwqtr', 'dgkfpsziznoumkjlxevacpwqtr', 'dghfxsyijnoumkjlxevaccwqtr', 'dghfbsyiznolmkjlwevzcpwqtr', 'dkhfbsaiznoumkjlxevacpwqtg',
  'dghfbsygknoumkjlaevacpwqtr', 'dghfbsyizizumkjlxevacpxqtr', 'ighfbbyijnoumxjlxevacpwqtr', 'dghfbsyizrouekjlxevacpwktr', 'dghobsyiznoujkjlxevacnwqtr',
  'dghpbsyizyoumkjlxeaacpwqtr', 'dghffsyiznoymkjlxevacewqtr', 'dghkbssiznoumzjlxevacpwqtr', 'dghfbsyawnoumkjlxevacpwjtr', 'drhfbsyiznormkjlfevacpwqtr',
  'dghfbsoiznouwkjlxevacpwqtn', 'dghfmsyiznoumkjlxlvecpwqtr', 'dxhfbsyiznoumkjlxeeacvwqtr', 'dghnbsyiznoumkjsxevacpwqur', 'dghfbsyiznrujkjlxevacpwqtc',
  'dghfbstoznoumhjlxevacpwqtr', 'dghfboyiznzumkjlvevacpwqtr', 'dghfbsyiznjumkjlxevgcpwmtr', 'dghfbsnizaoumkjlxevacpwetr', 'dghfbsyirnoumkjoxevacplqtr',
  'dghfbsyiznoumkjlxavvckwqtr', 'dghfbjdiznoumkjlxevacpwptr', 'dghfbsywznoumkjlxeiacpwqcr', 'djhfbsyizuoumkjlxelacpwqtr', 'dghffsniznoumkjlxpvacpwqtr',
  'dghebsyizuoumkjlxevecpwqtr', 'rghfbsyiznourkjcxevacpwqtr', 'dghfbsyignoumkwlxenacpwqtr', 'dghfbsyiznrufkjlxevacpwqth', 'dgifbsyiznoumkjlxevacpjqnr',
  'dghfbsyiznoumkjbxevaxpwqtw', 'dsufbsyizncumkjlxevacpwqtr', 'dihfbsyiznoumujlxecacpwqtr', 'dghfbiyiznoumkjlxevajpwqtn', 'dghqbsyixnoumkjlrevacpwqtr',
  'dghfbsyiznouukjlxeuacpwqtx', 'dghfbsyizyoumksfxevacpwqtr', 'dghfbsiiznopfkjlxevacpwqtr', 'eghfbsyidnoumkjlxexacpwqtr', 'dghfbgyiznouwkjlwevacpwqtr',
  'dghfbsyyznoumkjlxevacwwqtf', 'bghfbtypznoumkjlxevacpwqtr', 'dghfbsyiznoumtjlxebacpwetr', 'dghfbsgiznonmkplxevacpwqtr', 'dghfbsyiznoumxjlxevanpwqpr',
  'dghfbsyiznwumujuxevacpwqtr', 'dghxbsyiznoumkjzxevaypwqtr', 'dghfbsyhznoumkjlxlvacpiqtr', 'dghfbsyiznoumkjlxevzcnwqrr', 'dvhfbsyiznoumkjluevacpzqtr',
  'dghcbsyiznoumkjlxmvacpwetr', 'dghfbsyiznohmkjvxbvacpwqtr', 'dghfzsyiznouokjlxevacpwqpr', 'dghfbsyiznoumkjlxevachtqth', 'dghfbsyiznoumkjlxjvacpfutr',
  'dghfbsyiznoumkjlxevsppwqtt', 'dghfusyiznouakhlxevacpwqtr', 'dghfbsyizcoumkjlxrvaipwqtr', 'dghebsyipnoumfjlxevacpwqtr', 'dgdfbsyiznoumkjlwevacpkqtr',
  'dghfbsyiznoumkjlcffacpwqtr', 'dghfbsypznfumkjlxevacpwqar', 'dghfbsyiznojmkjlxevgcpkqtr', 'dghfbsyiznoumkjlaevlcpwstr', 'dgafrsyiunoumkjlxevacpwqtr',
  'dghfbsyiznouqljlxevacrwqtr', 'dyhkbsyiznokmkjlxevacpwqtr', 'pghfbsciznoumkjlxevacpwvtr', 'dghfbxyiznonmkjllevacpwqtr', 'ighfbsyizxoumkjlxevacpzqtr',
  'dgffbsyoznoumkjlxevacpwqto', 'hghfbsyiznoumkjlpevachwqtr', 'dlhfosyiznoumkjldevacpwqtr', 'dghfbsvizkoumkjlxvvacpwqtr', 'dbafbsyiznozmkjlxevacpwqtr',
  'dghfbsyidnoumkjlxrvjcpwqtr', 'dghfbsyiznfumkjlxeqacpwqta', 'dghfbsfiznoumkjvxevacjwqtr', 'dghfbsyimnoumrjlhevacpwqtr', 'dghflsyiznoumkjlxevacpvqmr',
  'dghfbmfiznoumkjlxevacpdqtr', 'dghfbsyizsouzkjlxevscpwqtr', 'dghfksyiznoumimlxevacpwqtr', 'dghfbsyiznoumkjlxevbwpwqur', 'wghcbsyiznoumkjlkevacpwqtr',
  'kghfbioiznoumkjlxevacpwqtr', 'dghfbsiizeoumkjlxmvacpwqtr', 'dglfbsyilnoumkjlxevpcpwqtr', 'dgqfbsylznoumkjlxevacpwqcr', 'dglfhsyiznoumkjlxevacpwqdr',
  'dghfbsymznoumkjlxbvacpwqtb', 'hghfbsyizhoumkjlxtvacpwqtr', 'dghdbsyiznoumkjlxeiacpyqtr', 'dohfbsyiznoumkjmxlvacpwqtr', 'xhhfbsyiznoumkjlxegacpwqtr',
  'dlhfbsyiznoumkjlxnvahpwqtr', 'dghfbsyiznovdpjlxevacpwqtr', 'dgcfbsyiznoumkjlxevactwqdr', 'dghfksyiknoumkjlxevacpwqcr', 'ughfqsyiznoumkjlxevacpwctr',
  'dghfbjyiznoumkjlxsvacnwqtr', 'dgwfbagiznoumkjlxevacpwqtr', 'dghfbsyiznoumknlxevtcpwqdr', 'jghfksyiznoumkjlxeoacpwqtr', 'dghfbsyiznoimkjlwezacpwqtr',
  'dghfbsyiunoumkjlxeqacpwstr', 'dghfbsyizjoumkwlxevaypwqtr', 'dghfysriznoumkjlxevucpwqtr', 'dghfbsygzjoumkjfxevacpwqtr', 'dghfbhviznoumkjlxevacpwqtq',
  'dghfbsyiznoumkjvwevacpwqur', 'dghfbsyiznoumtjlxevacplqnr', 'yghfbsysznouykjlxevacpwqtr', 'dgwfbsiiznoumkjlxevacfwqtr', 'dghfbsyizooumkjlxevampiqtr',
  'dshfbsyiznoumkjlxevawpoqtr', 'dghtbsyxznuumkjlxevacpwqtr', 'dkhfblyiznoumkjlxevacpaqtr', 'dgkfbsyiinoumkjlxegacpwqtr', 'dghfbtxiznouhkjlxevacpwqtr',
  'dghfbsyiznoumkjlxkvmcpeqtr', 'dghfbsyiznoumkjlghvacpwqmr', 'dghfbsbizioumkjlcevacpwqtr', 'dphfbsyizhoumkjwxevacpwqtr', 'dghfbsyiznqumkjlugvacpwqtr',
  'dghfbsjinnoumkjlxevacpwetr', 'mghfbsyiznoumkjlxfvacpjqtr', 'dghfbsxiznoumkjlxetacwwqtr', 'dghmbsyiznoumbjlxevacpwqyr', 'dghfbsyiznwumkjlwevacmwqtr',
  'dgkfbsyiznotmkjlxevacpwstr', 'dghfbsyiznouykjlxeiacuwqtr', 'dghfbsynznbhmkjlxevacpwqtr', 'dgyfbsyiznoumtjlbevacpwqtr', 'dghfbftiznoumkjlxevacpwatr',
  'dghfvsyiznouikjlievacpwqtr', 'dghfbsyiznodmkjlxevncpwqtz', 'yfhfbsyiznoumkjluevacpwqtr', 'dghfbzyiznoumhflxevacpwqtr', 'dphfbsyizncumkjlxevacpwqtf',
  'dghfasyiznoumkjlxeaicpwqtr', 'dgffbsyiznoumkjlzevacpwqsr', 'dghfbsyiznoumkmxxcvacpwqtr', 'dghffsyiznoumkjlxevacpwqre', 'dghfbsyizndmmkjlxemacpwqtr',
  'dghfbsviznoamkjlxevappwqtr', 'dghfbsyiznouckrlxevacpdqtr', 'dgwfbsyiznyumkjlxevacpqqtr', 'dujfbsyiznoumgjlxevacpwqtr', 'dghobsailnoumkjlxevacpwqtr',
  'dghfkqyiznoumknlxevacpwqtr', 'dghfbyypznoumkjlxevacpwatr', 'wqhfbsyiznoumkjlxevzcpwqtr', 'dghfbsyiznoumwjlxrvacppqtr', 'dghfbsymznoumkflxevacplqtr',
  'dghfbsyiznounkjpgevacpwqtr', 'ighfbsyijnoumxjlxevacpwqtr', 'dghfbsyizroumkjllevncpwqtr', 'dghfbsliznokmkjlxevacpwqtb', 'dgefbsyiznoumkqlxevpcpwqtr',
  'dghfbtypznouzkjlxevacpwqtr', 'dmhfbsyiznoumkjlxeyactwqtr', 'vohfbsyiznoumkjlqevacpwqtr', 'dgsfpsyiznodmkjlxevacpwqtr', 'dghfzsyijnoumkjnxevacpwqtr',
  'dghfbayijroumkjlxevacpwqtr', 'dghfbsyiznodmxjlxgvacpwqtr', 'dghfbsyiznocmkjlxhvaipwqtr', 'dghmbsyignoumkjlxevacpoqtr', 'dghfbsyiznosmkjlncvacpwqtr',
  'dggfbsyiznuumkjlxevacpwqrr', 'dghibsyilnoumkjlxevacowqtr', 'dghfbsyiznoumkjluevbcowqtr', 'dghfbsaiznyuvkjlxevacpwqtr', 'dgnfxsyiznommkjlxevacpwqtr',
  'dghfbnyiznoumkjlsnvacpwqtr', 'dghfssiiznoumkjlxavacpwqtr', 'dghfbsyizneumajlxevacfwqtr', 'dghfbsyiznoumkjlxevycpvptr', 'qghfbsyizgoumkjlxevacpwttr',
  'vghfbsyiznoumkjlievaepwqtr', 'dghfbsyiznoumejlxjvacpwdtr', 'dghfbsyispoumkjlxevacpwqtg', 'duhfbsyizpoumkjlxenacpwqtr', 'dghfbsyifnoumkblxevacpnqtr',
  'bghfbsyxznoumkjleevacpwqtr', 'dgtfbsyzpnoumkjlxevacpwqtr', 'dghfbsyiznoumkjlsecacpwqth', 'dghfqsyiznjumkjlxevawpwqtr', 'dgcfbsyizboumkjlxevacqwqtr',
  'dghfbqyiznoumkjkxevacpwqtj', 'dgyfbsyfznoumkjlievacpwqtr', 'dghfdsyiznoumkplxevacpwdtr', 'dphfbsyuznkumkjlxevacpwqtr', 'dghfbsyiznoupkjitevacpwqtr',
  'dghfisyiznoamkjlxevacpwqwr', 'dgufbsyiznoumkjlxivvcpwqtr', 'dghfbvyiznoumkjlxevacvwqtz', 'dghfbsyiqnxumkjlxbvacpwqtr', 'dghubsyiznqumkflxevacpwqtr',
  'dghfbsyiznzumkjlxevacpdbtr', 'dghfbsyiznoumkjlxehacpwwrr', 'mghfbsyiznoumkjlxevacpwqbp', 'dvhfbryiznoumkclxevacpwqtr', 'dghbbsyiznotmkjlxevacpwqhr',
  'dghfrsyiznoomkjlxevacpwqto', 'dghfbkyiznoumkjlxeracpxqtr', 'dghfbfyizfoumkjlxevacpwjtr', 'dghfbsyizqoulkjlxevacpwqtt', 'dghfbsyiwnoumkjlxevacxwgtr',
  'dghfbsyiznormkjlgxvacpwqtr', 'dghybsyizioumkjoxevacpwqtr', 'dchfbsyiznoumkjlxyvacpwqtc', 'dgyfbsyiznouckjlxewacpwqtr', 'dakfbsyeznoumkjlxevacpwqtr',
]

// reducers
const incIf = predicate => (n, x) => n + predicate(x)
const countTwos = incIf(equals(2))
const countThrees = incIf(equals(3))
const countGreaterThanZeroItems = zipWith(incIf(lt(0)))

const countDupletsAndTriplets = compose(
  juxt([reduce(countTwos, 0), reduce(countThrees, 0)]),
  Object.values,
  countBy(identity),
)

const solution1 = compose(
  reduce(multiply, 1),
  reduce(countGreaterThanZeroItems, [0, 0]),
  map(countDupletsAndTriplets),
)

console.log('2a result = ', solution1(input))

// ===========================================
// two strings are similar if exactly one letter at the same position in both string differs
const stringsAreSimilar = curry(compose(
  equals(1),
  reduce(incIf(not), 0),
  useWith(zipWith(equals), [split(''), split('')]),
))

const getEqual = (a, b) => a === b ? a : null

const intersect = compose(
  join(''),
  filter(complement(isNil)),
  apply(zipWith(getEqual)),
)

// finds the first pair of list items together matching the predicate
// returns empty array if no such pair exists
// TODO ugly. To make it truly FP, we need to eliminate similarString, if check
const findFirstPairBy = predicate => list => {
  let similarString
  const len = list.length
  const string = list.find((str, idx) => {
    if (idx >= len - 1) {
      return false
    }
    similarString = list.slice(idx + 1).find(predicate(str))
    return similarString !== undefined
  })
  return (string !== undefined) ? [string, similarString] : []
}

const solution2 = compose(
  intersect,
  findFirstPairBy(stringsAreSimilar),
)

console.log('2b similar strings=', solution2(input))
