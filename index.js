//todo fix 3 vowel issue and try to do syllables

const blends = {
    // first index is if it is not preceeded by a vowel
    // second index is if it is preceeded by a vowel
    // third index is if it is the 2nd-to-last character
    'a': ['qwrtpsdfghjklzxcvbnm', '', 'qwrtpsdfghjklzxcvbnm'],
    'b': ['rl', '', ''],
    'c': ['rklh', '', 'kh'],
    'd': ['wrj', 'l', 'rl'],
    'e': ['qwrtpsdfghjklzxcvbnm', '', 'qwrtpsdfghjklzxcvbnm'],
    'f': ['rjl', '', ''],
    'g': ['rlh', '', 'h'],
    'h': ['', '', ''],
    'i': ['qwrtpsdfghjklzxcvbnm', '', 'qwrtpsdfghjklzxcvbnm'],
    'j': ['', '', ''],
    'k': ['', 'wrls', 's'],
    'l': ['', 'rs', 's'],
    'm': ['', 'm', 'm'],
    'n': ['', 'n', 'n'],
    'o': ['qwrtpsdfghjklzxcvbnm', '', 'qwrtpsdfghjklzxcvbnm'],
    'p': ['rlh', '', 'h'],
    'q': ['u', '', 'u'],
    'r': ['', 'tpsdfghjklcvbnm', 'tpsdfghjklcvbnm'],
    's': ['rtplcm', 'tpsklcm', 'tpskm'],
    't': ['rh', 'tl', 'h'],
    'u': ['qwrtpsdfghjklzxcvbnm', '', 'qwrtpsdfghjklzxcvbnm'],
    'v': ['', 'rlh', 'h'],
    'w': ['', 'rl', ''],
    'x': ['', '', ''],
    'y': ['', '', ''],
    'z': ['', '', ''],
}

const allowedVowels = {
    'a': 'aioy',
    'b': 'aeiouy',
    'c': 'aeiouy',
    'd': 'aeiouy',
    'e': 'aeiouy',
    'f': 'aeiouy',
    'g': 'aeiouy',
    'h': 'aeiou',
    'i': 'aeo',
    'j': 'aeiouy',
    'k': 'aeiouy',
    'l': 'aeiouy',
    'm': 'aeiouy',
    'n': 'aeiouy',
    'o': 'aio',
    'p': 'aeiouy',
    'q': 'aeiou',
    'r': 'aeiouy',
    's': 'aeiouy',
    't': 'aeiouy',
    'u': 'ai',
    'v': 'aeiouy',
    'w': 'aeiouy',
    'x': 'aeiou',
    'y': 'aeiou',
    'z': 'aeiou',
}

const letterFrequency = {
    "eng": {
        'a': 7.8,
        'b': 2,
        'c': 4,
        'd': 3.8,
        'e': 11,
        'f': 1.4,
        'g': 3,
        'h': 2.3,
        'i': 8.6,
        'j': 0.21,
        'k': 0.97,
        'l': 5.3,
        'm': 2.7,
        'n': 7.2,
        'o': 6.1,
        'p': 2.8,
        'q': 0.19,
        'r': 7.3,
        's': 8.7,
        't': 6.7,
        'u': 3.3,
        'v': 1,
        'w': 0.91,
        'x': 0.27,
        'y': 1.6,
        'z': 0.44,
    },
    "norsk": {
        'a': 6.05 + 1.48,
        'b': 1.38,
        'c': 0.51,
        'd': 4.89,
        'e': 16.63,
        'f': 1.68,
        'g': 4.04,
        'h': 2.41,
        'i': 5.61,
        'j': 1.2,
        'k': 3.83,
        'l': 4.87,
        'm': 3.20,
        'n': 8.14,
        'o': 4.68 + 0.89,
        'p': 1.69,
        'q': 0.01,
        'r': 7.52,
        's': 5.41,
        't': 7.79,
        'u': 1.84,
        'v': 2.67,
        'w': 0.31,
        'x': 0.04,
        'y': 0.67,
        'z': 0.21,
    }
}

const harshnessRating = {
    'a': 0,
    'b': .5,
    'c': .6,
    'd': .4,
    'e': .0,
    'f': .5,
    'g': .4,
    'h': .2,
    'i': .1,
    'j': .6,
    'k': 1,
    'l': .2,
    'm': .4,
    'n': .4,
    'o': .1,
    'p': .7,
    'q': 1,
    'r': .7,
    's': .8,
    't': .8,
    'u': .3,
    'v': .6,
    'w': .5,
    'x': 1,
    'y': .2,
    'z': .6,
}

