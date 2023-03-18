// d3.select('h1').style('color', 'red')

let list = []
const listElement = document.getElementById('list')
const resetButton = document.getElementById('resetList')
const bubbleSortButton = document.getElementById('bubbleSort')
const insertionSortButton = document.getElementById('insertionSort')
const mergeSortButton = document.getElementById('mergeSort')
const stopButton = document.getElementById('stop')

const range = 100
const defaultColor = 'rgb(200, 200, 200)'
const highlightColor = 'rgb(219, 91, 91)'
const finalColor = 'lime'
const delay = 10
let size = 150
let running = false

mergeSortButton.addEventListener('click', () => {
    if(running === false) {
        running = true
        mergeSort(list, 0, list.length-1)
    }
})

stopButton.addEventListener('click', () => {
    running = false
})

resetButton.addEventListener('click', () => {
    resetList(size);
    running = false;
})

bubbleSortButton.addEventListener('click', () => {
    if(running === false) {
        running = true
        bubbleSort()
    }
})

insertionSortButton.addEventListener('click', () => {
    if(running === false) {
        running = true
        insertionSort()
    }
})

function sleep(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}
  
// Reflect the new List with the help of bars on the page
function updatePreview() {
    listElement.innerHTML = '';
    for(let i=0; i<list.length; i++) {
        const number = document.createElement('div')
        number.classList.add('number')
        number.dataset.value = list[i]
        number.style.height = ((list[i]/range)*100) + "%";
        number.style.width = (90/size) + 'vw'
        listElement.appendChild(number)
    }
}

// Create a new list of numbers with random variables
function resetList(number) {
    list = []
    for(let i=0; i<number; i++) {
        const num = Math.floor((Math.random()*range)+1)
        list.push(num)
    }

    updatePreview()
}

function finalise(pos) {
    const item = listElement.children.item(pos)
    item.style.backgroundColor = finalColor
}

async function highlight(i, j, set) {
    const item1 = listElement.children.item(i)
    const item2 = listElement.children.item(j)
    if(set === 1) {
        item1.style.backgroundColor = highlightColor
        item2.style.backgroundColor = highlightColor
        await sleep(delay)
        return
    }
    item1.style.backgroundColor = defaultColor
    item2.style.backgroundColor = defaultColor
}

async function highlight1(i, set) {
    const item1 = listElement.children.item(i)
    if(set === 1) {
        item1.style.backgroundColor = highlightColor
        await sleep(delay)
        return
    }
    item1.style.backgroundColor = defaultColor
}


function swapped(item1, item2, val1, val2) {
    item1.dataset.value = val1
    item2.dataset.value = val2
    item1.style.height = ((val1/range)*100) + "%";
    item2.style.height = ((val2/range)*100) + "%";
}

async function compare(i, j) {
    const item1 = listElement.children.item(i)
    const item2 = listElement.children.item(j)

    await highlight(i, j, 1)
    if(list[j] < list[j-1]) {
        let temp = list[j]
        list[j] = list[j-1]
        list[j-1] = temp

        item1.dataset.value = list[j-1]
        item2.dataset.value = list[j]
        swapped(item1, item2, list[j-1], list[j])
    }
    highlight(i, j, 2)
}



// Implementation of bubble sort
async function bubbleSort() {
    for(let i=0; i<list.length; i++) {
        for(let j=1; j<list.length - i; j++) {
            if(running === false) {
                return
            }
            await compare(j-1, j)
        }
        finalise(list.length - i - 1)
    }
}


// Implementation of Insertion Sort
async function insertionSort() {
    for(let i=0; i<list.length; i++) {
        let j=i
        while(j>0 && list[j-1]>list[j]) {
            if(running === false) {
                return
            }
            await compare(j-1, j)
            j--;
        }
    }
}

function updateElement(index) {
    const item = listElement.children.item(index)
    item.dataset.value = list[index]
    item.style.height = ((list[index]/range)*100) + "%";
}

async function merge(list, l, mid, r) {
    const left = []
    const right = []
    for(let i=l; i<=mid; i++) {
        left.push(list[i])
    }
    for(let i=mid+1; i<=r; i++) {
        right.push(list[i])
    }

    const finalList = []
    let pos = l
    let i=0, j=0
    
    while(i<left.length && j<right.length) {
        if(running === false) {
            return
        }
        await highlight(l+i, mid+1+j, 1)
        if(left[i] < right[j]) {
            finalList.push(left[i])
            list[pos] = left[i]
            updateElement(pos)
            await highlight(l+i, mid+1+j, 2)
            i++
        }
        else {
            finalList.push(right[j])
            list[pos] = right[j]
            await highlight(l+i, mid+1+j, 2)
            updateElement(pos)
            j++
        }
        pos++
    }

    while(i<left.length) {
        list[pos] = left[i]
        i++
        highlight1(pos, 1)
        updateElement(pos)
        highlight1(pos, 2)
        pos++
    }
    while(j<right.length) {
        list[pos] = right[j]
        j++
        highlight1(pos, 1)
        updateElement(pos)
        highlight1(pos, 2)
        pos++
    }
}

async function mergeSort(list, l, r) {
    if(l>=r) {
        return
    }
    let mid = Math.floor((l+r)/2)
    await mergeSort(list, l, mid)
    await mergeSort(list, mid+1, r)

    await merge(list, l, mid, r)
}

resetList(size)