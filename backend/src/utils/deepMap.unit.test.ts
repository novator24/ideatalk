import _ from 'lodash'
import { deepMap } from './deepMap'

describe('deepMap', () => {
  it('should map object', () => {
    const fn = () => {
      return 1
    }
    const fn1 = () => {
      return 2
    }
    fn1.fn2 = fn1
    const input = {
      object: {
        a: 1,
        x: null,
        z: undefined,
        o: fn,
        p: fn1,
        b: '22',
        c: [3, 4],
        c1: [3, 4],
        d: [{ e: 5 }, { f: 6 }],
        g: [
          [7, 8],
          [{ x: 0 }, 10],
        ],
        s: {
          t: 11,
          u: 12,
        },
        s1: {
          t: 11,
          u: 12,
        },
      },
      objectRecursive: null as any,
    }
    input.objectRecursive = input

    const output = deepMap(input, ({ key, path, value }) => {
      if (path === 'object.c1.0') {
        return 'my path is object.c1.0'
      }
      if (key === 'u') {
        return 'my key is u'
      }
      if (key === 's1') {
        return 'me was an object'
      }

      if (_.isString(value) || _.isNumber(value)) {
        return `${value}` + 'XXX'
      }
      return value
    })
    expect(output).toMatchInlineSnapshot(`
{
  "object": {
    "a": "1XXX",
    "b": "22XXX",
    "c": [
      "3XXX",
      "4XXX",
    ],
    "c1": [
      "my path is object.c1.0",
      "4XXX",
    ],
    "d": [
      {
        "e": "5XXX",
      },
      {
        "f": "6XXX",
      },
    ],
    "g": [
      [
        "7XXX",
        "8XXX",
      ],
      [
        {
          "x": "0XXX",
        },
        "10XXX",
      ],
    ],
    "o": {},
    "p": {
      "fn2": "!!!CIRCULAR!!!",
    },
    "s": {
      "t": "11XXX",
      "u": "my key is u",
    },
    "s1": "me was an object",
    "x": null,
    "z": undefined,
  },
  "objectRecursive": "!!!CIRCULAR!!!",
}
`)
  })
})
