//todo fix 3 vowel issue and try to do syllables

const VARIANT_DIFFERENTNESS = 1.0;
const PRECOMPUTE_SIZE = 10;

function swap(arr, i1, i2) {
    let l = arr[i1];
    let r = arr[i2];
    arr[i2] = l;
    arr[i1] = r;
}

// function shuffle(arr, rng, startIndex = 0) {
//     for (let i = startIndex; i < arr.length; i++) {
//         let other = rng.nextInt() % arr.length;
//         swap(arr, i, other);
//     }
// }

function RNG(seed, variant = 0, precompute = true) {
    // LCG using GCC's constants
    
    this.m = 0x80000000; // 2**31;
    this.a = 1103515245;
    this.c = 12345;
    this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));

    if (precompute) {
        this.precomputed = []
        
        for (let i = 0; i < PRECOMPUTE_SIZE; i++) {
            this.precomputed[i] = this.nextInt()
        }

        if (variant != 0) {
            let swapCount = Math.floor(VARIANT_DIFFERENTNESS * PRECOMPUTE_SIZE);
            let tempRng = new RNG(this.nextInt() + variant, variant = 0, precompute = false);

            let indices = [];
            for (let i = 1; i < PRECOMPUTE_SIZE; i++) {
                indices.push(i);
            }
            shuffle(indices, tempRng);

            for (let i = 0; i + 1 < swapCount; i) {
                let idx = indices[i++];
                this.precomputed[idx] += tempRng.nextInt() % 6;
                idx = indices[i++];
                this.precomputed[idx] -= tempRng.nextInt() % 6;
                // let i1 = indices[i++];
                // let i2 = indices[i++];
                // swap(this.precomputed, i1, i2);
            }
        }

        this.iter = 0;
        this.usePrecomputed = true;
    }
    
}
RNG.prototype.nextInt = function () {
    if (this.usePrecomputed) {
        let value = this.precomputed[this.iter];
        this.iter = (this.iter + 1) % this.precomputed.length;
        return value;
    }
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
}
RNG.prototype.nextFloat = function() {
    // returns in range [0,1]
    return this.nextInt() / (this.m - 1);
}

RNG.prototype.clone = function() {
    let rng = new RNG()
    rng.m = this.m;
    rng.a = this.a;
    rng.c = this.c;
    rng.state = this.state;
    rng.precomputed = [...this.precomputed];
    rng.iter = this.iter;
    rng.usePrecomputed = this.usePrecomputed;
    return rng;
}

const vowels = 'aeiou'

// we put 'y' here because it often makes the work unpronouncable as a solitary vowel
const consonants = 'bcdfghjklmnpqrstvwxyz'

