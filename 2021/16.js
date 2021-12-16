import R from 'ramda'
import S from 'sanctuary'
import L from 'lodash'

const hexa2bin = (hexa) => {
  let bin = ''
  for (let i = 0, l = hexa.length; i < l; i += 1) {
    bin += L.padStart(Number(`0x${hexa[i]}`).toString(2), 4, '0')
  }
  return bin
}

const bin2dec = (bin) => parseInt(bin, 2)

function countLiteralNumberBits(bits) {
  let count = 0
  for (let i = 0, l = bits.length; i < l; i += 5) {
    if (bits[i] === '0') {
      count += 5
      break
    }
    count += 5
  }
  return count
}

const notEmpty = (bits) => bits.length > 0 && bin2dec(bits) > 0

function decodePacket(packet, versionSum) {
  const version = bin2dec(packet.substring(0, 3))
  const type = packet.substring(3, 6)
  if (bin2dec(type) === 4) {
    // literal
    return {
      remainder: packet.substring(
        6 + countLiteralNumberBits(packet.substring(6)),
      ),
      versionSum: versionSum + version,
    }
  }
  // operator, there will be subpackets
  versionSum += version
  const lengthType = packet[6]
  if (lengthType === '0') {
    const subsLength = bin2dec(packet.substring(7, 22))
    let subsRemainder = packet.substring(22, 22 + subsLength)
    while (notEmpty(subsRemainder)) {
      ;({ remainder: subsRemainder, versionSum } = decodePacket(
        subsRemainder,
        versionSum,
      ))
    }
    return {
      remainder: packet.substring(22 + subsLength),
      versionSum,
    }
  } else {
    const subsCount = bin2dec(packet.substring(7, 18))
    let remainder = packet.substring(18)
    let processedSubPackets = 0
    while (processedSubPackets < subsCount) {
      processedSubPackets += 1
      ;({ remainder, versionSum } = decodePacket(remainder, versionSum))
    }
    return {
      remainder,
      versionSum,
    }
  }
}

// PART 1
const solver1 = S.pipe([hexa2bin, (packet) => decodePacket(packet, 0)])

// PART 2
function getLiteralNumberBits(bits) {
  let literal = ''
  for (let i = 0, l = bits.length; i < l; i += 5) {
    literal += bits.substring(i, i + 5)
    if (bits[i] === '0') {
      break
    }
  }
  return literal
}

function literalNumber2dec(bits) {
  let b = ''
  for (let i = 0, l = bits.length; i < l; i += 5) {
    b += bits.substring(i + 1, i + 5)
  }
  return bin2dec(b)
}

function applyOperator(operator, values) {
  switch (operator) {
    case 0:
      return R.sum(values)
    case 1:
      return values.reduce(R.multiply, 1)
    case 2:
      return values.reduce(R.min, Infinity)
    case 3:
      return values.reduce(R.max, -Infinity)
    case 5:
      return values[0] > values[1] ? 1 : 0
    case 6:
      return values[0] < values[1] ? 1 : 0
    case 7:
      return values[0] === values[1] ? 1 : 0

    default:
      throw new Error('unknown operator', operator)
  }
}

function decodePacket2(packet) {
  const version = bin2dec(packet.substring(0, 3))
  const operator = bin2dec(packet.substring(3, 6))
  if (operator === 4) {
    // literal
    const literalNumberBits = getLiteralNumberBits(packet.substring(6))
    return {
      remainder: packet.substring(6 + literalNumberBits.length),
      value: literalNumber2dec(literalNumberBits),
    }
  }
  // operator, there will be subpackets
  const lengthType = packet[6]
  if (lengthType === '0') {
    const subsLength = bin2dec(packet.substring(7, 22))
    let subsRemainder = packet.substring(22, 22 + subsLength)
    const subValues = []
    let value
    while (notEmpty(subsRemainder)) {
      ;({ remainder: subsRemainder, value } = decodePacket2(subsRemainder))
      subValues.push(value)
    }
    return {
      remainder: packet.substring(22 + subsLength),
      value: applyOperator(operator, subValues),
    }
  } else {
    const subsCount = bin2dec(packet.substring(7, 18))
    let remainder = packet.substring(18)
    let processedSubPackets = 0
    const subValues = []
    let value
    while (processedSubPackets < subsCount) {
      processedSubPackets += 1
      ;({ remainder, value } = decodePacket2(remainder))
      subValues.push(value)
    }
    return {
      remainder,
      value: applyOperator(operator, subValues),
    }
  }
}

const solver2 = S.pipe([hexa2bin, (packet) => decodePacket2(packet, 0)])

export const solvers = [solver1, solver2]
export const parser = (x) => x.replace('\n', '', x)
