import R from 'ramda'
import S from 'sanctuary'
import L from 'lodash'

const hexa2bin = (hexa) => {
  let b = ''
  for (let i = 0, l = hexa.length; i < l; i += 1) {
    b += L.padStart(Number(`0x${hexa[i]}`).toString(2), 4, '0')
  }
  return b
}

const bin2dec = (bin) => parseInt(bin, 2)

const notEmpty = (bits) => bits.length > 0 && bin2dec(bits) > 0

function readLiteralNumberBits(bits) {
  let b = ''
  for (let i = 0, l = bits.length; i < l; i += 5) {
    b += bits.substring(i, i + 5)
    if (bits[i] === '0') {
      break
    }
  }
  return b
}

function literalNumber2dec(bits) {
  let b = ''
  for (let i = 0, l = bits.length; i < l; i += 5) {
    b += bits.substring(i + 1, i + 5)
  }
  return bin2dec(b)
}

function op(operator, values) {
  switch (operator) {
    case 0:
      return R.sum(values)
    case 1:
      return values.reduce(R.multiply, 1)
    case 2:
      return values.reduce(R.min, Infinity)
    case 3:
      return values.reduce(R.max, -Infinity)
    case 4:
      return values[0]
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

function unpackWhile(predicate, bits, versionSum) {
  const packetValues = []
  while (predicate({ bits, packets: packetValues.length })) {
    let {
      remainder: nextBits,
      value,
      versionSum: subsVersionSum,
    } = unpack(bits)
    packetValues.push(value)
    versionSum += subsVersionSum
    bits = nextBits
  }
  return { packetValues, versionSum, bitsLeft: bits }
}

function unpack(packet) {
  let versionSum = bin2dec(packet.substring(0, 3))

  const operator = bin2dec(packet.substring(3, 6))
  if (operator === 4) {
    // literal
    const literalNumberBits = readLiteralNumberBits(packet.substring(6))
    return {
      remainder: packet.substring(6 + literalNumberBits.length),
      value: op(operator, [literalNumber2dec(literalNumberBits)]),
      versionSum,
    }
  }
  // operator, there will be subpackets
  const lengthType = packet[6]
  if (lengthType === '0') {
    const packetsLength = bin2dec(packet.substring(7, 22))
    let remainder = packet.substring(22, 22 + packetsLength)

    const {
      packetValues,
      versionSum: nextVersionSum,
      bitsLeft,
    } = unpackWhile(({ bits }) => notEmpty(bits), remainder, versionSum)
    return {
      remainder: packet.substring(22 + packetsLength),
      value: op(operator, packetValues),
      versionSum: nextVersionSum,
    }
  } else {
    const packetCount = bin2dec(packet.substring(7, 18))
    let remainder = packet.substring(18)

    const {
      packetValues,
      versionSum: nextVersionSum,
      bitsLeft,
    } = unpackWhile(
      ({ packets }) => packets < packetCount,
      remainder,
      versionSum,
    )
    return {
      remainder: bitsLeft,
      value: op(operator, packetValues),
      versionSum: nextVersionSum,
    }
  }
}

// PART 1
const solver1 = S.pipe([hexa2bin, unpack, R.prop('versionSum')])

// PART 2
const solver2 = S.pipe([hexa2bin, unpack, R.prop('value')])

export const solvers = [solver1, solver2]
export const parser = (x) => x.replace('\n', '', x)