const blends = {
    // first index is if it is the first letter
    // second index is if it is preceeded by a consonant
    // third index is if it is preceeded by a vowel
    // fourth index is if it is one of the last 2 letters
    'a': [consonants, consonants, '', consonants],
    'b': ['jlry', 'lr', '', ''],
    'c': ['hklry', 'hklry', '', 'kh'],
    'd': ['rjwy', 'rjwy', 'l', ''],
    'e': [consonants, consonants, '', consonants],
    'f': ['', 'jlry', '', ''],
    'g': ['', 'hlr', '', 'h'],
    'h': ['y', '', '', ''],
    'i': [consonants, consonants, '', consonants],
    'j': ['', '', '', ''],
    'k': ['rly', '', 'wrls', 's'],
    'l': ['y', '', 'rsy', 'sy'],
    'm': ['y', '', 'my', 'my'],
    'n': ['y', '', 'ny', 'ny'],
    'o': [consonants, consonants, '', consonants],
    'p': ['', 'rlh', '', 'h'],
    'q': ['', 'u', '', 'u'],
    'r': ['', '', 'tpsdfghjklcvbnm', 'tpsdfghjklcvbnm'],
    's': ['', 'rtplcm', 'tpsklcm', 'tpskm'],
    't': ['', 'rh', 'tl', 'h'],
    'u': [consonants, consonants, '', consonants],
    'v': ['', '', 'rlh', 'h'],
    'w': ['', '', 'rl', ''],
    'x': ['', '', '', ''],
    'y': ['', '', '', ''],
    'z': ['', '', '', ''],
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



const alphabet = vowels + consonants;

let lang = "eng";
// let lang = "norsk"

function shuffle(array, rng) {

    if (typeof array === 'string') {
        array = array.split('');
    }

    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = rng.nextInt() % counter;

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function weightedRandom(letters, harshness, rng) {
    var i;

    if (typeof letters == 'string') {
        letters = letters.split('');
    }

    var weights = [];

    for (i = 0; i < letters.length; i++) {
        weights[i] = getWeight(letters[i], harshness) + (weights[i - 1] || 0);
    }
        
    
    var random = rng.nextInt() % weights[weights.length - 1];

    for (i = 0; i < weights.length; i++) {
        if (weights[i] > random) {
            break;
        }
    }
        

    return letters[i];
}

function getRandomOf(str, harshness, rng) {
    return weightedRandom(str, harshness, rng);
}

function getWeight(letter, harshness) {
    const shrinkFactor = (1.5 - Math.abs(harshness - harshnessRating[letter]));
    return shrinkFactor * shrinkFactor * shrinkFactor * letterFrequency[lang][letter];
}


function getLast(str) {
    return str[str.length - 1];
}

function findValidInsert(prev, next) {
    
}

function nameGen(harshness, length, startingLetter = "", rng) {

    let maxAdjacentVowels = 2;

    let maxAdjacentConsonants = 3;

    let name = getRandomOf(alphabet, harshness, rng)

    if (startingLetter) {
        name = startingLetter;
    }

    let adjacentVowels = vowels.includes(getLast(startingLetter)) ? 1 : 0;
    let adjacentConsonants = consonants.includes(getLast(startingLetter)) ? 1 : 0;

    let prevprev = undefined;
    let prevLetter = undefined;

    // generate characters
    for (let i = 1; i < length; i++) {
        if (i == startingLetter.length) {
            name = startingLetter;
        }

        let prevChar = getLast(name);
        let nextPool = '';
        // if one of the last 2 chars
        if (i == 1) {
            nextPool = blends[prevChar][0];
        } else if (i + 2 >= length) {
            nextPool = blends[prevChar][3];
        } else {
            // if the previous char is a vowel
            if (vowels.includes(prevChar) && blends[prevChar][2]) {
                nextPool = blends[prevChar][2];
            } else {
                nextPool = blends[prevChar][1];
            }
        }

        // append default allowed vowels
        nextPool += allowedVowels[prevChar];

        let nextPart = '';

        // find next character
        
        for (let j = 0; j < nextPool.length; j++) {
            rng.nextInt();
            rng.nextInt();
            let letterRng = rng.clone();

            if (adjacentConsonants >= 2) {
                nextPart = getRandomOf(vowels, harshness, letterRng);
            } else {
                nextPart = getRandomOf(nextPool, harshness, letterRng);
            }

            if (prevLetter == nextPart) {
                // completely disallow triple repeats
                if (name.length >= 2) {
                    if (name[name.length - 2] == prevLetter) {
                        continue;
                    }
                }

                if (
                    (!repeatableVowels.includes(prevLetter) && vowels.includes(prevLetter)) ||
                    (name.length <= 1) ||
                    (prevprev == prevLetter)
                ) {
                    continue;
                }
            }
            // console.log(consonants.includes(nextPart), adjacentConsonants, maxAdjacentConsonants)
            // console.log(vowels.includes(nextPart), adjacentVowels, maxAdjacentVowels)
            if (consonants.includes(nextPart) && adjacentConsonants >= maxAdjacentConsonants) {
                continue;
            } else if (vowels.includes(nextPart) && adjacentVowels >= maxAdjacentVowels) {
                continue;
            }
            // console.log(nextPart)
            break;
        }

        if (vowels.includes(nextPart)) {
            adjacentConsonants = 0;
            adjacentVowels++;
        } else {
            adjacentVowels = 0
            adjacentConsonants++
        }

        name += nextPart;

        prevprev = prevLetter;
        prevLetter = getLast(nextPart);
    }

    return name;
}

$(document).ready(() => {
    $('.slider').each((_, e) => {
        let el = $(e);
        el.next().text(el.val());
    });
})

function changeHarshness(e) {
    let el = $(e);
    let strVal = el.val();
    let intVal = parseInt(strVal);

    if (global.state == State.Sequential) {
        global.originalHarshness = intVal;
    }
    if (intVal != global.originalHarshness) {
        let delta = intVal - global.originalHarshness;
        let sign = delta > 0 ? '+' : '-';
        strVal += ` (${sign}${Math.abs(delta)})`
    }
    el.parent().next().text(strVal);

    global.refresh();
}

function changeLength(e) {
    let el = $(e);
    let strVal = el.val();
    let intVal = parseInt(strVal);

    if (global.state == State.Sequential) {
        global.originalLength = intVal;
    }
    if (intVal != global.originalLength) {
        let delta = intVal - global.originalLength;
        let sign = delta > 0 ? '+' : '-';
        strVal += ` (${sign}${Math.abs(delta)})`
    }
    el.parent().next().text(strVal);

    global.refresh();
}

const State = {
    Sequential: 0,
    Variants: 1,
}

const GEN_COUNT = 5;
const global = {
    seed: Date.now() % 100000,
    variant: 0,
    variantSeed: 0,
    state: State.Sequential,
    originalHarshness: 0,
    originalLength: 0,
    next: () => {
        if (global.state == State.Sequential) {
            global.seed += GEN_COUNT;
        } else if (global.state == State.Variants) {
            global.variant += GEN_COUNT;
        }
        global.refresh();
    },
    prev: () => {
        if (global.state == State.Sequential) {
            global.seed -= GEN_COUNT;
        } else if (global.state == State.Variants) {
            global.variant -= GEN_COUNT;
        }
        global.refresh();
    },
    toggle: (element, seed) => {
        if (global.state == State.Variants) {
            global.changeState(element, State.Sequential);
        } else if (global.state == State.Sequential) {
            global.changeState(element, State.Variants, seed);
        }
    },
    refresh: () => {
        if (global.state == State.Sequential) {
            generateSequential(global.seed);
        } else if (global.state == State.Variants) {
            generateVariants(global.variantSeed, global.variant);
        }
    },
    changeState: (element, newState, variantSeed = 0) => {
        if (newState == State.Sequential) {
            if (global.state == State.Sequential) {
                return;
            }
            $('.selected').removeClass("selected");
            $('#variants').empty();
            global.sequentialMode();
        } else if (newState == State.Variants) {
            if (global.state == State.Variants) {
                return;
            }
            element.classList.add("selected");
            $('#names').addClass("selected");
            global.variantMode(variantSeed);
        }
    },
    sequentialMode: () => {
        global.state = State.Sequential;
        global.refresh();
    },
    variantMode: (variantSeed) => {
        global.state = State.Variants;
        global.variantSeed = variantSeed;
        global.refresh();
    }
}

function generateSequential(localSeed) {
    const harshness = parseInt($('#harshness').val()) / 10;
    const length = parseInt($('#length').val());

    let startingLetter = $('#firstLetter').val();
    if (!startingLetter) {
        startingLetter = "";
    }

    $('#names').empty();

    for (let i = 0; i < GEN_COUNT; i++) {
        let rng = new RNG(localSeed);
        let name = nameGen(harshness, length, startingLetter.toLowerCase(), rng);
        $('#names').append(`<p class='name' onclick="global.toggle(this, ${localSeed})"><span class='locked'>${startingLetter}</span>${name.substring(startingLetter.length)}</p>`);
        localSeed++;
    }
}

function generateVariants(seed, variant) {
    const harshness = parseInt($('#harshness').val()) / 10;
    const length = parseInt($('#length').val());

    let startingLetter = $('#firstLetter').val();
    if (!startingLetter) {
        startingLetter = "";
    }

    let variantGenerator = new RNG(variant);

    $('#variants').empty();
    let existing = [];
    for (let i = 0; existing.length < 5; i++) {
        let rng = new RNG(seed, variant = variantGenerator.nextInt());
        let name = nameGen(harshness, length, startingLetter.toLowerCase(), rng);
        if (existing.includes(name) && i < 20) {
            continue;
        }
        existing.push(name);
        $('#variants').append(`<p><span class='locked'>${startingLetter}</span>${name.substring(startingLetter.length)}</p>`);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    global.refresh();
});