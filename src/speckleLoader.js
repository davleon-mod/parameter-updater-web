/**
 * Since Node v<18 does not provide fetch, we need to pass it in the options object. Popular fetch implementations like cross-fetch or node-fetch should work
 */
// import fetch from 'cross-fetch'
import ObjectLoader from '@speckle/objectloader'

//get the value of the SpeckleDemoApp.AuthToken key from localStorage
const token = localStorage.getItem('SF-test-app.AuthToken')

const loader = new ObjectLoader({
    serverUrl: 'https://app.speckle.systems',
    streamId: 'f9eeb0be04',
    // objectId: 'e3851d352a22c4e2d379c602d177ce40', //small model
    objectId: '4ed15c7f30570d95dc9d238626dc6a62', //big model
    options: { enableCaching: false, excludeProps: [], fetch },
    token: token,
})

export const loadData = async function loadData() {
    const obj = await loader.getAndConstructObject((e) => {
        // console.log(e) // log progress!
    })

    console.log('Done!')
    // console.log(obj)
    return obj
}