const digraphs = {
    'ch': '',
    'gh': '',
    'ph': '',
    'sh': '',
    'th': '',
}

const repeatableVowels = ['a', 'e', 'o', 'i', 'u']

const vowels = 'aeiouy'

const consonants = 'bcdfghjklmnpqrstvwxz'

const alphabet = vowels + consonants;

// let lang = "eng"
let lang = "norsk"

function shuffle(array) {

    if (typeof array === 'string') {
        array = array.split('')
    }

    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function weightedRandom(letters, harshness) {
    var i;

    if (typeof letters == 'string') {
        letters = letters.split('')
    }

    var weights = [];

    for (i = 0; i < letters.length; i++)
        weights[i] = getWeight(letters[i], harshness) + (weights[i - 1] || 0);

    var random = Math.random() * weights[weights.length - 1];

    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break;

    return letters[i];
}

function getRandomOf(str, harshness) {
    return weightedRandom(str, harshness)
}

function getWeight(letter, harshness) {
    const shrinkFactor = (1.5 - Math.abs(harshness - harshnessRating[letter]))
    return shrinkFactor * shrinkFactor * shrinkFactor * letterFrequency[lang][letter]
}


function getLast(str) {
    return str[str.length - 1]
}

function nameGen(harshness, length, startingLetter = "") {

    let maxAdjacentVowels = 2

    let maxAdjacentConsonants = 3

    let name = getRandomOf(alphabet, harshness)

    if (startingLetter) {
        name = startingLetter
    }

    let adjacentVowels = vowels.includes(startingLetter) ? 1 : 0
    let adjacentConsonants = consonants.includes(startingLetter) ? 1 : 0

    let prevprev = undefined
    let prevLetter = undefined

    // generate characters
    for (let i = 1; i < length; i++) {

        let nextPool = ''
            // if it's 2nd-to-last
        if (i + 2 >= length) {
            nextPool = blends[getLast(name)][2]
        } else {
            // if the previous char is a vowel
            if (vowels.includes(getLast(name)) && blends[getLast(name)][1]) {
                nextPool = blends[getLast(name)][1]
            } else {
                nextPool = blends[getLast(name)][0]
            }
        }

        // append default allowed vowels
        nextPool += allowedVowels[getLast(name)]

        let nextPart = ''

        // find next character
        for (let j = 0; j < nextPool.length; j++) {

            if (adjacentConsonants >= 2) {
                nextPart = getRandomOf(vowels, harshness)
            } else {
                nextPart = getRandomOf(nextPool, harshness)
            }

            if (prevLetter == nextPart) {
                if (
                    (!repeatableVowels.includes(prevLetter) && vowels.includes(prevLetter)) ||
                    (name.length <= 1) ||
                    (prevprev == prevLetter)
                ) {
                    continue
                }
            }
            console.log(consonants.includes(nextPart), adjacentConsonants, maxAdjacentConsonants)
            console.log(vowels.includes(nextPart), adjacentVowels, maxAdjacentVowels)
            if (consonants.includes(nextPart) && adjacentConsonants >= maxAdjacentConsonants) {
                continue
            } else if (vowels.includes(nextPart) && adjacentVowels >= maxAdjacentVowels) {
                continue
            }
            console.log(nextPart)
            break
        }

        if (vowels.includes(nextPart)) {
            adjacentConsonants = 0
            adjacentVowels++
        } else {
            adjacentVowels = 0
            adjacentConsonants++
        }

        name += nextPart;

        prevprev = prevLetter
        prevLetter = getLast(nextPart)
    }

    return name;
}

$(document).ready(() => {
    $('.slider').each((_, e) => {
        $(e).next().text($(e).val())
    })
})

function changeHarshness(e) {
    $(e).next().text($(e).val())
}

function changeLength(e) {
    $(e).next().text($(e).val())
}

function gen() {

    const harshness = parseInt($('#harshness').val()) / 10
    const length = parseInt($('#length').val())

    $('#names').empty()

    for (let i = 0; i < 10; i++) {
        $('#names').append(`<p>${nameGen(harshness, length)}</p>`)
    }
}
