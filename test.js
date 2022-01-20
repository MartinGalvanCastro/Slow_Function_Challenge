
//random-function for simulate delay
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//cache key-value map
const cache = {}

//Mock data
const data = [
    {
        'id':1,
        'val':1,
    },
    {
        'id':2,
        'val':2,
    },
    {
        'id':3,
        'val':3,
    },
    {
        'id':4,
        'val':4,
    },
    {
        'id':5,
        'val':5,
    }
]

//stores data (value) by key
async function cache_store(key,value){
    cache[key] = value
}

//retrieves data by key (if it exists)
async function cache_retrive(key){
    const start = Date.now();
    while (Date.now() < start + getRandomInt(1000)) {} //Simulates delay for generating a race condition
    if(cache[key]) return cache[key]                   // between cache and Slow_Function

    //If not in cache, use slow function
    else{
        const result = slow_function(key)
        cache_store(key,result)
        return result
    }
}

//fetched data from a slow data source
async function slow_function(input){
    const start = Date.now();
    while (Date.now() < start + getRandomInt(1000)) {} //Simulates delay for generating a race condition
                                                       //between cache and Slow_Function
    //Finds data with the same id                                                   
    const ans = data.filter(v=>{
        if(v.id==input){
            return v
        }
    })
    //If one element has the data, return it
    if(ans.length>0){
        return ans.pop()
    }
}

// runs faster than slow_function by using cache functions
function memoize(slow_function_param){
    return (input)=>{
        const cache_promise = cache_retrive(input)
        const slow_function_promise = slow_function_param(input)
        //Returns and resolves the first promise that is compleated
        return Promise.race([cache_promise,slow_function_promise]).then(v=>console.log(v)).catch(err=>console.log(err))
    }
}

//----------------------------------------
//Simulation enviroment
const init = async () =>{
    const memoizedFetch = memoize(slow_function)
    memoizedFetch(1)
    memoizedFetch(1)
    memoizedFetch(1)
    memoizedFetch(1)
    memoizedFetch(1)
}


//Init simulation
init()