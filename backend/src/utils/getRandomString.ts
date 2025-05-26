import randomstring from 'randomstring'

export const getRandomString = (length: number) => {
  return randomstring.generate({
    length,
    charset: 'alphanumeric',
    capitalization: 'lowercase',
  })
}
